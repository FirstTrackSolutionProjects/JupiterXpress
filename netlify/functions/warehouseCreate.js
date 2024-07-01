// netlify/functions/fetchData.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET

exports.handler = async (event, context) => {
    const {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pin
  } = JSON.parse(event.body)
  const token = event.headers.authorization
  try {
    const verified = jwt.verify(token, SECRET_KEY)
    const id = verified.id
    const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        await connection.beginTransaction();
        await connection.execute('INSERT INTO WAREHOUSES (uid, warehouseName, address, phone, pin) VALUES (?,?,?,?,?)', [id, name, address, phone, pin]);
    const delhivery_500 = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/create/`, {
        method: 'POST',
        headers: {
        'Authorization': `Token ${process.env.DELHIVERY_500GM_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({name, email, phone, address, city, state, country, pin, return_address:address, return_pin:pin, return_city:city, return_state:state, return_country:country})
    });
    const delhivery_10 = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/create/`, {
        method: 'POST',
        headers: {
        'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({name, email, phone, address, city, state, country, pin, return_address:address, return_pin:pin, return_city:city, return_state:state, return_country:country})
    });
  //   const response2 = await fetch(`https://track.delhivery.com/api/backend/clientwarehouse/create/`, {
  //     method: 'POST',
  //     headers: {
  //     'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //     },
  //     body: JSON.stringify({name, email, phone, address, city, state, country, pin, return_address:address, return_pin:pin, return_city:city, return_state:state, return_country:country})
  // });
    const data = await delhivery_500.json();
    const data2 = await delhivery_10.json();
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
      body: JSON.stringify({success:false,  message: error.message + token }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  }
};
