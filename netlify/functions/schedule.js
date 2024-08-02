const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const token = event.headers.authorization;
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    let {wid, pickTime, pickDate, packages, serviceId, categoryId} = JSON.parse(event.body);
    const [warehouses] = await connection.execute('SELECT * FROM WAREHOUSES WHERE uid = ? AND wid = ?', [id, wid]);
    const warehouse = warehouses[0]
    categoryId = 1;
    serviceId = 1;
    // const [orders] = await connection.execute('SELECT * FROM ORDERS WHERE ord_id = ? ', [order]);
   
    if (serviceId == 1){
      const schedule = await fetch(`https://track.delhivery.com/fm/request/new/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`
        },
        body : JSON.stringify({pickup_location: warehouse.warehouseName, pickup_time : pickTime, pickup_date : pickDate, expected_package_count	: packages})
      })
      const scheduleData = await schedule.json()
      if (scheduleData.incoming_center_name){
        return {
          statusCode: 200,
          body: JSON.stringify({schedule : "Pickup request sent successfully", success : true}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        };
      }
      else if (scheduleData.prepaid){
        return {
          statusCode: 200,
          body: JSON.stringify({schedule : "Pickup request failed due to low balance of owner", success : true}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        };
      }
      else if (scheduleData.pr_exist){
        return {
          statusCode: 200,
          body: JSON.stringify({schedule : "This time slot is already booked", success : true}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        };
      }
      else {
        return {
          statusCode: 200,
          body: JSON.stringify({schedule : "Please enter a valid date and time in future", success : true}),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        };
      }
      


    } else {
      const schedule = await fetch(`https://newco-apim-test.azure-api.net/rest/v2/pickup/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Ocp-Apim-Subscription-Key' : `284cee****************************`,
          'Authorization': `Bearer ${process.env.MOVIN_API_KEY}`
        },
        body : JSON.stringify({pickup_location: warehouse.warehouseName, pickup_time : pickTime, pickup_date : pickDate, expected_package_count	: packages})
      }).then((response) => response.json())

return {
  statusCode: 200,
  body: JSON.stringify({schedule : schedule, success : true}),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
};
    }
    
  } catch (error) {
    return {
        statusCode: 400,
        body: JSON.stringify({schedule : error, success : false}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      };
    
  }  finally {
    connection.end()
  }
};
