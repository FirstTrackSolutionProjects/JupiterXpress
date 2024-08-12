import { useEffect, useState } from "react";

const DelhiveryCard = ({report, status}) => {
  return (
    <div>
              <p>AWB : {report.awb}</p>
              <p>Ref Id: JUP{report.ref_id}</p>
              <p>Status : {status.Status.Status}</p>
              {
                (status.Scans).map((scan,index)=> {
                  const timestamp = scan.ScanDetail.ScanDateTime;
                  const date = new Date(timestamp);
                  const formattedTimestamp = date.getFullYear() + "-" +
                    String(date.getMonth() + 1).padStart(2, '0') + "-" +
                    String(date.getDate()).padStart(2, '0') + " " +
                    String(date.getHours()).padStart(2, '0') + ":" +
                    String(date.getMinutes()).padStart(2, '0');
                  return (
                  <div>{formattedTimestamp} | {scan.ScanDetail.ScannedLocation} | {scan.ScanDetail.Instructions} </div>
                  )
              })
              }
            </div>
  )
}

const MovinCard = ({report, status}) => {
  return (
    <div>
              <p>AWB : {report.awb}</p>
              { status.length  ?
                (status).map((scan,index)=> {
                  <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.timestamp}</div>
                <div className="absolute right-8 cursor-pointer">{scan.package_status}</div>
            </div> 
              }) : "Shipment is not yet picked up"
              }
            </div>
  )
}

const View  = ({report, setIsView}) => {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    
    const getReport = async () => {
      const response = await fetch('/.netlify/functions/getReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ref_id: report.ref_id, serviceId: report.serviceId, categoryId : report.categoryId })
      })
      const data = await response.json();
      setStatus(data.data);
      console.log(report);
    }
    getReport();
  },[])
  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
          <div className="bg-white p-4  border">
            <div onClick={()=>setIsView(false)}>X</div>
            {
              status ? report.serviceId == 1 ? <DelhiveryCard report={report} status={status}/> : <MovinCard report={report} status={status}/> : "Loading..."
            }
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
      <div className="w-full h-16 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div><div>{report.ord_id}</div><div>JUP{report.ref_id}</div></div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
        {report.status}
        <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsView(true)}>View</div>
        </div>
      </div>
    </>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([])
  useEffect(() => {

      fetch('/.netlify/functions/getReports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              result.rows.sort((a,b) => parseInt(a.ref_id) - parseInt(b.ref_id)).reverse();
              setReports(result.rows);
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
const NDR = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <Listing/>
    </div>
  )
}

export default NDR
