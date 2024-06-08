import React from 'react'
import ContactForm from '../Components/ContactForm'
import Header from '../Components/Header'
import ContactDetails from '../Components/ContactDetails'
import Footer from '../Components/Footer'
const Contact = () => {
  return (
    <>
    <Header />
    <div className='relative lg:h-screen z-0 bg-center  bg-no-repeat bg-fixed bg-[url("bg/contactbg.webp")] bg-cover flex flex-col justify-center items-center overflow-auto'>
    <div className="absolute z-10 h-full w-full bg-[rgba(146,169,228,0.59)]">

    </div>
        
      <div className='relative z-20 flex flex-col items-center justify-center w-full space-y-4 py-24'>
      <div className="text-2xl text-center font-medium ">CONTACT US</div>
        <div className='flex flex-col lg:flex-row px-4 sm:px-0 justify-center items-center md:space-x-4 space-x-0 w-full'>
        <ContactForm />
        <ContactDetails/>
        </div>
      </div>
      
    </div>
    <Footer/>
    </>
  )
}

export default Contact
