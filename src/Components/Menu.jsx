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
      <button onClick={toggleMenu} className={`fixed block md:hidden z-50 top-3 right-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md`}>
        {isMenu ? 'X' : '☰'}
      </button>
      <div className="flex flex-col justify-center p-4 space-y-6 bg-white text-black h-screen items-center">
        <img src="logo.webp" alt="" className='w-48' />
        {navItems.map((item, index) =>(
          <div onClick={item.isDropdown?()=>{}:()=>toggleMenu()} className='w-full text-3xl text-medium text-center'>
            <NavItem key={index} name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} toggleMenu={toggleMenu}  />
          </div>
        ))}

      </div>
    </div>
     
    </>
  );
};

export default Menu;
