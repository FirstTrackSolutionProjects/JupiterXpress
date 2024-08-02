import React from "react";
import { FaArrowRight } from "react-icons/fa";
import LandingCalc from "./LandingCalc";

const CalcComp=()=>{
    return(
        <div className="bg-blue-100 font-inter">
            <div className="text-3xl bg-clip-text text-transparent bg-gradient-to-br from-blue-700  to-sky-400 text-center py-3 font-semibold">Estimate Your Shipping</div>
            <div className="md:grid md:grid-cols-2  ">
                <div>
                    <LandingCalc/>
                </div>

                <div className=" p-5">
                    
                    <div className="text-base mx-3 text-center text-blue-700">Effortlessly calculate shipping costs with precision and ease.</div>
                
                        <div className="text-sm m-3 text-justify">Optimize your shipping costs effortlessly with our advanced shipping calculator. Designed for precision and ease of use, our tool empowers you to quickly estimate shipping expenses based on weight, dimensions, and destination. No more guessing or unexpected charges - just accurate, transparent pricing tailored to your needs.</div>
                        <div className="text-sm m-3 text-justify">Whether you're a business owner managing bulk shipments or an individual sending a single package, our shipping calculator ensures you get the best rates available. Save time and budget effectively with real-time calculations and a user-friendly interface, making shipping decisions simpler and more efficient than ever before.</div>
                    <div className="bg-blue-700 text-sm m-5 text-white p-2 flex w-44 items-center justify-center rounded-lg text-center"> Explore More <span><FaArrowRight className="h-4 w-5 ml-2"/></span></div>
                    <div className="">
                        <img src="images/gif2.gif" className="w-96 mx-auto  -mt-20"></img>
                    </div>
                </div>

                
            </div>
        </div>
    )
}

export default CalcComp;