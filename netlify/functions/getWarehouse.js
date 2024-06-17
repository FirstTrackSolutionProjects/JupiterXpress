// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
require('dotenv').config();

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

  const { username } = JSON.parse(event.body);
  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Username required' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  }
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.execute('SELECT * FROM delhiveryWarehouse WHERE username = ?', [username]);

   
      return {
        statusCode: 200,
        body: JSON.stringify({ rows }),
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
  }
};
