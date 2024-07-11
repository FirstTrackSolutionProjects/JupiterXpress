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
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const token = event.headers.authorization;
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    const {order} = JSON.parse(event.body);
    const [shipments] = await connection.execute('SELECT * FROM SHIPMENTS WHERE ord_id = ? ', [order]);
    const shipment = shipments[0];
    const serviceId = shipment.serviceId;
    const categoryId = shipment.categoryId;
    const [warehouses] = await connection.execute('SELECT * FROM WAREHOUSES WHERE uid = ? AND wid = ?', [id, shipment.wid]);
    const warehouse = warehouses[0]

    // const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
    if (serviceId === 1) {
        const schedule = await fetch(`https://track.delhivery.com/fm/request/new/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Token ${categoryId === 2?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId===1?process.env.DELHIVERY_10KG_SURFACE_KEY:categoryId===3?'':''}`
            },
            body : JSON.stringify({pickup_location: warehouse.warehouseName, pickup_time : shipment.pickup_time, pickup_date : shipment.pickup_date, expected_package_count	: "1"})
          }).then((response) => response.json())
   
    return {
      statusCode: 200,
      body: JSON.stringify({schedule : schedule, success : true}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    };
    }
  } catch (error) {
    return {
        statusCode: 400,
        body: JSON.stringify({schedule : error, success : true, serviceId}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      };
    
  }  finally {
    connection.end()
  }
};
