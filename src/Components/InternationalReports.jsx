import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL

const WorldFirstCourierTrackingCard = ({ scan }) => {
    return (
        <>
            <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
                <div className='flex flex-col items-center justify-center'>
                    <div className='font-bold'>{scan?.Status}</div>
                    <div>{scan.Location}</div>
                    <div>{scan.EventDate1} {scan.EventTime1}</div>
                </div>
            </div>
        </>
    )
}

const FlightGoCard = ({ scan }) => {
    return (
        <>
            <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
                <div>{scan.event_at}</div>
                <div>{scan.event_location}</div>
                <div>{scan.event_description}</div>
            </div>
        </>
    )
}

const QuickShipNowCard = ({ scan }) => {
    return (
        <>
            <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
                <div>{scan.event_at}</div>
                <div>{scan.event_location}</div>
                <div>{scan.event_description}</div>
            </div>
        </>
    )
}

const QuickShipNow2Card = ({ scan }) => {
    return (
        <>
            <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
                <div>{scan.event_at}</div>
                <div>{scan.event_location}</div>
                <div>{scan.event_description}</div>
            </div>
        </>
    )
}

const DillikingCard = ({ scan }) => {
    const date = scan.event_date;
    const time = scan.event_time;
    const formattedDate = `${date.substr(0,4)}/${date.substr(4,2)}/${date.substr(6,2)}`
    const formattedTime = `${time.substr(0,2)}:${time.substr(2,2)}`
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan.remark}</div>
                <div>{scan.location}</div>
                <div>{`${formattedDate} ${formattedTime}`}</div>
            </div>
        </div>
    </>
    )
}

const View  = ({report, setIsView}) => {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    
    const getReport = async () => {
      const response = await fetch(`${API_URL}/shipment/international/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ awb : report.awb })
      })
      const data = await response.json();
      setStatus(data.track);
    }
    getReport();
  },[])
  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
          <div className="bg-white p-4  border">
            <div onClick={()=>setIsView(false)}>X</div>
            {report?.service == 7 ? 
                status?.[0]?.docket_events?.map((scan, index) => (
                    <FlightGoCard key={index} scan={scan} />
                ))
            :null}
            {report?.service == 8 ?
                status?.length ? status?.map((scan, index) => (
                    <DillikingCard key={index} scan={scan} />
                )) : <div>No Tracking Events Available</div>
            :null}
            {report?.service == 11 ?
                status?.length ? status?.map((scan, index) => (
                    <WorldFirstCourierTrackingCard key={index} scan={scan} />
                )) : <div>No Tracking Events Available</div>
            :null}
            {report?.service == 12 ?
                status?.[0]?.docket_events?.map((scan, index) => (
                    <QuickShipNowCard key={index} scan={scan} />
                ))
            :null}
            {report?.service == 13 ?
                status?.[0]?.docket_events?.map((scan, index) => (
                    <QuickShipNow2Card key={index} scan={scan} />
                ))
            :null}
            {!status ? <div>Loading...</div> : null}
          </div>
      </div>
      
    </>
  )
}

const Card = ({ report }) => {
  
  
  const [view, setIsView] = useState(false)
  return (
    <>
      {view && <View report={report} setIsView={setIsView}/>}
      <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
      <div className="text-[10px] text-gray-500">
          <div className="text-sm font-bold text-black">{report.ref_id} <span className="text-gray-500">{`(${report.iid})`}</span></div>
          {
            report.isAdmin? <><div >{report.fullName}</div>
            <div> {report.email}</div>
            <div> {report.awb?`AWB : ${report.awb}`:null}</div>
            </> : 
            <><div >{report.consignee_name}</div></>
          } 
            <div>{report.date ? report.date.toString().split('T')[0] + ' ' + report.date.toString().split('T')[1].split('.')[0] : null}</div>
          </div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
        {/* {report.status} */}
        <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsView(true)}>View</div>
        </div>
      </div>
    </>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([])
  useEffect(() => {

      fetch(`${API_URL}/shipment/international/all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              result.order.sort((a,b) => a.date - b.date).reverse();
              setReports(result.order);
            } else {
              alert('Fetch failed: ' + result.message)
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during fetching reports');
          });
  },[]);
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">SHIPMENT REPORTS</div>
        </div>
        <div className="w-full">
        
          {reports.map((report, index) => (
            <Card key={index} report={report} />
          ))}
        </div>
      </div>
    </>
  );
};
const InternationalReports = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <Listing/>
    </div>
  )
}

export default InternationalReports
