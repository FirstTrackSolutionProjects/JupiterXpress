const axios = require('axios');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const response = await axios.post('https://track.delhivery.com/api/cmu/create.json', body, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
        'Content-Type': 'application/json',
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
