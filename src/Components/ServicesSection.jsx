import React, { useEffect, useState } from 'react';
import { FaPlane, FaGlobe, FaTruck } from 'react-icons/fa';

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('services-section');
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id="services-section"
      className={`py-5 md:py-12 bg-gray-200 font-inter transition-opacity duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="flex flex-col md:flex-row justify-center items-center p-5 md:p-3 gap-3 md:gap-6">
        {/* International Shipping Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300">
          {/*<FaGlobe className="text-5xl mx-auto text-blue-500 mb-4" /> */}
          <img
            src="images/inter.jpeg"
            alt="International Shipping"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-center">International Shipping</h3>
          <p className="text-gray-600 text-center mt-2">
            We provide global shipping solutions, ensuring your cargo reaches any destination safely and on time.
          </p>
        </div>

        {/* Domestic Shipping Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300">
          {/*<FaTruck className="text-5xl mx-auto text-green-500 mb-4" /> */}
          <img
            src="images/domestic.webp"
            alt="Domestic Shipping"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-center">Domestic Shipping</h3>
          <p className="text-gray-600 text-center mt-2">
            Our domestic services ensure timely deliveries across the country, with a focus on efficiency and reliability.
          </p>
        </div>

        {/* By Air Shipping Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300">
          {/*<FaPlane className="text-5xl mx-auto text-red-500 mb-4" /> */}
          <img
            src="images/air.jpg"
            alt="By Air Shipping"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-center">By Air</h3>
          <p className="text-gray-600 text-center mt-2">
            With our air freight services, we guarantee fast and secure delivery of goods over long distances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
