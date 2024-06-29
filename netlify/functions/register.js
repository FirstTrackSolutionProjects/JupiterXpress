const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const SECRET_KEY = process.env.JWT_SECRET;

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { reg_email, reg_password, name, mobile, business_name } = JSON.parse(event.body);
  const hashedPassword = await bcrypt.hash(reg_password, 10);

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [users] = await connection.execute('SELECT * FROM USERS  WHERE email = ?', [reg_email]);
    if (users.length){
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User is already registered. Please login"}),
      };
    }
    await connection.execute('INSERT INTO USERS (businessName, email, password, fullName, phone ) VALUES (?, ?, ?, ?,?)', [business_name, reg_email, hashedPassword, name, mobile]);
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: reg_email, 
      subject: 'Registration Incomplete', 
      text: `Dear ${name}, \nYour registration on Jupiter Xpress is incomplete. Please verify your details to experience robust features of Jupiter Xpress. \n\n Regards, \nJupiter Xpress`
    };
    await transporter.sendMail(mailOptions)
    const [rows] = await connection.execute('SELECT * FROM USERS  WHERE email = ?', [reg_email]);
    const id = rows[0].uid
    const token = jwt.sign({  email : reg_email , verified : 0, name, id, business_name : business_name }, SECRET_KEY, { expiresIn: '12h' });
    return {
      statusCode: 200,
      body: JSON.stringify({ token : token ,message: 'User registered', success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message}),
    };
  } finally {
    await connection.end();
  }
};
