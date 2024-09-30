import React from 'react'
import ContactForm from '../Components/ContactForm'
import ContactDetails from '../Components/ContactDetails'
const Contact = () => {
  return (
    <>
    <div className='relative lg:h-screen z-0 bg-center  bg-no-repeat bg-fixed bg-[url("/src/assets/contact.avif")] bg-cover flex flex-col justify-center items-center overflow-auto'>
    <div className="absolute z-10 h-full w-full bg-[rgba(0,0,0,0.2)]">
    </div>
      <div className='relative z-20 flex flex-col items-center justify-center w-full space-y-4 my-16 sm:mt-32 mb-16'>
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-semibold  text-white">CONTACT US</div>
        <div className='flex flex-col lg:flex-row px-4 sm:px-0 justify-center items-center md:space-x-4 space-x-0 w-full'>
        <ContactForm />
        <ContactDetails/>
        </div>
      </div>
      
    </div>
    </>
  )
}

export default Contact
