import JupiterCanvas from "./Canvas/Jupiter"
import { Link } from "react-router-dom"
import Login from './Login'
import { useState } from "react"
import Track from "./Track"
const Welcome = () => {
  const [authMode, setAuthMode] = useState(0)
  const [track, setTrack] = useState(0)
  return (
    <div className='absolute inset-0 flex md:flex-row flex-col-reverse items-center justify-center'>
      <Login authMode={authMode} setAuthMode={setAuthMode} />
      <Track track={track} setTrack={setTrack} />
          <div className={` transition-all duration-500  -mt-10 md:-mt-0 md:h-auto w-full overflow-hidden ${authMode?"sm:w-0 h-0 delay-0  ":"sm:w-96 h-96 delay-1000"}   flex flex-col justify-center items-center`}>
            <div className='relative flex flex-col justify-center items-center py-6'>
              <div className=' text-left lg:text-7xl  text-5xl  font-bold italic'>JUPITER</div>
              <div className='flex items-center my-3'>
              <img src="logo.webp" alt="" className='lg:w-[200px] lg:h-[60px]  w-[150px] h-[45px]' />
              <div className='lg:text-[75px] text-5xl font-bold -ml-8 -mt-2 text-blue-400 italic'>PRESS</div>
            </div>
            <div className="lg:text-xl text-center">SEAMLESS SHIPPING • UNIVERSAL REACH</div>
            <div className="lg:text-[12px] text-[9px]">We Committed to delivery - Make easy Efficient and quality delivery.</div>
            <div className="flex justify-evenly w-full mt-6">
              <div onClick={()=>{setAuthMode(1); }} className="py-2 px-4 rounded-xl bg-blue-500 hover:text-blue-500 hover:bg-white" >Get Started</div>
              <div onClick={()=>{ setAuthMode(2);}} className="py-2 px-4 border rounded-xl border-blue-500 text-blue-500 hover:text-black hover:border-none hover:bg-blue-500" >Login Now</div>
            </div>
            </div>
            
          </div>
          <div className={`sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[600px] lg:h-[600px] w-[350px] h-[350px] relative sm:py-8 transition-all md:-m-10  duration-1000 flex items-center justify-center`}>
            <JupiterCanvas authMode={authMode} />
            <button onClick={()=>setTrack(1)} className="absolute border rounded-xl border-blue-500 text-blue-500 py-2 px-4 font-medium bg-[rgba(0,0,0,0.7)] font hover:bg-blue-600 hover:border-none hover:py-3 hover:px-6 hover:text-white transition-all duration-300 ">Track Parcel</button>
          </div>
      </div>
  )
}

export default Welcome
