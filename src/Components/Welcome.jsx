import JupiterCanvas from "./Canvas/Jupiter"
import { Link } from "react-router-dom"
import Login from './Login'
import { useState, useContext, useEffect } from "react"
import Track from "./Track"
import { AuthContext } from "../context/AuthContext"
import image1 from '../assets/images/bluedart.jpeg';
import image2 from '../assets/images/Shadow.png';
import image3 from '../assets/images/Ecom.png';
import image4 from '../assets/images/delhivery.png';     
import image5 from '../assets/images/dhl.jpeg';
import image6 from '../assets/images/gati.png';
import image7 from '../assets/images/razor.png';
import image8 from '../assets/images/xpress.jpeg';
import image9 from '../assets/images/aust.jpeg'
import image10 from '../assets/images/canada.png'
import image11 from '../assets/images/zoho.jpeg'

const images = [image1, image2, image3, image4, image5, image6, image7, image8,image11,image9,image10];

  

const Welcome = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = Math.ceil(images.length / 4);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1 + slides) % slides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides) % slides);
  };

  


  const {login , logout} = useContext(AuthContext)
  const [authMode, setAuthMode] = useState(0)
  const [track, setTrack] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('token')){
      setLoggedIn(true)
    }
    else{
      setLoggedIn(false)
    }
  },[login, logout])
  return (
    <div className='absolute inset-0 flex md:flex-row flex-col-reverse items-center justify-center text-white'>
      <Login authMode={authMode} setAuthMode={setAuthMode} />
      <Track track={track} setTrack={setTrack} />
          <div className={` transition-all duration-500  -mt-10 md:-mt-0 md:h-auto w-full overflow-hidden ${authMode?"sm:w-0 h-0 delay-0  ":"sm:w-96 h-96 delay-1000"}   flex flex-col justify-center items-center`}>
            <div className='relative flex flex-col justify-center items-center py-6'>
            <div className="lg:text-[12px] text-[9px] ">JUPITER <i className="text-blue-400 m-1">XPRESS</i>Delivering <i className="text-blue-400 m-1">DOMESTIC</i> AND </div>
          <div className="lg:text-[12px] text-[9px] mb-6"> <i className="text-blue-400 mr-1"> INTERNATIONAL  </i>   Shipment from Your Doorstep to the World!!</div>
              <div className=' text-left lg:text-7xl  text-5xl  font-bold italic'>JUPITER</div>
              <div className='flex items-center my-3'>
              <img src="logo.webp" alt="" className='lg:w-[200px] lg:h-[60px]  w-[150px] h-[45px]' />
              <div className='lg:text-[75px] text-5xl font-bold -ml-8 -mt-2 text-blue-400 italic'>PRESS</div>
            </div>
            <div className="lg:text-xl text-center">SEAMLESS SHIPPING • UNIVERSAL REACH</div>
            <div className="lg:text-[12px] text-[9px]">We Committed to delivery - Make easy Efficient and quality delivery.</div>
            {
              (!(loggedIn))?(<div className="flex justify-evenly w-full mt-6">
                <div onClick={()=>{setAuthMode(1); }} className="py-2 px-4 rounded-xl bg-blue-500 hover:text-blue-500 hover:bg-white" >Get Started</div>
                <div onClick={()=>{ setAuthMode(2);}} className="py-2 px-4 border rounded-xl border-blue-500 text-blue-500 hover:text-black hover:border-none hover:bg-blue-500" >Login Now</div>
              </div>):null
            }
            </div>

            {/*<div className='flex items-center my-3 mt-14'>
              <div className='lg:text-[12.5px] text-[9px] font-bold -ml-8 mt-2 text-blue-400 italic'>Our Trusted Partners </div>
                <img src={img1} alt="" className='lg:w-[42px] lg:h-[32px]  w-[42px] h-[32px] ml-2 mx-1' />
                <img src={img2} alt="" className='lg:w-[42px] lg:h-[32px]  w-[42px] h-[32px] mx-1' />
                <img src={img3} alt="" className='lg:w-[42px] lg:h-[32px]  w-[42px] h-[32px] mx-1' />
                <img src={img4} alt="" className='lg:w-[42px] lg:h-[32px]  w-[42px] h-[32px] mx-1' />
                </div>*/}
{/*Slider added*/}
              <div className=' mt-5 w-[340px] sm:w-[360px]  space-y-2'>
              <div className='lg:text-base text-sm font-bold  mt-1 px-9  text-blue-400 italic'>OUR TRUSTED PARTNERS </div>
              {/*<div className='lg:text-[12.5px] text-[9px] font-bold  mt-2'>Domestic </div>*/}
              <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {Array.from({ length: slides }).map((_, slideIndex) => (
          <div key={slideIndex} className="flex-shrink-0 w-full flex justify-center  items-center">
            {images.slice(slideIndex * 4, slideIndex * 4 + 4).map((image, index) => (
              <div key={index} className="flex-shrink-0 w-1/5 flex justify-center ">
                <img src={image} alt={`Slide ${slideIndex * 4 + index}`} className="w-full px-1 h-[40px] sm:h-[45px] shadow-md " />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <button onClick={prevSlide} className="absolute top-0 bottom-0 z-20  left-2  text-white  shadow-md ">
      &#10094;
      </button>
      <button onClick={nextSlide} className="absolute top-0 bottom-0 right-2 z-20   text-white  shadow-md ">
      &#10095;
      </button>
      
    </div>
              
    {/*---

    <div className='lg:text-[12.5px] text-[9px] font-bold  mt-2'>International </div>
    <div className='flex items-center mt-2 ml-10'>
    <img src={image9} alt="" className='lg:w-[60px] lg:h-[50px]  w-[55px] h-[45px] ml-2 mx-1' />
    <img src={image10} alt="" className='lg:w-[60px] lg:h-[50px]  w-[55px] h-[45px] mx-1' />
    </div> */}
              {/*<div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {Array.from({ length: slides }).map((_, slideIndex) => (
          <div key={slideIndex} className="flex-shrink-0 w-full flex px-6 py-2">
            {images.slice(slideIndex * 4, slideIndex * 4 + 4).map((image, index) => (
              <div key={index} className="flex-shrink-0 w-1/5 ">
                <img src={image} alt={`Slide ${slideIndex * 4 + index}`} className="ml-5 lg:w-[55px] lg:h-[45px] shadow-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full shadow-md ">
      &#10094;
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-14 transform -translate-y-1/2  text-white p-2 rounded-full shadow-md ">
      &#10095;
      </button>
    </div> */}
      
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
