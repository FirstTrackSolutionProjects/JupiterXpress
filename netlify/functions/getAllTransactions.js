const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
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
  const connection = await mysql.createConnection(dbConfig);

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const admin = verified.admin;
    if (!admin){
        return {
            statusCode: 400,
            body: JSON.stringify({success: false , message : "Access Denied"}),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)`
                
              },
        }
    }
    const [rows] = await connection.execute('SELECT * FROM RECHARGE r JOIN USERS u ON r.uid=u.uid');
    
      
      return {
        statusCode: 200,
        body: JSON.stringify({ success:true, data : rows }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)`
          
        },
      };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unexpected Error while fetching transactions', error: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } finally {
    await connection.end();
  }
};
