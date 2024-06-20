const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

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
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }
  const token = event.headers.authorization;
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access Denied" }),
    };
  }
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const { order } = JSON.parse(event.body);

    const connection = await mysql.createConnection(dbConfig);

    try {
      const [rows] = await connection.execute(
        "SELECT * FROM ORDERS WHERE ord_id = ?",
        [order]
      );
      if (rows.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, order: rows }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid id" }),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Unexpected Error while getting orders",
          error: error.message,
        }),
      };
    } finally {
      await connection.end();
    }
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access Denied" }),
    };
  }
};
