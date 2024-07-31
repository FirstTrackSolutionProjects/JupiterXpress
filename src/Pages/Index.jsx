import React, { useState } from 'react'
import Welcome from '../Components/Welcome'
import Header from '../Components/HeroHeader'
import StarsCanvas from '../Components/Canvas/Stars'
import Footer from '../Components/Footer'
import FAQ from './FAQ'
const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <>
      <Header setLoggedIn={setLoggedIn} />
      <div className='fixed inset-0 bg-black z-[-1] text-white'>
      <StarsCanvas/>
      </div>
      <div className='min-h-screen w-full'>
      <Welcome loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>
      <Footer />
    </>
  )
}

export default Index
