import React from "react";

const LandingInfo=()=>{
    return(
        <div className="bg-white mx-auto font-inter py-3">
            <div className="text-blue-900 text-center text-xl md:text-3xl font-semibold mt-5">What We Offer</div>
            <div className="md:grid md:grid-cols-2">
                <div>
                <div className="text-xl md:text-2xl font-bold text-yellow-500 p-3 md:p-5">
                    International Shipping
                    <div className="text-sm md:text-base text-black font-normal text-justify">
                    Navigate global commerce with confidence through our international shipping services. With extensive experience and a robust network, 
                    we ensure your goods are delivered efficiently and securely across borders. From customs clearance to final delivery, our comprehensive solutions provide seamless and reliable logistics support, making international shipping effortless and worry-free.
                    </div>
                </div>
                <div className="text-xl md:text-2xl font-bold text-yellow-500 p-3 md:p-5">
                    Domestic Shipping
                    <div className="text-sm md:text-base text-black font-normal text-justify">
                    Streamlining domestic shipping with precision and reliability, we ensure your goods reach their destination on time, every time. Our comprehensive logistics solutions offer seamless tracking, secure handling, and efficient delivery, tailored to meet your needs and exceed expectations.
                    Trust us for dependable domestic shipping that keeps your business moving smoothly and efficiently.
                    </div>
                </div>
                </div>
                <div>
                    <img src="images/banner.png" alt="no image" className="p-2 object-cover my-auto"></img>
                </div>
            </div>

        </div>
    )
}

export default LandingInfo;