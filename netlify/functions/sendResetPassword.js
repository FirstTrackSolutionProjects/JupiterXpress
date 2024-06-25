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
      user: 'azureaditya5155@gmail.com',
      pass: 'rjbgdxyvfimoahpn',
    },
  });

  


exports.handler = async (event) => {

    try{
      const {email} = JSON.parse(event.body);
      const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000);
    }
    const otp = generateOTP();
    
      const connection = await mysql.createConnection(dbConfig);

        try {
            const [users] = await connection.execute('SELECT * FROM USERS WHERE email = ?',[email]);
            if (users.length == 0){
                throw new Error({message : 'User is not Registered'})
            }
            await connection.execute('UPDATE USERS set secret = ? WHERE email = ?',[otp,email]);
            let mailOptions = {
                from: 'azureaditya5155@gmail.com', 
                to: email, 
                subject: 'OTP for password reset', 
                text: otp.toString(),
              };
            await transporter.sendMail(mailOptions);
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true,  message: `Otp sent to ${email}` }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message,error: error.message }),
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
}
