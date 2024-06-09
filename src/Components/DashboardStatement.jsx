const DashboardStatementCard = () => {
    return (
        <>
            <div className=" min-w-[370px] flex-1 m-2 bg-white border">
                <div className="h-14 border-b justify-center flex items-center">Delivery Man Statements</div>
                <div className="relative px-4 border-b h-14 border flex items-center">Income <div className="absolute right-4">₹0</div></div>
                <div className="relative px-4 border-b h-14 border flex items-center">Expense <div className="absolute right-4">₹0</div></div>
                <div className="relative px-4 border-b h-14 border flex items-center">Balance <div className="absolute right-4">₹0 </div></div>
            </div>
        </>
    )
}

const DashboardStatement = () => {
  return (
    <div className="flex flex-col flex-wrap px-4 lg:flex-row w-full max-w-[1220px] justify-evenly font-medium">
      <DashboardStatementCard />
      <DashboardStatementCard />
      <DashboardStatementCard />
    </div>
  )
}

export default DashboardStatement
