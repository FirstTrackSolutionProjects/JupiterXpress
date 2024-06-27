import { useEffect , useState  } from 'react'


const View = ({name, email, mobile, gstin, setView, business_name, cin, aadhar, pan, address, city, hub, state, pin, account_number, ifsc, bank}) => {
    const handleApprove = async () => {
        await fetch('/.netlify/functions/verifyMerchant', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : localStorage.getItem('token'),
            },
            body: JSON.stringify({id})
        }).then(response => response.json()).then(result => alert(result.message));
    }
    return (
        <>
            <div className='absolute inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center overflow-y-auto'>
                <div className='relative p-6 max-w-[400px] bg-white rounded-2xl overflow-hidden space-y-8'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <p className='text-2xl font-medium text-center'>Merchant Details</p>
                    <div className='w-full space-y-6'>
                        <div className='w-full flex items-center justify-center space-x-8'>
                            <div className='flex justify-center items-center w-32 h-32'>
                                <img src='user.webp'/>
                            </div>
                            <div className=''>
                                <p className='font-medium text-xl'>{business_name}</p>
                                <p className='font-medium text-sm text-gray-600'>({name})</p>
                                <p className='font-medium text-sm text-gray-600'>{email}</p>
                                <p className='font-medium text-sm text-gray-600'>{mobile}</p>
                                <p className='font-medium text-sm text-green-400'>Balance(Coming Soon)</p>
                            </div>
                        </div>
                        <div className='w-full font-medium text-gray-700'>
                            <p>GSTIN : {gstin}</p>
                            <p>CIN : {cin}</p>
                            <p>Aadhar Number : {aadhar}</p>
                            <p>PAN Number : {pan}</p>
                            <p>Address : {address}</p>
                            <p>Hub : {hub}</p>
                            <p>City : {city}</p>
                            <p>State : {state}</p>
                            <p>Pincode : {pin}</p>
                            <p>Bank Name : {bank}</p>
                            <p>A/C No. : {account_number}</p>
                            <p>IFSC : {ifsc}</p>
                        </div>
                    </div>
                    <button onClick={handleApprove} className=" bg-blue-500 text-white mx-2  py-2 px-4 rounded-3xl">
                        Approve
                    </button>
                    <button className=" bg-red-500 text-white mx-2  py-2 px-6 rounded-3xl">
                        Reject
                    </button>
                </div>
            </div>
        </>
    )
}


const Card = ({request}) => {
    const [view, setView] = useState(false)
    return (
        <>
            {view && <View {...request} setView={setView} />}
            <div className='p-4 border cursor-pointer ' onClick={()=>setView(true)} >
                <p>User Id : {request.id}</p>
                <p>Name : {request.name}</p>
                <p>Business Name : {request.business_name}</p>
            </div>
        </>
    )
}

const VerificationRequests =  () => {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const getVerificationRequests = async () => {
            const response = await fetch('/.netlify/functions/getVerificationRequests', {
                method: 'GET',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json();
            setRequests(data.message)
        }
        getVerificationRequests();
    },[]);
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Merchant Verification Requests</div>
      <div className='w-full bg-white p-8'>
        {
            requests.map(((request,index)=>(
                <Card key={index}  request={request}/>
            )))
        }
      </div>
      </div>
    </div>
    </>
  )
}

export default VerificationRequests
