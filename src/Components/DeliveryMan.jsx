import {useState} from 'react'

const Card = (profile) => {
    const [isEdit, setIsEdit] = useState(0)
    return (
        <>
            <div className="w-full py-4 space-x-4 border relative flex items-center px-3">
                        <img src="user.webp" alt="" className="h-14 w-14 rounded-full overflow-hidden border" />
                        <div>
                            <p>{profile.name}</p>
                            <p>{profile.email}</p>
                            <p>{profile.hub}</p>
                        </div>
                        <div className='absolute right-3 flex flex-col justify-evenly'>
                            <button onClick={()=>setIsEdit(1)} className="px-2 py-0 border rounded-3xl bg-blue-500 text-white">Edit</button>
                            <button onClick={()=>setIsEdit(1)} className="px-2 py-0 border rounded-3xl bg-red-500 text-white">Delete</button>
                        </div>
                    </div>
                <EditForm isEdit={isEdit} setIsEdit={setIsEdit} profile={profile} />
        </>
    )
}

const Filter  = () => {
    return (
        <>
            <form className="w-full min-h-16 bg-white flex px-8 py-16  items-center rounded-xl flex-wrap">
                <input type="text" className="border px-4 py-2 rounded-3xl flex-1 mx-2 mb-2" placeholder="Name"/>
                <input type="text" className="border px-4 py-2 rounded-3xl flex-1 mx-2 mb-2" placeholder="Email"/>
                <input type="text" className="border px-4 py-2 rounded-3xl flex-1 mx-2 mb-2" placeholder="Phone"/>
                <div className=" flex justify-center mx-2 mb-2 space-x-2">
                    <button className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Clear</button>
                    <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Filter</button>
                </div>
            </form>
        </>
    )
}

const AddForm = ({isAdd, setIsAdd}) => {
    return (
        <>
            <div className={`absolute ${isAdd?"":"hidden"} inset-0 p-4 bg-gray-100 rounded-xl z-20`}>
            <div className="w-full h-16 font-medium  relative flex text-3xl bg-white p-4 items-center">
                Create Delivery Man
            </div>
            <form action="" className="w-full flex flex-col bg-white pt-8 px-4">
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="name">Name</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="name" name="name" placeholder="Enter Name" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="email">Email</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="email" id="email" name="email" placeholder="Enter Email" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="phone">Phone</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="phone" name="phone" placeholder="Enter Phone" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="deliveryCharge">Delivery Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="deliveryCharge" name="deliveryCharge" placeholder="Enter Delivery Charge" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="returnCharge">Return Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="returnCharge" name="returnCharge" placeholder="Enter Return Charge" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pickupCharge">Pickup Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="pickupCharge" name="pickupCharge" placeholder="Enter Pickup Charge" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="openingBalance">Opening Balance</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="openingBalance" name="openingBalance" placeholder="Enter openingBalance" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="password">Password</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="password" id="password" name="password" placeholder="Enter Password" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="salary">Salary</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="salary" name="salary" placeholder="Enter Salary" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" className="border py-2 px-4 rounded-3xl">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="hub">Hub</label>
                    <select name="hub" id="hub" className="border py-2 px-4 rounded-3xl">
                        <option value="badda">Badda</option>
                    </select>
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="drivingLicense">Driving License</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="drivingLicense" name="drivingLicense" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="photo">Photo</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="photo" name="photo" placeholder="Upload Photo" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="address">Address</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" id="address" name="address" placeholder="Enter Address" />
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

const EditForm = ({isEdit, setIsEdit, profile}, ) => {
    return (
        <>
            <div className={`absolute ${isEdit?"":"hidden"} inset-0 p-4 bg-gray-100 rounded-xl z-20`}>
            <div className="w-full h-16 font-medium  relative flex text-3xl bg-white p-4 items-center">
                Create Delivery Man
            </div>
            <form action="" className="w-full flex flex-col bg-white pt-8 px-4">
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="name">Name</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.name} id="name" name="name" placeholder="Enter Name" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="email">Email</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="email" value={profile.email} id="email" name="email" placeholder="Enter Email" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="phone">Phone</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.phone} id="phone" name="phone" placeholder="Enter Phone" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="deliveryCharge">Delivery Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.deliveryCharge} id="deliveryCharge" name="deliveryCharge" placeholder="Enter Delivery Charge" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="returnCharge">Return Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.returnCharge} id="returnCharge" name="returnCharge" placeholder="Enter Return Charge" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="pickupCharge">Pickup Charge</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.pickupCharge} id="pickupCharge" name="pickupCharge" placeholder="Enter Pickup Charge" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="openingBalance">Opening Balance</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.openingBalance} id="openingBalance" name="openingBalance" placeholder="Enter openingBalance" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="password">Password</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="password" value={profile.password} id="password" name="password" placeholder="Enter Password" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="salary">Salary</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.salary} id="salary" name="salary" placeholder="Enter Salary" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" value={profile.status} className="border py-2 px-4 rounded-3xl">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
                    <label htmlFor="hub">Hub</label>
                    <select name="hub" id="hub" value={profile.hub} className="border py-2 px-4 rounded-3xl">
                        <option value="badda">Badda</option>
                    </select>
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="drivingLicense">Driving License</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="drivingLicense" name="drivingLicense" placeholder="Upload Driving License" />
                </div>
                </div>
                <div className="w-full flex mb-2 flex-wrap ">
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="photo">Photo</label>
                    <input className="w-full border leading-8  rounded-3xl " type="file" id="photo" name="photo" placeholder="Upload Photo" />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
                    <label htmlFor="address">Address</label>
                    <input className="w-full border py-2 px-4 rounded-3xl" type="text" value={profile.address} id="address" name="address" placeholder="Enter Address" />
                </div>
                </div>
                <div className="px-2 space-x-4 mb-4">
                <button className="px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>
                <button onClick={(e)=>{e.preventDefault(); setIsEdit(0)}} className="px-5 py-1 border rounded-3xl bg-red-500 text-white">Cancel</button>
                </div>
            </form>
            </div>
        </>
    )
}

const DeliveryManData = () => {
    const [isAdd, setIsAdd] = useState(0)
    return (
        <>
            
            <div className="w-full bg-white flex flex-col px-8 py-8 items-center relative">
            <AddForm isAdd={isAdd} setIsAdd={setIsAdd} />
                <div className="w-full h-16  relative flex">
                    <div className="text-2xl">Delivery Man</div>
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

const DeliveryMan = () => {
    
  return (
    <div className="w-full flex items-center flex-col p-8 space-y-8">
      
      <Filter/>
      <DeliveryManData />
    </div>
  )
}

export default DeliveryMan
