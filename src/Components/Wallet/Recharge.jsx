import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode"
const Recharge = () => {
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const token = localStorage.getItem('token'); 
  const decoded = jwtDecode(token);
  const username = decoded.username

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const displayRazorpay = async () => {
      const response = await fetch('/.netlify/functions/createOrder', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      setOrder(data);

      const res = await loadRazorpayScript();
  
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }
  

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_API_ID, // Replace with your Razorpay key ID
        amount: amount*100, // Amount is in paise (50000 paise = INR 500)
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        image: 'logo.webp',
        order_id: data.id,
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        // handler: async function (response) {
        //   const verifyResponse = await fetch('/.netlify/functions/verifyRecharge', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       razorpay_payment_id: response.razorpay_payment_id,
        //       razorpay_order_id: response.razorpay_order_id,
        //       razorpay_signature: response.razorpay_signature,
        //       username: username,
        //       amount: amount,
        //     }),
        //   });
        //   const verifyData = await verifyResponse.json();
        //   if (verifyData.success) {
        //     setPaymentId(response.razorpay_payment_id);
        //     setOrder(response.razorpay_order_id);
        //   } else {
        //     alert('Payment verification failed');
        //   }
        // },
        prefill: {
          name: 'Your Name',
          email: 'youremail@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };

  return (
    <div>
      <h1>INR Wallet</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={displayRazorpay}>Recharge Wallet</button>
      {order && <div>Order ID: {order.id}</div>}
      {paymentId && <div>Payment Successful: {paymentId}</div>}
    </div>
  );
};

export default Recharge;
