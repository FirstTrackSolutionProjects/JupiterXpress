import React from "react";
import ReachCount from "./Review";
import CounterCard from "./CounterCard";
 const ChooseUs=()=>{
    return(
      <>
        <div className='bg-indigo-100 font-inter '>
          <div className='text-center text-2xl md:text-4xl py-5 text-blue-900 font-bold'>Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-500 via-blue-600 to-sky-400">JUPITER XPRESS</span></div>
        <div className='md:grid md:grid-cols-4 px-8 md:px-12 py-2 md:py-5 gap-8'>
          <div className='my-2 shadow-lg h-80 w-full mx-auto bg-white rounded-3xl p-4 text-center border border-gray-400'>
            <img src='images/3.png' className=' w-40 h-40 rounded-md mx-auto'></img>
            <div className='text-xl text-blue-700 font-bold'>Secure Delivery</div>
            <div className='text-base my-3'>We strive to deliver products securely and promptly with our best services.</div>
          </div>
          <div className='my-2 shadow-lg h-80 w-full mx-auto bg-white rounded-3xl p-4 text-center border border-gray-400'>
            <img src='images/4.png' className=' w-40 h-40 rounded-md mx-auto'></img>
            <div className='text-xl text-blue-700 font-bold'>Payment Modes</div>
            <div className='text-base my-3'>Choose from Prepaid, COD, ToPay, and Franchise ToPay options.</div>
          </div>
          <div className='my-2 shadow-lg h-80 w-full mx-auto bg-white rounded-3xl p-4 text-center border border-gray-400'>
            <img src='images/6.png' className=' w-40 h-40 rounded-md mx-auto'></img>
            <div className='text-xl text-blue-700 font-bold'>Smart Label</div>
            <div className='text-base my-3'>Generate professional shipping labels and brand them with your name.</div>
          </div>
          <div className='my-2 shadow-lg h-80 w-full mx-auto bg-white rounded-3xl p-4 text-center border border-gray-400'>
            <img src='images/5.png' className=' w-40 h-40 rounded-md mx-auto'></img>
            <div className='text-xl text-blue-700 font-bold'>Billing Counts</div>
            <div className='text-base my-3'>Easily track transaction costs for better financial management.</div>
          </div>
          </div>
      </div>
      
      </>
    )
 }

 export default ChooseUs;