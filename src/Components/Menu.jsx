import  { useState} from 'react';
import { navItems } from '../Constants';
import NavItem from './NavItem';


const Menu = ( ) => {
  const [isMenu,setIsMenu] = useState(false)

  const toggleMenu = () => {
  setIsMenu(!isMenu);
}
  return (
    <>
      
      <div className={`fixed block md:hidden top-0 right-0 ${isMenu?"md:w-96 w-full":"w-0"} h-full transition-all duration-300 ease-in-out z-50 overflow-hidden`}>
      <button onClick={toggleMenu} className={`fixed block md:hidden z-50 top-3 right-4 px-4 py-2 bg-blue-600 text-black font-bold rounded-md`}>
        {isMenu ? 'X' : '☰'}
      </button>
      <div className="flex flex-col justify-center p-4 bg-[rgba(0,0,0,0.7)] h-screen text-white items-center">
      
        {navItems.map((item, index) =>(
          <div onClick={()=>toggleMenu()} className='w-full p-3 text-3xl text-medium text-center'>
            <NavItem key={index} name={item.name} url={item.url}  />
          </div>
        ))}

      </div>
    </div>
     
    </>
  );
};

export default Menu;
