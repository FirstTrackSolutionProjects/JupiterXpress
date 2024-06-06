import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import StarsCanvas from './Components/Canvas/Stars'
import Menu from './Components/Menu'

const App = () => {
  return (
    <>
      <div className='fixed inset-0 bg-black z-0 text-white'>
        <StarsCanvas/>
        {/* <Menu /> */}
        <Routes>
        <Route index element={<Index />} />
        
      </Routes>
      </div>
      
    </>
  )
}

export default App
