import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import Menu from './Components/Menu'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Dashboard from './Pages/Dashboard'
import Blogs from './Pages/Blogs'
import Privacy from './Pages/Privacy'
import TnC from './Pages/TnC'
import FAQ from './Pages/FAQ'
import Price from './Pages/Price'
import Verify from './Pages/Verify'
const App = () => {
  return (
    <>
      
        <Menu />
        
        <Routes>
        <Route index element={<Index />} />
        <Route path='/contact-send' element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/get-blogs' element={<Blogs/>} />
        <Route path='/privacy' element={<Privacy/>} />
        <Route path='/tnc' element={<TnC/>} />
        <Route path='/faq' element={<FAQ/>} />
        <Route path='/pricing' element={<Price />} />
        <Route path='/verify' element={<Verify/>} />
      </Routes>
      
      
    </>
  )
}

export default App
