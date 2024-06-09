


const DashboardSummaryCard = () => {
  return (
    <div className="rounded-xl my-2 w-72 h-32 transition-all flex items-center duration-300 text-[rgba(37,168,229)] font-medium bg-white hover:text-white hover:bg-[rgba(37,168,229,0.8)]">
      <img src="logo.webp" alt=""className="w-24" />
      <div>
        <div>Total Parcel</div>
        <div className="text-4xl">0</div>
      </div>
    </div>
  )
}


const DashboardSummary = () => { 
    return (
        <div className="w-full flex flex-wrap justify-evenly">
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
            <DashboardSummaryCard />
        </div>
    )
}

export default DashboardSummary