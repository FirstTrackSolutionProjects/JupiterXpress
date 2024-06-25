import { useState, useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom"
import DashboardMain from "../Components/DashboardMain"
import Header from "../Components/Header"
import MenuItem from "../Components/MenuItem"
import { menuItems } from "../Constants"
import { jwtDecode } from "jwt-decode"
import CreateOrder from "../Components/CreateOrder"
import Warehouse from "../Components/Warehouse"
import { AuthContext } from "../context/AuthContext"
import UpdateOrder from "../Components/UpdateOrder"
import NDR from "../Components/NDR"
import History from "../Components/History"
import Profile from "../Components/Profile"
import Recharge from "../Components/Wallet/Recharge"
import ChangePassword from "../Components/ChangePassword"
const Dashboard = () => {
  const {logout} = useContext(AuthContext)
  const [menuID, setMenuID] = useState([0])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showRecharge, setShowRecharge] = useState(false)
  const navigate = useNavigate()
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
  return (
     <>
        <>
            <Header/>
            <div className="absolute inset-0 flex  pt-16">
              <div className="min-w-[250px]  md:block hidden  h-full relative bg-blue-100 overflow-y-auto overflow-x-hidden">
                {menuItems.map((item,index) =>{
                  if (item.admin && !isAdmin)
                    return;
                  return (
                  <MenuItem key={index} setShowRecharge={setShowRecharge} icon={item.icon} menuID={item.menuID} setMenuID={setMenuID} name={item.name} isDropdown={item.isDropdown} dropDownOptions={item.dropDownOptions} />
                  )})}
              </div>
              {showRecharge && <Recharge setShowRecharge={setShowRecharge}/>}
              <div className="relative w-full bg-gray-100 overflow-y-auto overflow-x-hidden">
                {menuID[0] == 0 && <DashboardMain/>}
                {(menuID[0] == 1) && <CreateOrder/>}
                {(menuID[0] == 2) && <Warehouse/>}
                {(menuID[0] == 3) && <UpdateOrder/>}
                {(menuID[0] == 4) && <History/>}
                {(menuID[0] == 5) && <NDR/>}
                {(menuID[0] == 6 && menuID[1] == 0) && <Profile/>}
                {(menuID[0] == 6 && menuID[1] == 1) && <ChangePassword/>}
                {(menuID[0] == 7) && (loggingOut())}
                           
              </div>
            </div>
        </>
    </>
  )
}

export default Dashboard
