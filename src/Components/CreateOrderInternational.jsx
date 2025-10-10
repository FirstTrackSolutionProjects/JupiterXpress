import getServicesActiveVendorsService from "../services/serviceServices/getServicesActiveVendorsService";
import getActiveInternationalServicesService from "../services/serviceServices/getActiveInternationalServicesService";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { COUNTRIES } from "../Constants";
import { toast } from "react-toastify";
import getS3PutUrlService from "../services/s3Services/getS3PutUrlService";
import {v4} from "uuid";
import s3FileUploadService from "../services/s3Services/s3FileUploadService";
const API_URL = import.meta.env.VITE_APP_API_URL;

const FullDetails = () => {
  // Core form state
  const [formData, setFormData] = useState({
    wid: "",
    service: "",
    vendor: "",
    contents: "",
    consigneeName: "",
    consigneeCompany: "",
    countryCode: "India", // will be normalized to key if needed
    consigneeContact: "",
    consigneeEmail: "",
    consigneeAddress: "",
    consigneeZipCode: "",
    consigneeCity: "",
    consigneeState: "",
    consigneeCountry: "", // will be normalized to key if needed
    shipmentValue: "",
    gst: "",
    actualWeight: "1",
    price: "",
    aadhaarNumber: "",
    aadhaarDoc: "",
    invoiceNumber: "",
    invoiceDate: "",
    invoiceDoc: "",
    packageType: "NON-DOX",
  });
  const formDataRef = useRef(formData);

  const [files, setFiles] = useState({
    aadhaarDoc: null,
    invoiceDoc: null
  });

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

  const handleFileChange = (e) => {
    const { name, files: newFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: newFiles[0]
    }));
  };

  const [dockets, setDockets] = useState([
    { box_no: 1, docket_weight: 1, docket_weight_unit: "kg", length: 10, breadth: 10, height: 10, quantity: 1 }
  ]);
  const [items, setItems] = useState([
    { box_no: 1, hscode: "", quantity: 1, rate: "10", description: "Test", unit: "Pc", unit_weight: "1", item_weight_unit: "kg" }
  ]);

  // Auto-calculate shipment value whenever items change (rate * quantity)
  useEffect(() => {
    const total = items.reduce((sum, it) => {
      const rate = parseFloat(it.rate) || 0;
      const qty = parseFloat(it.quantity) || 0;
      return sum + rate * qty;
    }, 0);
    setFormData(prev => {
      const totalStr = String(total);
      if (prev.shipmentValue !== totalStr) {
        const next = { ...prev, shipmentValue: totalStr };
        formDataRef.current = next;
        return next;
      }
      return prev;
    });
  }, [items]);

  // Reference data
  const [warehouses, setWarehouses] = useState([]);
  const [services, setServices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [creatingStatus, setCreatingStatus] = useState(null);

  // Dropdown search states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [destCountryOpen, setDestCountryOpen] = useState(false);
  const [destCountrySearch, setDestCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);
  const destCountryRef = useRef(null);

  // Filtered lists
  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase();
    return Object.keys(COUNTRIES).filter(c =>
      COUNTRIES[c].name.toLowerCase().includes(q) || COUNTRIES[c].country_code.toLowerCase().includes(q)
    ).map(c => ({ key: c, name: COUNTRIES[c].name, code: COUNTRIES[c].country_code, iso2: COUNTRIES[c].iso_code2 }));
  }, [countrySearch]);

  const filteredDestCountries = useMemo(() => {
    const q = destCountrySearch.toLowerCase();
    return Object.keys(COUNTRIES).filter(c =>
      COUNTRIES[c].name.toLowerCase().includes(q) || COUNTRIES[c].country_code.toLowerCase().includes(q)
    ).map(c => ({ key: c, name: COUNTRIES[c].name, code: COUNTRIES[c].country_code, iso2: COUNTRIES[c].iso_code2 }));
  }, [destCountrySearch]);

  // Fetch warehouses & services on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
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
      } catch (e) { console.error(e); }
    };
    const fetchServices = async () => {
      try {
        const list = await getActiveInternationalServicesService();
        setServices(list || []);
      } catch (e) { console.error(e); }
    };
    fetchWarehouses();
    fetchServices();
  }, []);

  // Fetch vendors when service changes
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (!formData.service) return;
        const list = await getServicesActiveVendorsService(formData.service);
        setVendors(list || []);
      } catch (e) { console.error(e); }
    };
    fetchVendors();
  }, [formData.service]);

  // Outside click handlers
  useEffect(() => {
    const handler = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) setCountryDropdownOpen(false);
      if (destCountryRef.current && !destCountryRef.current.contains(e.target)) setDestCountryOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateForm = (patch) => {
    setFormData(prev => {
      const next = { ...prev, ...patch };
      formDataRef.current = next;
      return next;
    });
  }

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };
  const handleDocket = (index, e) => {
    const { name, value } = e.target;
    setDockets(ds => ds.map((d, i) => i === index ? { ...d, [name]: value } : d));
  };
  const handleDeleteDocket = (index) => {
    setDockets(ds => ds.filter((_, i) => i !== index).map((d, i2) => ({ ...d, box_no: i2 + 1 })));
  };
  const handleAddDocket = () => {
    setDockets(ds => [...ds, { box_no: ds.length + 1, docket_weight: 1, docket_weight_unit: "kg", length: 10, breadth: 10, height: 10, quantity: 1 }]);
  };
  const handleItems = (index, e) => {
    const { name, value } = e.target;
    setItems(it => it.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };
  const addProduct = () => {
    // Default rate set to '1' to satisfy > 0 rule
    setItems(it => [...it, { box_no: 1, hscode: "", quantity: 1, rate: "1", description: "", unit: "Pc", unit_weight: "", item_weight_unit: "kg" }]);
  };
  const removeProduct = (index) => {
    setItems(it => it.filter((_, i) => i !== index));
  };

  const uploadFile = async (file) => {
    if (!files[file]){
      if (filesMeta[file]?.required){
        throw new Error(`${filesMeta[file]?.label} is required`);
      }
      return;
    };
    try{
      const fileName = files[file].name
      const key = `shipment/international/${v4()}/${file}/${fileName}`;
      const newFormData = { ...formDataRef.current, [file]: key };
      formDataRef.current = newFormData;
      const filetype = files[file].type;
      const putUrl = await getS3PutUrlService(key, filetype, true);
      await s3FileUploadService(putUrl, files[file], filetype);
    } catch (error){
      console.error(error);
      setFormData((prev) => ({...prev, [file]: ""}));
      toast.error(`Failed to upload ${filesMeta[file]?.label}, try again!`)
    }
  }

  const handleUpload = async () => {
    try{
      setCreatingStatus("Uploading files...");
      await Promise.all(
        Object.keys(files).map(key => uploadFile(key))
      );
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to upload files");
      setCreatingStatus(null);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate item rates > 0 before any uploads/network
    const invalidRate = items.some(it => {
      const r = parseFloat(it.rate);
      return isNaN(r) || r <= 0;
    });
    if (invalidRate){
      toast.error('Each item rate must be greater than 0');
      return;
    }
    if (!(await handleUpload())) return;
    setCreatingStatus("Creating shipment...");
    const payload = {
      ...formDataRef.current,
      dockets: dockets,
      items
    };
    try {
      const res = await fetch(`${API_URL}/order/international/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Shipment created');
      } else {
        toast.error(data?.message || 'Failed to create');
      }
    } catch (err) {
      toast.error('Network error');
      console.error(err);
    } finally{
      setCreatingStatus(null);
    }
  };

  useEffect(()=>{
    // Normalize countryCode and consigneeCountry if they currently store name instead of key
    const patch = {};
    if (formData.countryCode && !COUNTRIES[formData.countryCode]){
      const matchKey = Object.keys(COUNTRIES).find(k => COUNTRIES[k].name === formData.countryCode);
      if (matchKey) patch.countryCode = matchKey;
    }
    if (formData.consigneeCountry && !COUNTRIES[formData.consigneeCountry]){
      const matchKey = Object.keys(COUNTRIES).find(k => COUNTRIES[k].name === formData.consigneeCountry);
      if (matchKey) patch.consigneeCountry = matchKey;
    }
    if (Object.keys(patch).length) updateForm(patch);
  }, [formData.countryCode, formData.consigneeCountry]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-center my-8 tracking-tight">Create International Shipment</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        {/* Service Details */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Service Details</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="wid">Pickup Warehouse*</label>
              <select id="wid" name="wid" required value={formData.wid} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl">
                <option value="">Select Warehouse</option>
                {warehouses.map(w => <option key={w.wid} value={w.wid}>{w.warehouseName}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="service">Service*</label>
              <select id="service" name="service" required value={formData.service} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl">
                <option value="">Select Service</option>
                {services.map(s => <option key={s.service_id} value={s.service_id}>{s.service_name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="vendor">Vendor*</label>
              <select id="vendor" name="vendor" required value={formData.vendor} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl">
                <option value="">Select Vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.vendor_name}</option>)}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="packageType" className="text-sm font-medium">Package Type*</label>
              <select id="packageType" name="packageType" required value={formData.packageType} onChange={handleChange} className="border rounded-xl px-4 py-2">
                <option value="DOX">DOX</option>
                <option value="NON-DOX">NON-DOX</option>
              </select>
            </div>
          </div>
        </section>
        {/* Consignee Details */}
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
                  <span>{formData.countryCode ? (COUNTRIES[formData.countryCode]?.country_code || formData.countryCode) : 'Select'}</span>
                  <span className="ml-2">▾</span>
                </button>
                {countryDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-64 max-h-72 overflow-hidden bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <input autoFocus required type="text" className="w-full border px-2 py-1 rounded-md text-sm" placeholder="Search code or name" value={countrySearch} onChange={(e)=>setCountrySearch(e.target.value)} />
                    </div>
                    <ul className="max-h-60 overflow-y-auto text-sm">
                      {filteredCountries.length === 0 && (<li className="px-3 py-2 text-gray-500">No matches</li>)}
                      {filteredCountries.map(c => (
                        <li key={c.key+"-code"}>
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
                  <span>{formData.consigneeCountry ? (COUNTRIES[formData.consigneeCountry]?.name || formData.consigneeCountry) : 'Select'}</span>
                  <span className="ml-2">▾</span>
                </button>
                {destCountryOpen && (
                  <div className="absolute z-20 mt-1 w-full max-h-80 bg-white border rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b">
                      <input autoFocus required type="text" className="w-full border px-2 py-1 rounded-md text-sm" placeholder="Search country" value={destCountrySearch} onChange={(e)=>setDestCountrySearch(e.target.value)} />
                    </div>
                    <ul className="max-h-72 overflow-y-auto text-sm">
                      {filteredDestCountries.length === 0 && (<li className="px-3 py-2 text-gray-500">No matches</li>)}
                      {filteredDestCountries.map(c => (
                        <li key={c.key+"-dest"}>
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

        {/** Shipment Meta Section */}
        <div className="bg-white shadow rounded-2xl p-6 border">
          <div className="text-lg font-semibold mb-4">Shipment Meta</div>
          <div className="grid gap-4 md:grid-cols-4">
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
              <input id="actualWeight" name="actualWeight" type="text" required value={formData.actualWeight} onChange={handleChange} className="border rounded-xl px-4 py-2" />
            </div>
          </div>
        </div>

        {/* Dockets Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dockets</h2>
            <button type="button" onClick={handleAddDocket} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Docket</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">L (cm)*</th>
                  <th className="p-2">W (cm)*</th>
                  <th className="p-2">H (cm)*</th>
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
                        <input name="docket_weight" required value={d.docket_weight} onChange={(e)=>handleDocket(i,e)} className="w-20 border px-2 py-1 rounded" />
                        <select name="docket_weight_unit" required value={d.docket_weight_unit} onChange={(e)=>handleDocket(i,e)} className="border px-2 py-1 rounded">
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-2"><input name="quantity" value={d.quantity} onChange={(e)=>handleDocket(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2 text-right">
                      {dockets.length>1 && <button type="button" onClick={()=>handleDeleteDocket(i)} className="text-red-500 hover:underline">Remove</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Items Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items</h2>
            <button type="button" onClick={addProduct} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Item</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">Box*</th>
                  <th className="p-2">HS Code*</th>
                  <th className="p-2">Description*</th>
                  <th className="p-2">Qty*</th>
                  <th className="p-2">Rate (₹)*</th>
                  <th className="p-2">Weight (kg)</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2"><input required name="box_no" value={it.box_no} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="hscode" minLength={8} maxLength={8} value={it.hscode} onChange={(e)=>handleItems(i,e)} className="w-28 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="description" value={it.description} onChange={(e)=>handleItems(i,e)} className="w-56 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required name="quantity" value={it.quantity} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required type="text" name="rate" value={it.rate} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <input name="unit_weight" value={it.unit_weight} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" />
                      </div>
                    </td>
                    <td className="p-2 text-right">{items.length>1 && <button type="button" onClick={()=>removeProduct(i)} className="text-red-500 hover:underline">Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Documents Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">KYC Document</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="aadhaarNumber">Aadhaar Number*</label>
              <input id="aadhaarNumber" required name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="XXXXXXXXXXXX" className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="aadhaarDoc">Aadhaar Document (PDF/Image)*</label>
              <input id="aadhaarDoc" required name="aadhaarDoc" type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
          </div>
        </section>
        {/* Invoice Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Invoice Details</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="invoiceNumber">Invoice Number*</label>
              <input id="invoiceNumber" required name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="INV-001" className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="invoiceDate">Invoice Date*</label>
              <input id="invoiceDate" required name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="invoiceDoc">Invoice Document (PDF/Image)</label>
              <input id="invoiceDoc" name="invoiceDoc" type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
          </div>
        </section>
        {/* Pricing */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Pricing</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="price">Shipment Cost (As provided)*</label>
              <input id="price" required name="price" value={formData.price} onChange={handleChange} placeholder="Ex. 1150" className="w-full border py-2 px-3 rounded-xl" />
            </div>
          </div>
        </section>
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={!!creatingStatus} className="px-6 py-2 rounded-xl bg-blue-600 text-white">{creatingStatus || "Create Shipment"}</button>
        </div>
      </form>
    </div>
  );
};
// ...existing code...
const CreateOrderInternational = () => {
  return (
    <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <FullDetails />
    </div>
  );
};

export default CreateOrderInternational;
// ...existing code...
