import React, { useState, useEffect , useContext} from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer';
import { jwtDecode } from "jwt-decode"
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const TextForm = () => {
    const navigate = useNavigate()
    const {logout} = useContext(AuthContext)
    const [isVerified, setIsVerified] = useState(false)
    const InitialState = {
        address: '',
        state: '',
        city: '',
        hub: '',
        pin: '',
        aadhar: '',
        pan: '',
        gst: '',
        msme: '',
        bank: '',
        ifsc: '',
        account: '',
        cin: '',
        aadharDoc : null,
        panDoc : null,
        gstDoc : null,
        chequeDoc : null,
        selfieDoc : null,
        otherDoc : null,
    }
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
          const decoded = jwtDecode(token);
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
        if (isVerified){
            navigate('/dashboard')
        }
      }, [])
    const [formData,setFormData] = useState(InitialState)
    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]:type=="file"?files[0]:value,
        }));
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        let fd = new FormData();
        for (const key in formData) {
          fd.append(key, formData[key]);
        }
        fetch("/.netlify/functions/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": localStorage.getItem('token'),
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((result) => alert(result.message))
          .catch((error) => alert(error.message));
      };
    return (
        <>
            <form onSubmit={handleSubmit} action="" className="w-[1024px] flex flex-col bg-white pt-8 px-4" >
            <div className="w-full flex mb-2 flex-wrap ">
            </div>
            <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="address">Address*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.address} id="address" name="address" placeholder="Enter Address" />
                </div>
            </div>
            <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="state">State*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.state} id="state" name="state" placeholder="Enter State" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="city">City*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.city} id="city" name="city" placeholder="Enter City" />

                </div>
                
            </div>
            <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pin">PIN*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.pin} id="pin" name="pin" placeholder="XXXXXX" />
                </div>
            </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="aadhar">Aadhar Number*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.aadhar} id="aadhar" name="aadhar" placeholder="XXXXXXXXXXXX" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pan">PAN Number*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.pan} id="pan" name="pan" placeholder="ABCDE1234F" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="gst">GST Number</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.gst} id="gst" name="gst" placeholder="22AAAAA0000A1Z5" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="msme">MSME/UDYAM Number</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.msme} id="msme" name="msme" placeholder="UDYAMXX000000000" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="bank">Bank Name*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.bank} id="bank" name="bank" placeholder="Ex. State Bank of India" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="ifsc">IFSC*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.ifsc} id="ifsc" name="ifsc" placeholder="Ex. ABCD0001234" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="account">Account Number*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.account} id="account" name="account" placeholder="Ex. 1234567890" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="cin">CIN</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.cin} id="cin" name="cin" placeholder="U12345MH2024PTC012345" />
                </div>
                </div>
                
             
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="aadharDoc">Aadhar Card (Both Sides) *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="aadharDoc" name="aadharDoc" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="panDoc">PAN Card (Front Side) *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="panDoc" name="panDoc" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="selfieDoc">Photo Upload</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="selfieDoc" name="selfieDoc" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="chequeDoc">Cancelled Cheque *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="chequeDoc" name="chequeDoc" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="gstDoc">GST Certificate</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="gstDoc" name="gstDoc" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="otherDoc">Other Document</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="otherDoc" name="otherDoc" placeholder="Upload Driving License" />
                </div>
                </div>
                
                <div className="px-2 space-x-4 mb-4">
                <button type='submit' className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>
                <button onClick={(e)=>{e.preventDefault();setFormData(InitialState)}} className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Clear</button>
                </div>
            </form>
        </>
    )
}


const Verify = () => {
  return (
    <>
    <Header/>
    <div className='w-full flex flex-col items-center pt-16'>
    <div className='w-full flex flex-col items-center p-8'>
      <div className='text-center text-3xl font-medium'>Verify your details</div>
      <TextForm/>
    </div>
    </div>
    <Footer/>
    </>
  )
}

export default Verify
