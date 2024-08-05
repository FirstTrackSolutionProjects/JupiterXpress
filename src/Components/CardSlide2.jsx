import React, { useEffect, useState } from 'react';

import { FaChevronLeft, FaChevronRight} from 'react-icons/fa';

const CardSlide2 = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    <div className="font-inter rounded-xl py-5 px-3 bg-sky-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>Pharmaceuticals</div>
          <div><img src='images/pharma.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
          </div>
        </div>,
        <div className="font-inter rounded-xl py-5 px-3 bg-stone-500 bg-opacity-40 h-fit  items-center justify-center">
        <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
        <div className='text-lg text-blue-950'>Electronics & Electricals</div>
        <div><img src='images/electronic.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
        </div>
        <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
        Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
        </div>
      </div>,
      <div className="font-inter rounded-xl py-5 px-3 bg-green-300 bg-opacity-40  h-fit  items-center justify-center">
      <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
      <div className='text-lg text-blue-950'>Cosmetics</div>
      <div><img src='images/cosmetics.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
      </div>
      <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
      Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
      </div>
    </div>,
    <div className="font-inter rounded-xl  py-5 px-3 bg-purple-300 bg-opacity-40 h-fit  items-center justify-center">
    <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
    <div className='text-lg text-blue-950'>Stationery</div>
    <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
    </div>
    <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
    Stay informed every step of the way with our real-time tracking feature, ensuring you always know the status of your order.
    </div>
  </div>,
  <div className="font-inter rounded-xl  py-5 px-3 bg-pink-300 bg-opacity-40 h-fit  items-center justify-center">
  <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
  <div className='text-lg text-blue-950'>Textile & Garments</div>
  <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
  </div>
  <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
  Streamlining Textile and Garment Logistics with Precision, Efficiency, and Industry Expertise
  </div>
</div>,
<div className="font-inter rounded-xl  py-5 px-3 bg-yellow-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>IT & Peripherals</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Efficiently tailored for IT with cutting-edge solutions for seamless technology management.
          </div>
        </div>,
    <div className="font-inter rounded-xl  py-5 px-3 bg-orange-300 bg-opacity-40 h-fit  items-center justify-center">
          <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
          <div className='text-lg text-blue-950'>E-Commerce</div>
          <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
          </div>
          <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
          Jupiter Xpress excels in e-commerce, tailored in ensuring timely deliveries and customer satisfaction
          </div>
        </div>,
    <div className="font-inter rounded-xl  py-5 px-3 bg-gray-500 bg-opacity-40  h-fit  items-center justify-center">
    <div className='bg-white h-fit bg-opacity-40 p-5 rounded-xl'>
    <div className='text-lg text-blue-950'>FMCG</div>
    <div><img src='images/stationery.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
    </div>
    <div className='bg-white text-black bg-opacity-40 p-5 mt-3 text-base rounded-xl'>
    Expertise in FMCG industry, ensuring efficient supply chain management and timely deliveries.
    </div>
  </div>,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };


  return (
    <div>
      {/* Medium and above screens */}
      <div className="hidden md:flex relative h-screen w-full items-center justify-center bg-gray-200">
        {/* Text content centered in the middle */}
        <div
          className={`relative z-10 text-center  transition-opacity duration-1000 ${
            visible ? 'opacity-0' : 'opacity-100'
          }`}
        >
         <div className='font-inter w-96 rounded-xl py-5 px-3 bg-white shadow-xl p-3 h-fit  items-center justify-center'>
          <div className='text-2xl font-semibold px-5 text-blue-900'>Our Industry Expertise</div>
          <div className="texl-base px-5 text-black my-3">Delivering excellence with industry-specific logistics expertise, ensuring seamless supply chain solutions every step of the way.</div>
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
          <div><img src='images/textile.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
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
          <div><img src='images/computer.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl'></img></div>
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
          <div><img src='images/comm.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl object-fill'></img></div>
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
          <div><img src='images/fmcg.jpg' alt='no image' className='w-full h-48 mx-auto rounded-xl object-fill'></img></div>
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

      {/* Small screens */}
      <div className='md:hidden'>
      <div className='font-inter w-fit py-5 px-3 bg-white shadow-xl p-3 h-fit  items-center justify-center'>
          <div className='text-xl font-semibold px-5 py-3 text-blue-900 text-center'>Our Industry Expertise</div>
          <div className="texl-base px-3 text-justify">Delivering excellence with industry-specific logistics expertise, ensuring seamless supply chain solutions every step of the way.</div>
        </div>
      </div>
      
      <div className="md:hidden relative w-full max-w-lg mx-auto bg-white py-2">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide,index) => (
            <div key={index} className="min-w-full h-fit flex items-center justify-center ">
              {slide}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handlePrevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2  text-white rounded-full focus:outline-none"
      >
        <FaChevronLeft/>
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2  text-white rounded-full focus:outline-none"
      >
        <FaChevronRight/>
      </button>
    </div>
    </div>
  );
};

export default CardSlide2;
