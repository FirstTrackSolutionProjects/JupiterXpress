import React from 'react'
import { useNavigate } from "react-router-dom"
import Login from './Login'
import { useState, useContext, useEffect } from "react"
import Track from "./Track"
import { AuthContext } from "../context/AuthContext"

const WelcomeNonSpace = () => {
  const navigate = useNavigate()
  const { login, logout } = useContext(AuthContext)
  const [authMode, setAuthMode] = useState(0)
  const [track, setTrack] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [login, logout])

  return (
    <div className='relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-black font-inter overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[100px] delay-700 animate-pulse"></div>
      </div>

      <Login authMode={authMode} setAuthMode={setAuthMode} />
      <Track track={track} setTrack={setTrack} />

      <div className="container mx-auto px-6 py-12 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Left Content Section: Messaging & Branding */}
        <div className={`flex-1 transition-all duration-700 transform ${authMode ? "opacity-0 translate-y-10 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"}`}>
          <div className="space-y-8 text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md text-blue-700 text-sm font-bold border border-blue-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              YOUR TRUSTED LOGISTICS PARTNER
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <div className='text-gray-900 text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter italic leading-none'>
                JUPITER
              </div>
              <div className='flex items-center mt-1 -ml-1'>
                <img src="logo.webp" alt="Jupiter Xpress Logo" className='w-[140px] md:w-[220px] lg:w-[260px] h-auto object-contain' />
                <div className='text-blue-600 text-5xl md:text-7xl lg:text-8xl font-black italic -ml-8 md:-ml-12 lg:-ml-14 leading-none'>
                  PRESS
                </div>
              </div>
              <div className="mt-4 text-lg md:text-xl lg:text-2xl font-bold text-gray-700 tracking-widest uppercase">
                Seamless Shipping • Universal Reach
              </div>
            </div>

            <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
              We are committed to delivering <span className="text-blue-600 font-bold italic">DOMESTIC</span> and <span className="text-blue-400 font-bold italic">INTERNATIONAL</span> shipments from your doorstep to the world with unmatched efficiency and quality.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              {!loggedIn ? (
                <>
                  <button 
                    onClick={() => setAuthMode(1)} 
                    className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-gray-900 hover:shadow-gray-300 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => setAuthMode(2)} 
                    className="px-10 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                  >
                    Login Now
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-12 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Dashboard Access
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Action Card (Replacement for animation) */}
        <div className={`flex-1 w-full max-w-lg transition-all duration-700 delay-150 transform ${authMode ? "opacity-0 translate-y-10 scale-95 pointer-events-none" : "opacity-100 translate-y-0 scale-100"}`}>
          <div className="relative group p-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-white border border-gray-100 p-8 md:p-12 rounded-[2rem] shadow-2xl flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Track Parcel</h3>
                <p className="text-gray-500 font-medium">Instantly locate your shipment with real-time updates.</p>
              </div>

              <button 
                onClick={() => setTrack(1)} 
                className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group/btn"
              >
                <span className="text-lg">Track Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <div className="w-full pt-4 border-t border-gray-50 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-600">5000+</div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">Pincodes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-600">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const NonSpaceTheme = ({ loggedIn, setLoggedIn }) => {
  return (
    <div className='bg-slate-50 min-h-screen w-full selection:bg-blue-100 selection:text-blue-900 relative'>
      <WelcomeNonSpace loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </div>
  )
}

export default NonSpaceTheme
