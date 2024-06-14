const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  const userId = event.queryStringParameters.username;

  // Connect to MySQL database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute('SELECT balance FROM users WHERE username = ?', [userId]);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const balance = rows[0].balance;

    return {
      statusCode: 200,
      body: JSON.stringify({ balance }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    connection.end();
  }
};
