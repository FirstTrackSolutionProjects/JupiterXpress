const Razorpay = require('razorpay');
const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, username, amount } = JSON.parse(event.body);

  const razorpay = new Razorpay({
    key_id: "rzp_live_bUjlhO5HTl10ug",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Verify the payment signature
  const isValid = razorpay.validateWebhookSignature(
    event.body,
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid payment signature' }),
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
    await connection.execute('UPDATE users SET balance = balance + ? WHERE username = ?', [amount, username]);

    // Insert transaction record
    const transactionDetails = {
      username,
      razorpay_payment_id,
      razorpay_order_id,
      amount,
      date: new Date(),
    };
    
    await connection.execute(
      'INSERT INTO transactions (username, payment_id, order_id, amount, date) VALUES (?, ?, ?, ?, ?)',
      [transactionDetails.username, transactionDetails.razorpay_payment_id, transactionDetails.razorpay_order_id, transactionDetails.amount, transactionDetails.date]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    connection.end();
  }
};
