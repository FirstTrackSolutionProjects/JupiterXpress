import React, { useEffect, useState } from 'react';

const CardSlide = () => {
  const [visible, setVisible] = useState(false);
  const [activeGrid, setActiveGrid] = useState(0);

  useEffect(() => {
    // Trigger the animation every 5 seconds
    const interval = setInterval(() => {
      setVisible((prevVisible) => !prevVisible);
      if (visible) {
        setActiveGrid((prevGrid) => (prevGrid + 1) % 2); // Toggle between grid 0 and 1
      }
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <div className="hidden relative h-screen w-full md:flex items-center justify-center bg-white">
      {/* Text content centered in the middle */}
      <div
        className={`relative z-10  text-center text-black transition-opacity duration-1000 ${
          visible ? 'opacity-0' : 'opacity-100'
        }`}
      >
         <div className='font-inter w-96 rounded-xl py-5 px-3 bg-white shadow-xl p-3 h-fit  items-center justify-center'>
          <div className='text-2xl font-semibold px-5 py-3 text-blue-400'>Our Industry Expertise</div>
          <div className="texl-base px-5 text-justify">Delivering excellence with industry-specific logistics expertise, ensuring seamless supply chain solutions every step of the way.</div>
        </div>
      </div>

      {/* Grid components overlapping the text */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        {activeGrid === 0 && (
          <div className="grid grid-cols-4 gap-4 w-full px-10">
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : '-translate-x-full'
              } col-span-1`}
            >
                <div className="font-inter rounded-xl py-5 px-3 bg-sky-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Pharmaceuticals</div>
          <div><img src='images/pharma.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : '-translate-x-full'
              } col-span-1`}
            >
              <div className="font-inter rounded-xl py-5 px-3 bg-stone-500 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Electronics & Electricals</div>
          <div><img src='images/electronic.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : 'translate-x-full'
              } col-span-1`}
            >
              <div className="font-inter rounded-xl py-5 px-3 bg-green-300 bg-opacity-40  h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Cosmetics</div>
          <div><img src='images/cosmetics.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : 'translate-x-full'
              } col-span-1`}
            >
              <div className="font-inter rounded-xl  py-5 px-3 bg-purple-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Stationery</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
          </div>
        </div>
            </div>
          </div>
        )}
        {activeGrid === 1 && (
          <div className="grid grid-cols-4 gap-4 w-full px-10">
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : '-translate-x-full'
              } col-span-1`}
            >
               <div className="font-inter rounded-xl  py-5 px-3 bg-pink-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Textile & Garments</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Streamlining Textile and Garment Logistics with Precision, Efficiency, and Industry Expertise
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : '-translate-x-full'
              } col-span-1`}
            >
               <div className="font-inter rounded-xl  py-5 px-3 bg-yellow-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>IT & Peripherals</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Efficiently tailored for IT with cutting-edge solutions for seamless technology management.
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : 'translate-x-full'
              } col-span-1`}
            >
               <div className="font-inter rounded-xl  py-5 px-3 bg-orange-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>E-Commerce</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Jupiter Xpress excels in e-commerce, tailored in ensuring timely deliveries and customer satisfaction
          </div>
        </div>
            </div>
            <div
              className={`transition-transform duration-1000 ${
                visible ? 'translate-x-0' : 'translate-x-full'
              } col-span-1`}
            >
               <div className="font-inter rounded-xl  py-5 px-3 bg-gray-500 bg-opacity-40  h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>FMCG</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Expertise in FMCG industry, ensuring efficient supply chain management and timely deliveries.
          </div>
        </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSlide;
