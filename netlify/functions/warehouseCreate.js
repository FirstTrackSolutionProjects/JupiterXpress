// netlify/functions/fetchData.js
const mysql = require('mysql2/promise');


exports.handler = async (event, context) => {
    const {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pin,
        username
  } = JSON.parse(event.body)
  try {
    const response = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/create/`, {
        method: 'POST',
        headers: {
        'Authorization': 'Token ee0f4261a8a842473bf0621173bbedc8cd230485',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({name, email, phone, address, city, state, country, pin, return_address:address, return_pin:pin, return_city:city, return_state:state, return_country:country})
    });
    const response2 = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/create/`, {
      method: 'POST',
      headers: {
      'Authorization': 'Token ee0f4261a8a842473bf0621173bbedc8cd230485',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      body: JSON.stringify({name, email, phone, address, city, state, country, pin, return_address:address, return_pin:pin, return_city:city, return_state:state, return_country:country})
  });
    const data = await response.json();
    if (!data.success){
        return {
            statusCode: 400,
            body: JSON.stringify({success: false, message: data.error}),
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
        await connection.beginTransaction();
        await connection.execute('INSERT INTO delhiveryWarehouse VALUES (?,?,?,?,?)', [username, name, address, phone, pin]);
        await connection.commit();

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
