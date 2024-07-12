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
import AdminProfile from "../Components/AdminProfile"
import NDR from "../Components/NDR"
import Profile from "../Components/Profile"
import Recharge from "../Components/Wallet/Recharge"
import ChangePassword from "../Components/ChangePassword"
import MerchantManage from "../Components/MerchantManage"
import ManualRecharge from "../Components/ManualRecharge"
import VerificationRequests from "../Components/VerificationRequests"
import TransactionHistory from "../Components/TransactionHistory"
import ContactSubmissions from "../Components/ContactSubmissions"
import CreateOrderInternational from "../Components/CreateOrderInternational"
import NonVerifiedMerchantManage from "../Components/NonVerifiedMerchantManage"
import AllTransactions from "../Components/AllTransactions"
import AllParcels from "../Components/AllParcels"
import AllShipmentReports from "../Components/AllShipmentReports"
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
              {showRecharge ? <Recharge setShowRecharge={setShowRecharge}/> : null}
              <div className="relative w-full bg-gray-100 overflow-y-auto overflow-x-hidden">
                {menuID[0] == 0 ? <DashboardMain/> : null}
                {(menuID[0] == 1 && menuID[1] == 0) ? <CreateOrder/> : null}
                {(menuID[0] == 1 && menuID[1] == 1) ? <CreateOrderInternational/> : null}
                {(menuID[0] == 2) ? <Warehouse/> : null}
                {(menuID[0] == 3) ? <UpdateOrder/> : null}
                {(menuID[0] == 4 ) ? <TransactionHistory/> : null}
                {(menuID[0] == 9 && menuID[1] == 2) ? <AllTransactions/> : null}
                {(menuID[0] == 9 && menuID[1] == 3) ? <AllParcels/> : null}
                {(menuID[0] == 9 && menuID[1] == 4) ? <AllShipmentReports/> : null}
                {(menuID[0] == 5) ? <NDR/> : null}
                {((menuID[0] == 6 && menuID[1] == 0) && isAdmin)  ?  <AdminProfile/> :null }
                {((menuID[0] == 6 && menuID[1] == 0) && !isAdmin)  ?  <Profile/> : null }
                {(menuID[0] == 6 && menuID[1] == 1) ? <ChangePassword/> : null}
                {(menuID[0] == 9 && menuID[1] == 0) ? <MerchantManage/> : null}
                {(menuID[0] == 9 && menuID[1] == 1) ? <NonVerifiedMerchantManage/> : null}
                {(menuID[0] == 11 && menuID[1] == 0) ? <VerificationRequests/> : null}
                {(menuID[0] == 11 && menuID[1] == 1) ? <ContactSubmissions/> : null}
                {(menuID[0] == 12) ? <ManualRecharge/> : null}
                {(menuID[0] == 7) && (loggingOut())}
              </div>
            </div>
        </>
    </>
  )
}

export default Dashboard
