import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode"
const Recharge = () => {
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const token = localStorage.getItem('token'); 
  const decoded = jwtDecode(token);
  const username = decoded.username
  const handlePayment = async () => {
    const response = await fetch('/.netlify/functions/createOrder', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    setOrder(data);

    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_API_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Your App',
      description: 'Wallet Recharge',
      order_id: data.id,
      handler: async function (response) {
        const verifyResponse = await fetch('/.netlify/functions/verifyPayment', {
          method: 'POST',
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            username: username,
            amount: amount,
          }),
        });
        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          setPaymentId(response.razorpay_payment_id);
        } else {
          alert('Payment verification failed');
        }
      },
      prefill: {
        name: 'Your Name',
        email: 'email@example.com',
        contact: '9999999999',
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h1>INR Wallet</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Recharge Wallet</button>
      {order && <div>Order ID: {order.id}</div>}
      {paymentId && <div>Payment Successful: {paymentId}</div>}
    </div>
  );
};

export default Recharge;
