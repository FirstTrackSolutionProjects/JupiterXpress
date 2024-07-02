exports.handler = async (event) => {
  try {
    const { id } = JSON.parse(event.body);

    const response1 = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${id}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_500GM_SURFACE_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data1 = await response1.json();

    if (data1.ShipmentData) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: data1, success: true, id : 1 }),
      };
    }

    const response2 = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${id}`, {
      headers: {
        'Authorization': `Token ${process.env.DELHIVERY_10KG_SURFACE_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data2 = await response2.json();

    if (data2.ShipmentData) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: data2, success: true, id : 1 }),
      };
    }

    const response3 = await fetch(`http://admin.flightgo.in/api/tracking_api/get_tracking_data?api_company_id=24&customer_code=1179&tracking_no=${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data3 = await response3.json();
    if (!data3[0].errors) {
      return {
        statusCode: 200,
        body: JSON.stringify({ data: data3[0], success: true, id : 2 }),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
