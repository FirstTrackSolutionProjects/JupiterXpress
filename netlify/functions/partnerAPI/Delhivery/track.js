const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { waybill } = JSON.parse(event.body);

    const response = await axios.get(`https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
