import React, { useEffect, useState } from "react";

const ManageForm = ({isManage, setIsManage,  shipment, isShipped}) => {
    const [boxes, setBoxes] = useState([
      { box_no: 1 , length : 0 , breadth: 0 , height: 0  , weight : 0 }
    ]);
    const [orders, setOrders] = useState([
        { box_no: 1 , product_name: '' , product_quantity: 0 , selling_price: 0  , tax_in_percentage: '' }
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
            body: JSON.stringify({ order : shipment.ord_id}),
          })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                setOrders(result.order)
              } else {
                alert('failed: ' + result.message)
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('An error occurred during fetching Order');
            });
            fetch('/.netlify/functions/getBoxes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
              },
              body: JSON.stringify({ order : shipment.ord_id}),
            })
              .then(response => response.json())
              .then(result => {
                if (result.success) {
                  setBoxes(result.order)
                } else {
                  alert('failed: ' + result.message)
                }
              })
              .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during fetching Boxes');
              });
            
      }, [])
      
      useEffect(()=>{
        setFormData((prev)=>({
            ...prev,
            orders: orders
          }))
      }, [orders]);
      useEffect(()=>{
        setFormData((prev)=>({
            ...prev,
            boxes: boxes
          }))
      }, [boxes]);

    const [formData, setFormData] = useState({
        wid : shipment.wid,
        order : shipment.ord_id,
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
        boxes : boxes,
        orders : orders,
        discount : shipment.total_discount,
        cod : shipment.cod_amount,
        gst : shipment.gst,
        Cgst : shipment.customer_gst,
        shippingType : shipment.shipping_mode
      })
      useEffect(()=>{
        
          const pinToAdd = async () => {
           try{
            await fetch(`https://api.postalpincode.in/pincode/${formData.postcode}`)
            .then(response => response.json())
            .then(result => {
               const city = result[0].PostOffice[0].District
               const state = result[0].PostOffice[0].State
               setFormData((prev)=>({
                  ...prev,
                   city: city,
                   state: state
                 }))
             })
           } catch (e) {
            setFormData((prev)=>({
              ...prev,
               city: '',
               state: ''
             }))
           }
          }
        if (formData.postcode.length == 6) pinToAdd()
      },[formData.postcode])
      useEffect(()=>{
        const pinToAdd = async () => {
          try{
           await fetch(`https://api.postalpincode.in/pincode/${formData.Bpostcode}`)
           .then(response => response.json())
           .then(result => {
              const city = result[0].PostOffice[0].District
              const state = result[0].PostOffice[0].State
              setFormData((prev)=>({
                 ...prev,
                  Bcity: city,
                  Bstate: state
                }))
            })
          } catch (e) {
           setFormData((prev)=>({
             ...prev,
              Bcity: '',
              Bstate: ''
            }))
          }
         }
       if (formData.Bpostcode.length == 6) pinToAdd()
      },[formData.Bpostcode])

      const addProduct = () => {
        setOrders([...orders, { box_no: 1 , product_name: '' , product_quantity: 0 , selling_price: 0  , tax_in_percentage: '' }]);
      };
      const addBox = () => {
        setBoxes([...boxes, { box_no: boxes.length+1 , length: 0 , breadth : 0 , height : 0  , weight: 0 }]);
      };
      const removeProduct = (index) => {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
        setFormData((prev)=>({
            ...prev,
            orders: orders
          }))
      };
      const removeBox = (index) => {
        const updatedBoxes = boxes.filter((_, i) => i !== index);
        setBoxes(updatedBoxes);
        setFormData((prev)=>({
            ...prev,
            boxes: boxes
          }))
      };
      const handleOrders = (index, event) => {
        if (isShipped)
          return;
        const { name, value } = event.target;
        const updatedOrders = [...orders];
        updatedOrders[index][name] = value;
        setOrders(updatedOrders);
        setFormData((prev)=>({
          ...prev,
          orders: orders
        }))
      };
      const handleBoxes = (index, event) => {
        if (isShipped)
          return;
        const { name, value } = event.target;
        const updatedBoxes = [...boxes];
        updatedBoxes[index][name] = value;
        setBoxes(updatedBoxes);
        setFormData((prev)=>({
          ...prev,
          boxes: boxes
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
        console.log(formData)
        
        let boxFlag = 0
    for (let i = 0; i < formData.boxes.length; i++) {
      for (let j = 0; j < formData.orders.length; j++) {
        if (parseInt(formData.orders[j].box_no) == i+1){
          boxFlag = 1
        }
      }
      if (boxFlag == 0){
        alert('Please make sure every box has some items')
        return
      }
      boxFlag = 0
    }

    let itemFlag = 0
    for (let i = 0; i < formData.orders.length; i++) {
      for (let j = 0; j < formData.boxes.length; j++) {
        if (formData.orders[i].box_no == formData.boxes[j].box_no){
          itemFlag = 1
        }
      }
      if (itemFlag == 0){
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }
    
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
              <label htmlFor="order">Order Id</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="order"
                name="order"
                placeholder="Ex. ORDER123456"
                value={formData.order}
                readOnly
                disabled
                onChange={handleChange}
              />
            </div>
            {/* <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
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
            </div> */}
            
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
                <option value="Pre-paid">Prepaid</option>
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
                readOnly
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
          <h2 className="text-xl font-bold mx-1">Boxes</h2>
          {boxes.map((box, index) => (
            
            <div key={index} className="product-form flex space-x-2 flex-wrap items-center">
              
              <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
                  <label htmlFor="box_no">Box No</label>
                  <input
                    className="w-full border py-2 px-4 rounded-3xl"
                    type="text"
                    id="box_no"
                    name="box_no"
                    placeholder="Box No"
                    disabled
                    value={index+1}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </div>
              <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
                  <label htmlFor="length">Length (in cm)</label>
                  <input
                    className="w-full border py-2 px-4 rounded-3xl"
                    type="text"
                    id="length"
                    name="length"
                    placeholder="Length (in cm)"
                    value={box.length}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
                  <label htmlFor="breadth">Width (in cm)</label>
                  <input
                    className="w-full border py-2 px-4 rounded-3xl"
                    type="text"
                    id="breadth"
                    name="breadth"
                    placeholder="Breadth (in cm)"
                    value={box.breadth}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </div>
                <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
                  <label htmlFor="height">Height (in cm)</label>
                  <input
                    className="w-full border py-2 px-4 rounded-3xl"
                    type="text"
                    id="height"
                    name="height"
                    placeholder="Height (in cm)"
                    value={box.height}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </div>
              <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
                  <label htmlFor="weight">Weight (in g)</label>
                  <input
                    className="w-full border py-2 px-4 rounded-3xl"
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="Weight"
                    value={box.weight}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </div>
                {boxes.length > 1 && <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => removeBox(index)}>Remove</button>}
            </div>
          ))}
          <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" onClick={addBox}>Add More Boxes</button>
          <h2 className="text-xl font-bold mx-1">Items</h2>
          {orders.map((order, index) => (
            
        <div key={index} className="product-form flex space-x-2 flex-wrap items-center">
          <div className="flex-1 mx-2 mb-2 min-w-[150px] space-y-2">
              <label htmlFor="box_no">Box No</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="box_no"
                name="box_no"
                placeholder="Box No"
                value={order.box_no}
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
          {/* <div className="flex-1 mx-2 mb-2 min-w-[100px] space-y-2">
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
            </div> */}
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
            {orders.length > 1 ? <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-red-500 text-white" onClick={() => removeProduct(index)}>Remove</button> : null}
        </div>
      ))}
      <button type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" onClick={addProduct}>Add More Product</button>
          <div className="w-full flex mb-2 flex-wrap ">
            
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="discount">Discount</label>
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
          {/* <div className="w-full flex mb-2 flex-wrap ">

            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="weight">Weight (In g)</label>
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
            
          </div> */}
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
          <button disabled={isShipped} className="px-5 py-1 mx-2 bg-blue-500  rounded-3xl text-white cursor-pointer" type="submit">Submit</button>
        </form>
        </div>
      </>
    );
  };

const ShipCard = ({price, shipment, setIsShipped, setIsShip}) => {
  const [isLoading, setIsLoading] = useState(false)
  const ship = async () => {
    setIsLoading(true)
    const getBalance = await fetch('/.netlify/functions/getBalance', {
      method: 'GET',
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token'),
      }
    })
    const balanceData = await getBalance.json();
    const balance = balanceData.balance;
    if ((parseFloat(balance) < parseFloat(price.price))){
      if (shipment.pay_method !== "topay"){
        alert('Insufficient balance')
        return;
      }
    }
    fetch('/.netlify/functions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({order : shipment.ord_id, price : shipment.pay_method=="topay"?0:Math.round(price.price), serviceId: price.serviceId, categoryId: price.categoryId})
    }).then(response => response.json()).then(async result => {
      if (result.success){
        setIsShipped(true)
        await fetch('/.netlify/functions/domesticOrderMail',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        })
        console.log(result)
        alert("Your shipment has been created successfully")
        setIsLoading(false)
        setIsShip(false)
        
      }
      else{
        alert("Your shipment has not been created")
        console.log(result)
        setIsLoading(false)
      }
      });
  }
  return (
    <>
       <div className="w-full h-16 bg-white relative items-center px-4 flex border-b" >
          <div>{price.name+" "+price.weight}</div>
          <div className="absolute flex space-x-2 right-4">{`₹${Math.round((price.price))}`} <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={price.serviceId==2?()=>{alert("This service is temporarily disabled")}:isLoading?()=>{}:()=>ship()}>{isLoading?"Shipping...":"Ship"}</div></div>
        </div>
    </>
  )
}

const ShipList = ({shipment, setIsShip, setIsShipped}) => {
  const [prices,setPrices] = useState([])
  const [boxes, setBoxes] = useState([])
  useEffect(()=>{
    
    const data = async () => {
      const getBoxes = await fetch('/.netlify/functions/getBoxes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'), 
        },
        body: JSON.stringify({ order : shipment.ord_id}),
      })
      const boxesData = await getBoxes.json()
      setBoxes(boxesData.order)
      console.log(boxesData.order)
      let weight = 0;
      let volume = 0;
      const volumetric = async () => {
        boxesData.order.map((box) => {
          weight += parseFloat(box.weight);
          volume += (parseFloat(box.length) * parseFloat(box.breadth) * parseFloat(box.height))
        })
      }
      await volumetric()
      console.log({method: shipment.shipping_mode=="Surface"?"S":"E", status : "Delivered", origin : shipment.pin, dest : shipment.shipping_postcode, payMode : shipment.pay_method == "topay"?"COD":shipment.pay_method, codAmount : shipment.cod_amount, volume, weight, quantity : boxesData.order.length})
      const getPrice = await fetch(`/.netlify/functions/price`, {
        method: 'POST',
        headers: { 'Accept': 'application/json',
                   'Content-Type': 'application/json'
        },
          body : JSON.stringify({method: shipment.shipping_mode=="Surface"?"S":"E", status : "Delivered", origin : shipment.pin, dest : shipment.shipping_postcode, payMode : shipment.pay_method == "topay"?"COD":shipment.pay_method, codAmount : shipment.cod_amount, volume, weight, quantity : boxesData.order.length}),
        
      })
      const prices = await getPrice.json()
      setPrices(prices.prices)
    }
    data()
  },[])
  
  return (
    <>
      <div className=" absolute inset-0 z-20 overflow-y-scroll px-4 pt-24 pb-4 flex flex-col bg-gray-100 items-center space-y-6">
        <div className="absolute top-3 right-3" onClick={()=>setIsShip(false)}>
          X
        </div>
        <div className="text-center text-3xl font-medium">
          CHOOSE YOUR SERVICE
        </div>
        <div className="w-full  p-4 ">
          {
            prices.length ? prices.map((price, index)=>(
             <ShipCard setIsShipped={setIsShipped} setIsShip={setIsShip} key={index} shipment={shipment}  price={price} />
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
    const [isShipped, setIsShipped] = useState(shipment.awb?true:false);
    const [isCancelled, setIsCancelled] = useState(shipment.cancelled?true:false);
    const getLabel = async () => {
      await fetch('/.netlify/functions/label', {
        method : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body : JSON.stringify({order : shipment.ord_id})
      }).then(response => response.json()).then(async result => {
        const link = document.createElement('a');
        link.href = result.label;
        link.target = '_blank'
        link.style.display = 'none'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    }
    const cancelShipment = async () => {
      const cancel = confirm('Do you want to cancel this shipment?');
      if (!cancel) return;
      await fetch('/.netlify/functions/cancelShipment', {
        method : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body : JSON.stringify({order : shipment.ord_id})
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
        {isShip && <ShipList setIsShip={setIsShip} setIsShipped={setIsShipped} shipment={shipment}/>}
        {isManage ? <ManageForm isManage={isManage} setIsManage={setIsManage} shipment={shipment} isShipped={isShipped}/> : null}
        <div className="w-full h-24 bg-white relative items-center px-4 sm:px-8 flex border-b">
          <div className="text-sm">
            <div className="font-bold">{shipment.ord_id}</div>
            <div >{shipment.customer_name}</div>
            <div> {shipment.awb?`AWB : ${shipment.awb}`:null}</div>
            <div>{shipment.date?shipment.date.toString().split('T')[0]+' '+shipment.date.toString().split('T')[1].split('.')[0]:null}</div>
          </div>
          <div className="absolute right-4 sm:right-8 flex space-x-2">
          <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsManage(true)}>{isShipped?"View":"Manage"}</div>
          {isShipped ? <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>getLabel()}>Label</div> : null}
          {!isShipped ? <div className="px-3 py-1 bg-blue-500  rounded-3xl text-white cursor-pointer" onClick={()=>setIsShip(true)}>Ship</div> : null}
          {isShipped && !isCancelled && shipment.serviceId == 1 ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" onClick={()=>cancelShipment()}>Cancel</div> : null}
          {isCancelled ? <div className="px-3 py-1 bg-red-500  rounded-3xl text-white cursor-pointer" >Cancelled</div> : null}
          </div>
        </div>
      </>
    );
  };
  const PickupRequest = ({setPickup}) => {
    const [warehouses, setWarehouses] = useState([]);
    useEffect(() => {
      const getWarehouses = async () => {
        const response = await fetch('/.netlify/functions/getWarehouse', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        });
        const result = await response.json();
        setWarehouses(result.rows);
      };
      getWarehouses();
    }, []);
    const [formData, setFormData] = useState({
      wid : "",
      pickDate : "",
      pickTime : "",
      packages : "",
      serviceId : ""
    })
    const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log(formData)
      // return
      await fetch('/.netlify/functions/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      }).then(response => response.json()).then(result => {
        alert(result.schedule);
      })
    }
    const handleChange =  (e) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]: value });
    }
    return (
      <>
        <div className="fixed z-50 bg-[rgba(0,0,0,0.5)] inset-0 flex justify-center items-center">
          <div className="relative p-8 bg-white">
              <div className="absolute right-3 top-3" onClick={()=>setPickup(false)}>
                x
              </div>
              <form action="" onSubmit={handleSubmit}>
              <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="wid">Pickup Warehouse Name</label>
              <select required
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="serviceId">Delivery Partner</label>
              <select required
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
              >
               <option value="">Select Service</option>
               <option value={"11"} >Delhivery (10Kg)</option>
               <option value={"12"} >Delhivery (500gm)</option>
               <option value={"21"} >Movin Surface</option>
               <option value={"22"} >Movin Express</option>
              </select>
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickDate">Pickup Date</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="date"
                id="pickDate"
                name="pickDate"
                placeholder="YYYY-MM-DD"
                value={formData.pickDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pickTime">Pickup Time</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="time"
                id="pickTime"
                name="pickTime"
                placeholder="HH:MM:SS (In 24 Hour Format)"
                value={formData.pickTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="packages">No of packages</label>
              <input required
                className="w-full border py-2 px-4 rounded-3xl"
                type="number"
                id="packages"
                name="packages"
                placeholder=""
                value={formData.packages}
                onChange={handleChange}
              />
            </div>
            <button className="px-5 py-1 mx-2 bg-blue-500  rounded-3xl text-white cursor-pointer" type="submit">Submit</button>
              </form>
          </div>
        </div>
      </>
    )
  }

const Listing = ({ step, setStep }) => {
    const [shipments, setShipments] = useState([])
    const [pickup, setPickup] = useState(false);
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
                result.order.sort((a, b) => new Date(a.date) - new Date(b.date)).reverse()
                const finalShipments = []
                const unShippedShipments = result.order.filter(shipment => !shipment.awb)
                const shippedShipments = result.order.filter(shipment => shipment.awb)
                finalShipments.push(...unShippedShipments,...shippedShipments)
                setShipments(finalShipments);
              } else {
                
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
          {pickup ? <PickupRequest setPickup={setPickup}/> : null}
          <div className="w-full h-16 px-4  relative flex">
            <div className="text-2xl font-medium">SHIPMENTS </div>
            <div
              onClick={()=>setPickup(true)}
              className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
            >
              Pickup Request
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
