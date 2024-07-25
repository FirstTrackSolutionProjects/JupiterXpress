const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const token = event.headers.authorization;
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    const [users] = await connection.execute('SELECT * FROM USERS WHERE uid =?', [id]);
    const email = users[0].email;
    const {order,  price,serviceId , categoryId} = JSON.parse(event.body);
    const [shipments] = await connection.execute('SELECT * FROM SHIPMENTS WHERE ord_id = ? ', [order]);
    const shipment = shipments[0];
    const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
    const [warehouses] = await connection.execute('SELECT * FROM WAREHOUSES WHERE uid = ? AND wid = ?', [id, shipment.wid]);
    const warehouse = warehouses[0]
    const [systemCodes] = await connection.execute('SELECT * FROM SYSTEM_CODE_GENERATOR')
    const refId = systemCodes[0].shipment_reference_id;
    await connection.execute('UPDATE SYSTEM_CODE_GENERATOR SET shipment_reference_id = ? WHERE shipment_reference_id = ?', [parseInt(refId) + 1, refId]);

    // const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
    let total_amount = 0;
    for (let i =0; i < orders.length; i++) {
      total_amount += (parseFloat(orders[i].selling_price)*parseFloat(orders[i].product_quantity))
    }
    let product_description = "";
    for (let i = 0; i < orders.length; i++) {
      product_description += `${orders[i].product_name} (${orders[i].product_quantity}) (₹${orders[i].selling_price})\n`
    }
    if (serviceId === "1") {
      const res = await fetch(`https://track.delhivery.com/waybill/api/bulk/json/?count=1`, {
        method : 'GET',
        headers: {
          "Content-Type" : "application/json",
          "Accept" : "application/json",
          'Authorization': `Token ${categoryId === "2"?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId==="1"?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
        }
      })
      const waybill = await res.json()
      let req = {
        shipments: [],
        pickup_location: {
          name: warehouse.warehouseName,
          add: warehouse.address,
          pin_code: warehouse.pin,
          phone: warehouse.phone,
        }
      }
      req.shipments.push({
        "name": shipment.customer_name,
        "add": shipment.shipping_address,
        "pin": shipment.shipping_postcode,
        "city": shipment.shipping_city,
        "state": shipment.shipping_state,
        "country": shipment.shipping_country,
        "phone": shipment.customer_mobile,
        "order": `JUP${refId}`,
        "payment_mode": shipment.pay_method == "topay"?"COD":shipment.pay_method,
        "return_pin": "",
        "return_city": "",
        "return_phone": "",
        "return_add": "",
        "return_state": "",
        "return_country": "",
        "products_desc": product_description,
        "hsn_code": (shipment.hsn)?(shipment.hsn):(""),
        "cod_amount": shipment.cod_amount,
        "order_date": shipment.date,
        "total_amount": total_amount,
        "seller_add": warehouse.address,
        "seller_name": warehouse.warehouseName,
        "seller_inv": "",
        "quantity": "1",
        "waybill": waybill,
        "shipment_length" : shipment.length,
        "shipment_width": shipment.breadth,
        "shipment_height": shipment.height,
        "weight": shipment.weight,
        "seller_gst_tin": shipment.gst,
        "shipping_mode": shipment.shippingType,
        "address_type": shipment.shipping_address_type
      })
      
      const formData = new URLSearchParams();
      formData.append('format', 'json');
      formData.append('data', JSON.stringify(req));

    const responseDta = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Token ${categoryId === "2"?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId==="1"?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
      },
      body : formData
    })
    const response = await responseDta.json()
    if (response.success){
      await connection.beginTransaction();
      await connection.execute('UPDATE SHIPMENTS set serviceId = ?, categoryId = ?, awb = ? WHERE ord_id = ?', [serviceId, categoryId, response.packages[0].waybill ,order])
      await connection.execute('INSERT INTO SHIPMENT_REPORTS VALUES (?,?,?)',[refId,order,"SHIPPED"])
      if (shipment.pay_method != "topay"){
        await connection.execute('UPDATE WALLET SET balance = balance - ? WHERE uid = ?', [price, id]);
        await connection.execute('INSERT INTO EXPENSES (uid, expense_order, expense_cost) VALUES  (?,?,?)',[id, order, price])
      }
      await connection.commit();
    }
    else{
      await connection.execute('INSERT INTO SHIPMENT_REPORTS VALUES (?,?,?)',[refId,order,"FAILED"])
      return {
        statusCode: 200,
        body: JSON.stringify({ success : false, message : response}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      };
    }
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Shipment created successfully', 
      text: `Dear Merchant, \nYour shipment request for Order id : ${order} is successfully created at Delhivery Courier Service and the corresponding charge is deducted from your wallet.\nRegards,\nJupiter Xpress`
    };
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({response : response, success : true}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    };
    } else if (serviceId == '2'){
      const req = {
        communication_email : email,
        shipment_unique_id : `JUP${refId}`,
        shipment_type : 'Forward',
        forward_shipment_number : `JUP${refId}`,
        ship_from_account : 0,
        ship_from_company : users[0].businessName,
        ship_from_address_line1 : warehouse.address,
        ship_from_address_line2 : warehouse.address,
        ship_from_address_line3 : warehouse.address,
        ship_from_zipcode : warehouse.pin,
        ship_from_email : email,
        ship_from_phone : users[0].phone,
        shipment_date : shipment.date,
        shipment_priority : 'Express Early Morning',
        ship_to_first_name : shipment.customer_name.split(" ")[0],
        ship_to_last_name : shipment.customer_name.split(" ")[1],
        ship_to_company : "Customer",
        ship_to_address_line1 : shipment.shipping_address,
        ship_to_address_line2 : shipment.shipping_address_2,
        ship_to_address_line3 : shipment.shipping_address_2,
        ship_to_zipcode : shipment.shipping_postcode,
        ship_to_email : shipment.customer_email,
        ship_to_phone : shipment.customer_mobile,
        package_type : 'Package',
        goods_general_description : product_description,
        goods_value : total_amount,
        bill_to : 'Shipper',
        include_insurance : 'No',
        email_notification : 'Yes',
        mobile_notification : 'Yes',
        add_adult_signature : 'Yes',
        cash_on_delivery : shipment.pay_method=="Pre-paid"?"No":"Yes",
        package : [{
          "package_unique_id": "PACK_1",
          "length": shipment.length,
          "width" : shipment.breadth,
          "height" : shipment.height,
          "weight_actual" : shipment.weight,
          "identical_package_count" : 1
        }]
      }
      const responseDta = await fetch('https://newco-apim-test.azure-api.net/rest/v2/shipment/sync/create', {
        method : 'POST',
        headers : {
          'Authorization': `Bearer ${process.env.MOVIN_API_KEY}`,
          'Ocp-Apim-Subscription-Key' : '284cee****************************'
        },
        body : JSON.stringify(req)
      })
      const data = await responseDta.json()
    if (data.status == 200) {
        return {
          statusCode: 200,
          body: JSON.stringify({response : "Shipment has been created Successfully", success : true}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }; 
      } else{ 
        return {
          statusCode: 400,
          body: JSON.stringify({response : data.response.errors[0].shipment.SHIP_1[0].error, success : false}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }; 
      }
    }
    
   
    
  } catch (error) {
    return {
      statusCode: 504,
      body: JSON.stringify({response : error, success : true}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    };
  }  finally {
    connection.end()
  }
};
