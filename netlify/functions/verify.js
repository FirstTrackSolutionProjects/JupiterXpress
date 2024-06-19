const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const token = event.headers.authorization;
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Access Denied' }),
    };
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    try{
      const {name,
        address,
        state,
        city,
        pin,
        hub,
        aadhar,
        pan,
        gst,
        msme,
        bank,
        ifsc,
        account,
        cin,
        id} = JSON.parse(event.body);

        const connection = await mysql.createConnection(dbConfig);

        try {
          await connection.execute('INSERT INTO USER_DATA (id, business_name, address, city, state, hub, pin ,aadhar, pan, gstin, cin, account_number, ifsc, bank, msme_udyam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id,name , address, city, state, hub, pin,  aadhar, pan, gst, cin, account, ifsc, bank, msme]);
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Details Submitted' }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({ message: "Something went wrong", error: error.message }),
          };
        } finally {
          await connection.end();
        }

    } catch(err){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Something went wrong' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Token' }),
    };
  }
};
