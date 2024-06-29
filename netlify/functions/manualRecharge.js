const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
  const {email, amount, reason} = JSON.parse(event.body);
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
            await connection.beginTransaction();
            const [users] = await connection.execute('SELECT * FROM USERS WHERE email = ?',[email]);
            if (users.length){
              const uid = users[0].uid;
              await connection.execute('UPDATE WALLET SET balance = balance + ? WHERE uid = ?', [amount, uid]);
              await connection.execute('INSERT INTO MANUAL_RECHARGE (beneficiary_id, amount, reason) VALUES (?,?,?)',[uid, amount, reason]);
            }
            else{
              return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User not found' }),
              };
            }
            await connection.commit();
            let mailOptions = {
              from: process.env.EMAIL_USER,
              to: email, 
              subject: 'Manual Recharge Received', 
              text: `Dear Merchant, \nYour wallet got manually ${amount>=0?"credited":"debited"} by ₹${amount}.\nRegards,\nJupiter Xpress`
            };
            await transporter.sendMail(mailOptions);
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
