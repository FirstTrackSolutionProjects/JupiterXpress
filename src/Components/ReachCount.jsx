import React from "react";
import CounterCard from "./CounterCard";
import Review from "./Review";

const ReachCount =()=>{
    return(
        <div>
            <div className="mx-auto my-auto md:grid md:grid-cols-2 bg-white">
      <div className='grid md:grid-cols-2  gap-3 p-5'>
            <div className='p-3 md:h-32 items-center container shadow-md w-full rounded-lg'>
                <CounterCard targetCount={20} symbol="K+"/>
                <div className='font-inter text-lg text-center my-4 text-gray-600 '>Sellers</div>
            </div>
            <div className='p-3 md:h-32 items-center container shadow-md w-full rounded-lg'>
                <CounterCard targetCount={25} symbol="+" />
                <div className='font-inter text-lg text-center my-4 text-gray-600 '>Delivery Partners</div>
            </div>

            <div className='p-3 md:h-32 items-center container shadow-md w-full rounded-lg'>
                <CounterCard targetCount={10} symbol="K+" />
                <div className='font-inter text-lg text-center my-4 text-gray-600 '>Pincodes</div>
            </div>

            <div className='p-3 md:h-32 items-center container shadow-md w-full rounded-lg'>
                <CounterCard targetCount={5} symbol="K+" />
                <div className='font-inter text-lg text-center my-4 text-gray-600 '>Daily Shipments</div>
            </div>
        </div>
        <div>
        <div className="bg-white p-5">
          <div className="bg-blue-200 bg-opacity-60 rounded-lg items-center justify-center font-inter">
            <div className="text-center px-5 text-lg md:text-2xl pt-8 font-semibold">What Our Clients Think About Us?</div>
            <div className="p-5"><Review/></div>
          </div>
          </div>
        </div>
        </div>
        

        </div>
    )
}

export default ReachCount;