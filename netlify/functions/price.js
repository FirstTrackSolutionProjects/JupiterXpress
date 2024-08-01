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
    })
    // const movinRegion = ["Madhya Pradesh, Chhattisgarh",
    //                      "Bihar, Jharkhand, Odisha",
    //                      "West Bengal", 
    //                      "Jammu & Kashmir",
    //                      "Kerala",
    //                      "Chandigarh,Delhi,Haryana,Himachal pradesh,Punjab , Uttarakhand , Uttar Pradesh", 
    //                      "Assam,Arunachal Pradesh,Manipur, Meghalaya ,Mizoram, Nagaland ,Sikkim ,Tripura ", 
    //                      "Andhra Pradesh ,Karnataka , Puducherry, Tamil Nadu , Telangana", 
    //                      "Dadra & Nager Haveli,Daman& Dia, GOA, Gujarat ,Maharashtra , Rajasthan"]
    // const movinPrices =       { 'S':
    //                             [[6.5,9,8,12,9,8,12,8,8],
    //                             [9,8,8,15,13,11,11,11,12],
    //                             [8,8,6.5,13,11,8,8,8,9],
    //                             [12,15,13,11,15,11,15,13,13],
    //                             [9,13,11,15,8,12,14,8,11],
    //                             [8,11,8,11,12,6.5,12,9,8],
    //                             [12,11,8,15,14,12,8,12,12],
    //                             [8,11,8,13,8,9,12,6.5,8],
    //                             [8,12,9,13,11,8,12,8,6.5]],
    //                             'E':
    //                             [[44,52,48,62,52,48,62,48,48],
    //                             [52,44,44,62,62,52,62,58,58],
    //                             [48,44,44,62,58,48,62,55,55],
    //                             [62,62,62,52,62,62,62,62,62],
    //                             [52,62,58,62,44,58,62,44,52],
    //                             [48,52,48,62,58,44,62,55,48],
    //                             [62,62,62,62,62,62,48,62,62],
    //                             [48,58,55,62,44,55,62,44,48],
    //                             [48,58,55,62,52,48,62,48,44]]
    //                           }
    // const movinNetWeight = (Math.max((parseFloat(length)*parseFloat(breadth)*parseFloat(height))/(method=="S"?4.5:5) , weight)).toString()
    // const originData = await fetch(`http://www.postalpincode.in/api/pincode/${origin}`)
    // const destData = await fetch(`http://www.postalpincode.in/api/pincode/${dest}`)
    // const originPSData = await originData.json()
    // const destPSData = await destData.json()
    // const originState = originPSData.PostOffice[0].State;
    // const destState = destPSData.PostOffice[0].State;
    // let i = 0;
    // for (i = 0; i < movinRegion.length; i++) {
    //   if ((movinRegion[i].toLowerCase()).includes((originState.toLowerCase()))){
    //     break;
    //   }
    // }
    // let j = 0;
    // for (j = 0; j < movinRegion.length; j++) {
    //   if ((movinRegion[i].toLowerCase()).includes((destState.toLowerCase()))){
    //     break;
    //   }
    // }
    // let movinPrice = parseFloat(movinPrices[method][i][j])*parseFloat(movinNetWeight)/1000;
    // movinPrice = movinPrice + 30;
    // movinPrice = movinPrice*1.18;
    // movinPrice = movinPrice*1.3;
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
    // if (movinNetWeight >= 10000 && method=='S'){
    //   responses.push({
    //     "name" : `Movin Surface`,
    //     "weight" : `Min. 10Kg`,
    //     "price" : Math.round(parseFloat(movinPrice)),
    //     "serviceId" : "2",
    //     "categoryId" : "1"
    //   })
    // }
    // if (movinNetWeight >= 5000 && method=='E'){
    //   responses.push({
    //     "name" : `Movin Express`,
    //     "weight" : `Min. 5Kg`,
    //     "price" : Math.round(parseFloat(movinPrice)),
    //     "serviceId" : "2",
    //     "categoryId" : "1"
    //   })
    // }
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
  } finally {}
};
