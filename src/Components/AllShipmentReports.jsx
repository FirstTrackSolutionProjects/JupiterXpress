import { useEffect, useState } from "react";

const View  = ({ord_id, setIsView}) => {
  return (
    <>
      <div className="absolute inset-0 flex z-50 justify-center items-center">
          <div className="bg-white">
            <div onClick={()=>setIsView(false)}>X</div>
            {ord_id}
          </div>
      </div>
      
    </>
  )
}

const Card = ({ report }) => {
  const [view, setIsView] = useState(false)
  return (
    <>
      {view && <View {...report} setIsView={setIsView}/>}
      <div className="w-full h-16 bg-white relative items-center px-4 sm:px-8 flex border-b">
        <div><div>JUP{report.ref_id}<span className="text-gray-500">({report.ord_id})</span> </div><div className="text-[10px] text-gray-500">{report.fullName}</div><div className="text-[10px] text-gray-500">{report.email}</div></div>
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
  const [email, setEmail] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);
  useEffect(() => {

      fetch('/.netlify/functions/getAllReports', {
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
