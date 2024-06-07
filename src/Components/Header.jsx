import NavItem from "./NavItem"
import { navItems } from "../Constants"
import { Link } from "react-router-dom"
const Header = () => {
  return (
    <div className="fixed bg-gradient-to-b from-white to-white z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ">
        
      <nav className="w-full relative z-3 lg:w-4/5 flex justify-evenly text-gray-700 items-center h-16">
      <Link to='/'><img src="logo.webp" alt="" className="h-8" /></Link>
        {
          navItems.map((item,index) =>(
            <NavItem key = {index} name={item.name} url={item.url} />
          ))
        }
      </nav>
    </div>
  )
}

export default Header
