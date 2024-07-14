// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event, context) => {

  const token = event.headers.authorization;
  const verified = jwt.verify(token, SECRET_KEY);
  const id = verified.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Access Denied' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  }
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [warehouses] = await connection.execute('SELECT COUNT(*) AS warehouses FROM WAREHOUSES WHERE uid = ? ', [id]);
    const warehouse = warehouses[0].warehouses;
    const [shipments] = await connection.execute('SELECT COUNT(*) AS shipments FROM SHIPMENTS WHERE  uid =?', [id]);
    const shipment = shipments[0].shipments;

      return {
        statusCode: 200,
        body: JSON.stringify({ warehouse, shipment , success : true }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
            
          },
      };





  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message , success: false }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } finally { 
    connection.end();
  }
};
