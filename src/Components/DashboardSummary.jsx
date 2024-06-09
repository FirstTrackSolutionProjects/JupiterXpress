


const DashboardSummaryCard = () => {
  return (
    <div className="rounded-xl flex-1 m-2  min-w-64 h-32 transition-all flex items-center duration-300 text-[rgba(37,168,229)] font-medium bg-white hover:text-white hover:bg-[rgba(37,168,229,0.8)]">
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
        <div className="w-full max-w-[1220px] flex flex-wrap justify-center px-4">
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