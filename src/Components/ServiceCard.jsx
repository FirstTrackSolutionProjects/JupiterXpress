import { Tilt } from "react-tilt"

const ServiceCard = ({color, title, icon}) => {
  return (
    <Tilt options={{
        max:45,
        scale:1,
        speed:450
      }} className={` w-56 h-62 rounded-2xl flex flex-col items-center ${color} p-1`}>
        
      <div className={`w-full h-40 flex justify-center items-center ${color} rounded-2xl`}>
                <img src={`icons/${icon}`} alt="" className="relative w-24 " />
      </div>
      <div className="w-full h-20 flex text-white font-medium text-xl items-center justify-center text-center">
            {title}
      </div>
    </Tilt>
  )
}

export default ServiceCard
