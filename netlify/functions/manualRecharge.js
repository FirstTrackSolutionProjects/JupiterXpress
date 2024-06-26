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
  const {email, amount} = JSON.parse(event.body);
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const admin = verified.admin;
    if (!admin){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Not an admin' }),
      };
    }
    try{
          
          const connection = await mysql.createConnection(dbConfig);
          try {
            const [users] = await connection.execute('SELECT * FROM USERS WHERE email = ?',[email]);
            const id = users[0].id;
            await connection.execute('UPDATE WALLET SET balance = balance + ? WHERE id = ?', [amount, id]);
          return {
            statusCode: 200,
            body: JSON.stringify({ success:true, message: "Recharge successfull"})
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message, error: error.message }),
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
