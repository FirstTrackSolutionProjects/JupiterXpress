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
            prices.length ? <><div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
            <div>{prices[0]?.name+" "+prices[0]?.weight}</div>
            <div className="absolute right-4">{`${Math.round((prices[0]?.price))}`}</div>
          </div> 
          <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
          <div>{prices[1]?.name+" "+prices[1]?.weight}</div>
          <div className="absolute right-4">{`${Math.round((prices[1]?.price))}`}</div>
        </div></>: null
          }
          
        </div>
      </div>
    </>
  )
}


const PriceCalc = () => {
  
  const [formData, setFormData] = useState({
    method : 'S',
    status: 'DTO',
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
      
      <div className="pt-16 relative">
      {showCompare && <ComparePrices {...formData} />}
      <div className="w-full p-8 flex flex-col items-center space-y-6">
        <div className="text-center text-3xl font-medium mb-8">
          Calculate your shipping price
        </div>
        <form action="" className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="method">Shipping Method</label>
              <select
                name="method"
                id="method"
                className="border py-2 px-4 rounded-3xl"
                value={formData.method}
                onChange={handleChange}
              >
                <option value="S">Surface</option>
                <option value="E">Express</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                className="border py-2 px-4 rounded-3xl"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Delivered">Delivered</option>
                <option value="RTO">RTO</option>
                <option value="DTO">DTO</option>
              </select>
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
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
                <option value="REPL">REPL</option>
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
              <label htmlFor="length">Length (in cm)</label>
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
              <label htmlFor="breadth">Breadth (in cm)</label>
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
              <label htmlFor="height">Height (in cm)</label>
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
      </div>
      </div>
    </>
  );
};

export default PriceCalc
