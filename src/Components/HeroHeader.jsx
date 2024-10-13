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
    const theme = localStorage.getItem("theme");
    if (!theme) {
      setSpaceTheme(true);
      localStorage.setItem("theme", "space");
    } else {
      setSpaceTheme(theme === "space");
    }
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: '35px',
        height: '20px',
        marginRight: '10px',
      }}>
        <input 
          type="checkbox" 
          checked={spaceTheme} 
          onChange={() => {setSpaceTheme((prev)=>{localStorage.setItem('theme', !prev?'space':'non-space'); return !prev }); }} 
          style={{ display: 'none' }} // Hides the default checkbox
        />
        <span style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: spaceTheme ? 'blue' : 'gray',
          borderRadius: '30px',
          cursor: 'pointer',
          transition: '0.4s',
        }}></span>
        <span style={{
          position: 'absolute',
          content: '""',
          height: '12px',
          width: '12px',
          left: spaceTheme ? '20px' : '2px',
          bottom: '4px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: '0.4s',
        }}></span>
      </label>
      {/*<button 
        onClick={() => setSpaceTheme((prev) => !prev)}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: spaceTheme ? 'blue' : 'white',
          color: spaceTheme ? 'white' : 'black',
          cursor: 'pointer',
          transition: '0.3s',
        }}
      >
        {spaceTheme ? "Switch to non-space" : "Switch to space"}
      </button> */}
    </div>
      </nav>
    </div>
  )
}

export default HeroHeader
