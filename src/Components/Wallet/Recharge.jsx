import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode"
const Recharge = ({setShowRecharge}) => {
  const [amount, setAmount] = useState(500);
  const [order, setOrder] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const token = localStorage.getItem('token'); 
  const decoded = jwtDecode(token);
  const id = decoded.id
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
      // if (parseInt(amount) < 500){
      //   return;
      // }
      const response = await fetch('/.netlify/functions/deliveryOrder', {
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
        handler: async function (response) {
          const verifyResponse = await fetch('/.netlify/functions/verifyRecharge', {
            method: 'POST',
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              uid: id,
              amount: amount,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            setPaymentId(response.razorpay_payment_id);
            setOrder(response.razorpay_order_id);
          } else {
            alert(verifyData.error);
          }
        },
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
    <div className='absolute inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]'>
      <form className='relative mx-2 w-full sm:w-[500px] flex flex-col items-center bg-white rounded-2xl p-8 space-y-8' onSubmit={(e)=>{e.preventDefault(); displayRazorpay()}}>
      <div className='absolute right-6 hover:bg-blue-500 w-7 h-7 rounded-full flex items-center justify-center hover:text-white' onClick={()=>setShowRecharge(false)}>
          X
        </div>
        <div className='text-2xl font-medium text-center'>Wallet Recharge</div>
        
      <input
        type="number"
        value={amount}
        min={500}
        onChange={(e) => setAmount(e.target.value)}
        className='w-full border py-2 px-4 rounded-3xl'
      />
      <div className='flex w-full justify-evenly'>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(500)}}>500</button>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(1000)}}>1000</button>
      <button className='w-20 border py-2 px-4 rounded-3xl hover:bg-blue-500 hover:text-white' onClick={()=>{setAmount(2000)}}>2000</button>
      </div>
      <button type='submit' className='w-40 border py-2 px-4 rounded-3xl hover:text-white hover:bg-blue-500'>Recharge Wallet</button>
      </form>
    </div>
  );
};

export default Recharge;
