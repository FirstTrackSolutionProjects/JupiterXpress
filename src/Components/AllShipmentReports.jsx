import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL
const View  = ({report, setIsView}) => {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    
    const getReport = async () => {
      const response = await fetch(`${API_URL}/getReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ref_id: report.ref_id, serviceId: report.serviceId, categoryId : report.categoryId }),
      })
      const data = await response.json();
      setStatus(data.data);
    }
    getReport();
  },[])
  return (
    <>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex z-50 justify-center items-center">
          <div className="bg-white p-4  border">
            <div onClick={()=>setIsView(false)}>X</div>
            {
              status ? <div>
              <p>AWB : {report.awb}</p>
              <p>Ref Id: JUP{report.ref_id}</p>
              <p>{status.Status.Status}</p>
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
            </div> : "Loading..."
            }
          </div>
      </div>
      
    </>
  )
}

const Card = ({ report }) => {
  const [view, setIsView] = useState(false)
  const [isCancelled, setIsCancelled] = useState(report.cancelled?true:false)
  const [isShipped, setIsShipped] = useState(report.awb?true:false)
  const cancelShipment = async () => {
    const cancel = confirm('Do you want to cancel this shipment?');
    if (!cancel) return;
    await fetch(`${API_URL}/cancelShipment`, {
      method : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body : JSON.stringify({order : report.ord_id})
    }).then(response => response.json()).then(async result => {
      if (result.message.status){
        setIsCancelled(true)
        alert(result.message.remark)
      }
      else{
        alert("Your shipment has not been cancelled")
        console.log(result.message)
      }
    })
  }
  return (
    <>
      {view ? <View report={report} setIsView={setIsView}/> : null}
      <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div>
          <div className="text-sm font-bold">
            JUP{report.ref_id}
            <span className="text-gray-500">({report.ord_id})</span>
          </div>
          <div className="text-[10px] text-gray-500">
            {report.fullName}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.email}
          </div>
          <div className="text-[10px] text-gray-500">
            {report.date?report.date.toString().split('T')[0]+' '+report.date.toString().split('T')[1].split('.')[0]:null}
          </div>
        </div>
        <div className="absolute right-4 sm:right-8 flex space-x-2">
        {report.status}
        <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsView(true)}>View</div>
    
        {isShipped && !isCancelled ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" onClick={()=>cancelShipment()}>Cancel</div> : null}
        {isCancelled ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" >Cancelled</div> : null}
        </div>
      </div>
    </>
  );
};

const Listing = () => {
  const [reports, setReports] = useState([])
  const [email, setEmail] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);
  useEffect(() => {

      fetch(`${API_URL}/getAllReports`, {
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
              setFilteredReports(result.rows);
              
            } else {
              alert('Fetch failed: ' + result.message)
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during fetching reports');
          });
  },[]);
  const handleEmailChange = (e) => {
    const query = e.target.value;
    setEmail(query);
}
useEffect(()=>{
    if (email==""){
        setFilteredReports(reports)
        return;
    }
    const filtered = reports.filter(report => 
        ((report.email).startsWith(email))
      );
  
      setFilteredReports(filtered);
      console.log(filtered)
},[email])
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">SHIPMENT REPORTS</div>
        </div>
        <div className="flex space-x-4">
      <input
        type="email"
        placeholder="Merchant Email"
        value={email}
        onChange={handleEmailChange}
      />
    </div>
        <div className="w-full">
        
          {(filteredReports).map((report, index) => (
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
