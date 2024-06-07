import React from 'react'
import Welcome from '../Components/Welcome'
import Header from '../Components/HeroHeader'
import StarsCanvas from '../Components/Canvas/Stars'
const Index = () => {
  return (
    <>
      <Header />
      <div className='fixed inset-0 bg-black z-0 text-white'>
      <StarsCanvas/>
      <Welcome />
      </div>
    </>
  )
}

export default Index
