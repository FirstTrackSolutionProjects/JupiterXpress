// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

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
  const connection = await mysql.createConnection(dbConfig);
//   const token = event.headers.authorization;
//   const verified = jwt.verify(token, SECRET_KEY);
//   const id = verified.id;
//   if (!id) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: 'Access Denied' }),
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
//       },
//     };
//   }
  const {awb} = JSON.parse(event.body)

  try {
     
        const response = await fetch(`http://admin.flightgo.in/api/tracking_api/get_tracking_data?api_company_id=24&customer_code=1179&tracking_no=${awb}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const status = data[0].docket_info[4][1];
          await connection.execute('UPDATE INTERNATIONAL_SHIPMENTS set status = ? WHERE awb = ?', [status, awb]);
          const [rows] = await connection.execute('SELECT * FROM INTERNATIONAL_SHIPMENTS WHERE awb = ?', [awb])
          return {
            statusCode: 200,
            body: JSON.stringify({ data : rows[0], track : data , success : true }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
                
              },
          
      }

      





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
