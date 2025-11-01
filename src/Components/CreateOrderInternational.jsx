import getServicesActiveVendorsService from "../services/serviceServices/getServicesActiveVendorsService";
import getActiveInternationalServicesService from "../services/serviceServices/getActiveInternationalServicesService";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from 'react-dom';
import { COUNTRIES } from "../Constants";
import { toast } from "react-toastify";
import getS3PutUrlService from "../services/s3Services/getS3PutUrlService";
import {v4} from "uuid";
import s3FileUploadService from "../services/s3Services/s3FileUploadService";
import {HS_CODES} from "../Constants"
// import getHsnCodesByDescService from "../services/hsnCodeServices/getHsnCodesByDescService";
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
    { box_no: 1, hscode: "", quantity: 1, rate: "10", description: "", unit: "Pc", unit_weight: "1", item_weight_unit: "kg" }
  ]);

  // HSN suggestions per item index (array of {c, n})
  const [hsnSuggestions, setHsnSuggestions] = useState({});
  const hsnTimersRef = useRef({});
  const hsnInputRefs = useRef([]);
  // const hsnPortalRef = useRef(null);

  // Description autocomplete (HS_CODES)
  const [descOpenIndex, setDescOpenIndex] = useState(null);
  const [descSuggestions, setDescSuggestions] = useState({}); // index -> string[]
  const descTimersRef = useRef({});
  const descInputRefs = useRef([]);
  const [descPortalPos, setDescPortalPos] = useState({ top: 0, left: 0, width: 0 });
  const filterDescriptions = (q) => {
    if (!q) return [];
    const query = String(q).toLowerCase().trim();
    if (!query) return [];
    // filter HS_CODES by substring match, return top 20
    return Object.keys(HS_CODES).filter(s => s && s.toLowerCase().includes(query)).slice(0, 20);
  };

  // Validation for consignee fields: disallow symbols (allow only letters, numbers and spaces)
  const [consigneeValidationErrors, setConsigneeValidationErrors] = useState({ address: '', city: '', state: '' });

  // Clear any timers on unmount
  useEffect(() => {
    return () => {
      Object.values(hsnTimersRef.current || {}).forEach(t => clearTimeout(t));
      Object.values(descTimersRef.current || {}).forEach(t => clearTimeout(t));
    };
  }, []);

  const fetchHsnSuggestions = (index, description) => {
    if (hsnTimersRef.current[index]) clearTimeout(hsnTimersRef.current[index]);
    hsnTimersRef.current[index] = setTimeout(async () => {
      try {
        if (!description || typeof description !== 'string') {
          // setHsnSuggestions(prev => ({ ...prev, [index]: [] }));
          return;
        }
        // const list = await getHsnCodesByDescService(description.trim());
        // setHsnSuggestions(prev => ({ ...prev, [index]: list || [] }));
        const hsn = HS_CODES[description.trim()];
        setItems(it => it.map((item, i) => i === index ? { ...item, hscode: hsn || "" } : item));
      } catch (err) {
        console.error('HSN lookup failed', err);
        // setHsnSuggestions(prev => ({ ...prev, [index]: [] }));
      }
    }, 400);
  };

  // Portal state for rendering suggestions on top of other content
  const [activeHsnIndex, setActiveHsnIndex] = useState(null);
  const [hsnPortalPos, setHsnPortalPos] = useState({ top: 0, left: 0, width: 0 });

  // Whenever suggestions for an index are set, mark it active and compute position
  // useEffect(() => {
  //   if (activeHsnIndex == null) return;
  //   const el = hsnInputRefs.current[activeHsnIndex];
  //   if (!el) return;
  //   const rect = el.getBoundingClientRect();
  //   setHsnPortalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
  // }, [activeHsnIndex, hsnSuggestions]);

  // When description changes we set active index so portal shows
  const setItemsAndActivate = (index, patch) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, ...patch } : it));
    // setActiveHsnIndex(index);
  }

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
  // useEffect(() => {
  //   const handler = (e) => {
  //     if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) setCountryDropdownOpen(false);
  //     if (destCountryRef.current && !destCountryRef.current.contains(e.target)) setDestCountryOpen(false);
  //     // close HSN portal when clicking outside input or portal
  //     try {
  //       const activeInput = hsnInputRefs.current[activeHsnIndex];
  //       if (activeInput && hsnPortalRef.current && !hsnPortalRef.current.contains(e.target) && !activeInput.contains(e.target)) {
  //         setActiveHsnIndex(null);
  //       }
  //     } catch (err) {}
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => document.removeEventListener("mousedown", handler);
  // }, [activeHsnIndex]);

  // Reposition portal when scrolling or resizing while active
  // useEffect(() => {
  //   if (activeHsnIndex == null) return;
  //   const reposition = () => {
  //     const el = hsnInputRefs.current[activeHsnIndex];
  //     if (!el) return;
  //     const rect = el.getBoundingClientRect();
  //     setHsnPortalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
  //   };
  // window.addEventListener('scroll', reposition, { passive: true });
  // // also listen to document-level scroll (capture) to catch scrolling in overflowed containers
  // document.addEventListener('scroll', reposition, true);
  // window.addEventListener('resize', reposition);
  //   // call once to ensure correct position
  //   reposition();
  //   return () => {
  //     window.removeEventListener('scroll', reposition);
  //     document.removeEventListener('scroll', reposition, true);
  //     window.removeEventListener('resize', reposition);
  //   };
  // }, [activeHsnIndex]);

  // Reposition description suggestions portal when open
  useEffect(() => {
    if (descOpenIndex == null) return;
    const el = descInputRefs.current[descOpenIndex];
    if (!el) return;
    const reposition = () => {
      const rect = el.getBoundingClientRect();
      setDescPortalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    };
    // initial position
    reposition();
    window.addEventListener('scroll', reposition, { passive: true });
    document.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition);
      document.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [descOpenIndex]);

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
    // Fields that should not contain symbols
    const consigneeFields = ['consigneeAddress', 'consigneeCity', 'consigneeState'];
    if (consigneeFields.includes(name)) {
      // allow only letters, numbers and spaces
      const invalidRegex = /[^A-Za-z0-9\s]/;
      const hasInvalid = invalidRegex.test(value);
      const sanitized = value.replace(/[^A-Za-z0-9\s]/g, '');
      // map field name to error key
      const key = name === 'consigneeAddress' ? 'address' : name === 'consigneeCity' ? 'city' : 'state';
      setConsigneeValidationErrors(prev => ({ ...prev, [key]: hasInvalid ? 'Symbols are not allowed' : '' }));
      updateForm({ [name]: sanitized });
    } else {
      updateForm({ [name]: value });
    }
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
    if (name === 'description') {
      // show HS_CODES suggestions (debounced)
      if (descTimersRef.current[index]) clearTimeout(descTimersRef.current[index]);
      descTimersRef.current[index] = setTimeout(() => {
        const list = filterDescriptions(value);
        setDescSuggestions(prev => ({ ...prev, [index]: list }));
        setDescOpenIndex(list.length ? index : null);
      }, 150);
      // existing: fetch HSN code suggestion based on description text
      fetchHsnSuggestions(index, value);
    }
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
    // Prevent submit if validation errors exist
    const hasConsigneeErrors = Object.values(consigneeValidationErrors).some(Boolean);
    if (hasConsigneeErrors) {
      toast.error('Please fix validation errors in consignee details before submitting');
      // focus first invalid field
      if (consigneeValidationErrors.address) document.getElementById('consigneeAddress')?.focus();
      else if (consigneeValidationErrors.city) document.getElementById('consigneeCity')?.focus();
      else if (consigneeValidationErrors.state) document.getElementById('consigneeState')?.focus();
      return;
    }
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
              <label className="text-sm font-medium" htmlFor="consigneeContact">Contact (Without Country Code)*</label>
              <input id="consigneeContact" name="consigneeContact" required value={formData.consigneeContact} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeEmail">Email*</label>
              <input id="consigneeEmail" name="consigneeEmail" type="email" required value={formData.consigneeEmail} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="consigneeAddress">Address*</label>
              <input id="consigneeAddress" name="consigneeAddress" required value={formData.consigneeAddress} onChange={handleChange} maxLength={60} className="w-full border py-2 px-3 rounded-xl" />
              {consigneeValidationErrors.address && <div className="text-xs text-red-600 mt-1">{consigneeValidationErrors.address}</div>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeZipCode">Zip Code*</label>
              <input id="consigneeZipCode" name="consigneeZipCode" required value={formData.consigneeZipCode} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeCity">City*</label>
              <input id="consigneeCity" name="consigneeCity" required value={formData.consigneeCity} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
              {consigneeValidationErrors.city && <div className="text-xs text-red-600 mt-1">{consigneeValidationErrors.city}</div>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="consigneeState">State*</label>
              <input id="consigneeState" name="consigneeState" required value={formData.consigneeState} onChange={handleChange} className="w-full border py-2 px-3 rounded-xl" />
              {consigneeValidationErrors.state && <div className="text-xs text-red-600 mt-1">{consigneeValidationErrors.state}</div>}
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

        {/* Dockets Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dockets</h2>
          </div>
          <div className="overflow-x-auto overflow-visible">
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
          <div className="flex justify-end">
            <button type="button" onClick={handleAddDocket} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Docket</button>
          </div>
        </section>
        {/* Items Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Items</h2>
          </div>
          <div className="overflow-x-auto overflow-visible">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">Box*</th>
                  <th className="p-2">Description*</th>
                  <th className="p-2">HS Code*</th>
                  <th className="p-2">Qty*</th>
                  <th className="p-2">Rate (₹)*</th>
                  <th className="p-2">Weight* (kg)</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                    <tr key={i} className="border-t">
                    <td className="p-2"><input required name="box_no" value={it.box_no} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2">
                      <input
                        required
                        name="description"
                        value={it.description}
                        onChange={(e)=>handleItems(i,e)}
                        onFocus={() => {
                          const list = filterDescriptions(items[i]?.description || '');
                          setDescSuggestions(prev => ({ ...prev, [i]: list }));
                          setDescOpenIndex(list.length ? i : null);
                          // compute initial position for portal
                          const el = descInputRefs.current[i];
                          if (el) {
                            const rect = el.getBoundingClientRect();
                            setDescPortalPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
                          }
                        }}
                        onBlur={() => {
                          // give a tiny delay to allow click
                          setTimeout(() => {
                            setDescOpenIndex(prev => (prev === i ? null : prev));
                          }, 120);
                        }}
                        className="w-56 border px-2 py-1 rounded"
                        autoComplete="off"
                        ref={(el) => descInputRefs.current[i] = el}
                      />
                    </td>
                    <td className="p-2">
                      <div className="relative">
                        <input
                          ref={(el) => hsnInputRefs.current[i] = el}
                          required
                          name="hscode"
                          value={it.hscode}
                          onChange={(e) => handleItems(i, e)}
                          onFocus={() => setActiveHsnIndex(i)}
                          className="w-28 border px-2 py-1 rounded"
                          autoComplete="off"
                        />
                      </div>
                    </td>
                    <td className="p-2"><input required name="quantity" value={it.quantity} onChange={(e)=>handleItems(i,e)} className="w-16 border px-2 py-1 rounded" /></td>
                    <td className="p-2"><input required type="text" name="rate" value={it.rate} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" /></td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <input required name="unit_weight" value={it.unit_weight} onChange={(e)=>handleItems(i,e)} className="w-20 border px-2 py-1 rounded" />
                      </div>
                    </td>
                    <td className="p-2 text-right">{items.length>1 && <button type="button" onClick={()=>removeProduct(i)} className="text-red-500 hover:underline">Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={addProduct} className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">Add Item</button>
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
          {activeHsnIndex !== null && hsnSuggestions[activeHsnIndex] && hsnSuggestions[activeHsnIndex].length > 0 && typeof document !== 'undefined' && createPortal(
        <div ref={hsnPortalRef} style={{ position: 'absolute', top: hsnPortalPos.top + 'px', left: hsnPortalPos.left + 'px', width: Math.max(240, hsnPortalPos.width) + 'px', zIndex: 1 }}>
          <div className="bg-white border rounded-xl shadow-lg max-h-72 overflow-y-auto">
            <ul className="text-sm">
              {hsnSuggestions[activeHsnIndex].map(s => (
                <li key={s.c}>
                  <button
                    type="button"
                    title={s.n}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50"
                    onClick={() => {
                      setItems(prev => prev.map((it2, idx) => idx === activeHsnIndex ? { ...it2, hscode: s.c } : it2));
                      setHsnSuggestions(prev => ({ ...prev, [activeHsnIndex]: [] }));
                      setActiveHsnIndex(null);
                    }}
                  >
                    {s.c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
            </div>, document.body)}

          {/* Description autocomplete portal anchored to description input */}
          {descOpenIndex !== null && Array.isArray(descSuggestions[descOpenIndex]) && descSuggestions[descOpenIndex].length > 0 && typeof document !== 'undefined' && createPortal(
            <div style={{ position: 'absolute', top: descPortalPos.top + 'px', left: descPortalPos.left + 'px', width: Math.max(280, descPortalPos.width) + 'px', zIndex: 9999 }}>
              <div className="bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <ul className="text-sm">
                  {descSuggestions[descOpenIndex].map((s, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-blue-50"
                        title={s}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setItems(prev => prev.map((it2, ix) => ix === descOpenIndex ? { ...it2, description: s } : it2));
                          // also try to auto-fetch HSN code for this description
                          fetchHsnSuggestions(descOpenIndex, s);
                          setDescOpenIndex(null);
                        }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>, document.body)}
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
