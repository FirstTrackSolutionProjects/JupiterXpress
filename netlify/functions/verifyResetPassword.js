const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

exports.handler = async (event) => {


    try{
      const {email, otp, password} = JSON.parse(event.body);
      const connection = await mysql.createConnection(dbConfig);

        try {
            
            const [users] = await connection.execute('SELECT * FROM USERS WHERE email = ?',[email]);
            if (users.length == 0){
              throw new Error({message : 'User not Found'})
            }
            const inOtp = users[0].secret;
            if (inOtp == otp){
              await connection.beginTransaction();
              await connection.execute('UPDATE USERS SET password = ? WHERE email = ?',[await bcrypt.hash(password, 10), email])
              await connection.execute('UPDATE USERS SET secret = ? WHERE email = ?',[null, email])
              await connection.commit();
            }
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true,  message: 'Password Changed' }),
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
