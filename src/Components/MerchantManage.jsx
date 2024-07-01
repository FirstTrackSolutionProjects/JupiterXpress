import { useEffect , useState  } from 'react'

const View = ({fullName, email, phone,isActive, uid  , gst, setView, businessName, cin, aadhar_number, pan_number, address, city, state, pin, accountNumber, ifsc, bank}) => {
    const [isActivated, setIsActivated] = useState(isActive)
    const activate = () => {
        fetch('/.netlify/functions/activateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({uid})
        }).then(response => response.json()).then(result => alert(result.message)).then(()=>setIsActivated(true));
    }
    const deactivate = () => {
        fetch('/.netlify/functions/deactivateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({uid})
        }).then(response => response.json()).then(result => alert(result.message)).then(()=>setIsActivated(false));
    }
    return (
        <>
            <div className='absolute inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center overflow-y-auto'>
                <div className='relative p-8 max-w-[400px] bg-white rounded-2xl overflow-hidden space-y-8'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <p className='text-2xl font-medium text-center'>Merchant Details</p>
                    <div className='w-full space-y-6'>
                        <div className='w-full flex items-center justify-center space-x-8'>
                            <div className='flex justify-center items-center w-32 h-32'>
                                <img src='user.webp'/>
                            </div>
                            <div className=''>
                                <p className='font-medium text-xl'>{businessName}</p>
                                <p className='font-medium text-sm text-gray-600'>({fullName})</p>
                                <p className='font-medium text-sm text-gray-600'>{email}</p>
                                <p className='font-medium text-sm text-gray-600'>{phone}</p>
                                <p className='font-medium text-sm text-green-400'>Balance(Coming Soon)</p>
                            </div>
                        </div>
                        <div className='w-full font-medium text-gray-700'>
                            <p>GSTIN : {gst}</p>
                            <p>CIN : {cin}</p>
                            <p>Aadhar Number : {aadhar_number}</p>
                            <p>PAN Number : {pan_number}</p>
                            <p>Address : {address}</p>
                            <p>City : {city}</p>
                            <p>State : {state}</p>
                            <p>Pincode : {pin}</p>
                            <p>Bank Name : {bank}</p>
                            <p>A/C No. : {accountNumber}</p>
                            <p>IFSC : {ifsc}</p>
                        </div>
                    </div>
                    <button onClick={isActivated?()=>deactivate():()=>activate()}  className={` ${isActivated?"bg-red-500":"bg-green-500"} text-white mx-2  py-2 px-4 rounded-3xl`}>
                        {isActivated? "Deactivate" : "Activate"}
                    </button>
                
                </div>
            </div>
        </>
    )
}


const Card = ({merchant}) => {
    const [view, setView] = useState(false)
    return (
        <>
            { view && <View {...merchant} setView={setView} />}
            <div className='p-4 border' onClick={()=>setView(true)}>
                <p>User Id : {merchant.uid}</p>
                <p>Name : {merchant.fullName}</p>
                <p>Business Name : {merchant.businessName}</p>
            </div>
        </>
    )
}



const MerchantManage =  () => {
    const [merchants, setMerchants] = useState([    ])
    useEffect(() => {
        const getVerifiedMerchant = async () => {
            const response = await fetch('/.netlify/functions/getVerifiedMerchants', {
                method: 'GET',
                headers: { 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json();
            if (data.message.length)
                setMerchants(data.message)
        }
        getVerifiedMerchant();
    },[]);
  return (
    <>
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <div className='w-full p-8 flex flex-col items-center space-y-8'>
      <div className='text-center text-3xl font-medium text-black'>Manage Merchants</div>
      <div className='w-full bg-white p-8'>
        {merchants.length > 0 ? (
        merchants.map(((merchant,index)=>(
            <Card key={index}  merchant={merchant}/>
        )))
      ) : (
        null
      )}
      </div>
      </div>
    </div>
    </>
  )
}

export default MerchantManage
