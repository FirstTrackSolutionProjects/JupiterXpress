import { useState, useEffect } from "react";


const ComparePrices = ({method, status, origin, dest, weight, payMode, codAmount, height, breadth, length}) => {
  const [prices,setPrices] = useState([])
  useEffect(()=>{
    console.log({method, status, origin, dest, weight, payMode, codAmount})
    const data = async () => {
      await fetch(`/.netlify/functions/price`, {
        method: 'POST',
        headers: { 'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': 'Token 2e80e1f3f5368a861041f01bb17c694967e94138',
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"
        },
          body : JSON.stringify({method: method, status : status, origin : origin, dest : dest, weight : weight, payMode : payMode, codAmount : codAmount, length, breadth, height}),
        
      }).then(response => response.json()).then(result => {console.log(result); setPrices(result.prices)}).catch(error => console.log(error + " " + error.message))
    }  
    data()
  }, []) 
  return (
    <>
      <div className="w-full absolute inset-0 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="text-center text-3xl font-medium">
          CHOOSE YOUR SERVICE
        </div>
        <div className="w-full p-4 ">
          {
            prices.length ? prices.map((price)=>(
              <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
          <div>{price.name+" "+price.weight}</div>
          <div className="absolute right-4">{`${Math.round((price.price))}`}</div>
        </div>
            ))
          : null
          }
          
        </div>
      </div>
    </>
  )
}


const Domestic = () => {
  const [formData, setFormData] = useState({
    method : 'S',
    status: 'Delivered',
    origin : '',
    dest : '',
    weight : '',
    payMode : 'COD',
    codAmount : '0',
    length : '',
    breadth : '',
    height : '',
  })
  const [showCompare, setShowCompare] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCompare(true)
  }
  return (
    <>
      {showCompare && <ComparePrices {...formData} />}
      <form action="" className=" text-sm bg-transparent flex flex-col max-w-[724px] space-y-4" onSubmit={handleSubmit}>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2  space-y-2 flex flex-col justify-center">
              <label htmlFor="method">Shipping Method</label>
              <select
                name="method"
                id="method"
                className="border py-2 px-4 rounded-3xl text-sm"
                value={formData.method}
                onChange={handleChange}
              >
                <option value="S">Surface</option>
                <option value="E">Express</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2  space-y-2 flex flex-col justify-center">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                className="border py-2 px-4 rounded-3xl"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Delivered">Forward</option>
                <option value="RTO">RTO</option>
                <option value="DTO">Reverse</option>
              </select>
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2  space-y-2">
              <label htmlFor="origin">Origin Pincode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="origin"
                name="origin"
                placeholder="Ex. 813210"
                value={formData.origin}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2  space-y-2">
              <label htmlFor="dest">Destination Pincode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="dest"
                name="dest"
                placeholder="Ex. 845401"
                value={formData.dest}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="weight">Weight (In grams)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="weight"
                name="weight"
                placeholder="Ex. 1500"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="payMode">Payment Mode</label>
              <select
                name="payMode"
                id="payMode"
                className="border py-2 px-4 rounded-3xl"
                value={formData.payMode}
                onChange={handleChange}

              >
                <option value="COD">COD</option>
                <option value="Pre-paid">Prepaid</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="codAmount">COD Amount</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="codAmount"
                name="codAmount"
                placeholder="Ex. 157"
                value={formData.codAmount}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] flex">
            <div className="flex-1 mx-2 mb-2 min-w-[90px] space-y-2">
              <label htmlFor="length">L (in cm)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="length"
                name="length"
                placeholder="Ex. 2.5"
                value={formData.length}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[90px] space-y-2">
              <label htmlFor="breadth">B (in cm)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="breadth"
                name="breadth"
                placeholder="Ex. 2.5"
                value={formData.breadth}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[90px] space-y-2">
              <label htmlFor="height">H (in cm)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="height"
                name="height"
                placeholder="Ex. 2.5"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            </div>
            </div>
            <button type="submit" className="border bg-white mx-2  py-2 px-4 rounded-3xl">
              Submit and Compare
            </button>
        </form>
    </>
  )
}




const LandingCalc = () => {
  return (
    <>
      
      <div className="w-full p-5  items-center">
        <div className="bg-blue-200 p-5 rounded-md">
        <div className="border-2 bg-blue-100  border-white rounded-md p-2">
        <Domestic className="" />
        </div>
        
      </div>
      </div>
    </>
  );
};

export default LandingCalc;
