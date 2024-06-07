import { Tilt } from "react-tilt"

const ServiceCard = ({color}) => {
  return (
    <Tilt options={{
        max:45,
        scale:1,
        speed:450
      }} className={`w-60 h-62 rounded-2xl flex flex-col items-center bg-${color} p-1`}>
        
      <div className={`w-full h-40 flex justify-center items-center bg-${color} rounded-2xl`}>
                <img src="icons/truck.webp" alt="" className="relative w-24 " />
      </div>
      <div className="w-full h-20 flex text-white font-medium text-xl items-center justify-center">
            E-Commerce delivery
      </div>
    </Tilt>
  )
}

export default ServiceCard
