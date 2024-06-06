// netlify/functions/authenticate.js
const mysql = require('mysql2/promise');
require('dotenv').config();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { email, password } = JSON.parse(event.body);
  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email and Password are required' }),
    };
  }
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      };
    }

    const user = rows[0];

    if (user.password === password) { // Note: In a real-world scenario, you should hash and compare passwords
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Authentication successful', success: true }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid email or password', success: false }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message , success: false }),
    };
  }
};
