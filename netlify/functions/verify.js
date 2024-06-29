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

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    const id = verified.id;
    try{
      const {
        address,
        state,
        city,
        pin,
        aadhar,
        pan,
        gst,
        msme,
        bank,
        ifsc,
        account,
        cin} = JSON.parse(event.body);

        const connection = await mysql.createConnection(dbConfig);

        try {
          const [requests] = await connection.execute('SELECT * FROM MERCHANT_VERIFICATION WHERE uid = ? AND status = "pending"',[id]);
          if (requests.length){
            return {
              statusCode: 400,
              body: JSON.stringify({ message: 'You already have a pending verification request' }),
            };
          }
          await connection.execute('INSERT INTO MERCHANT_VERIFICATION (uid, address, city, state, pin ,aadhar_number, pan_number, gst, cin, accountNumber, ifsc, bank, msme, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, address, city, state, pin,  aadhar, pan, gst, cin, account, ifsc, bank, msme, "pending"]);
          const [users] = await connection.execute('SELECT * FROM USERS WHERE uid = ?', [id]);
          const email = users[0].email;
          const name = users[0].fullName;
          let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, 
            subject: 'Verification Request Submitted Successfully', 
            text: `Dear ${name}, \n Your Request for verification of account on Jupiter Xpress is submitted successfully.  \n\nRegards, \nJupiter Xpress`
          };
          let mailOptions2 = {
            from: process.env.EMAIL_USER,
            to: process.env.VERIFY_EMAIL,  
            subject: 'Merchant Verification Request Received', 
            text: `Dear Owner, \n${name} has submitted a request for verification of account on Jupiter Xpress.`
          };
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions2);
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Details Submitted' }),
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
