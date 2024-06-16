// netlify/functions/fetchData.js



exports.handler = async (event, context) => {
    const {method, status, origin, dest, weight, payMode, codAmount} = JSON.parse(event.body)
  try {
    const response = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=${method}&ss=${status}&d_pin=${dest}&o_pin=${origin}&cgm=${weight}&pt=${payMode}&cod=${codAmount}`);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({data}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' + error }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  }
};
