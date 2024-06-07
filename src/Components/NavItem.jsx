
import { Link } from "react-router-dom"
const NavItem = ({name,url}) => {
  return (
    <Link to={url} className="group relative cursor-pointer font-medium transition-all duration-300 hover:font-bold">
      {name}
      <div className=" underline z-0 border-blue-500 absolute bottom-0 left-0 h-0.5 bg-blue-500 underline-width-0 underline-transition group-hover:underline-width-full"></div>
    </Link>
  )
}

export default NavItem
