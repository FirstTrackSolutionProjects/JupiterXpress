import NavItem from "./NavItem"
import { navItems } from "../Constants"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import Recharge from "./Wallet/Recharge"
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate()
  const {logout} = useContext(AuthContext)
  const [username,setUsername] = useState("")
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const isAuthenticated = () => {
      const token = localStorage.getItem('token');
      if (!token) return false;
      try {
        const decoded = jwtDecode(token);
        // alert(decoded.username)
        setUsername(decoded.name)
        return decoded.exp * 1000 > Date.now(); // Check if token is expired
      } catch (error) {
        return false;
      }
    };
    const fetchBalance = async () => {
      const balance = await fetch(`/.netlify/functions/getBalance?id=${jwtDecode(localStorage.getItem('token')).id}`)
      .then((response)=>response.json())
      .then(result => result.balance);
      if (balance) {
        
        setBalance(balance)
      } else {
        alert('Failed to fetch balance');
      }
    };
    const auth = isAuthenticated()
    if (!auth) setUsername("")
    else {
      fetchBalance();
    }
  }, [])
  return (
    <div className="fixed bg-gradient-to-b from-white to-[rgba(37,169,228,0.89)] z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ">
        
      <nav className="w-full relative z-3 lg:w-4/5 flex justify-evenly text-gray-700 items-center h-16">
      <Link to='/' className="flex items-center">
        <img src="logo.webp" alt="" className="h-8" />
        <div className="flex flex-col justify-evenly leading-4 -ml-6">
          <div className="font-bold text-blue-800">JUPITER</div>
          <div className="font-bold text-blue-600">XPRESS</div>
        </div>
      </Link>
        {
          navItems.map((item,index) =>(
            <NavItem key = {index} name={item.name} url={item.url} />
          ))
        }
       
          {username && <div className="h-16 flex space-x-4"><div><p>{username}</p><p onClick={()=>{logout(); navigate('/')}}>logout</p></div><div><p>{`Wallet Balance : ${balance}`}</p><Recharge/></div></div>}
      </nav>
    </div>
  )
}

export default Header
