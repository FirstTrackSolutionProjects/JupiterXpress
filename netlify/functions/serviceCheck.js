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

  const { code } = JSON.parse(event.body);
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Pincode required'}),
    };
  }
  try {
    const response = await axios.get(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${code}`, {
        headers: {
          'Authorization': `Token 2e80e1f3f5368a861041f01bb17c694967e94138`,
        },
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify({data : response.data}),
      };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message , success: false }),
    };
  }
};
