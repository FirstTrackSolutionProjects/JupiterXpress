import JupiterCanvas from "./Canvas/Jupiter"
import { Link } from "react-router-dom"
import Login from './Login'
import { useState } from "react"
const Welcome = () => {
  const [authMode, setAuthMode] = useState(0)
  return (
    <div className='absolute inset-0 flex md:flex-row flex-col-reverse items-center justify-center'>
      <Login authMode={authMode} setAuthMode={setAuthMode} />
          <div className={` transition-all -mt-10 md:-mt-0 md:h-auto w-full ${authMode?"sm:w-0 h-0  overflow-hidden":"sm:w-96 h-96"} duration-500   flex flex-col justify-center items-center`}>
            <div className='relative flex flex-col justify-center items-center py-6'>
              <div className=' text-left lg:text-7xl  text-5xl  font-bold italic'>JUPITER</div>
              <div className='flex items-center my-3'>
              <img src="logo.png" alt="" className='lg:w-[200px] lg:h-[60px]  w-[150px] h-[45px]' />
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
          <div className={`sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[600px] lg:h-[600px] w-[350px] h-[350px] relative sm:py-8 transition-all md:-m-10  duration-1000`}>
            <JupiterCanvas authMode={authMode} />
          </div>
      </div>
  )
}

export default Welcome
