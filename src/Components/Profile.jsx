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
      <div className='w-[90%] bg-white p-8 flex flex-col items-center'>
      <div className='text-center text-3xl font-medium text-black mb-8'>Merchant Profile</div>
      <div className='w-full  text-black text-xl flex flex-col space-y-2'>
        <div className='h-48 w-full flex items-center space-x-4'>
          <div className='h-16 w-16'>
            <img src="user.webp" alt="" className='object-contain' />
          </div>
          <div className='flex-1 font-medium'>
            <div>{profileData.business_name}</div>
            <div className='text-gray-600 text-sm'>({profileData.name})</div>
          </div>
          <div className='flex-1'>
            <div>E-mail : {}</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        
      </div>
      </div>
    </div>
  )
}

export default Profile
