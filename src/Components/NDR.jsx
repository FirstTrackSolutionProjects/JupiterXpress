import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedTimestamp = date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, '0') + "-" +
    String(date.getDate()).padStart(2, '0') + " " +
    String(date.getHours()).padStart(2, '0') + ":" +
    String(date.getMinutes()).padStart(2, '0');
  return formattedTimestamp;
}


const DelhiveryStatusCard = ({ report, status }) => {
  return (
    <div>
      <p>AWB : {report.awb}</p>
      <p>Ref Id: JUP{report.ref_id}</p>
      <p>Status : {status.Status.Status}</p>
      {
        (status.Scans).map((scan, index) => {
          const timestamp = scan.ScanDetail.ScanDateTime;
          const formattedTimestamp = timestampToDate(timestamp);
          return (
            <div>{formattedTimestamp} | {scan.ScanDetail.ScannedLocation} | {scan.ScanDetail.Instructions} </div>
          )
        })
      }
    </div>
  )
}

const MovinStatusCard = ({ report, status }) => {
  return (
    <div className="flex flex-col">
      <p className="mt-5">AWB : {report.awb}</p>
      {status.scans?.length ? <p className="mb-5">Currently At : {status?.latestLocation}</p> : null}
      {status.scans?.length ?
        (status.scans).reverse().map((scan, index) => {
          const date = scan.timestamp
          const formattedTimestamp = timestampToDate(date);
          return (
            <div className="flex space-x-5">
              <div>{formattedTimestamp}</div>
              <div>{scan.package_status}</div>
            </div>
          )
        }) : "Shipment is not yet picked up"
      }
    </div>
  )
}

const ShipRocketStatusCard = ({ report, status }) => {
  return (
    <div className="flex flex-col">
      <p className="mt-5">AWB : {report.awb}</p>

      {status.length ?
        (status).reverse().map((scan, index) => {
          const date = scan.timestamp
          const formattedTimestamp = timestampToDate(date);
          return (
            <div>{formattedTimestamp} | {scan.location} | {scan.remarks} </div>
          )
        }) : "Shipment is not yet picked up"
      }
    </div>
  )
}

const View = ({ report, setIsView }) => {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {

    const getReport = async () => {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/shipment/domestic/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ref_id: report.ref_id, serviceId: report.serviceId, categoryId: report.categoryId })
      }).then(response => response.json()).then(result => {
        if (result.success) {
          setStatus(result.data || [])
        }
        setIsLoading(false)
      })
      setIsLoading(false)
    }
    getReport();
  }, [])
  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
        <div className="bg-white p-4  border">
          <div onClick={() => setIsView(false)}>X</div>
          {
              isLoading? <div>Loading...</div> : null
          }
          {
            status && report.serviceId == 1 ? <DelhiveryStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 2 ? <MovinStatusCard report={report} status={status} /> : null
          }
          {
            status && report.serviceId == 3 ? <ShipRocketStatusCard report={report} status={status} /> : null
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
      {view && <View report={report} setIsView={setIsView} />}
      <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div>
          <div className="text-sm font-bold">
            JUP{report.ref_id}
            <span className="text-gray-500">({report.ord_id})</span>
          </div>
          <div className="text-[10px] text-gray-500">
            {report.customer_name}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.awb}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.date ? report.date.toString().split('T')[0] + ' ' + report.date.toString().split('T')[1].split('.')[0] : null}
          </div>
        </div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
          {report.status}
          <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={() => setIsView(true)}>View</div>
        </div>
      </div>
    </>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([])
  useEffect(() => {

    fetch(`${API_URL}/shipment/domestic/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          result.rows.sort((a, b) => parseInt(a.ref_id) - parseInt(b.ref_id)).reverse();
          setReports(result.rows);
        } else {
          alert('Fetch failed: ' + result.message)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during fetching reports');
      });
  }, []);
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
      <Listing />
    </div>
  )
}

export default NDR
