import React from 'react'
import ContactForm from '../Components/ContactForm'
import Header from '../Components/Header'
import ContactDetails from '../Components/ContactDetails'
import Footer from '../Components/Footer'
const Contact = () => {
  return (
    <>
    
    <div className='lg:h-screen  bg-center  bg-no-repeat bg-fixed bg-[url("bg/contactbg.jpg")] bg-cover flex flex-col justify-center items-center overflow-auto'>
    <Header />
        
      <div className='flex flex-col items-center justify-center space-y-4 py-24'>
      <div className="text-2xl text-center font-medium ">CONTACT US</div>
        <div className='flex flex-col lg:flex-row justify-center items-center md:space-x-4 space-x-0 w-full'>
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
