// netlify/functions/authenticate.js
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'I can reach this mf backend', success:true }),
  };
  const { name, email,  mobile, subject ,message } = JSON.parse(event.body);
  try {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "azureaditya5155@gmail.com", // replace with your email
            pass: "ygpgjcojjhhipbco"
            // replace with your email password or app password
        }
    });
    // Setup email data
    let mailOptions = {
        // from: process.env.EMAIL_USER,
        from : "azureaditya5155@gmail.com",
        // to: 'info@firsttracksolution.tech', // replace with the recipient's email
        // to: process.env.CONTACT_SERVICE_EMAIL, // replace with the recipient's email
        to : "adityakumar5155@gmail.com",
        subject: subject,
        text: "Name: " + name + '\n' + "E-mail: " + email + '\n' + "Mobile: " + mobile + '\n'+ "Message: " + message
    };
    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send({success:true ,message:info});
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message, success: false }),
    };
  }
};
