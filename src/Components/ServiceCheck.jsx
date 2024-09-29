import React, { useState } from 'react'
const API_URL = import.meta.env.VITE_APP_API_URL
const ServiceCheck = () => {
  const [formData, setFormData] = useState({
    source: '',
    destination: ''
  })
  const handleChange = (e) => {
    const { name, value,  } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
     await fetch(`${API_URL}/service/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({code : formData.source})
    }).then(response => response.json()).then(data => (data.data.delivery_codes.length)?alert("We are available at the Source"):alert("We are not available at the source"))
    const isDestination = await fetch(`${API_URL}/service/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({code : formData.destination})
    }).then(respose => respose.json()).then(data => (data.data.delivery_codes.length)?alert("We are available at the Destination"):alert("We are not available at the Destination"))
    
  }
  return (
    <>
        <div className='w-full pt-16 absolute inset-0 flex justify-center' onSubmit={handleSubmit}>
            <div className='w-full p-8'>
              <div className='text-center text-3xl font-medium'>SERVICE CHECK</div>
              <form action="" onSubmit={handleSubmit} className="w-full sm:w-auto flex px-3 flex-col mt-3 space-y-3 sm:space-y-5 text-black">
          <input type="number"  min={100000} max={999999}  name='source' value={formData.source} onChange={handleChange}className="py-2 px-3 rounded-xl w-full sm:w-[400px]" />
          <input type="number" min={100000} max={999999} name='destination' value={formData.destination} onChange={handleChange} className="py-2 px-3 rounded-xl  w-full sm:w-[400px]"/>
          <button type="submit" className="py-2 px-3 rounded-xl  w-full sm:w-[400px] border border-white text-white hover:bg-[rgba(135,206,235,0.3)]">Login</button>
        </form>
            </div>
        </div>
    </>
  )
}

export default ServiceCheck
