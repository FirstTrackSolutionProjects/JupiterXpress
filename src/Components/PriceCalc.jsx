import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_APP_API_URL
const ComparePrices = ({method, status, origin, dest, weight, payMode, codAmount, volume, quantity, boxes, setShowCompare, invoiceAmount}) => {
  const [prices,setPrices] = useState([])
  useEffect(()=>{
    console.log({method, status, origin, dest, weight, payMode, codAmount, volume, quantity, boxes})
    const data = async () => {
      await fetch(`${API_URL}/shipment/domestic/price`, {
        method: 'POST',
        headers: { 'Accept': '*/*',
          'Content-Type': 'application/json'
        },
          body : JSON.stringify({method: method, status : status, origin : origin, dest : dest, weight : weight, payMode : payMode, codAmount : codAmount,volume, quantity, boxes, invoiceAmount, priceCalc: true}),
        
      }).then(response => response.json()).then(result => {console.log(result); setPrices(result.prices)}).catch(error => console.log(error + " " + error.message))
    }  
    data()
  }, []) 
  return (
    <>
      <div className="w-full absolute z-[1] inset-0 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="text-center relative w-full">
          <div className="absolute right-5 text-2xl cursor-pointer" onClick={()=>setShowCompare(false)}>x</div>
          <p className="text-3xl font-medium">CHOOSE YOUR SERVICE</p>
        </div>
        <div className="w-full p-4 ">
          {
            prices.length ? prices.map((price)=>(
              <div className="w-full h-16 bg-white relative justify-center px-4 flex flex-col border-b" >
          <div className="font-bold">{price.name+" "+price.weight}</div>
          <div>{"Chargable Weight : "+price.chargableWeight}gm</div>
          <div className="absolute right-4">{`₹${Math.round((price.price))}`}</div>
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
  const [boxes, setBoxes] = useState([{weight : 100, length : 5, breadth : 5, height : 5}])
  const [formData, setFormData] = useState({
    method : 'S',
    status: 'Delivered',
    origin : '',
    dest : '',
    payMode : 'COD',
    codAmount : '0',
    weight : 0,
    volume : 0,
    quantity : 0,
    invoiceAmount : 0,
    // isB2B : false
  })
  useEffect(()=>{
    let totalVolume = 0;
    let totalWeight = 0;
    boxes.map((box,index)=>{
        totalVolume += parseFloat(box.length) * parseFloat(box.breadth) * parseFloat(box.height)
        totalWeight += parseFloat(box.weight)
    })
    setFormData((prevData) => ({
     ...prevData,
      weight : totalWeight,
      volume : totalVolume,
      quantity : boxes.length
    }));
  },[boxes])
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
    const { origin, dest, payMode, codAmount, invoiceAmount } = formData;
    if (!origin ||!dest ||!payMode) {
      toast.error('Please fill all the required fields');
      return;
    }
    if (payMode == 'COD' && codAmount <=0){
      toast.error('COD amount should be greater than zero');
      return;
    }
    if (invoiceAmount <= 0){
      toast.error('Invoice amount should be greater than zero');
      return;
    }
    setShowCompare(true)
  }
  const handleBoxes = (index, event) => {
    const { name, value } = event.target;
    const updatedBoxes = [...boxes];
    updatedBoxes[index][name] = value;
    setBoxes(updatedBoxes);
  };
  const addBox = () => {
    setBoxes([...boxes, {  length: 5 , breadth : 5 , height : 5  , weight: 100 }]);
  };
  const removeBox = (index) => {
    const updatedBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(updatedBoxes);
  };
  return (
    <>
      {showCompare && <ComparePrices {...formData} boxes={boxes} setShowCompare={setShowCompare} />}
      <form action="" className="flex flex-col max-w-[724px] space-y-4" onSubmit={handleSubmit}>
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
              <label htmlFor="payMode">Payment Mode</label>
              <select required
                name="payMode"
                id="payMode"
                className="border py-2 px-4 rounded-3xl"
                value={formData.payMode}
                onChange={handleChange}

              >
                <option value="COD">COD</option>
                <option value="Pre-paid">Prepaid</option>
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="invoiceAmount">Invoice Amount</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="invoiceAmount"
                name="invoiceAmount"
                placeholder="Ex. 157"
                value={formData.invoiceAmount}
                onChange={handleChange}
              />
            </div>
          </div>
          {boxes.map((box,index)=>(
            <>
              <div className="w-full relative z-0 flex mb-2 flex-wrap ">
              <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="weight">Weight (In grams)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="weight"
                name="weight"
                min={50}
                placeholder="Ex. 1500"
                value = {box.weight}
                onChange={(e)=>handleBoxes(index,e)}
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
                min={1}
                placeholder="Ex. 2.5"
                value={box.length}
                onChange={(e)=>handleBoxes(index,e)}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[90px] space-y-2">
              <label htmlFor="breadth">B (in cm)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="breadth"
                name="breadth"
                min={1}
                placeholder="Ex. 2.5"
                value={box.breadth}
                onChange={(e)=>handleBoxes(index,e)}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[90px] space-y-2">
              <label htmlFor="height">H (in cm)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="height"
                name="height"
                min={1}
                placeholder="Ex. 2.5"
                value={box.height}
                onChange={(e)=>handleBoxes(index,e)}
              />
            </div>
            </div>
            {boxes.length > 1 && <button type="button" className="absolute w-5 h-5 text-sm flex justify-center items-center top-0 right-0  border rounded-full bg-red-500 text-white" onClick={() => removeBox(index)}>X</button>}
            </div>
            </>
          ))}
            <button type="button" className="m-2 px-5 py-1 border border-blue-500 rounded-3xl bg-white text-blue-500" onClick={addBox}>Add More Boxes</button>
            <button type="submit" className="border bg-blue-500 text-white mx-2  py-2 px-4 rounded-3xl">
              Submit and Compare
            </button>
        </form>
    </>
  )
}




const PriceCalc = () => {
  return (
    <>
      
      <div className="pt-16 relative">
      
      <div className="w-full p-8 flex flex-col items-center space-y-6">
        <div className="justify-center text-center text-3xl font-medium mb-8 flex">
          Calculate your shipping price
        </div>
        <Domestic />
      </div>
      </div>
    </>
  );
};

export default PriceCalc
