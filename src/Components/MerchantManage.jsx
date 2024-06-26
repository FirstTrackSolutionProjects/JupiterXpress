import { useEffect , useState  } from 'react'

const View = ({name, email, mobile, gstin, setView}) => {
    
    return (
        <>
            <div className='absolute inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center overflow-y-auto'>
                <div className='relative w-4/5 p-8 bg-white space-y-2'>
                <p className='absolute top-5 right-6 cursor-pointer' onClick={()=>{setView(false)}}>X</p>
                    <p className='text-2xl font-medium text-center'>Merchant Details</p>
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
                <p>User Id : {merchant.id}</p>
                <p>Name : {merchant.name}</p>
                <p>Business Name : {merchant.business_name}</p>
            </div>
        </>
    )
}

const MerchantManage =  () => {
    const [merchants, setMerchants] = useState([])
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
        {
            merchants.map(((merchant,index)=>(
                <Card key={index}  merchant={merchant}/>
            )))
        }
      </div>
      </div>
    </div>
    </>
  )
}

export default MerchantManage
