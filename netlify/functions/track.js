const axios = require('axios');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

exports.handler = async (event) => {
  try {
    const { id, isWaybill } = JSON.parse(event.body);
    const connection = await mysql.createConnection(dbConfig);
    const [shipment] = await connection.execute(`SELECT * FROM SHIPMENTS WHERE ${isWaybill ?'awb':'ord_id'}=${id}`)
    const {serviceId, categoryId} = shipment[0]
    if (serviceId === 1){
      const response = await axios.get(`https://track.delhivery.com/api/v1/packages/json/?${isWaybill?"waybill":"ref_ids"}=${id}`, {
        headers: {
          'Authorization': `Token ${categoryId===1?process.env.DELHIVERY_500GM_SURFACE_KEY:categoryId===2?process.env.DELHIVERY_10KG_SURFACE_KEY:""}`,
        },
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify({data : response.data}),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
