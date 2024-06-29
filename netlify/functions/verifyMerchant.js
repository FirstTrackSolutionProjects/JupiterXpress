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
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
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
  const {uid, reqId} = JSON.parse(event.body);
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const admin = verified.admin;
    const id = verified.id;
    if (!admin){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Not an admin' }),
      };
    }
    try{
          
          const connection = await mysql.createConnection(dbConfig);
          try {
            await connection.execute("UPDATE MERCHANT_VERIFICATION SET status='accepted', actionBy=? WHERE reqId = ? ", [id,reqId]);
            const [req] = await connection.execute("SELECT * FROM MERCHANT_VERIFICATION WHERE reqId = ? ", [reqId]);
            const userData = req[0];
            await connection.execute("INSERT INTO USER_DATA (uid, address, state, city, pin, aadhar_number, pan_number, gst, cin ,msme, accountNumber, ifsc, bank) VALUES (?, ? ,? ,?, ? ,? ,? ,? ,? , ? , ? ,? ,?) ",[uid, userData.address, userData.state, userData.city, userData.pin, userData.aadhar_number, userData.pan_number, userData.gst, userData.cin, userData.msme, userData.accountNumber, userData.ifsc, userData.bank])
            await connection.execute("INSERT INTO WALLET (uid, balance) VALUES (?, ?)",[uid, 10]);
             await connection.execute("UPDATE USERS SET isVerified = 1 WHERE uid = ?", [uid]);
             const [users] = await connection.execute("SELECT * FROM USERS WHERE uid = ?", [uid]);
             const {email , name} = users[0];
             let mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,  
              subject: 'Account has been verified', 
              text: `Dear ${name}, \nYour account has been verified on Jupiter Xpress. Login now and experience the fast delivery.`
            };
            await transporter.sendMail(mailOptions);
          return {
            statusCode: 200,
            body: JSON.stringify({ success:true, message: 'Merchant successfully verified'}),
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
