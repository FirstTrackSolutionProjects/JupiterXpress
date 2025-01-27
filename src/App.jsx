import {Route, Routes, useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Index from './Pages/Index'
import Menu from './Components/Menu'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Dashboard from './Pages/Dashboard'
import Blogs from './Pages/Blogs'
import Privacy from './Pages/Privacy'
import TnC from './Pages/TnC'
import FAQ from './Pages/FAQ'
import DomesticPrice from './Pages/DomesticPrice'
import InternationalPrice from './Pages/InternationalPrice'
import Verify from './Pages/Verify'
import Tracking from './Pages/Tracking'
import Header from './Components/Header'
import Footer from './Components/Footer'
import { ToastContainer } from 'react-toastify'
const App = () => {
  const location = useLocation()
  const [spaceTheme, setSpaceTheme] = useState(false)
  useEffect(()=>{
    const theme = localStorage.getItem("theme");
    if (!theme) {
      setSpaceTheme(false);
      localStorage.setItem("theme", "non-space");
    } else {
      setSpaceTheme(theme === "space");
    }
  })
  return (
    <>
        <ToastContainer />
        <Menu spaceTheme={spaceTheme} setSpaceTheme={setSpaceTheme} />
        {location.pathname !== "/"?<Header/>:null}
        <Routes>
        <Route index element={<Index spaceTheme={spaceTheme} setSpaceTheme={setSpaceTheme} />} />
        <Route path='/contact-send' element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
        <Route path='/dashboard/*' element={<Dashboard />} />
        <Route path='/get-blogs' element={<Blogs/>} />
        <Route path='/privacy' element={<Privacy/>} />
        <Route path='/tnc' element={<TnC/>} />
        <Route path='/faq' element={<FAQ/>} />
        <Route path='/domestic' element={<DomesticPrice />} />
        <Route path='/international' element={<InternationalPrice />} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/tracking' element={<Tracking/>} />

        <Route path='*' element={<Index />} />
      </Routes>
      {location.pathname.startsWith('/dashboard')?null:<Footer/>}
      
    </>
  )
}

export default App
