import React, { useEffect, useRef } from 'react';
import 'tailwindcss/tailwind.css';

const logos = [
    'logo.webp', 'ContactBg.jpg'
];

const LogoSlider = () => {
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        let intervalId;

        const startSlider = () => {
            intervalId = setInterval(() => {
                slider.scrollLeft += slider.clientWidth / 7;
                if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                    slider.scrollLeft = 0;
                }
            }, 2000);
        };

        startSlider();

        return () => clearInterval(intervalId);
    }, []);

    const logoElements = [];
    for (let i = 0; i < 14; i++) {
        logoElements.push(
            <div key={i} className="flex-shrink-0 w-1/7 px-2">
                <img src={logos[i % logos.length]} alt={`Logo ${i + 1}`} className="h-16 mx-auto"/>
            </div>
        );
    }

    return (
        <div className="overflow-hidden relative">
            <div 
                ref={sliderRef}
                className="flex items-center transition-all ease-linear duration-2000"
                style={{ width: '200%' }}
            >
                {logoElements}
            </div>
        </div>
    );
}

export default LogoSlider;
