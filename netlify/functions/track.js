const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { id, isWaybill } = JSON.parse(event.body);

    const response = await axios.get(`https://track.delhivery.com/api/v1/packages/json/?waybill=${id}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({data : response.data}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
