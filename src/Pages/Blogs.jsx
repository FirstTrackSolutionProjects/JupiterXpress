import React from 'react'

const Blog = ({img, title, desc}) => {
  return (
    <>
      <div className=' bg-white w-72 rounded-xl flex flex-col my-3 mx-3'>
      <div className='w-72  bg-white rounded-t-xl overflow-hidden flex items-center'>
          <img src={img} className='object-contain' alt="" />
        </div> 
        <div className=' p-4'>
          <p className='text-xl font-medium'>{title}</p>
          <p>{desc}</p>
        </div>
      </div>
    </>
  )
}

const Blogs = () => {
  return (
    <>
    <div className={`relative space-y-10 min-h-screen p-6 md:p-12 z-0 bg-center  bg-no-repeat bg-fixed bg-[url('/src/assets/blog.jpg')] bg-cover flex flex-col items-center overflow-auto`}>
    <div className="w-full relative z-20 space-y-5 max-w-[1024px] border p-4 mt-12 sm:mt-16 rounded-xl bg-[rgba(67,158,245,0.3)]">
      <p className=' text-white text-2xl font-medium text-center'>YOUR SATISFACTION, OUR STORY</p>
      </div>
      <div className='w-full relative z-20  max-w-[1024px] p-4 mt-12 sm:mt-16 rounded-xl flex flex-wrap justify-evenly'>
        <Blog img={'blogs/1.webp'} title={'Revolutionizing Courier Services: Meet Jupiter Xpress'} desc={`In a world where speed and reliability are paramount, Jupiter Xpress is setting new standards in the courier industry. `} />
        <Blog img={'blogs/2.webp'} title={'Beyond Delivery: The Jupiter Xpress Advantage'} desc={'In today’s fast-paced world, the need for reliable and efficient courier services has never been greater. '} />
        <Blog img={'blogs/3.webp'} title={'Delivering Excellence: Why Jupiter Xpress is Your Ultimate Courier Solution'} desc={'In the ever-evolving world of courier services, Jupiter Xpress stands out as a beacon of innovation, reliability, and customer-centricity. '} />
      </div>
    </div>
    </>
  )
}

export default Blogs
