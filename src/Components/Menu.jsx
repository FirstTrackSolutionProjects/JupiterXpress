import  { useState, useContext, useEffect} from 'react';
import { navItems } from '../Constants';
import NavItem from './NavItem';
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const Menu = ( ) => {
  const [isMenu,setIsMenu] = useState(false)
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
      
      <div className={`fixed block md:hidden top-0 right-0 ${isMenu?"md:w-96 w-full":"w-0"} h-full transition-all duration-300 ease-in-out z-50 overflow-hidden`}>
      <button onClick={toggleMenu} className={`fixed block md:hidden z-50 top-3 right-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md`}>
        {isMenu ? 'X' : '☰'}
      </button>
      <div className="flex flex-col justify-center p-4 space-y-6 bg-white text-black h-screen items-center">
        <img src="logo.webp" alt="" className='w-48' />
        {username && (
          <div className="h-16 flex text-2xl space-x-3 items-center">
            <div className="flex flex-col justify-center space-y-1">
              <p className='w-full max-w-72 whitespace-nowrap overflow-hidden text-ellipsis  font-medium rounded-xl px-2 py-2'
                 onClick={()=>navigate('/dashboard')}
              >
              {username}
            </p>
            </div>
          </div>
        )}
        {navItems.map((item, index) =>(
          <div onClick={item.isDropdown?()=>{}:()=>toggleMenu()} className='w-full text-3xl text-medium text-center'>
            <NavItem key={index} name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} toggleMenu={toggleMenu}  />
          </div>
        ))}
        {username && (
          <div className="h-16 flex text-3xl space-x-3 items-center">
            <div className="flex flex-col justify-center">
            <p
                className=" text-red-400 flex items-center justify-center font-medium rounded-xl px-2"
                onClick={() => {
                  logout();
                  setUsername(null);
                  navigate("/");
                }}
              >
                Logout
              </p>
              
            </div>
          </div>
        )}
      </div>
    </div>
     
    </>
  );
};

export default Menu;
