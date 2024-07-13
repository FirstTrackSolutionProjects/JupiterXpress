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
    const {order} = JSON.parse(event.body);
    const [users] = await connection.execute('SELECT * FROM USERS WHERE uid =?', [id]);
    const email = users[0].email;
    const [shipments] = await connection.execute('SELECT * FROM SHIPMENTS WHERE ord_id = ? ', [order]);
    const shipment = shipments[0];
    const {serviceId, categoryId} = shipment;
    // const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
    if (serviceId === 1) {
      
          const label = await fetch(`https://track.delhivery.com/api/p/packing_slip?wbns=${shipment.awb}&pdf=true`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Token ${categoryId === 2?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId===1?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
            },
          }).then((response) => response.json())
          
        
   
    return {
      statusCode: 200,
      body: JSON.stringify({label : label.packages[0].pdf_download_link, success : true}),
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
