import { Tilt } from "react-tilt"
const ReasonCard = ({color, title, icon}) => {
  return (
    <Tilt options={{
        max:45,
        scale:1,
        speed:450
      }} className={`rcxs:w-80 w-60 rcxs:h-32 h-24 rounded-2xl flex  items-center ${color} p-1 rcsm:mb-3`}>
        <div className="rcxs:w-[120px] w-[90px] rcxs:h-[120px] h-[90px] rounded-2xl bg-white flex justify-center items-center">
            <img src={`icons/${icon}`} alt="" className="w-[60px] rcxs:w-auto" />
            
        </div>
        <div className="rcxs:w-48 w-36 font-medium text-white rcxs:h-[120px] h-[90px] flex items-center justify-center">
            {title}
        </div>
    </Tilt>
  )
}

export default ReasonCard
