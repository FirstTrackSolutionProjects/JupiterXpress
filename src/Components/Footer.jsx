// import { Link } from 'react-router-dom'
// import React from 'react'

// const Footer = () => {
//   return (
//     <>
//     <div className='w-full  sm:p-4 px-4 py-8 justify-center flex flex-wrap bg-gray-900 text-white'>
//       <div className=' flex my-8 flex-wrap space-y-10 md:space-y-0 justify-center'>
//         <div className=' flex flex-col w-[300px] justify-center '>
//         <div>
//         <div className='relative flex flex-col justify-center items-center sm:items-start'>
//               <div className=' text-left text-4xl text-white  font-bold italic'>JUPITER</div>
//               <div className='flex items-center my-3'>
//                 <img src="/logo.webp" alt="" className='w-[100px] h-[30px]' />
//                 <div className='text-[37px] font-bold -ml-8 -mt-2 text-blue-400 italic'>PRESS</div>
//               </div>
//         </div>
//         <div className='text-center sm:text-left'>
//             Fastest platform with all courier service features. Help you start, run and grow your courier service.
//         </div>
//         </div>
//         </div>
//         <div className='w-[300px] flex flex-col  space-y-3 '>

//             <div>
//             <div className='font-medium text-xl mb-3'>Available Services</div>
//             <div>E-Commerce delivery</div>
//             <div>Pick & Drop</div>
//             <div>Packaging</div>
//             <div>International & Domestic</div>
//             </div>
//         </div>
//       </div>
//       <div className='flex my-8 flex-wrap md:space-y-0 space-y-10 justify-center'>
//         <div className='w-[300px] xl:w-[200px] flex flex-col  '>
//             <div>
//         <div className='font-medium text-xl mb-4'>About</div>
//             <Link to='/faq'><div>FAQ</div></Link>
//             <Link to={'/about-us'}><div>About Us</div></Link>
//             <Link to={'/contact-send'}><div>Contact us</div> </Link>
//             <Link to="/privacy"><div>Privacy And Policy</div></Link>
//             <Link to={'/tnc'}><div>Terms of Use</div></Link>
//             </div>
//         </div>
//         <div className='w-[300px] space-y-3 flex flex-col justify-center '>
//         <div className='font-medium text-xl'>Subscribe Us</div>
//             <div>Get business news , tip and solutions to your problems our experts.</div>
//             <form action="" className='flex flex-col mx-4 space-y-4'>
//                 <input type="email" name='email' placeholder='E-mail address' className='py-2 px-4 rounded-xl' />
//                 <button className='border px-4 py-2 rounded-xl'>Subscribe</button>
//             </form>
//         </div>
//       </div>
//     </div>
//     <div className='bg-black text-white w-full flex flex-col sm:flex-row justify-center items-center text-xs sm:text-md md:text-lg text-center py-3'>
//       Copyright @ 2024, Developed by &nbsp; <p><a href="https://firsttracksolution.tech">First Track Solution Technologies</a></p>
//     </div>
//     </>
//   )
// }

// export default Footer

import { Link } from 'react-router-dom';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      {/* ✅ WhatsApp Floating Button */}
      <a
        href="https://wa.me/919115247188"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={24} />
      </a>

      {/* ✅ Footer Content */}
      <div className='w-full px-4 sm:px-8 py-8 bg-gray-900 text-white'>
        <div className='flex flex-wrap justify-center gap-10'>

          {/* Column 1: Logo & Description */}
          <div className='w-full sm:w-[300px] px-2'>
            <div className='flex flex-col items-center sm:items-start'>
              <div className='text-4xl font-bold italic'>JUPITER</div>
              <div className='flex items-center my-3'>
                <img src="/logo.webp" alt="" className='w-[100px] h-[30px]' />
                <div className='text-[32px] font-bold text-blue-400 italic -ml-6'>PRESS</div>
              </div>
              <p className='text-center sm:text-left'>
                Fastest platform with all courier service features. Help you start, run and grow your courier service.
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className='w-full sm:w-[300px] px-2'>
            <div className='font-medium text-xl mb-3'>Available Services</div>
            <div>E-Commerce delivery</div>
            <div>Pick & Drop</div>
            <div>Packaging</div>
            <div>International & Domestic</div>
          </div>

          {/* Column 3: About Links */}
          <div className='w-full sm:w-[200px] px-2'>
            <div className='font-medium text-xl mb-4'>About</div>
            <Link to='/faq'><div>FAQ</div></Link>
            <Link to='/about-us'><div>About Us</div></Link>
            <Link to='/contact-send'><div>Contact Us</div></Link>
            <Link to='/privacy'><div>Privacy and Policy</div></Link>
            <Link to='/tnc'><div>Terms of Use</div></Link>
          </div>

          {/* Column 4: Subscribe */}
          <div className='w-full sm:w-[300px] px-2'>
            <div className='font-medium text-xl mb-2'>Subscribe Us</div>
            <p className='mb-3'>Get business news, tips, and solutions to your problems from our experts.</p>
            <form className='flex flex-col space-y-3'>
              <input type="email" placeholder="E-mail address" className='py-2 px-4 rounded-xl' />
              <button className='border px-4 py-2 rounded-xl'>Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Copyright */}
      <div className='bg-black text-white w-full text-center text-xs sm:text-sm py-3 relative'>
        {/* <div className='absolute right-4 bottom-3 sm:bottom-2'>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={20} className='text-green-500' />
          </a>
        </div> */}
        <p>
          Copyright © 2024, Developed by <a className='underline' href="https://firsttracksolution.tech" target="_blank" rel="noopener noreferrer">First Track Solution Technologies</a>
        </p>
      </div>
    </>
  );
};

export default Footer;
