import { useState, useEffect, useContext, createElement} from "react"
import { useNavigate, Routes, Route, useLocation } from "react-router-dom"
import MenuItem from "../Components/MenuItem"
import { menuItems } from "../Constants"
import { jwtDecode } from "jwt-decode"
import { AuthContext } from "../context/AuthContext"
import Recharge from "../Components/Wallet/Recharge"
import { XIcon, MenuIcon } from "@heroicons/react/outline"

const Dashboard = () => {
  const {logout} = useContext(AuthContext)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showRecharge, setShowRecharge] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.admin)
      if (decoded.exp * 1000 < Date.now()){
        logout();
        return false;
      } // Check if token is expired
      if (!(decoded.verified)){
        navigate('/verify')
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    
    if (!isAuthenticated()) {
      navigate('/')
    }
  }, [])
  const loggingOut = () => {
    logout();
    navigate('/');
  }

  useEffect(() => {
    if (location.pathname === '/dashboard/logout') loggingOut()
  },[navigate])

  const generateRoutes = (items, isAdmin) => {
    return items.flatMap((item, index) => {
      if ((item.admin && !isAdmin) || (item.merchantOnly && isAdmin)) {
        return [];
      }
      const routes = [
        <Route
          key={item.url || `route-${index}`}
          path={item.url}
          element={item.component ? createElement(item.component) : null}
        />
      ];
      if (item.dropDownOptions && item.dropDownOptions.length > 0) {
        routes.push(...generateRoutes(item.dropDownOptions, isAdmin));
      }
      return routes;
    });
  };
  

  return (
     <>
        <>
            <div className="absolute inset-0 flex  pt-16">
              <div className="min-w-[250px]  md:block hidden  h-full relative bg-blue-100 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item,index) =>{
                  if ((item.admin && !isAdmin) || (item.merchantOnly && isAdmin))
                    return;
                  return (
                  <MenuItem key={index} setShowRecharge={setShowRecharge} icon={item.icon} name={item.name} url={item.url} isDropdown={item.isDropdown} dropDownOptions={item.dropDownOptions} />
                  )})}
              </div>
              <div className={`relative  ${isOpen?'w-[300px] min-w-[300px]':'w-0'} block md:hidden  h-full  bg-white  pt-12`}>
              {isOpen? <XIcon className="absolute h-8 z-[1] top-3 left-3" onClick={()=>setIsOpen(false)} /> : <MenuIcon className="absolute h-8 z-50 top-3 left-3" onClick={()=>setIsOpen(true)}  />}
                <div className={`relative w-full block md:hidden  h-full  bg-white overflow-y-auto overflow-x-hidden`}>
                {menuItems.map((item,index) =>{
                  if ((item.admin && !isAdmin) || (item.merchantOnly && isAdmin))
                    return;
                  return (
                  <MenuItem key={index} setShowRecharge={setShowRecharge} icon={item.icon} name={item.name} isDropdown={item.isDropdown} dropDownOptions={item.dropDownOptions} />
                  )})}
                </div>
           
              </div>
              {showRecharge ? <Recharge setShowRecharge={setShowRecharge}/> : null}
              <div className="relative w-full bg-gray-100 overflow-y-auto overflow-x-hidden">
                <Routes>
                  {generateRoutes(menuItems, isAdmin)}
                </Routes>
              </div>
            </div>
        </>
    </>
  )
}

export default Dashboard
