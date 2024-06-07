import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import Menu from './Components/Menu'
import Contact from './Pages/Contact'
import About from './Pages/About'
const App = () => {
  return (
    <>
      
        <Menu />
        
        <Routes>
        <Route index element={<Index />} />
        <Route path='/contact-send' element={<Contact/>} />
        <Route path='/about-us' element={<About/>} />
      </Routes>
      
      
    </>
  )
}

export default App
