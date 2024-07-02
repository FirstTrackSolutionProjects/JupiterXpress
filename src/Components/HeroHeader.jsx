import NavItem from "./NavItem"
import { navItems } from "../Constants"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const HeroHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      if (!token) return false;
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.business_name);
        return decoded.exp * 1000 > Date.now(); 
      } catch (error) {
        return false;
      }
    };
    const auth = isAuthenticated();
    if (!auth) setUsername("");
  }, []);
  return (
    <div className=" absolute z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ">
      <nav className="w-full relative z-3 lg:w-4/5 flex justify-evenly text-gray-300 items-center h-16">
        {
          navItems.map((item,index) =>(
            <NavItem key = {index} name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} />
          ))
        }
        {username && (
          <div className="h-16 flex space-x-3 items-center text-white">
            <div className="flex space-x-4">
              <p className="flex items-center font-medium rounded-xl px-2 py-2" onClick={()=>navigate('/dashboard')}>
                {username}
              </p>
              <p
                className=" text-red-400 flex items-center font-medium rounded-xl px-2 py-2"
                onClick={() => {
                  logout();
                  setUsername(null);
                  navigate("/");
                }}
              >
                Logout
              </p>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default HeroHeader
