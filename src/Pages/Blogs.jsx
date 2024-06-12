import React from 'react'
import Header from '../Components/Header'


const Blog = () => {
  return (
    <>
      <div className=' bg-white w-72 rounded-xl flex flex-col '>
      <div className='w-72  bg-white rounded-l-xl overflow-hidden flex items-center'>
          <img src="tech.jpg" className='object-contain' alt="" />
        </div> 
        <div className=' p-4'>
          <p className='text-xl font-medium'>Launching new features in 2024</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eos obcaecati neque autem ullam, pariatur non inventore aperiam porro quasi officia officiis exercitationem nemo totam.</p>
        </div>
      </div>
    </>
  )
}

const Blogs = () => {
  return (
    <>
    <Header/>
    <div className={`relative space-y-10 min-h-screen p-6 md:p-12 z-0 bg-center  bg-no-repeat bg-fixed bg-[url('/src/assets/blog.jpg')] bg-cover flex flex-col items-center overflow-auto`}>
    <div className="w-full relative z-20 space-y-5 max-w-[1024px] border p-4 mt-12 sm:mt-16 rounded-xl bg-[rgba(67,158,245,0.3)]">
      <p className=' text-white text-2xl font-medium text-center'>YOUR SATISFACTION, OUR STORY</p>
      </div>
      <div className='w-full relative z-20  max-w-[1024px] p-4 mt-12 sm:mt-16 rounded-xl flex justify-between'>
        <Blog />
        <Blog />
        <Blog />
      </div>
    </div>
    </>
  )
}

export default Blogs
