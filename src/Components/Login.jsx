
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
const LoginForm = ({authMode}) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  
  const handleLogin = (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Manually collect form data
    const username = (document.querySelector('input[name="email"]')).value;
    const password = (document.querySelector('input[name="password"]')).value;

    const data = {
      username,
      password,
    };

    // Make the API call
    fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Login successful')
          login(username, result.token);
          alert('token successfully')
          navigate('/dashboard');
          
          // Handle successful login
        } else {
          alert('Login failed: ' + result.message);
          // Handle login failure
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
      });
  };
  return (
    <>
      <div className={` transition-all duration-500  overflow-hidden flex items-center flex-col  ${authMode==2?"w-full h-56" : ""} ${authMode==1?"hidden" : ""} ${authMode==0?"w-0 h-0" : ""} `}>
        <div className="text-center text-3xl font-medium ">
          Welcome back, Partner
        </div>
        <form action="" onSubmit={handleLogin} className="w-full sm:w-auto flex px-3 flex-col mt-3 space-y-3 sm:space-y-5 text-black">
          <input type="email" placeholder="E-mail" name="email" className="py-2 px-3 rounded-xl w-full sm:w-[400px]" />
          <input type="password" placeholder="Password"name="password" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Login</button>
        </form>
        </div>
        </>
  )
}

const RegisterForm = ({authMode}) => {
  return (
    <>
      <div className={` transition-all duration-500  overflow-hidden  flex flex-col items-center justify-center ${authMode==1?"w-full h-[550px] md:h-[550px] " : ""} ${authMode==2?"hidden" : ""} ${authMode==0?"w-0 h-0" : ""}`}>
      <div className="text-center text-xl sm:text-3xl font-medium mb-5 ">
          Welcome to the team, Partner
        </div>
        <form action="" className="w-full sm:w-auto flex px-3 flex-col space-y-3 sm:space-y-5 text-black">
          <input type="text" placeholder="Business Name" name="businessName" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input type="text" placeholder="Full Name" name="name" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <div className="flex space-x-2">
          <select placeholder="Select State" name="state" className="py-2 px-3 rounded-xl  w-1/2 sm:w-[196px]" >
            <option value="">Select State</option>
          </select>
          <select placeholder="Select Hub" name="hub" className="py-2 px-3 rounded-xl  w-1/2 sm:w-[196px]" >
            <option value="">Select Hub</option>
          </select>
          </div>
          
          <input type="text" placeholder="Mobile" name="mobile" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input type="email" placeholder="Your E-mail Address" name="regEmail" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input type="password" name="regpassword" placeholder="Password" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <textarea name="address" placeholder="Address" id="" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Register</button>
        </form>
        </div>
    </>
  )
}

const Login = ({authMode, setAuthMode}) => {
  return (
    <div className={`absolute  flex sm:py-3 z-20 ${authMode?"w-full delay-0":"w-0 delay-500"} justify-center  items-center transition-all duration-1000`}>
      <div className={` shadow-cabCard shadow-[hsl(197,71%,73%)] relative space-y-5 pt-1 pb-5 flex flex-col items-center transition-all duration-500 w-[400px] sm:w-[600px] md:w-[760px]  overflow-hidden  lg:w-[700px] rounded-xl bg-[rgba(135,206,235,0.3)]  ${authMode?"":"w-0"} `}>
        <div onClick={()=>setAuthMode(0)} className="absolute top-6 right-6 text-3xl cursor-pointer">
          X
        </div>
        <img src="logo.webp" alt="" className="w-32 sm:w-auto" />
          <RegisterForm authMode={authMode}/>
         <LoginForm authMode={authMode} />
        
      </div>
    </div>
  )
}

export default Login
