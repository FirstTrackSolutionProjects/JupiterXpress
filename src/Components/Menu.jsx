import  { useState, useContext, useEffect} from 'react';
import { navItems } from '../Constants';
import NavItem from './NavItem';
import { AuthContext } from "../context/AuthContext"
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const Menu = ({spaceTheme, setSpaceTheme} ) => {
  const [isMenu,setIsMenu] = useState(false)
  const location = useLocation();
  const {login , logout} = useContext(AuthContext)
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const toggleMenu = () => {
  setIsMenu(!isMenu);
  }
  useEffect(() => {
    const loginStatus = async () => {
      const token = localStorage.getItem('token');
      if(token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.business_name);
      }
    }
    loginStatus();
  },[login, logout])
  useEffect(() => {
    const loginStatus = async () => {
      const token = localStorage.getItem('token');
      if(token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.business_name);
      }
    }
    loginStatus();
  },[])

  return (
    <>
      {
        location.pathname=='/'?<div className='fixed top-0 left-0 z-[100] flex items-center p-5'>
        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: '35px',
          height: '20px',
          marginRight: '10px',
        }}>
          <input 
            type="checkbox" 
            checked={spaceTheme} 
            onChange={() => {setSpaceTheme((prev)=>{localStorage.setItem('theme', !prev?'space':'non-space'); return !prev }); }} 
            style={{ display: 'none' }} // Hides the default checkbox
          />
          <span style={{
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: spaceTheme ? 'blue' : 'gray',
            borderRadius: '30px',
            cursor: 'pointer',
            transition: '0.4s',
          }}></span>
          <span style={{
            position: 'absolute',
            zIndex : 2,
            content: '""',
            height: '12px',
            width: '12px',
            left: spaceTheme ? '20px' : '2px',
            bottom: '4px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: '0.4s',
          }}></span>
        </label>
      </div> : null
      }
      <div className={`fixed block md:hidden top-0 right-0 ${isMenu?"w-full":"w-0"} h-full transition-all duration-300 ease-in-out z-50 overflow-hidden bg-white shadow-2xl`}>
      
      <button onClick={toggleMenu} className={`fixed block md:hidden z-[60] top-3 right-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md shadow-lg transition-transform active:scale-95`}>
        {isMenu ? '✕' : '☰'}
      </button>
      
      <div className="flex flex-col p-6 pt-20 space-y-8 bg-white text-black h-full w-full overflow-y-auto items-center">
        <img src="/logo.webp" alt="Logo" className='w-40 h-auto' />
        
        {username && (
          <div className="w-full flex flex-col items-center space-y-2 py-4 border-y border-gray-100">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Welcome</span>
            <p className='w-full text-center max-w-[250px] truncate text-xl font-bold text-blue-600 cursor-pointer'
               onClick={()=>{navigate('/dashboard'); toggleMenu();}}
            >
              {username}
            </p>
          </div>
        )}

        <div className="w-full space-y-6 flex flex-col items-center">
          {navItems.map((item, index) =>(
            <div key={index} onClick={item.isDropdown?()=>{}:()=>toggleMenu()} className='w-full text-2xl font-semibold text-center'>
              <NavItem name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} toggleMenu={toggleMenu}  />
            </div>
          ))}
        </div>

        {username && (
          <div className="w-full pt-4 pb-12">
            <button
              className="w-full py-3 px-4 bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold rounded-2xl hover:bg-red-600 hover:text-white transition-colors"
              onClick={() => {
                logout();
                setUsername(null);
                toggleMenu();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
     
    </>
  );
};

export default Menu;
