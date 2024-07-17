const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

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
      body: JSON.stringify({ message: "Access Denied" }),
    };
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    try {
      const connection = await mysql.createConnection(dbConfig);
      try {
        const [req] = await connection.execute(
          "SELECT * FROM KYC_UPDATE_REQUEST WHERE status='INCOMPLETE' AND uid = ?",
          [id]
        );
        if (req.length > 0) {
          await connection.execute(
            "UPDATE KYC_UPDATE_REQUEST set status='PENDING' WHERE status='INCOMPLETE' AND uid = ?",
            [id]
          );
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              message: "KYC Request Submitted Successfully",
            }),
          };
        }
        else{
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: true,
              message: "You already have a pending KYC Request",
            }),
          };
        }
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: error.message,
            error: error.message,
          }),
        };
      } finally {
        await connection.end();
      }
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Something went wrong" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid Token" }),
    };
  }
};
