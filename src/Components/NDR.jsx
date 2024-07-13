import { useEffect, useState } from "react";

const View  = ({ord_id, setIsView}) => {
  return (
    <>
      <div className="absolute inset-0 flex z-50 justify-center items-center">
          <div className="bg-white p-4">
            <div onClick={()=>setIsView(false)}>X</div>
            {ord_id}
          </div>
      </div>
      
    </>
  )
}

const Card = ({ report }) => {
  const [fullReport, setFullReport] = useState({
    report : report,
    status : null
  })
  useEffect(() => {
    const getReport = async () => {
      const response = await fetch('/.netlify/functions/getReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ord_id: report.ord_id, serviceId: report.serviceId, categoryId : report.categoryId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setFullReport({...fullReport, status : data.message});
    }
  },[])
  const [view, setIsView] = useState(false)
  return (
    <>
      {view && <View {...report} setIsView={setIsView}/>}
      <div className="w-full h-16 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div><div>{report.ord_id}</div><div>{report.ref_id}</div></div>
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
