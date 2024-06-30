// netlify/functions/fetchData.js
const mysql = require('mysql2/promise');


exports.handler = async (event, context) => {
    const {
        name,
        phone,
        address,
        pin
  } = JSON.parse(event.body)
  try {
    const response = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/edit/`, {
        method: 'POST',
        headers: {
        'Authorization': `Token ${process.env.DELHIVERY_500GM_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({name,  phone, address, pin})
    });
    const response2 = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/edit/`, {
      method: 'POST',
      headers: {
      'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      body: JSON.stringify({name,  phone, address, pin})
  });
    const data = await response.json();
    const data2 = await response2.json();
    if (!data.success || !data2.success){
        return {
            statusCode: 400,
            body: JSON.stringify({success: false, message: data.error + data2.error}),
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
        await connection.execute('UPDATE WAREHOUSES set address = ?, phone = ?, pin = ? WHERE warehouseName = ?', [ address, phone, pin, name]);

      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: error.message , success: false }),
        };
      }
    return {
      statusCode: 200,
      body: JSON.stringify({success: true, message:data.data.message}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } catch (error) {
    return {
      statusCode: 501,
      body: JSON.stringify({success:false,  message: error }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  }
};
