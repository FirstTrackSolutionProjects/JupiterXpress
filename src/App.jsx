import {Route, Routes} from 'react-router-dom'
import Index from './Pages/Index'
import StarsCanvas from './Components/Canvas/Stars'

const App = () => {
  return (
    <>
      <div className='absolute inset-0 bg-black z-0'>
        <StarsCanvas/>
      </div>
      
    </>
  )
}

export default App
