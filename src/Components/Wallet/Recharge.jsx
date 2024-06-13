// RechargeForm.js
import React, { useState } from 'react';

const RechargeForm = () => {
  const [amount, setAmount] = useState('');
  const handleRecharge = async (amount) => {
    const response = await fetch('/.netlify/functions/createOrder', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  
    const order = await response.json();
   
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Your App Name',
      description: 'Wallet Recharge',
      order_id: order.id,
      handler: async (response) => {
        const paymentDetails = {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };
  
        // Verify the payment on the server
        const verificationResponse = await fetch('/.netlify/functions/verifyPayment', {
          method: 'POST',
          body: JSON.stringify(paymentDetails),
        });
  
        const verificationResult = await verificationResponse.json();
        if (verificationResult.success) {
          alert('Payment Successful!');
        } else {
          alert('Payment Verification Failed!');
        }
      },
    };
  
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleRecharge(amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <button type="submit">Recharge</button>
    </form>
  );
}

export default RechargeForm;
