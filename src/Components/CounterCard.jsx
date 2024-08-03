// CounterCard.js
import React, { useState, useEffect } from 'react';

const CounterCard = ({ targetCount,symbol }) => {
  const [count, setCount] = useState(0);
  const [sign, setSign] = useState(0);


  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted && count < targetCount) {
        setCount(prevCount => Math.min(prevCount + 1, targetCount));
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust the interval time for smoother animation

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [count, targetCount]);

  

  return (
    <div className="">
      <div className=" flex justify-center items-center">
        <div className="text-5xl md:text-5xl font-bold text-blue-400">{count}{symbol}</div>
      </div>
    </div>
  );
};

export default CounterCard;
