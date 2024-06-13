const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { username, password } = JSON.parse(event.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error registering user', error: error.message }),
    };
  } finally {
    await connection.end();
  }
};
