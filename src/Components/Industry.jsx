import React from "react";

const Industry =()=>{
    return(
        <div className="bg-neutral-50 text-center font-inter py-3">
            <div className="text-2xl text-blue-900 font-bold py-3 md:py-5">Industries We Serve</div>
            <div className="px-3 md:px-44 pb-3 text-sm md:text-base">Leverage our extensive expertise in logistics, honed through years of industry experience. We provide tailored solutions for complex supply chains, ensuring efficiency, reliability, and cost-effectiveness.
                Trust us to navigate the challenges of modern logistics, delivering excellence from start to finish with our dedicated team and innovative strategies.</div>
            {/*<div className="flex-1 md:flex items-center mx-auto md:justify-evenly p-3">*/}
                <div className="grid grid-cols-3 grid-rows-2 md:grid-rows-1 md:grid-cols-6 md:px-5">
                <div className="justify-center">
                    <img src="images/z1.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-4 bg-pink-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">Pharmacy</div>
                </div>
                <div className="justify-center">
                    <img src="images/z2.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-2 bg-yellow-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">Cosmetics</div>
                </div>
                <div className="justify-center">
                    <img src="images/z3.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-4 bg-purple-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">Electronics</div>
                </div>
                <div className="justify-center">
                    <img src="images/z4.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-4 bg-orange-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">Textile</div>
                </div>
                <div className="justify-center">
                    <img src="images/z5.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-4 bg-green-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">FMCG</div>
                </div>
                <div className="justify-center">
                    <img src="images/z6.png" alt="" className="mx-auto h-28 w-24 md:h-32 md:w-32 object-fill md:p-4 bg-blue-50 shadow-lg"></img>
                    <div className="text-base md:text-lg mt-2">Stationery</div>
                </div>
            </div>
        </div>
    )
}

export default Industry;