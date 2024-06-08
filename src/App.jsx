import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import Menu from './Components/Menu'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Dashboard from './Pages/Dashboard'
const App = () => {
  return (
    <>
      
        <Menu />
        
        <Routes>
        <Route index element={<Index />} />
        <Route path='/contact-send' element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      
      
    </>
  )
}

export default App
