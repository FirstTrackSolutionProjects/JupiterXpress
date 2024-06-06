import NavItem from "./NavItem"
import { navItems } from "../Constants"
const Header = () => {
  return (
    <div className=" absolute z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ">
      <div className="w-full relative z-3 lg:w-4/5 flex justify-evenly items-center h-16">
        {
          navItems.map((item,index) =>(
            <NavItem key = {index} name={item.name} url={item.url} />
          ))
        }
      </div>
    </div>
  )
}

export default Header
