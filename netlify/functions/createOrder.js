const Razorpay = require('razorpay');

exports.handler = async (event, context) => {
  const { amount } = JSON.parse(event.body);

  const razorpay = new Razorpay({
    key_id: process.env.VITE_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
