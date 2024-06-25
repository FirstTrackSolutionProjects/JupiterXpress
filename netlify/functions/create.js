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
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false,
  auth: {
    user: 'azureaditya5155@gmail.com',
    pass: 'rjbgdxyvfimoahpn',
  },
});
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization;
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    const {order} = JSON.parse(event.body);
    const connection = await mysql.createConnection(dbConfig);

    const [shipments] = await connection.execute('SELECT * FROM SHIPMENTS WHERE ord_id = ? ', [order]);
    // const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
    const shipment = shipments[0];
    


    let req =
         {
        shipments: [],
        pickup_location: {
          name: "Hello",
          add: "ABC123",
          city: "Delhi",
          pin_code: 813210,
          country: "India",
          phone: "1234567890"
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
        "order": shipment.ord_id,
        "payment_mode": shipment.pay_method,
        "return_pin": "",
        "return_city": "",
        "return_phone": "",
        "return_add": "",
        "return_state": "",
        "return_country": "",
        "products_desc": "",
        "hsn_code": (shipment.hsn)?(shipment.hsn):(""),
        "cod_amount": shipment.cod_amount,
        "order_date": shipment.date,
        "total_amount": shipment.cod_amount,
        "seller_add": "",
        "seller_name": "",
        "seller_inv": "",
        "quantity": "1",
        "waybill": "",
        "shipment_width": shipment.width,
        "shipment_height": shipment.height,
        "weight": shipment.weight,
        "seller_gst_tin": shipment.gst,
        "shipping_mode": "Surface",
        "address_type": shipment.shipping_address_type,
      })
      const formData = new URLSearchParams();
      formData.append('format', 'json');
      formData.append('data', JSON.stringify(req));

    const response = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Token ee0f4261a8a842473bf0621173bbedc8cd230485'
      },
      body : formData
    }).then((response) => response.json())

    const schedule = await fetch(`https://track.delhivery.com/​fm/request/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Token ee0f4261a8a842473bf0621173bbedc8cd230485'
      },
      body : JSON.stringify({pickup_location: "warehouse", pickup_time : '', pickup_date : '', expected_package_count	: 1})
    }).then((response) => response.json()).catch((err)=>err)

    const label = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Token ee0f4261a8a842473bf0621173bbedc8cd230485'
      },
      body : formData
    }).then((response) => response.json())
    const [users] = await connection.execute('SELECT * FROM USERS WHERE id = ?',[id])
    let mailOptions = {
      from: 'azureaditya5155@gmail.com', 
      to: users[0].email, 
      subject: 'Shipment created successfully', 
      text: `Dear Merchant, \nYour shipment request for Order id : ${shipment.ord_id} is successfully created at Delivery Courier Service and the corresponding charge is deducted from your wallet.\nRegards,\nJupiter Xpress`
    };
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({response, shipment, schedule, label}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message + 'hello' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  }
};
