import React, { useEffect, useRef } from 'react';
import './trustedpartner.css';

const TrustedPartners = () => {
  const images = [
    'images/partners/bluedart.jpeg',
    'images/partners/delhivery.png',
    'images/partners/dhl.jpeg',
    'images/partners/xpress.jpeg',
    'images/partners/zoho.jpeg',
    'images/partners/Ecom.png',
    'images/partners/gati.png',
    'images/partners/razor.png',
    'images/partners/Shadow.png',
    'images/partners/aust.jpeg',
    'images/partners/canada.png',
  ];
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let intervalId;

    const startAnimation = () => {
      slider.style.animation = 'scroll 10s linear infinite';
    };

    const resetAnimation = () => {
      slider.style.animation = 'none';
      setTimeout(() => {
        slider.style.animation = 'scroll 10s linear infinite';
      }, 50);
    };

    slider.addEventListener('animationiteration', resetAnimation);
    startAnimation();

    return () => {
      clearInterval(intervalId);
      slider.removeEventListener('animationiteration', resetAnimation);
    };
  }, []);

  return (
    
    <div className="overflow-hidden whitespace-nowrap py-3">
    <div ref={sliderRef} className="flex">
      {images.map((src, index) => (
        <img key={index} src={src} alt={`Image ${index + 1}`} className="w-32 h-20 md:w-52 md:h-32 md:mx-8 mx-2 justify-center bg-white rounded-md object-contain p-1" />
      ))}
      {images.map((src, index) => (
        <img key={index + images.length} src={src} alt={`Image ${index + 1}`} className="w-32 h-20 md:w-52 mx-2 justify-center md:h-32 md:mx-8 bg-white rounded-md object-contain p-1" />
      ))}
    </div>
  </div>
  );
};

export default TrustedPartners;
