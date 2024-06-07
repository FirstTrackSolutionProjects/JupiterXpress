
const Track = ({track, setTrack}) => {
  return (
    <div className={`absolute inset-0 z-20 flex justify-center items-center overflow-hidden transition-all duration-1000 ${track?"w-full":"w-0"} `}>
      <div className="w-full min-w-[320px] sm:w-[600px] relative bg-white rounded-xl flex flex-col items-center space-y-5 p-8  text-black sm:min-w-[600px]">
        <div onClick={()=>setTrack(0)} className="absolute top-5 right-5 text-2xl font-medium">
            X
        </div>
        <img src="logo.webp" alt="" />
        <div className="text-lg sm:text-2xl font-medium my-3">
            TRACK YOUR ORDER NOW
        </div>
        <div className="flex justify-evenly text-md sm:text-xl w-[200px] font-medium">
            <div>
            <input checked type="radio" id="awb" name="idType" />
            <label htmlFor="awb">AWB</label>
            </div>
            <div>
            <input type="radio" id="orderId" name="idType"/>
            <label htmlFor="orderId">OrderId</label>
            </div>
        </div>
        <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <input type="text" name="id" className="border py-2 px-4 sm:rounded-l-xl" placeholder="Enter Tracking Id" />
            <button className="border py-2 px-4 sm:rounded-r-xl">Track</button>
        </form>
      </div>
    </div>
  )
}

export default Track
