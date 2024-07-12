// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  }

  const token = event.headers.authorization;
  const verified = jwt.verify(token, SECRET_KEY);
  const admin = verified.admin;
  if (!admin) {
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
    const [rows] = await connection.execute('SELECT * FROM SHIPMENT_REPORTS r JOIN SHIPMENTS s ON r.ord_id=s.ord_id');
      return {
        statusCode: 200,
        body: JSON.stringify({ rows , success : true }),
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
