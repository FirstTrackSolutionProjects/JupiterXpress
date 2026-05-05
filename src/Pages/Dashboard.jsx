import { useState, useEffect, useContext, createElement} from "react"
import { useNavigate, Routes, Route, useLocation, Link } from "react-router-dom"
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
      const routes = [];
      if (item.component) {
        routes.push(
          <Route
            key={item.url || `route-${index}`}
            path={item.url}
            element={createElement(item.component)}
          />
        );
      }
      if (item.dropDownOptions && item.dropDownOptions.length > 0) {
        routes.push(...generateRoutes(item.dropDownOptions, isAdmin));
      }
      return routes;
    });
  };
  

  return (
     <>
        <>
            <div className="absolute inset-0 flex pt-16">
              <div className="min-w-[250px] md:block hidden h-full relative bg-slate-900 text-white overflow-y-auto overflow-x-hidden border-r border-slate-800 shadow-xl">
                <div className="flex justify-center items-center py-6 border-b border-slate-800/50 mb-2 bg-slate-950/30">
                  <Link to="/" className="flex items-center">
                    <img src="/logo.webp" alt="" className="h-10" />
                    <div className="flex flex-col justify-evenly leading-4 -ml-6">
                      <div className="font-bold text-blue-100">JUPITER</div>
                      <div className="font-bold text-blue-500">XPRESS</div>
                    </div>
                  </Link>
                </div>
                {menuItems.map((item,index) =>{
                  if ((item.admin && !isAdmin) || (item.merchantOnly && isAdmin))
                    return;
                  return (
                  <MenuItem key={index} setShowRecharge={setShowRecharge} icon={item.icon} name={item.name} url={item.url} isDropdown={item.isDropdown} dropDownOptions={item.dropDownOptions} />
                  )})}
              </div>
              <div className={`relative ${isOpen?'w-[280px] min-w-[280px]':'w-0'} block md:hidden h-full bg-slate-900 pt-12 transition-all duration-300 border-r border-slate-800 shadow-2xl`}>
              {isOpen? <XIcon className="absolute h-8 z-[60] top-3 left-3 text-white cursor-pointer" onClick={()=>setIsOpen(false)} /> : <MenuIcon className="absolute h-8 z-50 top-3 left-3 text-slate-900 cursor-pointer" onClick={()=>setIsOpen(true)}  />}
                <div className={`relative w-full block md:hidden h-full bg-slate-900 overflow-y-auto overflow-x-hidden pb-40`}>
                  <div className="flex justify-center items-center py-6 border-b border-slate-800/50 mb-2 bg-slate-950/30">
                    <Link to="/" className="flex items-center">
                      <img src="/logo.webp" alt="" className="h-10" />
                      <div className="flex flex-col justify-evenly leading-4 -ml-6">
                        <div className="font-bold text-blue-100">JUPITER</div>
                        <div className="font-bold text-blue-500">XPRESS</div>
                      </div>
                    </Link>
                  </div>
                {menuItems.map((item,index) =>{
                  if ((item.admin && !isAdmin) || (item.merchantOnly && isAdmin))
                    return;
                  return (
                  <MenuItem key={index} setShowRecharge={setShowRecharge} icon={item.icon} name={item.name} url={item.url} isDropdown={item.isDropdown} dropDownOptions={item.dropDownOptions} />
                  )})}
                </div>
           
              </div>
              {showRecharge ? <Recharge setShowRecharge={setShowRecharge}/> : null}
              <div className="relative w-full bg-gray-100 overflow-y-auto overflow-x-hidden pb-32 md:pb-0">
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
