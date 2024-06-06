import JupiterCanvas from "./Canvas/Jupiter"
import { Link } from "react-router-dom"
import Login from './Login'
import { useState } from "react"
const Welcome = () => {
  const [authMode, setAuthMode] = useState(0)
  return (
    <div className='absolute inset-0 flex md:flex-row flex-col-reverse items-center justify-center'>
      <Login authMode={authMode} />
          <div className={` transition-all -mt-10 md:-mt-0 md:h-auto ${authMode?"sm:w-0 h-0  overflow-hidden":"sm:w-1/2 h-96"} duration-500  w-full flex flex-col justify-center items-center`}>
            <div className='relative flex flex-col justify-center items-center py-6'>
              <div className=' text-left md:text-7xl text-5xl  font-bold italic'>JUPITER</div>
              <div className='flex items-center my-1 sm:my-3'>
              <img src="logo.png" alt="" className='md:w-[200px] md:h-[60px] w-[150px] h-[45px]' />
              <div className='md:text-[75px] text-5xl font-bold -ml-8 -mt-2 text-blue-400 italic'>PRESS</div>
            </div>
            <div className="md:text-xl text-center">SEAMLESS SHIPPING • UNIVERSAL REACH</div>
            <div className="md:text-[12px] text-[9px]">We Committed to delivery - Make easy Efficient and quality delivery.</div>
            <div className="flex justify-evenly w-full mt-6">
              <Link onClick={()=>{setAuthMode(1); }} className="py-2 px-4 rounded-xl bg-blue-500 hover:text-blue-500 hover:bg-white" to={'/register'}>Get Started</Link>
              <Link onClick={()=>{ setAuthMode(2);}} className="py-2 px-4 border rounded-xl border-blue-500 text-blue-500 hover:text-black hover:border-none hover:bg-blue-500" to={'/login'}>Login Now</Link>
            </div>
            </div>
          </div>
          <div className={`sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] w-[350px] h-[350px] relative sm:py-8 transition-all  duration-1000`}>
            <JupiterCanvas authMode={authMode} />
          </div>
      </div>
  )
}

export default Welcome
