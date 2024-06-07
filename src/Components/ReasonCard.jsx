import { Tilt } from "react-tilt"
const ReasonCard = () => {
  return (
    <Tilt options={{
        max:45,
        scale:1,
        speed:450
      }} className="w-80 h-32 rounded-2xl flex  items-center bg-blue-300 p-1">
        <div className="w-[120px] h-[120px] rounded-2xl bg-white flex justify-center items-center">\
            <img src="icons/timely.webp" alt="" />
            
        </div>
        <div className="w-48 font-medium text-white text-xl h-[120px] flex items-center justify-center">
            FAST DELIVERY
        </div>
    </Tilt>
  )
}

export default ReasonCard
