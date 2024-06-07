import React from 'react'

const ContactDetails = () => {
  return (
    <>
    <div className='space-y-3 flex flex-col justify-center'>
    <div className='w-96 bg-white p-4 rounded-xl font-medium'>
      <p className='font-bold text-xl'>Address:</p>
      <p>Email : info@jupiterxpress.online</p>
      <p>Address: JUPITER XPRESS At: Ward No :13, Ekta Nagar, Street No.3, Near Railway Station, Malout, Sri Muktsar Sahib, Punjab, 152107</p>
    </div>
    <div className='w-96 bg-white py-6 rounded-xl font-medium'>
      <p className='font-bold text-xl px-6'>Connect With Us:</p>
      <div className="flex sm:w-96 w-full h-16 py-3 justify-evenly m-auto">
        <img src="social/facebook.png" alt="" />
        <img src="social/instagram.png" alt="" />
        <img src="social/linkedin.png" alt="" />
        <img src="social/twitter.png" alt="" />
        <img src="social/whatsapp.png" alt="" />
      </div>
    </div>
    </div>
    </>
  )
}

export default ContactDetails
