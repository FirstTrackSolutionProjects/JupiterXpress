import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"


const DashboardSummaryCard = ({title, number}) => {
  return (
    <div className="rounded-xl flex-1 m-2  min-w-64 h-32 transition-all flex items-center duration-300 text-[rgba(37,168,229)] font-medium bg-white hover:text-white hover:bg-[rgba(37,168,229,0.8)]">
      <img src="logo.webp" alt=""className="w-24" />
      <div>
        <div>{title}</div>
        <div className="text-xl">{number}</div>
      </div>
    </div>
  )
}


const DashboardSummary = () => { 
  const [summary, setSummary] = useState(null)
  useEffect(() => {
      const getStatistics = async () => {
        await fetch(`/.netlify/functions/getStatistics`, {
          method: 'GET',
          headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        }).then(response => response.json()).then(response => setSummary(response));
      }
      getStatistics()
  },[])
    return (
        <div className="w-full max-w-[1220px] flex flex-wrap justify-center px-4">
            <DashboardSummaryCard title="Total Warehouses" number={summary?summary.warehouse:0} />
            <DashboardSummaryCard title="Total Shipments" number={summary?summary.shipment:0} />
            <DashboardSummaryCard title="Total Delivered" number="3" />
            <DashboardSummaryCard title="Total Undelivered" number="2" />
            <DashboardSummaryCard title={jwtDecode(localStorage.getItem('token')).admin?`Total Revenue`:`Total Expense`} number="₹1563" />
            <DashboardSummaryCard title="Parcel on process" number="4" />
            <DashboardSummaryCard title="Returning parcels" number="1" />
            <DashboardSummaryCard title="NDR Parcels" number="1" />
        </div>
    )
}

export default DashboardSummary