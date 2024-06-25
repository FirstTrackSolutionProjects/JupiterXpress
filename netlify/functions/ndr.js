// netlify/functions/authenticate.js
const axios = require('axios');
require('dotenv').config();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { waybill, act, date } = JSON.parse(event.body);

  try {
    const req = {
        waybill: waybill,
        act: act,
        action_data : {
            deferred_date : date
        }
    }
    const response = await fetch(`https://track.delhivery.com/api/p/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ee0f4261a8a842473bf0621173bbedc8cd230485`,
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        },
        body : JSON.stringify(req)
      }).then(response => response.json());
  
      return {
        statusCode: 200,
        body: JSON.stringify({data : response}),
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
