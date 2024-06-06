


const LoginForm = () => {
  const handleLogin = (event) => {
    event.preventDefault();  // Prevent the default form submission

    // Manually collect form data
    const email = (document.querySelector('input[name="email"]')).value;
    const password = (document.querySelector('input[name="password"]')).value;

    const data = {
      email,
      password,
    };

    // Make the API call
    fetch('/.netlify/functions/auth', {
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
  <div className="text-center text-3xl font-medium ">
          Welcome back, Partner
        </div>
        <form action="" onSubmit={handleLogin} className="w-full sm:w-auto flex px-3 flex-col space-y-3 sm:space-y-5 text-black">
          <input type="email" placeholder="E-mail" name="email" className="py-2 px-3 rounded-xl w-full sm:w-[400px]" />
          <input type="password" placeholder="Password"name="password" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white hover:bg-[rgba(135,206,235,0.3)]">Login</button>
        </form>
        </>
  )
}

const RegisterForm = () => {
  return (
    <>
      <div className="text-center text-3xl font-medium ">
          Welcome to the team, Partner
        </div>
        <form action="" className="w-full sm:w-auto flex px-3 flex-col space-y-3 sm:space-y-5 text-black">
          <input type="text" placeholder="Business Name" name="businessName" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input type="text" placeholder="Full Name" name="name" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <select placeholder="Select Hub" name="hub" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" >
            <option value="">Select Hub</option>
          </select>
          <input type="text" placeholder="Mobile" name="mobile" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]" />
          <input type="password" name="password" placeholder="Password" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <textarea name="address" placeholder="Address" id="" className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Register</button>
        </form>
       
    </>
  )
}

const Login = ({authMode, setAuthMode}) => {
  return (
    <div className={`absolute ${authMode?"flex":"hidden"} sm:py-8 z-20 inset-0 justify-center items-center`}>
      <div className={`relative justify-center space-y-10 py-5 flex flex-col items-center transition-all duration-500 w-[400px] sm:w-[600px] md:w-[760px]   lg:w-[700px] rounded-xl bg-[rgba(135,206,235,0.3)]  ${authMode?"":"w-0"} `}>
        <div onClick={()=>setAuthMode(0)} className="absolute top-3 right-3 text-3xl">
          X
        </div>
        <img src="logo.png" alt="" className="" />
         {authMode==2 ? <LoginForm/> : <RegisterForm/>}
      </div>
    </div>
  )
}

export default Login
