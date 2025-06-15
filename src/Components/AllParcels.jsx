import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = import.meta.env.VITE_APP_API_URL
const ManageForm = ({ isManage, setIsManage, shipment, isShipped }) => {
  const [boxes, setBoxes] = useState([
    { box_no: 1, length: 0, breadth: 0, height: 0, weight: 0 }
  ]);
  const [orders, setOrders] = useState([
    { box_no: 1, product_name: '', product_quantity: 0, selling_price: 0, tax_in_percentage: '' }
  ]);
  const [warehouses, setWarehouses] = useState([])
  useEffect(() => {
    const getWarehouses = async () => {
      await fetch(`${API_URL}/warehouse/warehouses/all`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        }
      }).then(response => response.json()).then(result => setWarehouses(result.rows))
    }
    getWarehouses();
    fetch(`${API_URL}/order/domestic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ order: shipment.ord_id }),
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
    fetch(`${API_URL}/order/domestic/boxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
      body: JSON.stringify({ order: shipment.ord_id }),
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orders: orders
    }))
  }, [orders]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      boxes: boxes
    }))
  }, [boxes]);

  const [formData, setFormData] = useState({
    wid: shipment.wid,
    order: shipment.ord_id,
    payMode: shipment.pay_method,
    name: shipment.customer_name,
    email: shipment.customer_email,
    phone: shipment.customer_mobile,
    address: shipment.shipping_address,
    addressType: shipment.shipping_address_type,
    postcode: shipment.shipping_postcode,
    city: shipment.shipping_city,
    state: shipment.shipping_state,
    country: shipment.shipping_country,
    Baddress: shipment.billing_address,
    BaddressType: shipment.billing_address_type,
    Bpostcode: shipment.billing_postcode,
    Bcity: shipment.billing_city,
    Bstate: shipment.billing_state,
    Bcountry: shipment.billing_country,
    same: 1,
    boxes: boxes,
    orders: orders,
    discount: shipment.total_discount,
    cod: shipment.cod_amount,
    gst: shipment.gst,
    Cgst: shipment.customer_gst,
    shippingType: shipment.shipping_mode,
    pickupDate: shipment.pickup_date,
    pickupTime: shipment.pickup_time,
    ewaybill: shipment.ewaybill,
    invoiceNumber: shipment.invoice_number,
    invoiceDate: shipment.invoice_date,
    invoiceAmount: shipment.invoice_amount,
    invoiceUrl: shipment.invoice_url,
    isB2B: shipment.is_b2b
  })
  useEffect(() => {

    const pinToAdd = async () => {
      try {
        await fetch(`https://api.postalpincode.in/pincode/${formData.postcode}`)
          .then(response => response.json())
          .then(result => {
            const city = result[0].PostOffice[0].District
            const state = result[0].PostOffice[0].State
            setFormData((prev) => ({
              ...prev,
              city: city,
              state: state
            }))
          })
      } catch (e) {
        setFormData((prev) => ({
          ...prev,
          city: '',
          state: ''
        }))
      }
    }
    if (formData.postcode.length == 6) pinToAdd()
  }, [formData.postcode])
  useEffect(() => {
    const pinToAdd = async () => {
      try {
        await fetch(`https://api.postalpincode.in/pincode/${formData.Bpostcode}`)
          .then(response => response.json())
          .then(result => {
            const city = result[0].PostOffice[0].District
            const state = result[0].PostOffice[0].State
            setFormData((prev) => ({
              ...prev,
              Bcity: city,
              Bstate: state
            }))
          })
      } catch (e) {
        setFormData((prev) => ({
          ...prev,
          Bcity: '',
          Bstate: ''
        }))
      }
    }
    if (formData.Bpostcode.length == 6) pinToAdd()
  }, [formData.Bpostcode])

  const addProduct = () => {
    setOrders([...orders, { box_no: 1, product_name: '', product_quantity: 0, selling_price: 0, tax_in_percentage: '' }]);
  };
  const addBox = () => {
    setBoxes([...boxes, { box_no: boxes.length + 1, length: 0, breadth: 0, height: 0, weight: 0 }]);
  };
  const removeProduct = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
    setFormData((prev) => ({
      ...prev,
      orders: orders
    }))
  };
  const removeBox = (index) => {
    const updatedBoxes = boxes.filter((_, i) => i !== index);
    setBoxes(updatedBoxes);
    setFormData((prev) => ({
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
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      boxes: boxes
    }))
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const [invoice, setInvoice] = useState(null)
  const handleInvoice = (e) => {
    const { files } = e.target;
    setInvoice(files[0])
  }
  const uploadInvoice = async () => {
    if (!invoice) {
      return;
    }
    const invoiceUuid = uuidv4();
    const key = `invoice/${invoiceUuid}`;
    const filetype = invoice.type;


    const putUrlReq = await fetch(`${API_URL}/s3/putUrl`, {
      method: "POST",
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ filename: key, filetype: filetype, isPublic: true }),
    }).catch(err => { console.error(err); alert("err"); return });
    const putUrlRes = await putUrlReq.json();

    const uploadURL = putUrlRes.uploadURL;
    await fetch(uploadURL, {
      method: "PUT",
      headers: {
        'Content-Type': filetype
      },
      body: invoice,
    }).then(response => {
      if (response.status == 200) {
        setFormData((prev) => ({
          ...prev,
          invoiceUrl: key
        }))
        alert("Invoice uploaded successfully!");
      } else {
        setFormData((prev) => ({
          ...prev,
          invoiceUrl: null
        }))
        alert("Failed to upload invoice!");
      }
    })

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)

    let boxFlag = 0
    for (let i = 0; i < formData.boxes.length; i++) {
      for (let j = 0; j < formData.orders.length; j++) {
        if (parseInt(formData.orders[j].box_no) == i + 1) {
          boxFlag = 1
        }
      }
      if (boxFlag == 0) {
        alert('Please make sure every box has some items')
        return
      }
      boxFlag = 0
    }

    let itemFlag = 0
    for (let i = 0; i < formData.orders.length; i++) {
      for (let j = 0; j < formData.boxes.length; j++) {
        if (formData.orders[i].box_no == formData.boxes[j].box_no) {
          itemFlag = 1
        }
      }
      if (itemFlag == 0) {
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }

    fetch(`${API_URL}/order/domestic/update`, {
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
    <Dialog 
      open={isManage} 
      onClose={() => setIsManage(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>MANAGE SHIPMENT</div>
          <IconButton onClick={() => setIsManage(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Pickup Warehouse Name</InputLabel>
              <Select
                value={formData.wid}
                onChange={handleChange}
                name="wid"
                label="Pickup Warehouse Name"
              >
                <MenuItem value="">Select Warehouse</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.wid} value={warehouse.wid}>
                    {warehouse.warehouseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Pickup Date"
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Pickup Time"
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Order Id"
                name="order"
                placeholder="Ex. ORDER123456"
                value={formData.order}
                disabled
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.payMode}
                onChange={handleChange}
                name="payMode"
                label="Payment Method"
              >
                <MenuItem value="COD">COD</MenuItem>
                <MenuItem value="Pre-paid">Prepaid</MenuItem>
                <MenuItem value="topay">To Pay</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Buyer's Name"
                name="name"
                placeholder="Ex. Aditya Kumar"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Buyer's email"
                name="email"
                placeholder="Ex. customer@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Buyer's Phone"
                name="phone"
                placeholder="Ex. 1234554321"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Shipping Address"
                name="address"
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Shipping Address Type</InputLabel>
              <Select
                value={formData.addressType}
                onChange={handleChange}
                name="addressType"
                label="Shipping Address Type"
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="office">Office</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Shipping Postcode"
                name="postcode"
                placeholder="Ex. 813210"
                value={formData.postcode}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Shipping City"
                name="city"
                placeholder="Ex. Bhagalpur"
                value={formData.city}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Shipping State"
                name="state"
                placeholder="Ex. Bihar"
                value={formData.state}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Shipping Country"
                name="country"
                placeholder="Ex. India"
                disabled
                value={formData.country}
                onChange={handleChange}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.same}
                  onChange={handleChange}
                  name="same"
                />
              }
              label="Billing address is same as Shipping address"
            />
          </Box>
          <Box sx={{ display: formData.same ? 'none' : 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing Address"
                name="Baddress"
                placeholder="Ex. House no. 105, Kankarbagh, Patna, Bihar"
                value={formData.Baddress}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Billing Address Type</InputLabel>
              <Select
                value={formData.BaddressType}
                onChange={handleChange}
                name="BaddressType"
                label="Billing Address Type"
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="office">Office</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing Postcode"
                name="Bpostcode"
                placeholder="Ex. 813210"
                value={formData.Bpostcode}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing City"
                name="Bcity"
                placeholder="Ex. Bhagalpur"
                value={formData.Bcity}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing State"
                name="Bstate"
                placeholder="Ex. Bihar"
                value={formData.Bstate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Billing Country"
                name="Bcountry"
                placeholder="Ex. India"
                value={formData.Bcountry}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Boxes</div>
            {boxes.map((box, index) => (
              <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Box No"
                    name="box_no"
                    disabled
                    value={index + 1}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Length (in cm)"
                    name="length"
                    value={box.length}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Width (in cm)"
                    name="breadth"
                    value={box.breadth}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Height (in cm)"
                    name="height"
                    value={box.height}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Weight (in g)"
                    name="weight"
                    value={box.weight}
                    onChange={(e) => handleBoxes(index, e)}
                  />
                </FormControl>
                {boxes.length > 1 && (
                  <FormControl fullWidth sx={{ minWidth: 150 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeBox(index)}
                      sx={{ width: '100%' }}
                    >
                      Remove
                    </Button>
                  </FormControl>
                )}
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={addBox}
              sx={{ borderRadius: '24px', mt: 2 }}
            >
              Add More Boxes
            </Button>
          </Box>
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Items</div>
            {orders.map((order, index) => (
              <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                <FormControl fullWidth sx={{ minWidth: 150 }}>
                  <TextField
                    label="Box No"
                    name="box_no"
                    value={order.box_no}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 300 }}>
                  <TextField
                    label="Product Name"
                    name="product_name"
                    value={order.product_name}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 50 }}>
                  <TextField
                    label="Quantity"
                    name="product_quantity"
                    type="number"
                    value={order.product_quantity}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 100 }}>
                  <TextField
                    label="Price"
                    name="selling_price"
                    value={order.selling_price}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 100 }}>
                  <TextField
                    label="Tax"
                    name="tax_in_percentage"
                    value={order.tax_in_percentage}
                    onChange={(e) => handleOrders(index, e)}
                  />
                </FormControl>
                {orders.length > 1 && (
                  <FormControl fullWidth sx={{ minWidth: 150 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeProduct(index)}
                      sx={{ width: '100%' }}
                    >
                      Remove
                    </Button>
                  </FormControl>
                )}
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={addProduct}
              sx={{ borderRadius: '24px', mt: 2 }}
            >
              Add More Product
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isB2B}
                onChange={handleChange}
                name="isB2B"
              />
            }
            label="Is this is a B2B shipment?"
          />
          {formData.isB2B && (
            <Box sx={{ my: 4 }}>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <TextField
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <TextField
                  label="Invoice Date"
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <TextField
                  label="Invoice Amount"
                  name="invoiceAmount"
                  type="number"
                  value={formData.invoiceAmount}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <label>Invoice</label>
                <input
                  type="file"
                  onChange={handleInvoice}
                />
                <a type="button" className="m-2 px-5 py-1 border rounded-3xl bg-blue-500 text-white" target="_blank" href={import.meta.env.VITE_APP_BUCKET_URL + formData.invoiceUrl}>View</a>
                <Button
                  variant="contained"
                  onClick={uploadInvoice}
                  sx={{ borderRadius: '24px', mt: 2 }}
                >
                  Update
                </Button>
              </FormControl>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <TextField
                  label="E-Waybill"
                  name="ewaybill"
                  value={formData.ewaybill}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          )}
          <Box sx={{ my: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Additional Info</div>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="COD Amount"
                name="cod"
                value={formData.cod}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <InputLabel>Shipping Type</InputLabel>
              <Select
                value={formData.shippingType}
                onChange={handleChange}
                name="shippingType"
                label="Shipping Type"
              >
                <MenuItem value="Surface">Surface</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Seller GST"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 300 }}>
              <TextField
                label="Customer GSTIN (FOR B2B)"
                name="Cgst"
                value={formData.Cgst}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isShipped}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Function to add page numbers to the array
  const addPageNumber = (pageNum) => {
    pages.push({
      number: pageNum,
      isCurrent: pageNum === currentPage
    });
  };

  // Add first page
  addPageNumber(1);

  if (totalPages <= 7) {
    // If total pages is 7 or less, show all pages
    for (let i = 2; i < totalPages; i++) {
      addPageNumber(i);
    }
  } else {
    if (currentPage <= 4) {
      // We're near the start
      for (let i = 2; i <= 5; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false });
      addPageNumber(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // We're near the end
      pages.push({ number: '...', isCurrent: false });
      for (let i = totalPages - 4; i < totalPages; i++) {
        addPageNumber(i);
      }
    } else {
      // We're in the middle
      pages.push({ number: '...', isCurrent: false });
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        addPageNumber(i);
      }
      pages.push({ number: '...', isCurrent: false });
      addPageNumber(totalPages);
    }
  }

  return (    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-4">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
      
      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => page.number !== '...' && onPageChange(page.number)}
          className={`min-w-[30px] px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
            page.number === '...' ? 'cursor-default' 
            : page.isCurrent ? 'bg-blue-500 text-white' 
            : 'bg-white hover:bg-gray-100 border'
          }`}
        >
          {page.number}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-[1000] bg-white rounded-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

const Card = ({ shipment }) => {
  const [isManage, setIsManage] = useState(false);
  const [isShipped, setIsShipped] = useState(shipment.awb ? true : false);

  return (
    <>
      <Modal isOpen={isManage} onClose={() => setIsManage(false)}>
        <ManageForm setIsManage={setIsManage} shipment={shipment} isManage={isManage} isShipped={shipment.awb ? true : false} />
      </Modal>
      
      <div className="w-full bg-white hover:bg-gray-50 border-b">
        <div className="grid grid-cols-12 gap-4 px-4 py-3">
          {/* Order Info - 3 columns */}
          <div className="col-span-3">
            <div className="text-sm font-semibold mb-1">{shipment.ord_id}</div>
            <div className="text-xs text-gray-500">
              {shipment.date ? new Date(shipment.date).toLocaleString() : null}
            </div>
          </div>

          {/* Customer Info - 3 columns */}
          <div className="col-span-3">
            <div className="text-sm text-gray-700">{shipment.fullName}</div>
            <div className="text-xs text-gray-600 truncate">{shipment.email}</div>
          </div>

          {/* Shipping Info - 4 columns */}
          <div className="col-span-4">
            {isShipped ? (
              <div className="space-y-1">
                {shipment.awb && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">AWB:</span> {shipment.awb}
                  </div>
                )}
                {shipment.shipping_vendor_reference_id && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">LRN:</span> {shipment.shipping_vendor_reference_id}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No shipping details yet</div>
            )}
          </div>

          {/* Status - 1 column */}
          <div className="col-span-1 flex items-center">
            <span className={`px-2 py-1 text-xs rounded-full ${
              isShipped ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isShipped ? 'Shipped' : 'Pending'}
            </span>
          </div>

          {/* Action Button - 1 column */}
          <div className="col-span-1 flex items-center justify-end">
            <button 
              className="px-4 py-1 bg-blue-500 text-white text-sm rounded-3xl hover:bg-blue-600 transition-colors" 
              onClick={() => setIsManage(true)}
            >
              {isShipped ? "View" : "Manage"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Listing = ({ step, setStep }) => {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    orderId: "",
    name: "",
    startDate: "",
    endDate: ""
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [abortController, setAbortController] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  // Debounce filter changes
  useEffect(() => {
    const timerId = setTimeout(() => {
      setPage(1); // Reset to first page when filters change
      setDebouncedFilters(filters);
    }, 500); // 500ms delay

    return () => clearTimeout(timerId);
  }, [filters]);

  // Fetch data with filters
  useEffect(() => {
    const fetchData = async () => {
      if (abortController) {
        abortController.abort();
      }
      const newController = new AbortController();
      setAbortController(newController);

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          ...(debouncedFilters.name && { merchant_name: debouncedFilters.name }),
          ...(debouncedFilters.email && { merchant_email: debouncedFilters.email }),
          ...(debouncedFilters.orderId && { orderId: debouncedFilters.orderId }),
          ...(debouncedFilters.startDate && { startDate: debouncedFilters.startDate }),
          ...(debouncedFilters.endDate && { endDate: debouncedFilters.endDate })
        });

        const response = await fetch(`${API_URL}/order/domestic/all?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
          signal: newController.signal
        });
        
        const result = await response.json();
        if (result.success) {
          setShipments(result.orders);
          setTotalPages(result.totalPages);
        } else {
          alert("Failed to fetch parcels");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error:', error);
          alert('An error occurred during Order fetch');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedFilters, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: 'ord_id', headerName: 'Order ID', width: 130 },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 180,
      renderCell: (params) => 
        params.row.date ? new Date(params.row.date).toLocaleString() : ''
    },
    { field: 'fullName', headerName: 'Customer Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'shipping',
      headerName: 'Shipping Details',
      width: 200,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <div>
            {isShipped ? (
              <div>
                {params.row.awb && <div>AWB: {params.row.awb}</div>}
                {params.row.shipping_vendor_reference_id && (
                  <div>LRN: {params.row.shipping_vendor_reference_id}</div>
                )}
              </div>
            ) : (
              <div>No shipping details yet</div>
            )}
          </div>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Box
            sx={{
              bgcolor: isShipped ? 'success.100' : 'warning.100',
              color: isShipped ? 'success.800' : 'warning.800',
              px: 2,
              py: 0.5,
              borderRadius: 8,
              fontSize: '0.875rem'
            }}
          >
            {isShipped ? 'Shipped' : 'Pending'}
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setSelectedShipment(params.row);
              setIsManageOpen(true);
            }}
            sx={{ borderRadius: '24px' }}
          >
            {isShipped ? 'View' : 'Manage'}
          </Button>
        );
      }
    }
  ];

  return (
    <div className={`w-full p-4 flex flex-col items-center space-y-6 ${step == 0 ? "" : "hidden"}`}>
      <Paper sx={{ width: '100%', p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <h2 className="text-2xl font-medium">Shipments</h2>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
          <TextField
            label="Merchant Name"
            name="name"
            value={filters.name}
            onChange={handleChange}
            size="small"
          />
          <TextField
            label="Merchant Email"
            name="email"
            value={filters.email}
            onChange={handleChange}
            size="small"
          />
          <TextField
            label="Order ID"
            name="orderId"
            value={filters.orderId}
            onChange={handleChange}
            size="small"
          />
          <TextField
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>        {/* DataGrid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={shipments}
            columns={columns}
            loading={isLoading}
            hideFooter={true}
            disableSelectionOnClick
            getRowId={(row) => row.ord_id}
          />
        </Box>

        {/* Custom Pagination */}
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Paper>

      {selectedShipment && (
        <ManageForm
          isManage={isManageOpen}
          setIsManage={setIsManageOpen}
          shipment={selectedShipment}
          isShipped={Boolean(selectedShipment.awb)}
        />
      )}
    </div>
  );
};

const UpdateOrder = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {step == 0 && <Listing step={step} setStep={setStep} />}
    </div>
  );
};

export default UpdateOrder;
