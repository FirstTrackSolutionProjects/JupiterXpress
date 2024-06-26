import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
const Profile = () => {
  const admin = jwtDecode(localStorage.getItem('token')).admin;
  const INITIAL_STATE = {
    name : '',
    business_name : '',
    email : '',
    phone : '',
    address : '',
    msme : '',
    cin : '',
    gstin : ''
  }
  const [profileData,  setProfileData] = useState(INITIAL_STATE)
  useEffect(()=>{
    fetch('/.netlify/functions/getProfile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token'),
      }
    }).then(response => response.json()).then(result => result.data).then( (data) => {
      setProfileData({
        name : data.basic.name,
        business_name : data.detailed.business_name,
        email : data.basic.email,
        phone : data.basic.mobile,
        address : data.detailed.address,
        msme : data.detailed.msme_udyam,
        cin : data.detailed.cin,
        gstin : data.detailed.gstin
      })
    })
  }, [])
  return (
    <div className=" w-full h-full flex flex-col items-center overflow-x-hidden">
      <div className='w-full h-full bg-white p-8 flex flex-col items-center'>
      <div className='text-center text-3xl font-medium text-black mb-8'>{admin?"Admin":"Merchant"} Profile</div>
      <div className='sm:px-8 sm:border text-black text-xl flex flex-col space-y-2 items-center'>
        <div className='h-48 flex items-center space-x-4'>
          <div className='h-16 w-16'>
            <img src="user.webp" alt="" className='object-contain' />
          </div>
          <div className='flex-1 sm:text-xl font-medium'>
            <div>{profileData.business_name}</div>
            <div className='text-gray-600 text-sm'>({profileData.name})</div>
          </div>
        </div>
        <div className=' text-sm sm:text-xl space-y-1'>
        <div><span className='font-medium'> E-mail </span> : {profileData.email}</div>
        <div><span className='font-medium'> Phone </span> : {profileData.phone}</div>
        <div><span className='font-medium'> Address </span> : {profileData.address}</div>
        <div><span className='font-medium'> MSME/UDYOG </span> : {profileData.msme}</div>
        <div><span className='font-medium'> CIN </span> : {profileData.cin}</div>
        <div><span className='font-medium'> GSTIN </span> : {profileData.gstin}</div>
        </div>
        <div className=' py-6'>
        <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white text-sm sm:text-xl">Edit Details</button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Profile
