import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const GreetingMessage = () => {
  const [displayName, setDisplayName] = useState('User');
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [theme, setTheme] = useState({
    bg: 'bg-white',
    border: 'border-gray-100',
    accent: 'bg-blue-600',
    nameText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    timeIcon: 'text-blue-500'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDisplayName(decoded.business_name || decoded.name || 'Partner');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const todayDate = now.toLocaleDateString('en-US', dateOptions);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const currentTime = now.toLocaleTimeString('en-US', timeOptions);

    setCurrentDateTime(`${todayDate} | ${currentTime}`);

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setGreetingIcon('🌅');
      setTheme({ bg: 'bg-sky-50', border: 'border-sky-100', accent: 'bg-sky-400', nameText: 'text-sky-700', iconBg: 'bg-white', timeIcon: 'text-sky-400' });
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good Afternoon');
      setGreetingIcon('☀️');
      setTheme({ bg: 'bg-blue-50', border: 'border-blue-100', accent: 'bg-blue-600', nameText: 'text-blue-700', iconBg: 'bg-white', timeIcon: 'text-blue-500' });
    } else if (hour >= 18 && hour < 24) {
      setGreeting('Good Evening');
      setGreetingIcon('🌆');
      setTheme({ bg: 'bg-indigo-50/50', border: 'border-indigo-100', accent: 'bg-indigo-600', nameText: 'text-indigo-800', iconBg: 'bg-white', timeIcon: 'text-indigo-500' });
    } else {
      setGreeting('Enjoy Your Night');
      setGreetingIcon('🌙');
      setTheme({ bg: 'bg-slate-50', border: 'border-slate-200', accent: 'bg-slate-800', nameText: 'text-slate-800', iconBg: 'bg-white', timeIcon: 'text-slate-600' });
    }
  };

  useEffect(() => {
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full max-w-[1220px] mx-auto px-4 py-4 md:py-8">
      <div className={`relative overflow-hidden ${theme.bg} rounded-2xl md:rounded-3xl shadow-sm border ${theme.border} p-5 md:p-8 transition-all duration-500`}>
        {/* Decorative Accent Bar */}
        <div className={`absolute top-0 left-0 w-1.5 md:w-2.5 h-full ${theme.accent}`}></div>

        <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
            {/* Icon Box */}
            <div className={`flex-none flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl ${theme.iconBg} text-3xl md:text-5xl shadow-sm`}>
              {greetingIcon}
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {greeting}, <br className="md:hidden" /> 
                <span className={`${theme.nameText}`}>{displayName}</span>!
              </h1>
              
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm md:text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 md:h-5 md:w-5 ${theme.timeIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentDateTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingMessage;