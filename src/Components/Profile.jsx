import React, { useEffect, useState } from 'react'

const Profile = () => {
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
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center'>
      <div className='text-center text-3xl font-medium text-black mb-8'>Merchant Profile</div>
      <div className='w-full text-black font-medium text-xl flex flex-col items-center space-y-2'>
        <div>Name : {profileData.name}</div>
        <div> Business Name : {profileData.business_name}</div>
        <div>Email : {profileData.email}</div>
        <div>Phone : {profileData.phone}</div>
        <div>Address : {profileData.address}</div>
        <div>MSME : {profileData.msme}</div>
        <div>CIN : {profileData.cin}</div>
        <div>GSTIN : {profileData.gstin}</div>
      </div>
      </div>
    </div>
  )
}

export default Profile
