const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { id } = JSON.parse(event.body);

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute('SELECT * FROM USERS WHERE id = ?', [id]);
    const [rows2] = await connection.execute('SELECT * FROM USER_DATA WHERE id = ?', [id]);
    if (rows.length > 0) {
      const id = rows[0].id;
      const name = rows[0].name;
      const verified = rows[0].verified;
      const business_name = rows2[0].business_name;
      return {
        statusCode: 200,
        body: JSON.stringify({ success:true, data : {id, name, verified, business_name} }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error logging in', error: error.message }),
    };
  } finally {
    await connection.end();
  }
};
