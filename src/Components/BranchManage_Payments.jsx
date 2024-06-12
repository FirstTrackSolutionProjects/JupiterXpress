import { useState } from "react"

const Filter  = () => {
    return (
        <>
            <form className="w-full min-h-16 bg-white flex px-8 py-8  items-center rounded-xl flex-wrap">
                <input type="text" className="border px-4 py-2 rounded-3xl flex-1 mx-2 mb-2" placeholder="Hub Name"/>
                
                <div className="flex-1 ">
                <input type="checkbox" id="isProcessed" className="border px-4 py-2 rounded-3xl flex-1 mx-2 mb-2"/>
                <label htmlFor="isProcessed"> Is Processed</label>
                </div>
                <div className=" flex justify-center mx-2 mb-2 space-x-2">
                    <button className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Clear</button>
                    <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Filter</button>
                </div>
            </form>
        </>
    )
}

const Card = (data) => {
    
    const [mode, setMode] = useState(0)
    return (
        <>
            <div className="w-full py-4 border relative flex items-center px-3">
                        <div onClick={()=>setMode(1)} className='flex flex-1 items-center space-x-4 cursor-pointer'>
                        <img src="user.webp" alt="" className="h-14 w-14 rounded-full overflow-hidden border" />
                        <div>
                            <p>{data.name}</p>
                            <p>{data.phone}</p>
                            <p>{data.address}</p>
                        </div>
                        </div>
                        <div className='absolute right-3 flex flex-col justify-evenly'>
                            <button onClick={()=>setMode(2)} className="px-2 py-0 border rounded-3xl bg-blue-500 text-white">Edit</button>
                            <button onClick={()=>setMode(1)} className="px-2 py-0 border rounded-3xl bg-red-500 text-white">Delete</button>
                        </div>
                    </div>
                    <Viewer mode={mode} setMode={setMode} data={data} />
                <EditForm mode={mode} setMode={setMode} data={data} />
                
        </>
    )
}


const EditForm = ({mode, setMode, data}, ) => {
    return (
        <>
            <div className={`absolute ${mode==2?"":"hidden"} inset-0 p-4 bg-gray-100 rounded-xl z-20`}>
            <div className="w-full h-16 font-medium  relative flex text-3xl bg-white p-4 items-center">
                Edit Branch
            </div>
            <form action="" className="w-full flex flex-col bg-white pt-8 px-4">
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="name">Name</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={data.name} id="name" name="name" placeholder="Enter Name" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="phone">Phone</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={data.phone} id="phone" name="phone" placeholder="Enter Phone" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="address">Address</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={data.address} id="address" name="address" placeholder="Enter Address" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" value={data.status} className="border py-2 px-4 rounded-3xl">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                </div>
                
                <div className="px-2 space-x-4 mb-4">
                <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>
                <button onClick={(e)=>{e.preventDefault(); setMode(0)}} className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Cancel</button>
                </div>
            </form>
            </div>
        </>
    )
}

const Viewer = ({mode, setMode, data}) => {
    return (
        <>
            <div onClick={()=>setMode(0)} className={`absolute ${mode==1?"":"hidden"} inset-0 p-4 bg-white rounded-xl z-20`}>
                <div className="w-full h-16 font-medium  relative flex text-3xl bg-white p-4 items-center">
                    Branch
                </div>
                <div className=''>
                    
                </div>
            </div>
        </>
    )
}

const AddForm = ({isAdd, setIsAdd}) => {
    return (
        <>
            <div className={`absolute ${isAdd?"":"hidden"} inset-0 p-4 bg-gray-100 rounded-xl z-20`}>
            <div className="w-full h-16 font-medium  relative flex text-3xl bg-white p-4 items-center">
                Create Branch
            </div>
            <form action="" className="w-full flex flex-col bg-white pt-8 px-4">
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="name">Name</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="name" name="name" placeholder="Enter Name" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="phone">Phone</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="phone" name="phone" placeholder="Enter Phone" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="address">Address</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="address" name="address" placeholder="Enter Address" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" className="border py-2 px-4 rounded-3xl">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                </div>
                
                <div className="px-2 space-x-4 mb-4">
                <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>
                <button onClick={(e)=>{e.preventDefault(); setIsAdd(0)}} className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Cancel</button>
                </div>
            </form>
            </div>
        </>
    )
}

const PaymentsData = () => {
    const [isAdd, setIsAdd] = useState(0)
    return (
        <>
            
            <div className="w-full bg-white flex flex-col px-8 py-8 items-center relative">
            <AddForm isAdd={isAdd} setIsAdd={setIsAdd} />
                <div className="w-full h-16  relative flex">
                    <div className="text-2xl">Payments</div>
                    <div onClick={(e)=>{e.preventDefault(); setIsAdd(1)}} className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-0">
                        Add
                    </div>
                </div>
                <div className="w-full ">
                    <Card name="Aditya" hub={"Badda"} email={"aditya"} status={"inactive"}  />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
                
            </div>
        </>
    )
}

const BranchManage_Payments = () => {
  return (
    <div className="w-full flex items-center flex-col p-8 space-y-8">
          
          <Filter/>
          <PaymentsData/>
        </div>
  )
}

export default BranchManage_Payments
