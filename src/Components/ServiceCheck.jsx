import React, { useState } from 'react'

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
     await fetch('/.netlify/functions/serviceCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({code : formData.source})
    }).then(response => response.json()).then(data => (data.data.delivery_codes.length)?alert("We are available at the Source"):alert("We are not available at the source"))
    const isDestination = await fetch('/.netlify/functions/serviceCheck', {
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
              <form action="">
                <input type="number"  min={100000} max={999999}  name='source' value={formData.source} onChange={handleChange} />
                <input type="number" min={100000} max={999999} name='destination' value={formData.destination}  onChange={handleChange}/>
                <button type="submit">Submit</button>
              </form>
            </div>
        </div>
    </>
  )
}

export default ServiceCheck
