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

  const { name, email,  mobile, subject ,message } = JSON.parse(event.body);


  try {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // replace with your email
            pass: process.env.EMAIL_PASS  // replace with your email password or app password
        }
    });

    // Setup email data
    let mailOptions = {
        from: process.env.EMAIL_USER,
        // to: 'info@firsttracksolution.tech', // replace with the recipient's email
        to: process.env.CONTACT_SERVICE_EMAIL, // replace with the recipient's email
        subject: subject,
        text: "Name: " + name + '\n' + "E-mail: " + email + '\n' + "Mobile: " + mobile + '\n'+ "Message: " + message
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.toString() , success: false }),
              };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "success" , success: true }),
          };
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message , success: false }),
    };
  }
};
