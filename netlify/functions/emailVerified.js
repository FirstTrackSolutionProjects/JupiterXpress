// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
 
  
  try {
    const {email} = JSON.parse(event.body);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.execute('SELECT * FROM USERS WHERE email = ?', [email]);
    const emailVerified = rows[0].emailVerified;
        return {
            statusCode: 200,
            body: JSON.stringify({ emailVerified : emailVerified }),
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
