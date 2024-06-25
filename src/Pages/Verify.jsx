import React, { useState, useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer';
import { jwtDecode } from "jwt-decode"
const TextForm = () => {
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
    }
    const [formData,setFormData] = useState(InitialState)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = (e) => {
        e.preventDefault();
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
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.address} id="address" name="address" placeholder="Ex. House no 103, Patna, Bihar" />
                </div>
            </div>
            <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="state">State*</label>
                    <select name="state" value={formData.state} onChange={handleChange} id="state" className="border py-2 px-4 rounded-3xl">
                        <option value="">Select State</option>
                        <option value="bihar">Bihar</option>
                    </select>
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="city">City*</label>
                    <select name="city" value={formData.city} onChange={handleChange} id="city" className="border py-2 px-4 rounded-3xl">
                        <option value="">Select City</option>
                        <option value="bihar">Bhagalpur</option>
                    </select>
                </div>
                
            </div>
            <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="hub">Hub*</label>
                    <select name="hub" id="hub" value={formData.hub} onChange={handleChange} className="border py-2 px-4 rounded-3xl">
                        <option value="">Select Hub</option>
                        <option value="bhagalpur">Bhagalpur</option>
                    </select>
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pin">PIN*</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.pin} id="pin" name="pin" placeholder="Ex. 813210" />
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
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.ifsc} id="ifsc" name="ifsc" placeholder="Ex. SBIN0001234" />
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
                    <label htmlFor="aadhar_doc">Aadhar Card (Both Sides) *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="aadhar_doc" name="aadhar_doc" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pan_doc">PAN Card (Front Side) *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="pan_doc" name="pan_doc" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="photo">Photo Upload</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="photo" name="photo" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="cheque">Cancelled Cheque *</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="cheque" name="cheque" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="gst_doc">GST Certificate</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="gst_doc" name="gst_doc" placeholder="Upload Driving License" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="other">Other Document</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="other" name="other" placeholder="Upload Driving License" />
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
