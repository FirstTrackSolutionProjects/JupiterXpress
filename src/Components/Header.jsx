import NavItem from "./NavItem";
import { navItems } from "../Constants";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Recharge from "./Wallet/Recharge";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [showRecharge, setShowRecharge] = useState(false)
  const [isVerified, setIsVerified] = useState(false);
  const [balance, setBalance] = useState(0.00);
  useEffect(() => {
    const isAuthenticated = () => {
      const token = localStorage.getItem("token");
      if (!token) return false;
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.business_name);
        setIsVerified(decoded.verified);
        return decoded.exp * 1000 > Date.now(); // Check if token is expired
      } catch (error) {
        return false;
      }
    };
    const fetchBalance = async () => {
      const balance = await fetch(
        `/.netlify/functions/getBalance`,{
          headers:{
            "authorization":localStorage.getItem("token"),
          }
        }
      )
        .then((response) => response.json())
        .then((result) => result.balance);
      if (balance) {
        setBalance(balance);
      }
    };
    const auth = isAuthenticated();
    if (!auth) setUsername("");
    else {
        fetchBalance();
    }
  }, []);
  return (
    <>
    {showRecharge && <Recharge setShowRecharge={setShowRecharge}/>}
    <div className="fixed bg-gradient-to-b from-white to-[rgba(37,169,228,0.89)] z-10 top-0 hidden sm:flex justify-center items-center w-full h-16 ">
      <nav className="w-full relative z-3 lg:w-4/5 flex justify-evenly text-gray-700 items-center h-16">
        <Link to="/" className="flex items-center">
          <img src="logo.webp" alt="" className="h-8" />
          <div className="flex flex-col justify-evenly leading-4 -ml-6">
            <div className="font-bold text-blue-800">JUPITER</div>
            <div className="font-bold text-blue-600">XPRESS</div>
          </div>
        </Link>
        {navItems.map((item, index) => (
          <NavItem key={index} name={item.name} url={item.url} isDropdown={item.isDropdown} options={item.options} />
        ))}

        {username && (
          <div className="h-16 flex space-x-3 items-center">
            {isVerified? (<>
              <div onClick={()=>setShowRecharge(true)} className={`relative bg-blue-600 ${balance < 250 ? "text-red-400" : "text-green-400"} flex items-center font-medium rounded-tl-xl rounded-br-xl px-3 min-w-14 py-2 cursor-pointer border-l-4 border-t-4 border-blue-900`}>
              {balance < 250 && <p className="absolute -mt-5 top-0 right-[2px] text-red-400 text-3xl">!</p>}
                <p>{`₹${balance}`}</p>
              </div>
              {/* <div className="bg-white flex items-center font-medium rounded-xl px-3 py-2 ">
                <p>R</p>
              </div> */}
              </>
            ):null}
            <div className="flex space-x-4">
              <p className="bg-white flex items-center font-medium rounded-xl px-2 py-2 cursor-pointer" onClick={()=>navigate('/dashboard')}>
                {username}
              </p>
              <p
                className="bg-red-400 text-white flex items-center font-medium rounded-xl px-2 py-2 cursor-pointer"
                onClick={() => {
                  logout();
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
    </>
  );
};

export default Header;
