import React, { useState } from 'react'
import Welcome from '../Components/Welcome'
import Header from '../Components/HeroHeader'
import StarsCanvas from '../Components/Canvas/Stars'
const Index = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <>
      <Header setLoggedIn={setLoggedIn} />
      <div className='fixed inset-0 bg-black z-0 text-white'>
      <StarsCanvas/>
      <Welcome loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </div>
    </>
  )
}

export default Index
