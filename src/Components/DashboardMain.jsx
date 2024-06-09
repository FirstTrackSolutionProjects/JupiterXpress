import DashboardStatement from "./DashboardStatement"
import DashboardSummary from "./DashboardSummary"
const DashboardMain = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <DashboardSummary />
      <DashboardStatement />
    </div>
  )
}

export default DashboardMain
