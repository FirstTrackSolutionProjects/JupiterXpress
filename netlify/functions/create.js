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
    const {order,  price,serviceId , categoryId} = JSON.parse(event.body);
    const [users] = await connection.execute('SELECT * FROM USERS WHERE uid = ?',[id])
    const email = users[0].email;
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
      total_amount += parseFloat(orders[i].selling_price)
    }
    let product_description = "";
    for (let i = 0; i < orders.length; i++) {
      product_description += `${orders[i].product_name} (${orders[i].product_quantity}) (₹${orders[i].selling_price})\n`
    }
    if (serviceId === "1") {
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
        "payment_mode": shipment.pay_method,
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
        "waybill": "",
        "shipment_width": shipment.width,
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
      await connection.execute('UPDATE SHIPMENTS set serviceId = ?, categoryId = ?, awb = ? WHERE ord_id = ?', [serviceId, categoryId, response.packages[0].waybill ,order])
      await connection.execute('INSERT INTO SHIPMENT_REPORTS VALUES (?,?,?)',[refId,order,"SHIPPED"])
    }
    else{
      await connection.execute('INSERT INTO SHIPMENT_REPORTS VALUES (?,?,?)',[refId,order,"FAILED"])
      return {
        statusCode: 200,
        body: JSON.stringify({ success : false}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      };
    }
    const schedule = await fetch(`https://track.delhivery.com/fm/request/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${categoryId === "2"?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId==="1"?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
      },
      body : JSON.stringify({pickup_location: warehouse.warehouseName, pickup_time : shipment.pickup_time, pickup_date : shipment.pickup_date, expected_package_count	: "1"})
    }).then((response) => response.json())

    const label = await fetch(`https://track.delhivery.com/api/p/packing_slip?wbns=${response.packages[0].waybill}&pdf=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${categoryId === "2"?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId==="1"?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
      },
    }).then((response) => response.json())
    await connection.execute('UPDATE WALLET SET balance = balance - ? WHERE uid = ?', [price, id]);
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Shipment created successfully', 
      text: `Dear Merchant, \nYour shipment request for Order id : ${order} is successfully created at Delivery Courier Service and the corresponding charge is deducted from your wallet.\nLabel PDF : ${label.packages[0].pdf_download_link}\nRegards,\nJupiter Xpress`
    };
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({response : response,  schedule : schedule, success : true}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    };
    }
    
  }  finally {
    connection.end()
  }
};
