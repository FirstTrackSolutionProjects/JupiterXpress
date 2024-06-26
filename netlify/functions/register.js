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
    user: 'azureaditya5155@gmail.com',
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

  const { reg_email, reg_password, name, mobile } = JSON.parse(event.body);
  const hashedPassword = await bcrypt.hash(reg_password, 10);

  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.execute('INSERT INTO USERS (email, password, name, mobile ) VALUES (?, ?, ?, ?)', [reg_email, hashedPassword, name, mobile]);
    let mailOptions = {
      from: 'azureaditya5155@gmail.com', 
      to: reg_email, 
      subject: 'Registration Successfull', 
      text: `Dear ${name}, \nYour registration on Jupiter Xpress is successfull. Please verify your details to experience robust features of Jupiter Xpress. \n\n Regards, \nJupiter Xpress`
    };
    await transporter.sendMail(mailOptions)
    const [rows] = await connection.execute('SELECT * FROM USERS WHERE email = ?', [reg_email]);
    const id = rows[0].id
    const token = jwt.sign({  email : reg_email , verified : 0, name, id }, SECRET_KEY, { expiresIn: '12h' });
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
