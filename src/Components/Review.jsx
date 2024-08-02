import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight} from 'react-icons/fa';

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    <div className="h-fit justify-center items-center bg-blue-400 bg-opacity-20 rounded-lg font-inter">
      <div className="text-black text-sm md:text-base text-justify p-3">I've been using Jupiter Xpress for all my logistics needs, and they've never let me down. Great company!</div>
      <div className='text-right text-sm md:text-base p-2 text-gray-700'>- Amit Kumar</div>
    </div>,
    <div className="h-fit justify-center items-center bg-blue-400 bg-opacity-20 rounded-lg font-inter">
      <div className="text-black text-sm md:text-base text-justify p-3">Jupiter Xpress's dedication to on-time deliveries and excellent customer service makes them the best in the business.</div>
      <div className='text-right text-sm md:text-base p-2 text-gray-700'>- Sejal Gupta</div>
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
    <div className="relative w-full h-44 overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full">
            {slide}
          </div>
        ))}
      </div>
      <button
        onClick={handlePrevSlide}
        className="absolute bottom-0 left-2 transform -translate-y-1/2 text-white"
      >
        <FaChevronLeft size={18} />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute bottom-0 right-2 transform -translate-y-1/2 text-white"
      >
        <FaChevronRight size={18} />
      </button>
    </div>
  );
};

export default Review;
