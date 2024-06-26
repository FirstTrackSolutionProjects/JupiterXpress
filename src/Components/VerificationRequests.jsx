import { useEffect , useState  } from 'react'

const View = ({name, email, mobile, gstin, setView, id}) => {
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
                <div className='relative w-4/5 p-8 bg-white space-y-2'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <p className='text-2xl font-medium text-center'>Verification Request</p>
                    <div className='flex w-full justify-evenly flex-wrap'>
                        <div className='w-1/2 min-w-72'>
                        <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {mobile}</p>
                    <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {mobile}</p>
                    <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {mobile}</p>
                    <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {mobile}</p>
                        </div>
                        <div className='w-1/2 min-w-72'>
                        <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {mobile}</p>
                    <p>Name : {name}</p>
                    <p>Business Name : {gstin}</p>
                  
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
            <div className='p-4 border cursor-pointer' onClick={()=>setView(true)} >
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
      <div className='text-center text-3xl font-medium text-black'>Manage Verification Requests</div>
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
