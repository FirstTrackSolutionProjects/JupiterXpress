// netlify/functions/fetchData.js



exports.handler = async (event, context) => {
    const {method, status, origin, dest, weight, payMode, codAmount, length, breadth, height} = JSON.parse(event.body)
  try {
    const netWeight = (Math.max((length*breadth*height)/5000 , weight)).toString()
    let responses = []
    
    const response = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=${method}&ss=${status}&d_pin=${dest}&o_pin=${origin}&cgm=${netWeight}&pt=${payMode}&cod=${codAmount}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    const data = await response.json();
    const price = data[0]['total_amount']
    responses.push({
      "name" : "Delhivery",
      "min" : "500gm",
      "price" : Math.round(price*1.3)
    })
    return {
      statusCode: 200,
      body: JSON.stringify({responses}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } catch (error) {
    return {
      statusCode: 501,
      body: JSON.stringify({ error: 'Failed to fetch data' + error }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
      },
    };
  }
};
