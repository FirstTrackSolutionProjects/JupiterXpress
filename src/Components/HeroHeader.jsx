import NavItem from "./NavItem"
import { navItems } from "../Constants"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const HeroHeader = ({spaceTheme, setSpaceTheme}) => {
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
    <>
    <div className={`fixed z-1 top-0 sm:hidden flex justify-center items-center w-full h-16 ${spaceTheme ? 'bg-black' : 'bg-indigo-100'}`}>
    </div>
    <div className={`fixed z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ${spaceTheme ? 'bg-black' : 'bg-indigo-100'}`}>
      <nav className={`w-full relative z-3 lg:w-4/5 flex justify-evenly items-center text-lg h-16 ${spaceTheme ? 'text-gray-100' : 'text-black'}`}>
        {
          navItems.map((item,index) =>(
            <NavItem key = {index} name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} />
          ))
        }
        {username && (
          <div className={`h-16 flex space-x-3 items-center ${spaceTheme?"text-white":"text-black"}`}>
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
        {/*<button onClick={()=>setSpaceTheme((prev)=>!prev)}>{spaceTheme?"Switch to non-space":"Switch to space"}</button>*/}

      </nav>
    </div>
    </>
  )
}

export default HeroHeader
