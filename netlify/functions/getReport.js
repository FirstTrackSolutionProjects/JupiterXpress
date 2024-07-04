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
  const {ref_id, serviceId, categoryId} = JSON.parse(event.body)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
      if (serviceId === 1){
        const response = await fetch(`https://track.delhivery.com/api/v1/packages/json/?ref_ids=JUPX${ref_id}`, {
            headers: {
              'Authorization': `Token ${categoryId==2?process.env.DELHIVERY_500GM_SURFACE_KEY:process.env.DELHIVERY_10KG_SURFACE_KEY}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const status = data.ShipmentData[0].Status.Status;
          await connection.execute('UPDATE SHIPMENT_REPORTS set status = ? WHERE ref_id = ?', [status, ref_id]);
          const [rows] = await connection.execute('SELECT * FROM SHIPMENT_REPORTS r JOIN SHIPMENTS s ON r.ord_id=s.ord_id WHERE r.ref_id = ?', [ref_id])
          return {
            statusCode: 200,
            body: JSON.stringify({ data : rows[0] , success : true }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
                
              },
          };
      } else if ( serviceId === 2) {
        const response = await fetch(`http://admin.flightgo.in/api/tracking_api/get_tracking_data?api_company_id=24&customer_code=1179&tracking_no=${ref_id}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const status = data.ShipmentData[0].Status.Status;
          await connection.execute('UPDATE SHIPMENT_REPORTS set status = ? WHERE ref_id = ?', [status, ref_id]);
          const [rows] = await connection.execute('SELECT * FROM SHIPMENT_REPORTS r JOIN SHIPMENTS s ON r.ord_id=s.ord_id WHERE r.ref_id = ?', [ref_id])
          return {
            statusCode: 200,
            body: JSON.stringify({ data : rows[0] , success : true }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
                
              },
          };
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
