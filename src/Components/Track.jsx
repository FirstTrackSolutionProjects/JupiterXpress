
const TrackInfo = () => {
  return (
    <>
      <div className="w-1/2 p-4 absolute z-30 bg-white text-black">
        <div className="text-center">YOUR SHIPMENT STATUS:-</div>
        <div>
          
        </div>
      </div>
    </>
  )
}



const Track = ({track, setTrack}) => {
  return (
    <div className={`absolute inset-0 z-20 flex justify-center items-center overflow-hidden transition-all duration-1000 ${track?"w-full":"w-0"} `}>
      {/* <TrackInfo/> */}
      <div className="w-full min-w-[320px] sm:w-[600px] relative bg-blue-100 rounded-xl flex flex-col items-center space-y-5 p-8  text-black sm:min-w-[600px]">
        <div onClick={()=>setTrack(0)} className="absolute top-5 right-5 text-2xl font-medium">
            X
        </div>
        <img src="logo.webp" alt="" />
        <div className="text-lg sm:text-2xl font-medium my-3">
            TRACK YOUR ORDER NOW
        </div>
        <div className="flex justify-evenly w-[200px] font-medium">
            <div className="space-x-2">
            <input checked type="radio" id="awb" name="idType" />
            <label htmlFor="awb">AWB</label>
            </div>
            <div className="space-x-2">
            <input type="radio" id="orderId" name="idType"/>
            <label htmlFor="orderId">OrderId</label>
            </div>
        </div>
        <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <input type="text" name="id" className="border py-2 px-4 sm:rounded-l-xl bg-blue-50" placeholder="Enter Tracking Id" />
            <button className="border py-2 px-4 sm:rounded-r-xl bg-blue-50">Track</button>
        </form>
      </div>
    </div>
  )
}

export default Track
