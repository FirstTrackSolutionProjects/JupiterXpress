import React, { useEffect, useState } from "react";

const FullDetails = () => {
  const [orders, setOrders] = useState([
    { master_sku: '' , product_name: '' , product_quantity: '' , selling_price: '' , discount: '' , tax_in_percentage: '' }
]);
  const [formData, setFormData] = useState({
    wid : '',
    pickupTime : '',
    pickupDate: '',
    order : '',
    date : '',
    payMode : 'prepaid',
    name : '',
    email : '',
    phone : '',
    address: '',
    address2 : '',
    addressType : 'home',
    addressType2 : 'office',
    postcode : '',
    city : '',
    state : '',
    country : '',
    Baddress: '',
    Baddress2 : '',
    BaddressType : 'home',
    BaddressType2 : 'office',
    Bpostcode : '',
    Bcity : '',
    Bstate : '',
    Bcountry : '',
    same : 1,
    orders : orders,
    discount : '',
    cod : 0,
    weight : '',
    length : '',
    breadth : '',
    height :  '',
    gst : '',
    Cgst : '',
    shippingType : 'Surface',
    pickDate : '',
    pickTime : '',
  })
  const [warehouses, setWarehouses] = useState([])
  useEffect(() => {
    const getWarehouses = async () => {
      await fetch('/.netlify/functions/getWarehouse',{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      }).then(response => response.json()).then(result => setWarehouses(result.rows))
    }
    getWarehouses();
  }, [])
  const addProduct = () => {
    setOrders([...orders, { master_sku: '' , product_name: '' , product_quantity: 0 , selling_price: 0 , discount: '' , tax_in_percentage: 0 }]);

  };
  const removeProduct = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
    setFormData((prev)=>({
      ...prev,
      orders: orders
    }))
  };
  const handleOrders = (index, event) => {
    
    const { name, value } = event.target;
    const updatedOrders = [...orders];
    updatedOrders[index][name] = value;
    setOrders(updatedOrders);
    setFormData((prev)=>({
      ...prev,
      orders: orders
    }))
  };

  useEffect(()=>{
    setFormData((prev)=>({
        ...prev,
        orders: orders
      }))
  }, [orders]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/.netlify/functions/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Order created successfully')
        } else {
          alert('Order failed: ' + result.message)
          console.log(result.orders)
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during Order');
      });
  }
  return (
    <>
      <div className="w-full p-4 flex flex-col items-center">
        <div className="text-3xl font-medium text-center my-8">Enter Shipping Details</div>
        <form action="" onSubmit={handleSubmit}>
        <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="wid">Pickup Warehouse Name</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="wid"
                name="wid"
                placeholder="Warehouse Name"
                value={formData.wid}
                onChange={handleChange}
              >
                <option value="">Select Warehouse</option>
                { warehouses.length ?
                  warehouses.map((warehouse, index) => (
                    <option value={warehouse.wid} >{warehouse.warehouseName}</option>
                  ) ) : null
                } 
              </select>
            </div>
            
          </div>
         
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickDate">Pickup Date</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pickDate"
                name="pickDate"
                placeholder="YYYY-MM-DD"
                value={formData.pickDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickTime">Pickup Time</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pickTime"
                name="pickTime"
                placeholder="HH:MM:SS (In 24 Hour Format)"
                value={formData.pickTime}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="order">Order Id</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="order"
                name="order"
                placeholder="Ex. ORDER123456"
                value={formData.order}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="date">Order Date</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="date"
                name="date"
                placeholder="Ex. 13/05/2024"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="payMode">Payment Method</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="payMode"
                name="payMode"
                value={formData.payMode}
                onChange={handleChange}
              >
                <option value="COD">COD</option>
                <option value="prepaid">Prepaid</option>
                <option value="topay">To Pay</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Buyer's Name</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                placeholder="Enter Customer Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="city">Buyer's email</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="email"
                name="email"
                placeholder="Ex. customer@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="phone">Buyer's Phone</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="phone"
                name="phone"
                placeholder="Ex. 1234554321"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="address">Shipping Address</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="address"
                name="address"
                placeholder="Enter Shipping Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            
            
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="address2">Alternate Shipping Address</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="address2"
                name="address2"
                placeholder="Alternate Shipping Address"
                value={formData.address2}
                onChange={handleChange}
              />
            </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType">Shipping Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType2">Alternate Shipping Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType2"
                name="addressType2"
                value={formData.addressType2}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="postcode">Shipping Postcode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="postcode"
                name="postcode"
                placeholder="XXXXXX"
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="city">Shipping City</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="city"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="state">Shipping State</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="state"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="country">Shipping Country</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="country"
                name="country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-x-4 flex items-center">
          <input
                className=""
                type="checkbox"
                checked={formData.same}
                id="same"
                name="same"
                value={formData.same}
                onChange={handleChange}
              />
              <label htmlFor="same" >Billing address is same as Shipping address</label>
              
            </div>
          <div className={`w-full ${formData.same?'hidden':''}`}>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Baddress">Billing Address</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Baddress"
                name="Baddress"
                placeholder="Enter Address"
                value={formData.Baddress}
                onChange={handleChange}
              />
            </div>
            
            
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Baddress2">Alternate Billing Address</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Baddress2"
                name="Baddress2"
                placeholder="Enter Address"
                value={formData.Baddress2}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="BaddressType">Billing Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="BaddressType"
                name="BaddressType"
                placeholder="Home or Office"
                value={formData.BaddressType}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="BaddressType2">Alternate Billing Address Type</label>
              <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="BaddressType2"
                name="BaddressType2"
                placeholder="Home or Office"
                value={formData.BaddressType2}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
              </select>
            </div>
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Bpostcode">Billing Postcode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Bpostcode"
                name="Bpostcode"
                placeholder="XXXXXX"
                value={formData.Bpostcode}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Bcity">Billing City</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Bcity"
                name="Bcity"
                placeholder="Enter City"
                value={formData.Bcity}
                onChange={handleChange}
              />
            </div>
            
            
          </div>
          
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Bstate">Billing State</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Bstate"
                name="Bstate"
                placeholder="Enter State"
                value={formData.Bstate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Bcountry">Billing Country</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Bcountry"
                name="Bcountry"
                placeholder="Enter Country"
                value={formData.Bcountry}
                onChange={handleChange}
              />
            </div>

          </div>
          </div>
          {orders.map((order, index) => (
            
        <div key={index} className="product-form flex space-x-2 flex-wrap items-center">
          <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
              <label htmlFor="masterSKU">Master SKU</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="masterSKU"
                name="master_sku"
                placeholder="Master SKU"
                value={order.master_sku}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="product">Product Name</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="product"
                name="product_name"
                placeholder="Product Name"
                value={order.product_name}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="quantity">Quantity</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="quantity"
                name="product_quantity"
                placeholder="Quantity"
                value={order.product_quantity}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="price">Price</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="price"
                name="selling_price"
                placeholder="Price"
                value={order.selling_price}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="discount">Discount</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="discount"
                name="discount"
                placeholder="Discount"
                value={order.discount}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
          <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
              <label htmlFor="tax">Tax</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="tax"
                name="tax_in_percentage"
                placeholder="Tax"
                value={order.tax_in_percentage}
                onChange={(e) => handleOrders(index, e)}
              />
            </div>
            <button type="button" className="mx-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => removeProduct(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" onClick={addProduct}>Add More Product</button>
          <div className="w-full flex mb-2 flex-wrap ">
            
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="discount">Total Discount</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="discount"
                name="discount"
                placeholder="Ex. 100"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 flex min-w-[300px] space-x-2">
              <div className="space-y-2">
                <label htmlFor="cod">COD Amount</label>
                <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="cod"
                name="cod"
                placeholder="Ex. 1500"
                value={formData.cod}
                onChange={handleChange}
              />
              </div>
              <div className="space-y-2">
                <label htmlFor="shippingType">Shipping Type</label>
                <select
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="shippingType"
                name="shippingType"
                value={formData.shippingType}
                onChange={handleChange}
              >
                <option value="Surface">Surface</option>
                <option value="Express">Express</option>
              </select>
              </div>
            </div>
            
          </div>
          <div className="w-full flex mb-2 flex-wrap ">

            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="weight">Weight (In Kg)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="weight"
                name="weight"
                placeholder="Ex. 2.5"
                value={formData.weight}
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
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="gst">Seller GST</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="gst"
                name="gst"
                placeholder="Enter GSTIN"
                value={formData.gst}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Cgst">Customer GSTIN (FOR B2B)</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Cgst"
                name="Cgst"
                placeholder="Enter Customer GST"
                value={formData.Cgst}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <button type='submit' className="mx-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white">Submit</button>

        </form>
      </div>
    </>
  )
}

const ComparePrices = ({method, status, origin, dest, weight, payMode, codAmount, setStep}) => {
  const [price,setPrice] = useState(null)
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
          body : JSON.stringify({method: method, status : status, origin : origin, dest : dest, weight : weight, payMode : payMode, codAmount : codAmount}),
        
      }).then(response => response.json()).then(result => {console.log(result); setPrice(result.price)}).catch(error => console.log(error + " " + error.message))
    }  
    data()
  }, []) 
  return (
    <>
      <div className="w-full inset-0 absolute p-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="text-center text-3xl font-medium">
          CHOOSE YOUR SERVICE
        </div>
        <div className="w-full p-4 ">
          <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" onClick={()=>setStep(1)}>
            <div>Delhivery</div>
            <div className="absolute right-4">{`${Math.round(price)}    >`}</div>
          </div>
        </div>
      </div>
    </>
  )
}

const InitialDetails = ({setStep}) => {
  
  const [formData, setFormData] = useState({
    method : 'S',
    status: 'DTO',
    origin : '',
    dest : '',
    weight : '',
    payMode : 'COD',
    codAmount : '0',
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
      {showCompare && <ComparePrices {...formData} setStep={setStep} />}
      <div className="w-full p-4 flex flex-col items-center space-y-6">
        <div className="text-center text-3xl font-medium">
          Enter your Shipment Details
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
            <button type="submit" className="border bg-white mx-2  py-2 px-4 rounded-3xl">
              Submit and Compare
            </button>
        </form>
      </div>
    </>
  );
};

const CreateOrder = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {/* {step==0 && <InitialDetails setStep={setStep} />} */}
      <FullDetails />
    </div>
  );
};

export default CreateOrder;
