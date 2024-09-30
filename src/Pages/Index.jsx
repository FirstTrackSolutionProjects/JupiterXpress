import React, { useState } from 'react'
import Welcome from '../Components/Welcome'
import Header from '../Components/HeroHeader'
import StarsCanvas from '../Components/Canvas/Stars'
import ChooseUs from '../Components/ChooseUs'
import LandingInfo from '../Components/LandingInfo'
import ReachCount from '../Components/ReachCount'
import CalcComp from '../Components/CalcComp'
import Industry from '../Components/Industry'
import TrustedPartners from '../Components/TrustedPartners'
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
      <ChooseUs/>
      <LandingInfo/>
      <CalcComp/>
      <Industry/>
      <ReachCount/>
      <div className='bg-gradient-to-r p-5 from-blue-900 via-blue-400 to-slate-300 font-inter'>
        <div className='md:p-2 text-xl md:text-3xl text-white font-bold text-center'>Our Trusted Partners</div>
      <TrustedPartners/>
      </div>
    </>
  )
}

export default Index
