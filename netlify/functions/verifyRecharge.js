const Razorpay = require('razorpay');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false,
  auth: {
    user: 'azureaditya5155@gmail.com',
    pass: 'rjbgdxyvfimoahpn',
  },
});
exports.handler = async (event, context) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, uid, amount } = JSON.parse(event.body);

  const razorpay = new Razorpay({
    key_id: "rzp_live_bUjlhO5HTl10ug",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Verify the payment signature
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid payment signature' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
            
          },
        };
      }

  // Connect to MySQL database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Update user's wallet balance in database
    await connection.execute('UPDATE WALLET SET balance = balance + ? WHERE id = ?', [amount, uid]);

    // Insert transaction record
    const transactionDetails = {
      uid,
      razorpay_payment_id,
      razorpay_order_id,
      amount,
      date: new Date(),
    };
    
    await connection.execute(
      'INSERT INTO TRANSACTIONS (id, payment_id, order_id, amount, date) VALUES (?, ?, ?, ?, ?)',
      [transactionDetails.uid, transactionDetails.razorpay_payment_id, transactionDetails.razorpay_order_id, transactionDetails.amount, transactionDetails.date]
    );
    let mailOptions = {
      from: 'azureaditya5155@gmail.com', 
      to: 'adityakr5155@gmail.com', 
      subject: 'Wallet Recharge Successfull', 
      text: `Dear Merchant, \nYour wallet recharge for amount ₹${amount} has been verified and credited to your wallet.\nRegards,\nJupiter Xpress`
    };
  await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message : "Recharge Successfull" }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
        
      },
    };
  } finally {
    connection.end();
  }
};
