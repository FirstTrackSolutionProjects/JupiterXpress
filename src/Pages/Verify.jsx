// import React, { useState, useEffect , useContext} from 'react'
// import Header from '../Components/Header'
// import Footer from '../Components/Footer';
// import { jwtDecode } from "jwt-decode"
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// const TextForm = () => {
//     const navigate = useNavigate()
//     const {logout} = useContext(AuthContext)
//     const [isVerified, setIsVerified] = useState(false)
//     const InitialState = {
//         address: '',
//         state: '',
//         city: '',
//         hub: '',
//         pin: '',
//         aadhar: '',
//         pan: '',
//         gst: '',
//         msme: '',
//         bank: '',
//         ifsc: '',
//         account: '',
//         cin: '',
//         aadhar_doc : null,
//         pan_doc : null,
//         gst_doc : null,
//         cancelledCheque : null,
//         selfie_doc : null,
//         otherDoc : null,
//     }
//     const isAuthenticated = () => {
//         const token = localStorage.getItem('token');
//         if (!token) return false;
//         try {
//           const decoded = jwtDecode(token);
//           if (decoded.exp * 1000 < Date.now()){
//             logout();
//             return false;
//           } // Check if token is expired
//           if (!(decoded.verified)){
//             navigate('/verify')
//             return true;
//           }
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };
//       useEffect(() => {

//         if (!isAuthenticated()) {
//           navigate('/')
//         }
//         if (isVerified){
//             navigate('/dashboard')
//         }
//       }, [])
//     const [formData,setFormData] = useState(InitialState)
//     const handleChange = (e) => {
//         const { name, value, files, type } = e.target;
//         setFormData((prevData) => ({
//           ...prevData,
//           [name]:type=="file"?files[0]:value,
//         }));
//       };
//       const handleSubmit = (e) => {
//         e.preventDefault();
//         let fd = new FormData();
//         for (const key in formData) {
//           fd.append(key, formData[key]);
//         }
//         fetch("/.netlify/functions/verify", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "Authorization": localStorage.getItem('token'),
//           },
//           body: JSON.stringify(formData),
//         })
//           .then((response) => response.json())
//           .then((result) => alert(result.message))
//           .catch((error) => alert(error.message));
//       };
//     return (
//         <>
//             <form onSubmit={handleSubmit} action="" className="w-[1024px] flex flex-col bg-white pt-8 px-4" >
//             <div className="w-full flex mb-2 flex-wrap ">
//             </div>
//             <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="address">Address*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.address} id="address" name="address" placeholder="Enter Address" />
//                 </div>
//             </div>
//             <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
//                     <label htmlFor="state">State*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.state} id="state" name="state" placeholder="Enter State" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
//                     <label htmlFor="city">City*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.city} id="city" name="city" placeholder="Enter City" />

//                 </div>

//             </div>
//             <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="pin">PIN*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.pin} id="pin" name="pin" placeholder="XXXXXX" />
//                 </div>
//             </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="aadhar">Aadhar Number*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.aadhar} id="aadhar" name="aadhar" placeholder="XXXXXXXXXXXX" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="pan">PAN Number*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.pan} id="pan" name="pan" placeholder="ABCDE1234F" />
//                 </div>
//                 </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="gst">GST Number</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.gst} id="gst" name="gst" placeholder="22AAAAA0000A1Z5" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="msme">MSME/UDYAM Number</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.msme} id="msme" name="msme" placeholder="UDYAMXX000000000" />
//                 </div>
//                 </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="bank">Bank Name*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.bank} id="bank" name="bank" placeholder="Ex. State Bank of India" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="ifsc">IFSC*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.ifsc} id="ifsc" name="ifsc" placeholder="Ex. ABCD0001234" />
//                 </div>
//                 </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="account">Account Number*</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.account} id="account" name="account" placeholder="Ex. 1234567890" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="cin">CIN</label>
//                     <input required className="w-full border py-2 px-4 rounded-3xl" type="text" onChange={handleChange} value={formData.cin} id="cin" name="cin" placeholder="U12345MH2024PTC012345" />
//                 </div>
//                 </div>

//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="aadhar_doc">Aadhar Card (Both Sides) *</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="aadhar_doc" name="aadhar_doc" placeholder="Upload Driving License" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="pan_doc">PAN Card (Front Side) *</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="pan_doc" name="pan_doc" placeholder="Upload Driving License" />
//                 </div>
//                 </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="selfie_doc">Photo Upload</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="selfie_doc" name="selfie_doc" placeholder="Upload Driving License" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="cancelledCheque">Cancelled Cheque *</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="cancelledCheque" name="cancelledCheque" placeholder="Upload Driving License" />
//                 </div>
//                 </div>
//                 <div className="w-full flex mb-2 flex-wrap ">
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="gst_doc">GST Certificate</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="gst_doc" name="gst_doc" placeholder="Upload Driving License" />
//                 </div>
//                 <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
//                     <label htmlFor="otherDoc">Other Document</label>
//                     <input required className="w-full border leading-8  rounded-3xl " type="file" onChange={handleChange} id="otherDoc" name="otherDoc" placeholder="Upload Driving License" />
//                 </div>
//                 </div>

//                 <div className="px-2 space-x-4 mb-4">
//                 <button type='submit' className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>
//                 <button onClick={(e)=>{e.preventDefault();setFormData(InitialState)}} className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Clear</button>
//                 </div>
//             </form>
//         </>
//     )
// }

// const Verify = () => {
//   return (
//     <>
//     <Header/>
//     <div className='w-full flex flex-col items-center pt-16'>
//     <div className='w-full flex flex-col items-center p-8'>
//       <div className='text-center text-3xl font-medium'>Verify your details</div>
//       <TextForm/>
//     </div>
//     </div>
//     <Footer/>
//     </>
//   )
// }

// export default Verify

import React, { useState, useEffect, useContext } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FileUploadForm = () => {
  const [reqId, setReqId] = useState(null)
  const [fileData, setFileData] = useState({
    aadhar_doc: null,
    pan_doc: null,
    gst_doc: null,
    cancelledCheque: null,
    selfie_doc: null,
  });
  const [uploadStatus, setUploadStatus] = useState({
    aadhar_doc: false,
    pan_doc: false,
    gst_doc: false,
    cancelledCheque: false,
    selfie_doc: false,
  });
  useEffect(() => {
    const getDocumentStatus = async () => {
      await fetch('/.netlify/functions/getDocumentStatus', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(response => response.json()).then((result) => {
        setReqId(result.message.reqId)
        setUploadStatus({
          aadhar_doc: result.message.aadhar_doc?(true):(false),
          pan_doc: result.message.pan_doc?(true):(false),
          gst_doc: result.message.gst_doc?(true):(false),
          cancelledCheque: result.message.cancelledCheque?(true):(false),
          selfie_doc: result.message.selfie_doc?(true):(false),
        })
      })
    }
    getDocumentStatus()
  }, [])
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFileData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleUpload = async (name) => {
    // Fetch signed URL from backend
    const response  = await fetch ('/.netlify/functions/getTokenData', {
      method: 'GET',
      headers: {
        'Authorization' : localStorage.getItem('token'),
      }
    })
    const tokenData = await response.json();
    const id = tokenData.id;
    const key  = `merchant/${id}/verificationDocs/${reqId}/${name}`
    await fetch(`/.netlify/functions/getPutSignedUrl`, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({filename : key, filetype : fileData[name].type})
    })
      .then((response) => response.json())
      .then(async (data) => {
        const { uploadURL } = data;
        await fetch(uploadURL, {
          method: "PUT",
          headers: {
            'Content-Type': fileData[name].type
          },
          body: fileData[name],
        });
        await fetch(`/.netlify/functions/updateDocumentStatus`, {
          method: 'POST',
          headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization' : localStorage.getItem('token')
          },
          body : JSON.stringify({name : name, key : key})
        })
        alert("Success");
      })
      .then(() => {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [name]: true,
        }));
      })
      .catch((error) => alert(error.message));
  };

  const handleSubmit= async (e) => {
    e.preventDefault();
    if (!(uploadStatus.aadhar_doc && uploadStatus.pan_doc && uploadStatus.cancelledCheque && uploadStatus.selfie_doc)){
      alert("Please upload all required documents")
      return;
    }
    await fetch(`/.netlify/functions/completeVerificationRequest`, {
      method: 'GET',
      headers : {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : localStorage.getItem('token')
      }
  }).then(response => response.json()).then(result => alert(result.message));
}
  return (
    <form className="w-[1024px] flex flex-col bg-white pt-8 px-4" onSubmit={handleSubmit}>
      {/* File input required fields */}
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="aadhar_doc">Aadhar Card (Both Sides) *</label>
          <input
            className="w-full border leading-8 rounded-3xl"
            type="file"
            onChange={handleFileChange}
            id="aadhar_doc"
            name="aadhar_doc"
          />
          <button
            type="button"
            onClick={() => handleUpload("aadhar_doc")}
            className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
          >
            Upload
          </button>
          {uploadStatus.aadhar_doc && <span>✔️</span>}
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="pan_doc">PAN Card (Front Side) *</label>
          <input
            className="w-full border leading-8 rounded-3xl"
            type="file"
            onChange={handleFileChange}
            id="pan_doc"
            name="pan_doc"
          />
          <button
            type="button"
            onClick={() => handleUpload("pan_doc")}
            className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
          >
            Upload
          </button>
          {uploadStatus.pan_doc && <span>✔️</span>}
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="gst_doc">GST Certificate </label>
          <input
            className="w-full border leading-8 rounded-3xl"
            type="file"
            onChange={handleFileChange}
            id="gst_doc"
            name="gst_doc"
          />
          <button
            type="button"
            onClick={() => handleUpload("gst_doc")}
            className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
          >
            Upload
          </button>
          {uploadStatus.gst_doc && <span>✔️</span>}
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="cancelledCheque">Cancelled Cheque *</label>
          <input
            className="w-full border leading-8 rounded-3xl"
            type="file"
            onChange={handleFileChange}
            id="cancelledCheque"
            name="cancelledCheque"
          />
          <button
            type="button"
            onClick={() => handleUpload("cancelledCheque")}
            className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
          >
            Upload
          </button>
          {uploadStatus.cancelledCheque && <span>✔️</span>}
        </div>
      </div>
      <div className="w-1/2 flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="selfie_doc">Upload your selfie *</label>
          <input
            className="w-full border leading-8 rounded-3xl"
            type="file"
            onChange={handleFileChange}
            id="selfie_doc"
            name="selfie_doc"
          />
          <button
            type="button"
            onClick={() => handleUpload("selfie_doc")}
            className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
          >
            Upload
          </button>
          {uploadStatus.selfie_doc && <span>✔️</span>}
        </div>
        {/* <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                  <label htmlFor="pan_doc">PAN Card (Front Side) *</label>
                  <input required className="w-full border leading-8 rounded-3xl" type="file" onChange={handleFileChange} id="pan_doc" name="pan_doc" />
                  <button type='button' onClick={() => handleUpload('aadhar_doc')} className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Upload</button>
                  {uploadStatus.pan_doc && <span>✔️</span>}
              </div> */}
      </div>
      <div className="px-2 space-x-4 mb-4">
        <button
          type="submit"
          className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
        >
          Submit
        </button>
      </div>
      {/* Add similar file inputs for other documents */}
    </form>
  );
};

const TextForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    address: "",
    state: "",
    city: "",
    hub: "",
    pin: "",
    aadhar: "",
    pan: "",
    gst: "",
    msme: "",
    bank: "",
    ifsc: "",
    account: "",
    cin: "",
  });

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
        Accept: "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
        onNext(); // Move to the next step
      })
      .catch((error) => alert(error.message));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[1024px] flex flex-col bg-white pt-8 px-4"
    >
      <div className="w-full flex mb-2 flex-wrap "></div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="address">Address*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.address}
            id="address"
            name="address"
            placeholder="Enter Address"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
          <label htmlFor="state">State*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.state}
            id="state"
            name="state"
            placeholder="Enter State"
          />
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
          <label htmlFor="city">City*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.city}
            id="city"
            name="city"
            placeholder="Enter City"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="pin">PIN*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.pin}
            id="pin"
            name="pin"
            placeholder="XXXXXX"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="aadhar">Aadhar Number*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.aadhar}
            id="aadhar"
            name="aadhar"
            placeholder="XXXXXXXXXXXX"
          />
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="pan">PAN Number*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.pan}
            id="pan"
            name="pan"
            placeholder="ABCDE1234F"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="gst">GST Number</label>
          <input
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.gst}
            id="gst"
            name="gst"
            placeholder="22AAAAA0000A1Z5"
          />
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="msme">MSME/UDYAM Number*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.msme}
            id="msme"
            name="msme"
            placeholder="UDYAMXX000000000"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="bank">Bank Name*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.bank}
            id="bank"
            name="bank"
            placeholder="Ex. State Bank of India"
          />
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="ifsc">IFSC*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.ifsc}
            id="ifsc"
            name="ifsc"
            placeholder="Ex. ABCD0001234"
          />
        </div>
      </div>
      <div className="w-full flex mb-2 flex-wrap ">
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="account">Account Number*</label>
          <input required
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.account}
            id="account"
            name="account"
            placeholder="Ex. 1234567890"
          />
        </div>
        <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
          <label htmlFor="cin">CIN</label>
          <input
            className="w-full border py-2 px-4 rounded-3xl"
            type="text"
            onChange={handleChange}
            value={formData.cin}
            id="cin"
            name="cin"
            placeholder="U12345MH2024PTC012345"
          />
        </div>
      </div>

      <div className="px-2 space-x-4 mb-4">
        <button
          type="submit"
          className="px-5 py-1 border rounded-3xl bg-blue-500 text-white"
        >
          Next
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setFormData(InitialState);
          }}
          className="px-5 py-1 border rounded-3xl bg-red-500 text-white"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

const Verify = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const getStatus = async () => {
      await fetch('/.netlify/functions/getVerificationStatus', {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        }
      }).then((response)=>response.json()).then((data)=>data.success?(setStep(2)):null)
    }
    getStatus()
  }, [])

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      if (!decoded.verified) {
        navigate("/verify");
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
        navigate('/');
    }
  }, []);

  const handleNextStep = () => {
    setStep(2);
  };

  return (
    <>
      <Header />
      <div className="w-full flex flex-col items-center pt-16">
        <div className="w-full flex flex-col items-center p-8">
          <div className="text-center text-3xl font-medium">
            Verify your details
          </div>
          {step === 1 ? (
            <TextForm onNext={handleNextStep} />
          ) : (
            <FileUploadForm />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Verify;