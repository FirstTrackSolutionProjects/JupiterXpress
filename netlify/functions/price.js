// netlify/functions/fetchData.js



exports.handler = async (event, context) => {
    const {method, status, origin, dest, weight, payMode, codAmount, length, breadth, height} = JSON.parse(event.body)
  try {
    const netWeight = (Math.max((parseFloat(length)*parseFloat(breadth)*parseFloat(height))/5 , weight)).toString()
    let responses = []
    
    const response = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=${method}&ss=${status}&d_pin=${dest}&o_pin=${origin}&cgm=${netWeight}&pt=${payMode}&cod=${codAmount}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_500GM_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    const response2 = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=${method}&ss=${status}&d_pin=${dest}&o_pin=${origin}&cgm=${netWeight}&pt=${payMode}&cod=${codAmount}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    const data = await response.json();
    const data2 = await response2.json();
    const price = data[0]['total_amount']
    const price2 = data2[0]['total_amount']
    responses.push({
      "name" : `Delhivery ${method=='S'?'Surface' : 'Express'} Light`,
      "weight" : "500gm",
      "price" : Math.round(price*1.3),
      "serviceId" : "1",
      "categoryId" : "2"
    })
    if (method=='S') {
      responses.push({
        "name" :  `Delhivery Surface`,
        "weight" : "10Kg",
        "price" : Math.round(price2*1.3),
        "serviceId" : "1",
        "categoryId" : "1"

      })
    }
    return {
      statusCode: 200,
      body: JSON.stringify({prices : responses}),
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
