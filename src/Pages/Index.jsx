import React, { useState } from 'react'
import Header from '../Components/HeroHeader'
import ChooseUs from '../Components/ChooseUs'
import LandingInfo from '../Components/LandingInfo'
import ReachCount from '../Components/ReachCount'
import CalcComp from '../Components/CalcComp'
import Industry from '../Components/Industry'
import TrustedPartners from '../Components/TrustedPartners'
import WelcomeSpaceTheme from '../Components/WelcomeSpaceTheme'
import NonSpaceTheme from '../Components/NonSpaceTheme'
const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [spaceTheme, setSpaceTheme] = useState(true)
  return (
    <>
      <Header setLoggedIn={setLoggedIn} spaceTheme={spaceTheme} setSpaceTheme={setSpaceTheme} />
      {
        spaceTheme? <WelcomeSpaceTheme loggedIn={loggedIn} setLoggedIn={setLoggedIn}  /> : <div className={{
          backgroundColor: spaceTheme ? null : 'bg-indigo-200'}}> <NonSpaceTheme loggedIn={loggedIn} setLoggedIn={setLoggedIn} /></div>
      }
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
