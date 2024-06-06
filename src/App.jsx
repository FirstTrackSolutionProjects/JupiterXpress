import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import StarsCanvas from './Components/Canvas/Stars'

const App = () => {
  return (
    <>
      <div className='fixed inset-0 bg-black z-0 text-white'>
        <StarsCanvas/>
        <Index />
      </div>
      <Routes>
        <Route path='/elele' element={null} />
      </Routes>
    </>
  )
}

export default App
