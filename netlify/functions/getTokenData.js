const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
  const token = event.headers.authorization;
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access Denied" }),
    };
  }
  try{
    const verified = jwt.verify(token, SECRET_KEY);
    return { statusCode: 200,
        body: JSON.stringify(verified)
    }
  } catch(e){
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Token' }),
    };
  }

};
