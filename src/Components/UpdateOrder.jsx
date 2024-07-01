import React, { useEffect, useState } from "react";

const ManageForm = ({isManage, setIsManage,  shipment}) => {
    const [orders, setOrders] = useState([
        { master_sku: '' , product_name: '' , product_quantity: '' , selling_price: '' , discount: '' , tax_in_percentage: '' }
    ]);
    const [warehouses, setWarehouses] = useState([])
    useEffect(()=>{
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
        fetch('/.netlify/functions/getOrder', {
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
                setOrders(result.order)
              } else {
                alert('Order failed: ' + result.message)
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('An error occurred during Order');
            });
            
      }, [])
      
      useEffect(()=>{
        setFormData((prev)=>({
            ...prev,
            orders: orders
          }))
      }, [orders]);

    const [formData, setFormData] = useState({
        wid : shipment.wid,
        order : shipment.ord_id,
        date : shipment.ord_date,
        payMode : shipment.pay_method,
        name : shipment.customer_name,
        email : shipment.customer_email,
        phone : shipment.customer_mobile,
        address: shipment.shipping_address,
        address2 : shipment.shipping_address_2,
        addressType : shipment.shipping_address_type,
        addressType2 : shipment.shipping_address_type_2,
        postcode : shipment.shipping_postcode,
        city : shipment.shipping_city,
        state : shipment.shipping_state,
        country : shipment.shipping_country,
        Baddress: shipment.billing_address,
        Baddress2 :shipment.billing_address_2,
        BaddressType : shipment.billing_address_type,
        BaddressType2 : shipment.billing_address_type_2,
        Bpostcode :shipment.billing_postcode,
        Bcity : shipment.billing_city,
        Bstate : shipment.billing_state,
        Bcountry :shipment.billing_country,
        same : 1,
        orders : orders,
        discount : shipment.total_discount,
        cod : shipment.cod_amount,
        weight : shipment.weight,
        length :shipment.length,
        breadth : shipment.breadth,
        height :  shipment.height,
        gst : shipment.gst,
        Cgst : shipment.customer_gst,
        pickDate : shipment.pickup_date,
        pickTime : shipment.pickup_time,
        shippingType : shipment.shipping_mode
      })


      
      const addProduct = () => {
        setOrders([...orders, { master_sku: '' , product_name: '' , product_quantity: '' , selling_price: '' , discount: '' , tax_in_percentage: '' }]);
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
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]:type === 'checkbox' ? checked : value
        }));
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/.netlify/functions/updateOrder', {
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
              alert('Order Updated successfully')
            } else {
              alert('Order failed: ' + result.message)
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during Order');
          });
      }
      const ndr = () => {
        const waybill = '67566';
        const act = 'RE-ATTEMPT';
        const date = Date.now();
        fetch('/.netlify/functions/ndr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({waybill, act, date})
        }).then(response => response.json()).then(result => console.log(result.data));

      }
    return (
      <>
        <div
          className={`absolute top-0 z-20 bg-white w-full p-4 flex flex-col items-center space-y-6 ${
            isManage ? "" : "hidden"
          }`}
        >
          <div className="w-full h-16 px-4  relative flex">
            <div className="text-2xl font-medium">MANAGE SHIPMENT</div>
            <div
              onClick={(e) => {
                e.preventDefault();
                setIsManage(0);
              }}
              className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
            >
              X
            </div>
          </div>
          
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
                readOnly
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
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="payMode"
                name="payMode"
                placeholder="Ex. COD or Prepaid"
                value={formData.payMode}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Buyer's Name</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                placeholder="Ex. Aditya Kumar"
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
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
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
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.address2}
                onChange={handleChange}
              />
            </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType">Shipping Address Type</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType"
                name="addressType"
                placeholder="Home or Office"
                value={formData.addressType}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="addressType2">Alternate Shipping Address Type</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="addressType2"
                name="addressType2"
                placeholder="Home or Office"
                value={formData.addressType2}
                onChange={handleChange}
              />
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
                placeholder="Ex. 813210"
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
                placeholder="Ex. Bhagalpur"
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
                placeholder="Ex. Bihar"
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
                placeholder="Ex. India"
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
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.Baddress}
                onChange={handleChange}
              />
            </div>
            
            
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="Baddress2">Alternate Billing Address</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="Baddress2"
                name="Baddress2"
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.Baddress2}
                onChange={handleChange}
              />
            </div>
          <div className="w-full flex mb-2 flex-wrap ">
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="BaddressType">Billing Address Type</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="BaddressType"
                name="BaddressType"
                placeholder="Home or Office"
                value={formData.BaddressType}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="BaddressType2">Alternate Billing Address Type</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="BaddressType2"
                name="BaddressType2"
                placeholder="Home or Office"
                value={formData.BaddressType2}
                onChange={handleChange}
              />
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
                placeholder="Ex. 813210"
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
                placeholder="Ex. Bhagalpur"
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
                placeholder="Ex. Bihar"
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
                placeholder="Ex. India"
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
          <div className="flex-1 mx-2 mb-2 min-w-[50px] space-y-2">
              <label htmlFor="quantity">Quantity</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
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
            <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => removeProduct(index)}>Remove</button>
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
                placeholder="Ex. 1500"
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
                <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="shippingType"
                name="shippingType"
                placeholder="Express or Surface"
                value={formData.shippingType}
                onChange={handleChange}
              />
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
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
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
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
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
            <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
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
                placeholder="Enter Csutomer GST"
                value={formData.Cgst}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <button className="px-5 py-1 mx-2 bg-blue-500  rounded-3xl text-white cursor-pointer" type="submit">Submit</button>
        </form>
        </div>
      </>
    );
  };

const ShipList = ({shipment, setIsShip}) => {
  const [prices,setPrices] = useState([])
  useEffect(()=>{
    // console.log({method, status, origin, dest, weight, payMode, codAmount})
    const data = async () => {
      await fetch(`/.netlify/functions/price`, {
        method: 'POST',
        headers: { 'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': 'Token 2e80e1f3f5368a861041f01bb17c694967e94138',
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"
        },
          body : JSON.stringify({method: shipment.shipping_mode=="Surface"?"S":"E", status : "Delivered", origin : shipment.pin, dest : shipment.shipping_postcode, weight : shipment.weight, payMode : shipment.pay_method=="COD"?"COD":"Pre-paid", codAmount : shipment.cod_amount, length : shipment.length, breadth : shipment.breadth ,height : shipment.height}),
        
      }).then(response => response.json()).then(result => {console.log(result); result.prices.sort((a,b)=>parseFloat(a.price) - parseFloat(b.price)) ;setPrices(result.prices)}).catch(error => console.log(error + " " + error.message))
    }  
    data()
  }, []) 
  return (
    <>
      <div className="w-full absolute inset-0 z-20 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="absolute top-3 right-3" onClick={()=>setIsShip(false)}>
          X
        </div>
        <div className="text-center text-3xl font-medium">
          CHOOSE YOUR SERVICE
        </div>
        <div className="w-full p-4 ">
          {
            prices.length ? prices.map((price)=>(
              <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
          <div>{price.name+" "+price.weight}</div>
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

const Card = ({ shipment }) => {
    const [isManage, setIsManage] = useState(false);
    const [isShip, setIsShip] = useState(false);
    const ship = (order) => {
      fetch('/.netlify/functions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({order})
      }).then(response => response.json()).then(result => alert(result.response.rmk));
    }
    return (
      <>
        {isShip && <ShipList setIsShip={setIsShip} shipment={shipment}/>}
        <ManageForm isManage={isManage} setIsManage={setIsManage} shipment={shipment} />
        <div className="w-full h-16 bg-white relative items-center px-4 sm:px-8 flex border-b">
          <div>{shipment.ord_id}</div>
          <div className="absolute right-4 sm:right-8 flex space-x-2">
          <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsManage(true)}>Manage</div>
          <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsShip(true)}>Ship</div>
          </div>
        </div>
      </>
    );
  };

const Listing = ({ step, setStep }) => {
    const [shipments, setShipments] = useState([])
    useEffect(() => {

        fetch('/.netlify/functions/getShipments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token'),
            },
            
          })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                setShipments(result.order);
              } else {
                alert('Order failed: ' + result.message)
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('An error occurred during Order');
            });
    },[]);
    return (
      <>
        <div
          className={`w-full p-4 flex flex-col items-center space-y-6 ${
            step == 0 ? "" : "hidden"
          }`}
        >
          <div className="w-full h-16 px-4  relative flex">
            <div className="text-2xl font-medium">SHIPMENTS</div>
            <div
              onClick={(e) => {
                e.preventDefault();
                setStep(1);
              }}
              className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
            >
              Add
            </div>
          </div>
          <div className="w-full">
          
            {shipments.map((shipment, index) => (
              <Card key={index} shipment={shipment} />
            ))}
          </div>
        </div>
      </>
    );
  };

const UpdateOrder = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {step==0 && <Listing step={step} setStep={setStep} />}
      {/* <FullDetails /> */}
    </div>
  );
};

export default UpdateOrder;
