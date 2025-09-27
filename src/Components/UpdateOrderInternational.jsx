import React, { useEffect, useState, useMemo, useRef } from "react";
import getServicesActiveVendorsService from "../services/serviceServices/getServicesActiveVendorsService";
import getActiveInternationalServicesService from "../services/serviceServices/getActiveInternationalServicesService";
import getAllInternationalShipmentsService from '../services/orderServices/internationalOrderServices/getAllInternationalShipmentsService';
import createInternationalRequestShipmentService from '../services/shipmentServices/internationalShipmentServices/createInternationalRequestShipmentService';
import cancelInternationalRequestShipmentService from '../services/shipmentServices/internationalShipmentServices/cancelInternationalRequestShipmentService';
import { COUNTRIES } from "../Constants";
import { toast } from "react-toastify";
import {v4} from "uuid";
import getS3PutUrlService from "../services/s3Services/getS3PutUrlService";
import s3FileUploadService from "../services/s3Services/s3FileUploadService";
import cancelInternationalShipmentService from "../services/shipmentServices/internationalShipmentServices/cancelInternationalShipmentService";
import getInternationalShipmentLabelService from "../services/shipmentServices/internationalShipmentServices/getInternationalShipmentLabel";
const API_URL = import.meta.env.VITE_APP_API_URL
const ManageForm = ({ shipment}) => {
  // ---------------- State: Dockets & Items ----------------

  const [loading, setLoading] = useState(null);

  const [dockets, setDockets] = useState([
    { box_no: 1 , docket_weight: 0 , docket_weight_unit: 'kg', length: 0 , breadth : 0, height : 0, quantity: 1 }
  ]);
  
const handleDeleteDocket = (index) => {
  const newDockets = dockets.filter((_, i) => i !== index).map((docket, i) => ({
    ...docket,
    box_no: i + 1,
  }));
  setDockets(newDockets);
};
const handleAddDocket = () => {
  setDockets([...dockets, { box_no: dockets.length + 1, docket_weight: 1 , length: 10 , breadth : 10, height : 10, docket_weight_unit: 'kg', quantity: 1  }]);
};
const [items, setItems] = useState([
  { hscode: '' , box_no: '' , quantity: 1 , rate: 1 , description: '' , unit: 'Pc', unit_weight: 0, item_weight_unit: 'kg', igst_amount : 0 }
]);
  useEffect(() => {
    const getDockets = async () => {
      await fetch(`${API_URL}/order/international/dockets`,{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ iid : shipment.iid })
      })
     .then(response => response.json()).then(result => {setDockets(result.dockets); console.log(result.dockets)})
    }
    const getItems = async () => {
      await fetch(`${API_URL}/order/international/items`,{
        method : 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ iid : shipment.iid })
      })
     .then(response => response.json()).then(result => setItems(result.dockets))
    }
    getDockets()
    getItems()
  },[]);
  const [formData, setFormData] = useState({
    iid : shipment.iid,
    wid : shipment.wid || "",
    service: shipment.service || "",
    vendor: shipment.vendor || "",
    contents : shipment.contents || "",
    consigneeName : shipment.consignee_name || "",
    consigneeCompany : shipment.consignee_company_name || "",
    countryCode : shipment.consignee_country_code || "", // will normalize to key
    consigneeContact : shipment.consignee_contact_no || "",
    consigneeEmail : shipment.consignee_email || "",
    consigneeAddress : shipment.consignee_address_1 || "",
    consigneeAddress2 : shipment.consignee_address_2 || "",
    consigneeAddress3: shipment.consignee_address_3 || "",
    consigneeCity : shipment.consignee_city || "",
    consigneeState : shipment.consignee_state || "",
    consigneeCountry : shipment.consignee_country || "", // will normalize to key
    consigneeZipCode : shipment.consignee_zip_code || "",
    actualWeight : shipment.actual_weight || "",
    gst : shipment.gst || "",
    shipmentValue : shipment.shipment_value,
    price : shipment.shipping_price || "",
    aadhaarNumber: shipment.aadhaar_number || "",
    aadhaarDoc: shipment.aadhaar_doc || "",
    invoiceNumber: shipment.invoice_number || "",
    invoiceDate: shipment.invoice_date || "",
    invoiceDoc: shipment.invoice_doc || "",
    packageType: shipment.package_type || "NON-DOX",
  });
  const formDataRef = useRef(formData);
  const updateForm = (patch) => {
    setFormData(prev => {
      const next = { ...prev, ...patch };
      formDataRef.current = next;
      return next;
    });
  };

  // Auto-calc shipment value whenever items change (sum of rate * quantity)
  useEffect(() => {
    const total = items.reduce((sum, it) => {
      const rate = parseFloat(it.rate) || 0;
      const qty = parseFloat(it.quantity) || 0;
      return sum + rate * qty;
    }, 0);
    if (String(total) !== String(formDataRef.current.shipmentValue)) {
      updateForm({ shipmentValue: String(total) });
    }
  }, [items]);

  const [files, setFiles] = useState({
    aadhaarDoc: null,
    invoiceDoc: null
  })

  const filesMeta = Object.freeze({
    aadhaarDoc: {
      label: "Aadhaar Document",
      required: true,
    },
    invoiceDoc: {
      label: "Invoice Document",
      required: false,
    }
  })

  const handleFileChange = async (e) => {
    const { name, files: newFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: newFiles[0]
    }));
  }
  // Warehouses, services, vendors
  const [warehouses, setWarehouses] = useState([])
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch(`${API_URL}/warehouse/warehouses`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          }
        });
        const result = await response.json();
        if (result?.rows) setWarehouses(result.rows);
      } catch(e){ console.error(e);}      
      try {
        const list = await getActiveInternationalServicesService();
        setServices(list || []);
      } catch(e){ console.error(e);}    
    };
    fetchAll();
  }, []);
  // Fetch vendors when service changes
  useEffect(() => {
    const fetchVend = async () => {
      try {
        if(!formData.service) { setVendors([]); return; }
        const list = await getServicesActiveVendorsService(formData.service);
        setVendors(list || []);
      } catch(e){ console.error(e);}    
    };
    fetchVend();
  }, [formData.service]);
  const addProduct = () => {
    setItems([...items, { hscode: '' , box_no: '' , quantity: 1 , rate: 1 , description: '' , unit: 'Pc', unit_weight: 0, item_weight_unit: 'kg', igst_amount : 0 }]);
  };
  const removeProduct = (index) => {
    setItems(it => it.filter((_, i) => i !== index));
  };
  const handleDocket = (index, event) => {
    const { name, value } = event.target;
    setDockets(ds => {
      const next = [...ds];
      next[index][name] = value;
      return next;
    });
  };
  const handleItems = (index, event) => {
    const { name, value } = event.target;
    setItems(it => {
      const next = [...it];
      next[index][name] = value;
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const uploadFile = async (file) => {
    if ((!files[file] && !formData[file]) && filesMeta[file]?.required){
      throw new Error(`${filesMeta[file]?.label} is required`);
    };
    if (!files[file]) return;
    try{
      const key = `shipment/international/${v4()}/${file}`;
  updateForm({ [file]: key });
      const filetype = files[file].type;
      const putUrl = await getS3PutUrlService(key, filetype, true);
      console.log(file)
      console.log(files[file])
      await s3FileUploadService(putUrl, files[file], filetype);
    } catch (error){
      console.error(error);
      setFormData((prev) => ({...prev, [file]: ""}));
      toast.error(`Failed to upload ${file}, try again!`)
    }
  }

  const handleUpload = async () => {
    try{
      setLoading("Uploading Files...")
      await Promise.all(
        Object.keys(files).map(key => uploadFile(key))
      );
      return true;
    } catch (error) {
      toast.error(error?.message || "Failed to upload files");
    } finally {
      setLoading(null);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate item rates > 0
    const invalidRate = items.some(it => {
      const r = parseFloat(it.rate);
      return isNaN(r) || r <= 0;
    });
    if (invalidRate){
      toast.error('Each item rate must be greater than 0');
      return;
    }
    if (!(await handleUpload())) return;
    try{
      setLoading("Updating Order...")
      const formData = {...formDataRef.current, dockets, items};
    let docketFlag = 0
    for (let i = 0; i < formData.dockets.length; i++) {
      for (let j = 0; j < formData.items.length; j++) {
        if (parseInt(formData.items[j].box_no) == i+1){
          docketFlag = 1
        }
      }
      if (docketFlag == 0){
        alert('Please make sure every docket has some items')
        return
      }
      docketFlag = 0
    }

    let itemFlag = 0
    for (let i = 0; i < formData.items.length; i++) {
      for (let j = 0; j < formData.dockets.length; j++) {
        if (formData.items[i].box_no == formData.dockets[j].box_no){
          itemFlag = 1
        }
      }
      if (itemFlag == 0){
        alert('Some items have invalid box no.')
        return
      }
      itemFlag = 0
    }

    fetch(`${API_URL}/order/international/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      },
  body: JSON.stringify({...formData}),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Order Updated successfully')
        } else {
          alert('Something Went Wrong, please try again')
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something Went Wrong, please try again');
      });
    } catch (error){
      console.error(error)
      toast.error("Failed to update order")
    } finally{
      setLoading(null)
    }
  }
  // ---------------- Country & Dial code searchable dropdowns ----------------
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [destCountryOpen, setDestCountryOpen] = useState(false);
  const [destCountrySearch, setDestCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);
  const destCountryRef = useRef(null);
  useEffect(()=>{
    const handler = (e)=>{
      if(countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) setCountryDropdownOpen(false);
      if(destCountryRef.current && !destCountryRef.current.contains(e.target)) setDestCountryOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return ()=>document.removeEventListener('mousedown', handler);
  },[]);
  const filteredCountries = useMemo(()=>{
    const q = countrySearch.toLowerCase();
    return Object.keys(COUNTRIES).filter(c =>
      COUNTRIES[c].name.toLowerCase().includes(q) || COUNTRIES[c].country_code.toLowerCase().includes(q)
    ).map(c => ({ key: c, name: COUNTRIES[c].name, code: COUNTRIES[c].country_code, iso2: COUNTRIES[c].iso_code2 }));
  },[countrySearch]);
  const filteredDestCountries = useMemo(()=>{
    const q = destCountrySearch.toLowerCase();
    return Object.keys(COUNTRIES).filter(c =>
      COUNTRIES[c].name.toLowerCase().includes(q) || COUNTRIES[c].country_code.toLowerCase().includes(q)
    ).map(c => ({ key: c, name: COUNTRIES[c].name, code: COUNTRIES[c].country_code, iso2: COUNTRIES[c].iso_code2 }));
  },[destCountrySearch]);

  // normalize legacy values to keys
  useEffect(() => {
    let patch = {};
    const currentCC = formDataRef.current.countryCode;
    if (currentCC && !COUNTRIES[currentCC]) {
      const found = Object.keys(COUNTRIES).find(k => COUNTRIES[k].country_code === currentCC);
      if (found) patch.countryCode = found;
    }
    const currentDest = formDataRef.current.consigneeCountry;
    if (currentDest && !COUNTRIES[currentDest]) {
      const found2 = Object.keys(COUNTRIES).find(k => COUNTRIES[k].name === currentDest);
      if (found2) patch.consigneeCountry = found2;
    }
    if (Object.keys(patch).length) updateForm(patch);
  }, [formData.countryCode, formData.consigneeCountry]);
  const displayDialCode = formData.countryCode && COUNTRIES[formData.countryCode]?.country_code;
  const displayCountryName = formData.consigneeCountry && COUNTRIES[formData.consigneeCountry]?.name;

  return (
    <div className="w-full p-4 flex flex-col items-center">
      <div className="text-3xl font-medium text-center my-8">Update Shipping Details</div>
      <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-8">
        {/* Service Details Card */}
        <div className="bg-white shadow rounded-2xl p-6 border">
          <div className="text-lg font-semibold mb-4">Service Details</div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="orderId">Order Id</label>
              <input id="orderId" name="iid" disabled value={formData.iid} onChange={handleChange} className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="wid" className="text-sm font-medium">Pickup Warehouse*</label>
              <select id="wid" name="wid" required value={formData.wid} onChange={handleChange} className="border rounded-xl px-4 py-2">
                <option value="">Select Warehouse</option>
                {warehouses.map(w => (<option key={w.wid} value={w.wid}>{w.warehouseName}</option>))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="service" className="text-sm font-medium">Service*</label>
              <select id="service" name="service" value={formData.service} onChange={handleChange} className="border rounded-xl px-4 py-2" required>
                <option value="">Select Service</option>
                {services.map(s => <option key={s.service_id} value={s.service_id}>{s.service_name}</option>)}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="vendor" className="text-sm font-medium">Vendor*</label>
              <select id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} className="border rounded-xl px-4 py-2" required>
                <option value="">Select Vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.vendor_name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Consignee Details Card */}
        <section className="bg-white/70  rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Consignee Details</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeName">Name*</label>
              <input id="consigneeName" name="consigneeName" required value={formData.consigneeName} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeCompany">Company*</label>
              <input id="consigneeCompany" name="consigneeCompany" required value={formData.consigneeCompany} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Country Code*</label>
              <div className="relative" ref={countryDropdownRef}>
                <button type="button" onClick={()=>setCountryDropdownOpen(o=>!o)} className="w-full border py-2 px-3 rounded-xl text-left flex justify-between items-center">
                  <span>{displayDialCode || 'Select'}</span>
                  <span className="ml-2">▾</span>
                </button>
                <input tabIndex={-1} style={{position:'absolute',opacity:0,height:0,width:0}} required value={displayDialCode || ''} onChange={()=>{}} />
                {countryDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-64 max-h-72 overflow-hidden bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <input autoFocus type="text" className="w-full border px-2 py-1 rounded-md text-sm" placeholder="Search code or name" value={countrySearch} onChange={(e)=>setCountrySearch(e.target.value)} />
                    </div>
                    <ul className="max-h-60 overflow-y-auto text-sm">
                      {filteredCountries.length === 0 && (<li className="px-3 py-2 text-gray-500">No matches</li>)}
                      {filteredCountries.map(c => (
                        <li key={c.iso2+"-code"}>
                          <button type="button" className={`w-full text-left px-3 py-2 hover:bg-blue-100 ${formData.countryCode===c.key ? 'bg-blue-50 font-medium':''}`} onClick={()=>{updateForm({countryCode:c.key}); setCountryDropdownOpen(false); setCountrySearch("");}}>
                            <span className="inline-block w-16">{c.code}</span>
                            <span>{c.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeContact">Contact*</label>
              <input id="consigneeContact" name="consigneeContact" required value={formData.consigneeContact} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeEmail">Email*</label>
              <input id="consigneeEmail" name="consigneeEmail" type="email" required value={formData.consigneeEmail} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="consigneeAddress">Address*</label>
              <input id="consigneeAddress" name="consigneeAddress" required value={formData.consigneeAddress} onChange={handleChange} maxLength={60} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeZipCode">Zip Code*</label>
              <input id="consigneeZipCode" name="consigneeZipCode" required value={formData.consigneeZipCode} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeCity">City*</label>
              <input id="consigneeCity" name="consigneeCity" required value={formData.consigneeCity} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeState">State*</label>
              <input id="consigneeState" name="consigneeState" required value={formData.consigneeState} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Country*</label>
              <div className="relative" ref={destCountryRef}>
                <button type="button" onClick={()=>setDestCountryOpen(o=>!o)} className="w-full border py-2 px-3 rounded-xl text-left flex justify-between items-center">
                  <span>{displayCountryName || 'Select'}</span>
                  <span className="ml-2">▾</span>
                </button>
                <input tabIndex={-1} style={{position:'absolute',opacity:0,height:0,width:0}} required value={displayCountryName || ''} onChange={()=>{}} />
                {destCountryOpen && (
                  <div className="absolute z-20 mt-1 w-full max-h-80 bg-white border rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b">
                      <input autoFocus type="text" className="w-full border px-2 py-1 rounded-md text-sm" placeholder="Search country" value={destCountrySearch} onChange={(e)=>setDestCountrySearch(e.target.value)} />
                    </div>
                    <ul className="max-h-72 overflow-y-auto text-sm">
                      {filteredDestCountries.length === 0 && (<li className="px-3 py-2 text-gray-500">No matches</li>)}
                      {filteredDestCountries.map(c => (
                        <li key={c.iso2+"-dest"}>
                          <button type="button" className={`w-full text-left px-3 py-2 hover:bg-blue-100 ${formData.consigneeCountry===c.key ? 'bg-blue-50 font-medium':''}`} onClick={()=>{updateForm({consigneeCountry:c.key}); setDestCountryOpen(false); setDestCountrySearch("");}}>
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Shipment Meta & Pricing */}
        <div className="bg-white shadow rounded-2xl p-6 border">
          <div className="text-lg font-semibold mb-4">Shipment Meta</div>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="flex flex-col space-y-2 md:col-span-1">
              <label htmlFor="contents" className="text-sm font-medium">Contents*</label>
              <input id="contents" name="contents" required value={formData.contents} onChange={handleChange} placeholder="Ex. Books" className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="shipmentValue" className="text-sm font-medium">Shipment Value*</label>
              <input id="shipmentValue" name="shipmentValue" type="number" min={0} required value={formData.shipmentValue} readOnly className="border rounded-xl px-4 py-2 bg-gray-100 cursor-not-allowed" title="Automatically calculated from Items (Rate * Qty)" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="gst" className="text-sm font-medium">Seller GST</label>
              <input id="gst" name="gst" value={formData.gst} onChange={handleChange} placeholder="GSTIN" className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="actualWeight" className="text-sm font-medium">Total Weight (Kg)*</label>
              <input id="actualWeight" name="actualWeight" type="number" min={0} required value={formData.actualWeight} onChange={handleChange} className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="packageType" className="text-sm font-medium">Package Type*</label>
              <select id="packageType" name="packageType" required value={formData.packageType} onChange={handleChange} className="border rounded-xl px-4 py-2">
                <option value="DOX">DOX</option>
                <option value="NON-DOX">NON-DOX</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dockets */}
        <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Dockets</div>
            <button type="button" onClick={handleAddDocket} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Docket</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">L*</th>
                  <th className="p-2">W*</th>
                  <th className="p-2">H*</th>
                  <th className="p-2">Weight*</th>
                  <th className="p-2">Qty*</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {dockets.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 font-medium">{i+1}</td>
                    <td className="p-2"><input required name="length" value={d.length} onChange={(e)=>handleDocket(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="breadth" value={d.breadth} onChange={(e)=>handleDocket(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="height" value={d.height} onChange={(e)=>handleDocket(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <input required name="docket_weight" value={d.docket_weight} onChange={(e)=>handleDocket(i,e)} className="w-20 border px-2 py-1 rounded" />
                        <select name="docket_weight_unit" value={d.docket_weight_unit} onChange={(e)=>handleDocket(i,e)} className="border px-2 py-1 rounded">
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2"><input required name="quantity" value={d.quantity} onChange={(e)=>handleDocket(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2 text-right">{dockets.length>1 && <button type="button" onClick={()=>handleDeleteDocket(i)} className="text-red-500 hover:underline">Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Items */}
        <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Items</div>
            <button type="button" onClick={addProduct} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Item</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">Box*</th>
                  <th className="p-2">HS Code</th>
                  <th className="p-2">Description*</th>
                  <th className="p-2">Qty*</th>
                  <th className="p-2">Rate*</th>
                  <th className="p-2">Weight (kg)</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2"><input required name="box_no" value={it.box_no} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input name="hscode" value={it.hscode} onChange={(e)=>handleItems(i,e)} className="w-24 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="description" value={it.description} onChange={(e)=>handleItems(i,e)} className="w-56 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="quantity" value={it.quantity} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="rate" value={it.rate} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <input name="unit_weight" value={it.unit_weight} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" />
                        <select name="item_weight_unit" value={it.item_weight_unit} onChange={(e)=>handleItems(i,e)} className="border px-2 py-1 rounded">
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2 text-right">{items.length>1 && <button type="button" onClick={()=>removeProduct(i)} className="text-red-500 hover:underline">Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
          <div className="text-lg font-semibold">KYC Document</div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label htmlFor="aadhaarNumber" className="text-sm font-medium">Aadhaar Number*</label>
              <input id="aadhaarNumber" name="aadhaarNumber" required value={formData.aadhaarNumber} onChange={handleChange} placeholder="XXXX-XXXX-XXXX" className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label htmlFor="aadhaarDoc" className="text-sm font-medium">Aadhaar Document (PDF/Image)</label>
              <input id="aadhaarDoc" name="aadhaarDoc" type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="border rounded-xl px-4 py-2" />
              {formData.aadhaarDoc && typeof formData.aadhaarDoc === 'string' && (
                  <a
                    href={`${import.meta.env.VITE_APP_BUCKET_URL}${formData.aadhaarDoc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    View
                  </a>
                )}
            </div>
          </div>
        </div>

        {/* Invoice Section */}
        <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
          <div className="text-lg font-semibold">Invoice Details</div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="invoiceNumber" className="text-sm font-medium">Invoice Number*</label>
              <input id="invoiceNumber" name="invoiceNumber" required value={formData.invoiceNumber} onChange={handleChange} placeholder="INV-001" className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="invoiceDate" className="text-sm font-medium">Invoice Date*</label>
              <input id="invoiceDate" name="invoiceDate" required type="date" value={formData.invoiceDate} onChange={handleChange} className="border rounded-xl px-4 py-2" />
            </div>
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label htmlFor="invoiceDoc" className="text-sm font-medium">Invoice Document (PDF/Image)</label>
              <input id="invoiceDoc" name="invoiceDoc" type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="border rounded-xl px-4 py-2" />
              {formData.invoiceDoc && typeof formData.invoiceDoc === 'string' && (
                  <a
                    href={`${import.meta.env.VITE_APP_BUCKET_URL}${formData.invoiceDoc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    View
                  </a>
                )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white shadow rounded-2xl p-6 border space-y-4">
          <div className="text-lg font-semibold">Pricing</div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col space-y-2 md:col-span-1">
              <label htmlFor="price" className="text-sm font-medium">Shipment Cost*</label>
              <input id="price" name="price" required type="number" min={0} value={formData.price} onChange={handleChange} placeholder="Ex. 1150" className="border rounded-xl px-4 py-2" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type='submit' disabled={loading} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition">{loading || "Update"}</button>
        </div>
      </form>
    </div>
  );
};

const Card = ({ shipment, onRefresh }) => {
    const [isManage, setIsManage] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);


    // Action handlers
    const handleRequest = async (orderId) => {
      setIsRequesting(true);
      try {
        const ensure = confirm('Are you sure you want to request this shipment?');
        if (!ensure) return;
        await createInternationalRequestShipmentService(orderId);
        await onRefresh();
        toast.success('Shipment request sent');
      } catch (err) {
        toast.error(err.message || 'Failed to request shipment');
      } finally {
        setIsRequesting(false);
      }
    };
    const handleCancelRequest = async (orderId) => {
      const ensure = confirm('Are you sure you want to cancel this shipment request?');
      if (!ensure) return;
      setIsCancelling(true);
      try {
        await cancelInternationalRequestShipmentService(orderId);
        await onRefresh();
        toast.success('Shipment request cancelled');
      } catch (err) {
        toast.error(err.message || 'Failed to cancel request');
      } finally {
        setIsCancelling(false);
      }
    };
    // Placeholder for cancel shipment (manifested)
    const handleCancelShipment = async (orderId) => {
      if (!orderId) {
        toast.error('Invalid order ID');
        return;
      }
      const ensure = confirm('Are you sure you want to cancel this shipment? This action cannot be undone.');
      if (!ensure) return;
      try{
        setIsCancelling(true);
        await cancelInternationalShipmentService(orderId);
        await onRefresh();
        toast.success('Shipment cancelled successfully');
      } catch (err){
        toast.error(err.message || 'Failed to cancel shipment');
      } finally {
        setIsCancelling(false);
      }
    };

    const handleGetLabel = async (orderId) => {
      if (!orderId) {
        toast.error('Invalid order ID');
        return;
      }
      try{
        const labelResponse = await getInternationalShipmentLabelService(orderId);
        if (labelResponse.isBase64URL){
          const link = document.createElement('a');
          link.href = labelResponse.label;
          link.download = `Label_${orderId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(labelResponse.label, '_blank');
        }
      } catch (err){
        toast.error(err.message || 'Failed to get label');
      }
    }

    // UI logic
    const isRequested = shipment.is_requested;
    const isManifested = shipment.is_manifested;
    const isCancelled = shipment.cancelled;
    const hasAwb = !!shipment.awb;

    return (
      <>
        <div className="w-full py-2 bg-white relative items-center px-4 sm:px-8 flex border-b">
          <div className="text-sm">
            <div className="font-bold">{shipment.iid}</div>
            <div>{shipment.consignee_name}</div>
            <div>{shipment.awb ? `AWB : ${shipment.awb}` : null}</div>
            <div>{shipment.created_at ? shipment.created_at.toString().split('T')[0] + ' ' + shipment.created_at.toString().split('T')[1].split('.')[0] : null}</div>
          </div>
          <div className="absolute right-4 sm:right-8 flex space-x-2">
            <div className="px-3 py-1 bg-blue-500 rounded-3xl text-white cursor-pointer" onClick={() => setIsManage(!isManage)}>{!isManage ? hasAwb ? "View" : "Manage" : "X"}</div>
            {/* Manifested: show label and cancel shipment */}
            {(isManifested && hasAwb && !isCancelled) ? (
              <>
                {/* <div className="px-3 py-1 bg-blue-500 rounded-3xl text-white cursor-pointer" onClick={() => handleGetLabel(shipment.iid)}>Label</div> */}
                <div className="px-3 py-1 bg-red-500 rounded-3xl text-white cursor-pointer" onClick={isCancelling ? () => {} : () => handleCancelShipment(shipment.iid)}>{isCancelling ? "Cancelling..." : "Cancel Shipment"}</div>
              </>
            ): null}
            {/* Not requested: show request button */}
            {!isRequested && !isManifested ? (
              <div className="px-3 py-1 bg-blue-500 rounded-3xl text-white cursor-pointer" onClick={isRequesting ? () => {} : () => handleRequest(shipment.iid)}>{isRequesting ? "Requesting..." : "Request"}</div>
            ): null}
            {/* Requested: show cancel request button */}
            {isRequested ? (
              <div className="px-3 py-1 bg-red-500 rounded-3xl text-white cursor-pointer" onClick={isCancelling ? () => {} : () => handleCancelRequest(shipment.iid)}>{isCancelling ? "Cancelling..." : "Cancel Request"}</div>
 ): null}
         
            {/* Cancelled: show message */}
            {isCancelled ? (
              <div className="px-3 py-1 bg-red-500 rounded-3xl text-white cursor-not-allowed">Cancelled</div>
            ): null} </div>
        </div>
        {isManage && <ManageForm isManage={isManage} setIsManage={setIsManage} shipment={shipment} isShipped={hasAwb} />}
      </>
    );
  };
  const PickupRequest = ({setPickup}) => {
    const [warehouses, setWarehouses] = useState([]);
    useEffect(() => {
      const getWarehouses = async () => {
        const response = await fetch(`${API_URL}/warehouse/warehouses`, {
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
      packages : ""
    })
    const handleSubmit = async (e) => {
      e.preventDefault();
      await fetch(`${API_URL}/shipment/domestic/pickup/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      }).then(response => response.json()).then(result => {
        if (result.schedule.incoming_center_name){
          alert("Pickup request sent successfully")
        }
        else if (result.schedule.prepaid){
          alert("Pickup request failed due to low balance of owner")
        }
        else if (result.schedule.pr_exist){
          alert("This time slot is already booked")
        }
        else {
          alert("Please enter a valid date and time in future")
        }
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="packages">No of packages</label>
              <input
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
    const [shipments, setShipments] = useState([]);
    const [pickup, setPickup] = useState(false);

    // Fetch shipments using service
    const fetchShipments = async () => {
      try {
        const data = await getAllInternationalShipmentsService();
        setShipments(data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to load shipments');
      }
    };

    useEffect(() => {
      fetchShipments();
    }, []);

    const refreshShipments = async () => {
      await fetchShipments();
    };

    return (
      <>
        <div className={`w-full p-4 flex flex-col items-center space-y-6 ${step == 0 ? "" : "hidden"}`}> 
          {pickup ? <PickupRequest setPickup={setPickup}/> : null}
          <div className="w-full h-16 px-4  relative flex">
            <div className="text-2xl font-medium">SHIPMENTS </div>
          </div>
          <div className="w-full">
            {shipments.map((shipment, index) => (
              <Card key={index} shipment={shipment} onRefresh={refreshShipments} />
            ))}
          </div>
        </div>
      </>
    );
  };

const UpdateOrderInternational = () => {
  const [step, setStep] = useState(0)
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {step==0 && <Listing step={step} setStep={setStep} />}
      {/* <FullDetails /> */}
    </div>
  );
};

export default UpdateOrderInternational;
