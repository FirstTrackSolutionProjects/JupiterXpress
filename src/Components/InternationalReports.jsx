import { useEffect, useState } from "react";
import { Box, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, FormControl, InputLabel, Select, MenuItem, Autocomplete, Menu, Typography, Chip, Divider, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { DataGrid } from "@mui/x-data-grid";
import getAllInternationalShipmentsService from "../services/shipmentServices/internationalShipmentServices/getAllInternationalShipmentsService";
import getActiveInternationalServicesService from "../services/serviceServices/getActiveInternationalServicesService";
import getServicesActiveVendorsService from "../services/serviceServices/getServicesActiveVendorsService";
import { jwtDecode } from "jwt-decode";
import deductInternationalExtraChargeService from "../services/shipmentServices/internationalShipmentServices/deductInternationalExtraChargeService";
import allocateInternationalForwardingNumberService from "../services/shipmentServices/internationalShipmentServices/allocateInternationalForwardingNumberService";
import { toast } from "react-toastify";
import manualTrackingEventEntryService from "../services/shipmentServices/internationalShipmentServices/manualTrackingEventEntryService";
import assignCostPriceInternationalService from "../services/shipmentServices/internationalShipmentServices/assignCostPriceInternationalService";
import { COUNTRIES } from "../Constants";

const API_URL = import.meta.env.VITE_APP_API_URL;
import DownloadIcon from '@mui/icons-material/Download';
import getAllInternationalShipmentReportsDataService from '../services/shipmentServices/internationalShipmentServices/getAllInternationalShipmentReportsDataService';
import convertToUTCISOString from "../helpers/convertToUTCISOString";
import TrackingShareDialog from './TrackingShareDialog';

const InternationalOrderDetailsDialog = ({ isOpen, onClose, orderId, shipment, isAdmin }) => {
  const [dockets, setDockets] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !orderId || !shipment) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [dockRes, itemRes] = await Promise.all([
          fetch(`${API_URL}/order/international/dockets`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
            body: JSON.stringify({ iid: orderId }),
          }).then(res => res.json()),
          fetch(`${API_URL}/order/international/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
            body: JSON.stringify({ iid: orderId }),
          }).then(res => res.json())
        ]);
        if (dockRes.dockets) setDockets(dockRes.dockets);
        if (itemRes.dockets) setItems(itemRes.dockets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [isOpen, orderId, shipment]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusColor = (status) => {
    if (shipment?.cancelled) return 'error';
    if (shipment?.awb) return 'success';
    if (shipment?.is_requested) return 'warning';
    return 'primary';
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: { xs: 2, sm: 3 }, 
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Order Details - {orderId}
            </Typography>
            <Chip 
              label={shipment?.cancelled ? 'CANCELLED' : shipment?.awb ? 'MANIFESTED' : shipment?.is_requested ? 'REQUESTED' : 'PENDING'} 
              color={getStatusColor()} 
              size="small" 
              sx={{ fontWeight: 600, px: 1, height: 20, fontSize: '0.65rem' }}
            />
          </Box>
          <IconButton onClick={onClose} sx={{ '&:hover': { color: 'error.main', bgcolor: 'error.light' }, p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </DialogTitle>
      
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
        {loading ? (
          <Box p={8} textAlign="center" display="flex" flexDirection="column" alignItems="center" gap={2}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-800"></div>
            <Typography color="text.secondary">Fetching order details...</Typography>
          </Box>
        ) : (
          <Box className="space-y-6 md:space-y-8">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }} gutterBottom>
                  CONTACT INFORMATION
                </Typography>
                <Box className="grid grid-cols-2 gap-x-3 gap-y-4 mt-4">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Merchant</Typography>
                    <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ wordBreak: 'break-word' }}>{shipment.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all', mt: 0.5, display: 'block', lineHeight: 1.1 }}>{shipment.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Consignee</Typography>
                    <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ wordBreak: 'break-word' }}>{shipment.consignee_name || shipment.customer_name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all', mt: 0.5, display: 'block', lineHeight: 1.1 }}>{shipment.consignee_email || shipment.customer_email}</Typography>
                    <Typography variant="caption" color="text.secondary">{shipment.consignee_contact_no || shipment.customer_mobile}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ letterSpacing: '0.05em', fontSize: '0.7rem' }} gutterBottom>
                  SHIPMENT INFO
                </Typography>
                <Box className="grid grid-cols-2 gap-x-2 gap-y-4 mt-4">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Service Type</Typography>
                    <Chip label={shipment.package_type || "N/A"} size="small" color="default" sx={{ mt: 0.5, fontWeight: 700, height: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Courier / Vendor</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                      {shipment.service_name} / {shipment.vendor_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Ref ID</Typography>
                    <Typography variant="body2" fontWeight="700" color="primary.main" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                      {shipment.ref_id || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Warehouse</Typography>
                    <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'}, wordBreak: 'break-word' }}>{shipment.warehouseName || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Shipping Charge</Typography>
                    <Typography variant="body2" fontWeight="700" color="error.main" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                      {shipment.shipping_charge ? `- ₹${parseFloat(shipment.shipping_charge).toFixed(2)}` : 'N/A'}
                    </Typography>
                  </Box>
                  {isAdmin && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">Cost Price (Admin)</Typography>
                      <Typography variant="body2" fontWeight="700" color="text.secondary" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                        {shipment.cost_price ? `₹${parseFloat(shipment.cost_price).toFixed(2)}` : 'N/A'}
                      </Typography>
                    </Box>
                  )}
                  {isAdmin && <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" display="block">AWB Number</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="body2" fontWeight="800" color="primary.main" sx={{ wordBreak: 'break-all', fontSize: {xs: '0.85rem', sm: '1rem'} }}>{shipment.awb || 'N/A'}</Typography>
                      {shipment.awb && (
                        <Tooltip title="Copy AWB">
                          <IconButton size="small" onClick={() => handleCopy(shipment.awb)} sx={{ p: 0.5 }}>
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>}
                </Box>
              </Paper>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
              <Box>
                <Typography variant="subtitle2" fontWeight="800" display="flex" alignItems="center" gap={1.5} mb={2} color="text.primary" sx={{ fontSize: {xs: '0.75rem', sm: '0.875rem'} }}>
                  <Box sx={{ width: 6, height: 18, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                  ORIGIN
                </Typography>
                <Box sx={{ pl: 2.5 }}>
                  <Typography variant="body2" fontWeight="700" color="text.primary" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                    {shipment.warehouse_city}, {shipment.warehouse_state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: {xs: '0.75rem', sm: '0.875rem'} }}>
                    {shipment.warehouse_country} — {shipment.warehouse_pin}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" display="flex" alignItems="center" gap={1.5} mb={2} color="text.primary" sx={{ fontSize: {xs: '0.75rem', sm: '0.875rem'} }}>
                  <Box sx={{ width: 6, height: 18, bgcolor: 'error.main', borderRadius: 0.5 }} />
                  DESTINATION
                </Typography>
                <Box sx={{ pl: 2.5 }}>
                  <Typography variant="body2" fontWeight="700" color="text.primary" sx={{ fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                    {shipment.consignee_city}, {shipment.consignee_state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: {xs: '0.75rem', sm: '0.875rem'} }}>
                    {COUNTRIES[shipment.consignee_country]?.name || shipment.consignee_country} — {shipment.consignee_zip_code}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="800" display="flex" alignItems="center" gap={1.5} mb={2} color="text.primary">
                <InventoryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                DOCKETS ({dockets.length})
              </Typography>
              <Paper variant="outlined" sx={{ overflowX: 'auto', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Box #</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Dimensions (L×B×H cm)</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-right">Weight</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockets.map((b, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700">{b.box_no}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">{b.length} × {b.breadth} × {b.height}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900 font-bold text-right">{b.docket_weight} {b.docket_weight_unit}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 text-center font-medium">{b.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="800" display="flex" alignItems="center" gap={1.5} mb={2} color="text.primary">
                <ListAltIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                ITEM DETAILS
              </Typography>
              <Paper variant="outlined" sx={{ overflowX: 'auto', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Box #</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest">Product Name</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-center">Qty</th>
                      <th className="p-3 sm:p-4 font-bold text-gray-600 text-[10px] uppercase tracking-widest text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-700">{it.box_no}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 font-medium" style={{ wordBreak: 'break-word' }}>{it.description}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 text-center font-bold">{it.quantity}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-900 font-bold text-right">₹{parseFloat(it.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Box>

            <Box display="flex" justifyContent="flex-end" pt={2} pb={2}>
              <Paper 
                variant="elevation" 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 3, 
                  minWidth: { xs: '100%', sm: 280 }, 
                  bgcolor: '#F3F4F6',
                  border: '1px solid #E5E7EB'
                }}
              >
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" fontWeight="600" color="text.secondary">Total Items</Typography>
                  <Typography variant="body2" fontWeight="800" color="text.primary">
                    {items.reduce((acc, item) => acc + parseInt(item.quantity), 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" fontWeight="600" color="text.secondary">Total Value</Typography>
                  <Typography variant="body2" fontWeight="800" color="text.primary">
                    ₹{items.reduce((acc, item) => acc + (parseFloat(item.rate) * parseInt(item.quantity)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" fontWeight="600" color="text.secondary">Total volumetric weight</Typography>
                  <Typography variant="body2" fontWeight="800" color="text.primary">
                    {(dockets.reduce((acc, box) => acc + (parseFloat(box.length) * parseFloat(box.breadth) * parseFloat(box.height) * parseInt(box.quantity || 1)), 0) / 5000).toFixed(3)} kg
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, borderColor: '#D1D5DB' }} />
                <Box display="flex" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="subtitle1" fontWeight="800" color="text.primary">Actual Weight</Typography>
                  <Typography variant="h6" fontWeight="900" color="primary.main">
                    {shipment.actual_weight} Kg
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Tracking cards (unchanged functional rendering)
const ReportCard = ({ scan }) => (
  <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
    <div className="flex flex-col items-center justify-center">
      <div className="font-bold">{scan?.status}</div>
      {scan?.description && <div>{scan.description}</div>}
      {scan?.location && <div>{scan.location}</div>}
      <div>{scan.timestamp}</div>
    </div>
  </div>
);

// View dialog (MUI) using existing tracking render logic
const ViewDialog = ({ isOpen, onClose, report }) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getReport = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/shipment/international/report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ awb: report.awb }),
        });
        const data = await response.json();
        setStatus(data.track);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && report?.awb) getReport();
  }, [isOpen, report?.awb]);

  const renderStatus = () => {
    if (isLoading) return <div>Loading...</div>;
    if (!status) return <div>No Tracking Events Available</div>;
    return status?.length ? status.map((scan, i) => <ReportCard key={i} scan={scan} />) : <div>No Tracking Events Available</div>;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>Shipment Status</div>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{renderStatus()}</DialogContent>
    </Dialog>
  );
};

const PAGE_SIZE = 50;

const MANUAL_STATUS_OPTIONS = [
  "PICKED UP",
  "SHIPMENT IS UNDER PROCESS",
  "READY FOR DISPATCH",
  "HANDOVER TO AIRLINES",
];

const FORWARDING_SERVICE_OPTIONS = [
  "UPS",
  "FEDEX",
  "DHL",
  "ARAMEX",
  "PUROLATOR",
  "COURIER PLEASE",
  "CANPER",
  "DPD",
  "NEW ZEALAND POST",
  "AUSTRALIA POST",
  "CANADA POST",
  "USPS",
];

const Listing = () => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState(null); // set when API returns full array (no pagination)
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTrackingShareOpen, setIsTrackingShareOpen] = useState(false);
  const [currentTrackingShareData, setCurrentTrackingShareData] = useState(null);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [extraSubmitting, setExtraSubmitting] = useState(false);
  const [extraForm, setExtraForm] = useState({ amount: "", reason: "" });
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [forwardSubmitting, setForwardSubmitting] = useState(false);
  const [forwardForm, setForwardForm] = useState({ forwarding_number: "", forwarding_service: "" });
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState({ status: "", description: "", location: "", timestampDate: "", timestampTime: "" });
  const [isCostOpen, setIsCostOpen] = useState(false);
  const [costSubmitting, setCostSubmitting] = useState(false);
  const [costValue, setCostValue] = useState("");
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [actionsRow, setActionsRow] = useState(null);
  const [filters, setFilters] = useState({
    awb: "",
    iid: "",
    ref_id: "",
    serviceId: "",
    vendorId: "",
    merchant_name: "",
    merchant_email: "",
    consignee_name: "",
    consignee_email: "",
    startDate: "",
    endDate: "",
  });
  const [services, setServices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // Determine if current user is admin from JWT
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setIsAdmin(Boolean(decoded?.admin));
      }
    } catch (_) {}

    const fetchServices = async () => {
      try {
        const list = await getActiveInternationalServicesService();
        setServices(Array.isArray(list) ? list : []);
      } catch (e) {
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  // Load vendors when a service is selected; clear vendor filter when service changes
  useEffect(() => {
    const loadVendors = async () => {
      try {
        if (!filters.serviceId) {
          setVendors([]);
          setFilters((prev) => ({ ...prev, vendorId: "" }));
          return;
        }
        const list = await getServicesActiveVendorsService(filters.serviceId);
        setVendors(Array.isArray(list) ? list : []);
        // If current vendorId is not in the new list, clear it
        setFilters((prev) => ({
          ...prev,
          vendorId: list?.some(v => String(v.vendor_id) === String(prev.vendorId)) ? prev.vendorId : ""
        }));
      } catch (_) {
        setVendors([]);
        setFilters((prev) => ({ ...prev, vendorId: "" }));
      }
    };
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.serviceId]);

  // Export current dataset to CSV
  const exportToCSV = (rows, filename = 'international_reports.csv') => {
    try {
      const arr = Array.isArray(rows) ? rows : [];
      if (!arr.length) throw new Error('No data to export');
      const headers = Array.from(new Set(arr.flatMap(obj => Object.keys(obj || {}))));
      const esc = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      };
      const lines = [headers.join(',')].concat(
        arr.map(obj => headers.map(h => esc(obj[h])).join(','))
      );
      const csv = lines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to export CSV');
    }
  };

  // Trigger server-side fetch of full reports dataset based on current filters
  const handleDownload = async () => {
    try {
      const params = {
        awb: filters.awb || undefined,
        iid: filters.iid || undefined,
        ref_id: filters.ref_id || undefined,
        serviceId: filters.serviceId || undefined,
        vendorId: filters.vendorId || undefined,
        // Admin vs merchant person filters
        ...(isAdmin
          ? {
              merchant_name: filters.merchant_name || undefined,
              merchant_email: filters.merchant_email || undefined,
            }
          : {
              consignee_name: filters.consignee_name || undefined,
              consignee_email: filters.consignee_email || undefined,
            }),
        startDate: filters.startDate ? convertToUTCISOString(new Date(filters.startDate).setHours(0,0,0,0)) : undefined,
        endDate: filters.endDate ? convertToUTCISOString(new Date(filters.endDate).setHours(23,59,59,999)) : undefined,
      };
      const data = await getAllInternationalShipmentReportsDataService(params);
      exportToCSV(data || [], 'international_reports.csv');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to download reports');
    }
  };

  const handleTrackAndShare = async (reportRow) => {
    if (!reportRow?.awb) return toast.error("AWB missing");
    setSelectedReport(reportRow);
    setIsTrackingShareOpen(true);
    try {
      const response = await fetch(`${API_URL}/shipment/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb: reportRow.awb })
      });
      const result = await response.json();
      setCurrentTrackingShareData(result);
    } catch (error) { setCurrentTrackingShareData({ success: false }); }
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = {
        awb: filters.awb || undefined,
        iid: filters.iid || undefined,
        ref_id: filters.ref_id || undefined,
        serviceId: filters.serviceId || undefined,
        vendorId: filters.vendorId || undefined,
        // Admin vs merchant person filters
        ...(isAdmin
          ? {
              merchant_name: filters.merchant_name || undefined,
              merchant_email: filters.merchant_email || undefined,
            }
          : {
              consignee_name: filters.consignee_name || undefined,
              consignee_email: filters.consignee_email || undefined,
            }),
        startDate: filters.startDate ? convertToUTCISOString(new Date(filters.startDate).setHours(0,0,0,0)) : undefined,
        endDate: filters.endDate ? convertToUTCISOString(new Date(filters.endDate).setHours(23,59,59,999)) : undefined,
        page,
      };

      const response = await getAllInternationalShipmentsService(params);
      const data = response?.data;
      // Support both array and paginated object shapes
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
        setAllReports(sorted);
        setTotalPages(response?.totalPages);
        setReports(sorted);
      } else if (data && typeof data === "object") {
        const rows = data.reports || data.rows || data.orders || data.data || [];
        setReports(rows);
        if (typeof data.totalPages === "number") setTotalPages(data.totalPages || 1);
        if (typeof data.page === "number") setPage(Number(data.page) || 1);
      } else {
        setReports([]);
        setTotalPages(1);
      }
    } catch (e) {
      setReports([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.awb, filters.iid, filters.ref_id, filters.serviceId, filters.vendorId, filters.merchant_name, filters.merchant_email, filters.consignee_name, filters.consignee_email, filters.startDate, filters.endDate]);

  const handleOpenExtra = (row) => {
    setSelectedReport(row);
    setExtraForm({ amount: "", reason: "" });
    setIsExtraOpen(true);
  };

  const handleSubmitExtra = async () => {
    try {
      if (!selectedReport) return;
      const amtNum = parseFloat(extraForm.amount);
      if (isNaN(amtNum) || amtNum <= 0) {
        toast.error("Amount must be a number greater than 0");
        return;
      }
      if (!extraForm.reason || !extraForm.reason.trim()) {
        toast.error("Reason is required");
        return;
      }
      setExtraSubmitting(true);
      // Assumption: orderId corresponds to iid; fallback to ref_id if missing
      const orderId = selectedReport?.iid || selectedReport?.ref_id;
      await deductInternationalExtraChargeService(orderId, { amount: amtNum, reason: extraForm.reason.trim() });
      toast.success("Extra charge applied successfully");
      setIsExtraOpen(false);
      setExtraForm({ amount: "", reason: "" });
      // Optionally refresh reports
      fetchReports();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to apply extra charge";
      toast.error(msg || "Failed to apply extra charge");
    } finally {
      setExtraSubmitting(false);
    }
  };

  const handleOpenForward = (row) => {
    setSelectedReport(row);
    setForwardForm({
      forwarding_number: row?.forwarding_number || "",
      forwarding_service: row?.forwarding_service || "",
    });
    setIsForwardOpen(true);
  };

  const handleOpenManual = (row) => {
    setSelectedReport(row);
    setManualForm({ status: "", description: "", location: "", timestampDate: "", timestampTime: "" });
    setIsManualOpen(true);
  };

  const handleOpenCost = (row) => {
    setSelectedReport(row);
    const existing = row?.cost_price;
    const initial = existing != null && existing !== "" ? String(existing) : "";
    setCostValue(initial);
    setIsCostOpen(true);
  };

  const handleSubmitForward = async () => {
    try {
      if (!selectedReport) return;
      const { forwarding_number, forwarding_service } = forwardForm;
      if (!forwarding_number || !forwarding_service) {
        toast.error("Both forwarding number and service are required");
        return;
      }
      setForwardSubmitting(true);
      const orderId = selectedReport?.iid || selectedReport?.ref_id;
      await allocateInternationalForwardingNumberService(orderId, { forwarding_number, forwarding_service });
      toast.success("Forwarding number saved");
      setIsForwardOpen(false);
      // Refresh list to reflect new values
      fetchReports();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save forwarding info";
      toast.error(msg);
    } finally {
      setForwardSubmitting(false);
    }
  };

  const handleSubmitManual = async () => {
    try {
      if (!selectedReport) return;
      const { status, description, location, timestampDate, timestampTime } = manualForm;
      if (!status || !status.trim()) {
        toast.error("Status is required");
        return;
      }
      // if (!description || !description.trim()) {
      //   toast.error("Description is required");
      //   return;
      // }
      if (!location || !location.trim()) {
        toast.error("Location is required");
        return;
      }
      if (!timestampDate || !timestampTime) {
        toast.error("Both date and time are required for timestamp");
        return;
      }
      setManualSubmitting(true);
      const timestamp = `${timestampDate} ${timestampTime}`;
      const refId = selectedReport?.ref_id || selectedReport?.iid || selectedReport?.awb;
      await manualTrackingEventEntryService(refId, {
        status: status.trim(),
        description: description?.trim() || "",
        location: location.trim(),
        timestamp,
      });
      toast.success("Tracking event added");
      setIsManualOpen(false);
      setManualForm({ status: "", description: "", location: "", timestampDate: "", timestampTime: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add tracking event";
      toast.error(msg);
    } finally {
      setManualSubmitting(false);
    }
  };

  const handleSubmitCost = async () => {
    try {
      if (!selectedReport) return;
      const val = parseFloat(costValue);
      if (!Number.isFinite(val) || val <= 0) {
        toast.error("Please enter a valid cost price greater than 0");
        return;
      }
      setCostSubmitting(true);
      const orderId = selectedReport?.iid || selectedReport?.ref_id;
      if (!orderId) {
        toast.error("Invalid order ID");
        return;
      }
      await assignCostPriceInternationalService(orderId, { cost_price: val });
      toast.success("Cost price assigned successfully");
      setIsCostOpen(false);
      setCostValue("");
      await fetchReports();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to assign cost price";
      toast.error(msg || "Failed to assign cost price");
    } finally {
      setCostSubmitting(false);
    }
  };

  const merchantCol = {
    field: 'merchant', 
    headerName: 'Merchant', 
    width: 200, 
    renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 90 }}>
          <div>{params.row.fullName}</div>
          <div>{params.row.email}</div>
        </Box>
    )
  };
  const consigneeCol = { 
    field: 'consignee', 
    headerName: 'Consignee', 
    width: 200, 
    renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 90 }}>
          <div>{params.row.consignee_name}</div>
          <div>{params.row.consignee_email}</div>
          <div>{params.row.consignee_contact_no}</div>
        </Box>
    )
  };
  const columns = [
    { field: "ref_id", headerName: "Reference ID", width: 140 },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : ""),
    },
    ...(isAdmin ? [merchantCol] : []),
    ...(!isAdmin ? [consigneeCol] : []),
    {
      field: "forwarding_info",
      headerName: "Forwarding Info",
      width: 260,
      renderCell: (params) => {
        const content = (
          <Box sx={{ whiteSpace: 'normal', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 90 }}>
            <div>Forwarding No: {params.row.forwarding_number || 'N/A'}</div>
            <div>Service: {params.row.forwarding_service || 'N/A'}</div>
          </Box>
        );
        if (!isAdmin) return content;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {content}
            <IconButton size="small" onClick={() => handleOpenForward(params.row)} title="Edit forwarding info">
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
    },
    {
      field: 'shipping',
      headerName: 'Shipping Details',
      width: 300,
      renderCell: (params) => {
        const isShipped = Boolean(params.row.awb);
        return (
          <Box sx={{ whiteSpace: 'normal', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 100 }}>
            {isShipped ? (
              <>
                <div>{params.row.service_name}</div>
                <div>{params.row.vendor_name}</div>
                <div>Order Id: {params.row.iid}</div>
                {params.row.awb && <div>AWB : {params.row.awb}</div>}
                {params.row.shipping_charge && <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>Charge: - ₹{Number(params.row.shipping_charge).toFixed(2)}</div>}
                {(isAdmin && params.row.cost_price) ? <div style={{ color: '#6b7280' }}>Cost: ₹{Number(params.row.cost_price).toFixed(2)}</div> : null}
              </>
            ) : (
              <div style={{ color: '#666' }}>No shipping details yet</div>
            )}
          </Box>
        );
      }
    },
    { field: "status", headerName: "Status", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 320,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} height={90} alignItems={'center'} flexWrap="wrap" py={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedReport(params.row);
              setIsDetailsOpen(true);
            }}
          >
            Details
          </Button>
          {params.row.awb && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleTrackAndShare(params.row)}
            >
              Track
            </Button>
          )}
          {isAdmin ? (
            <IconButton
              size="small"
              onClick={(e) => {
                setActionsAnchorEl(e.currentTarget);
                setActionsRow(params.row);
              }}
              title="More actions"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
  ];

  const getRowId = (row) => row?.ref_id || row?.iid || row?.iid;

  return (
    <div className="w-full p-4">
      <Paper sx={{ width: "100%", p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <h2 className="text-2xl font-medium">Shipment Reports</h2>
        </Box>

        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "primary.main",
            borderRadius: 2,
            "& .MuiTextField-root": { bgcolor: "background.paper", borderRadius: 1 },
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box display="flex" gap={1} sx={{ minWidth: "fit-content", alignItems: 'flex-end' }}>
            <TextField
              label="Order ID"
              variant="outlined"
              size="small"
              name="iid"
              value={filters.iid}
              onChange={(e) => setFilters({ ...filters, iid: e.target.value })}
              sx={{ mr: 1, minWidth: "150px" }}
              InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
            />
            <TextField
              label="Reference ID"
              variant="outlined"
              size="small"
              name="ref_id"
              value={filters.ref_id}
              onChange={(e) => setFilters({ ...filters, ref_id: e.target.value })}
              sx={{ mr: 1, minWidth: "150px" }}
              InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
            />
            {/* Conditional name/email filters */}
            {isAdmin ? (
              <>
                <TextField
                  label="Merchant Name"
                  variant="outlined"
                  size="small"
                  name="merchant_name"
                  value={filters.merchant_name}
                  onChange={(e) => setFilters({ ...filters, merchant_name: e.target.value })}
                  sx={{ mr: 1, minWidth: "180px" }}
                  InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
                />
                <TextField
                  label="Merchant Email"
                  variant="outlined"
                  size="small"
                  name="merchant_email"
                  value={filters.merchant_email}
                  onChange={(e) => setFilters({ ...filters, merchant_email: e.target.value })}
                  sx={{ mr: 1, minWidth: "200px" }}
                  InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
                />
              </>
            ) : (
              <>
                <TextField
                  label="Consignee Name"
                  variant="outlined"
                  size="small"
                  name="consignee_name"
                  value={filters.consignee_name}
                  onChange={(e) => setFilters({ ...filters, consignee_name: e.target.value })}
                  sx={{ mr: 1, minWidth: "180px" }}
                  InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
                />
                <TextField
                  label="Consignee Email"
                  variant="outlined"
                  size="small"
                  name="consignee_email"
                  value={filters.consignee_email}
                  onChange={(e) => setFilters({ ...filters, consignee_email: e.target.value })}
                  sx={{ mr: 1, minWidth: "200px" }}
                  InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
                />
              </>
            )}
            <TextField
              label="AWB"
              variant="outlined"
              size="small"
              name="awb"
              value={filters.awb}
              onChange={(e) => setFilters({ ...filters, awb: e.target.value })}
              sx={{ mr: 1, minWidth: "150px" }}
              InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
            />
            <TextField
              label="Start Date"
              variant="outlined"
              size="small"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              sx={{ mr: 1, minWidth: "150px" }}
              InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
            />
            <TextField
              label="End Date"
              variant="outlined"
              size="small"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              sx={{ mr: 1, minWidth: "150px" }}
              InputLabelProps={{ sx: { backgroundColor: "white", px: 0.5, width: "100%", borderRadius: 1 } }}
            />
            <FormControl size="small" sx={{ minWidth: "180px", mr: 1 }}>
              <InputLabel id="service-select-label" className="bg-white w-full">
                Service
              </InputLabel>
              <Select
                labelId="service-select-label"
                value={filters.serviceId}
                onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                label="Service"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {services.map((service) => (
                  <MenuItem key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: "180px", mr: 1 }} disabled={!filters.serviceId}>
              <InputLabel id="vendor-select-label" className="bg-white w-full">
                Vendor
              </InputLabel>
              <Select
                labelId="vendor-select-label"
                value={filters.vendorId}
                onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
                label="Vendor"
                sx={{ backgroundColor: !filters.serviceId ? "#f3f4f6" : "white", borderRadius: 1 }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.vendor_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Download reports button */}
            <IconButton
              onClick={handleDownload}
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                minWidth: '40px'
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={reports}
            columns={columns}
            loading={isLoading}
            hideFooter={true}
            rowHeight={100}
            disableSelectionOnClick
            getRowId={getRowId}
          />
        </Box>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      </Paper>

      <ViewDialog isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} report={selectedReport} />

      {selectedReport && (
        <InternationalOrderDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          orderId={selectedReport.iid || selectedReport.ORDER_ID}
          shipment={selectedReport}
          isAdmin={isAdmin}
        />
      )}

      <TrackingShareDialog
        isOpen={isTrackingShareOpen}
        onClose={() => setIsTrackingShareOpen(false)}
        trackingData={currentTrackingShareData}
        report={selectedReport}
      />

      {/* Admin actions dropdown menu */}
      {isAdmin && (
        <Menu
          anchorEl={actionsAnchorEl}
          open={Boolean(actionsAnchorEl)}
          onClose={() => {
            setActionsAnchorEl(null);
            setActionsRow(null);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              if (actionsRow) handleOpenManual(actionsRow);
              setActionsAnchorEl(null);
              setActionsRow(null);
            }}
          >
            Add Event
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (actionsRow) handleOpenExtra(actionsRow);
              setActionsAnchorEl(null);
              setActionsRow(null);
            }}
          >
            Extra Charge
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (actionsRow) handleOpenCost(actionsRow);
              setActionsAnchorEl(null);
              setActionsRow(null);
            }}
          >
            <MonetizationOnIcon fontSize="small" style={{ marginRight: 8 }} />
            Assign Cost Price
          </MenuItem>
        </Menu>
      )}

      {/* Extra Charge Dialog */}
      <Dialog open={isExtraOpen} onClose={() => !extraSubmitting && setIsExtraOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>Deduct Extra Charge</div>
            <IconButton onClick={() => !extraSubmitting && setIsExtraOpen(false)} size="small" disabled={extraSubmitting}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Amount"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={extraForm.amount}
              onChange={(e) => setExtraForm((f) => ({ ...f, amount: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Reason"
              multiline
              minRows={2}
              value={extraForm.reason}
              onChange={(e) => setExtraForm((f) => ({ ...f, reason: e.target.value }))}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsExtraOpen(false)} disabled={extraSubmitting} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitExtra} disabled={extraSubmitting} variant="contained">
            {extraSubmitting ? 'Submitting…' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Cost Price Dialog (Admin only) */}
      <Dialog open={isCostOpen} onClose={() => !costSubmitting && setIsCostOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>Assign Cost Price</div>
            <IconButton onClick={() => !costSubmitting && setIsCostOpen(false)} size="small" disabled={costSubmitting}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Cost Price (₹)"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={costValue}
              onChange={(e) => setCostValue(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsCostOpen(false)} disabled={costSubmitting} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitCost} disabled={costSubmitting} variant="contained">
            {costSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

        {/* Forwarding Info Dialog */}
        <Dialog open={isForwardOpen} onClose={() => !forwardSubmitting && setIsForwardOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>Set Forwarding Info</div>
              <IconButton onClick={() => !forwardSubmitting && setIsForwardOpen(false)} size="small" disabled={forwardSubmitting}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Forwarding Number"
                value={forwardForm.forwarding_number}
                onChange={(e) => setForwardForm((f) => ({ ...f, forwarding_number: e.target.value }))}
                fullWidth
                size="small"
              />
              <Autocomplete
                freeSolo
                options={FORWARDING_SERVICE_OPTIONS}
                value={forwardForm.forwarding_service}
                onChange={(_, newValue) =>
                  setForwardForm((f) => ({ ...f, forwarding_service: newValue || "" }))
                }
                onInputChange={(_, newInputValue) =>
                  setForwardForm((f) => ({ ...f, forwarding_service: newInputValue || "" }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Forwarding Service"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsForwardOpen(false)} disabled={forwardSubmitting} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmitForward} disabled={forwardSubmitting} variant="contained">{forwardSubmitting ? 'Saving…' : 'Save'}</Button>
          </DialogActions>
        </Dialog>

        {/* Manual Tracking Event Dialog */}
        <Dialog open={isManualOpen} onClose={() => !manualSubmitting && setIsManualOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>Add Manual Tracking Event</div>
              <IconButton onClick={() => !manualSubmitting && setIsManualOpen(false)} size="small" disabled={manualSubmitting}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Autocomplete
                freeSolo
                options={MANUAL_STATUS_OPTIONS}
                value={manualForm.status}
                onChange={(_, newValue) =>
                  setManualForm((f) => ({ ...f, status: newValue || "" }))
                }
                onInputChange={(_, newInputValue) =>
                  setManualForm((f) => ({ ...f, status: newInputValue || "" }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    fullWidth
                    size="small"
                  />
                )}
              />
              <TextField
                label="Description"
                multiline
                minRows={2}
                value={manualForm.description}
                onChange={(e) => setManualForm((f) => ({ ...f, description: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="Location"
                value={manualForm.location}
                onChange={(e) => setManualForm((f) => ({ ...f, location: e.target.value }))}
                fullWidth
                size="small"
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={manualForm.timestampDate}
                  onChange={(e) => setManualForm((f) => ({ ...f, timestampDate: e.target.value }))}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={manualForm.timestampTime}
                  onChange={(e) => setManualForm((f) => ({ ...f, timestampTime: e.target.value }))}
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsManualOpen(false)} disabled={manualSubmitting} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmitManual} disabled={manualSubmitting} variant="contained">{manualSubmitting ? 'Submitting…' : 'Submit'}</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const addPageNumber = (pageNum) => pages.push({ number: pageNum, isCurrent: pageNum === currentPage });
  addPageNumber(1);
  if (totalPages <= 7) {
    for (let i = 2; i < totalPages; i++) addPageNumber(i);
  } else {
    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) addPageNumber(i);
      pages.push({ number: "..." });
    } else if (currentPage >= totalPages - 3) {
      pages.push({ number: "..." });
      for (let i = totalPages - 4; i < totalPages; i++) addPageNumber(i);
    } else {
      pages.push({ number: "..." });
      for (let i = currentPage - 1; i <= currentPage + 1; i++) addPageNumber(i);
      pages.push({ number: "..." });
    }
  }
  if (totalPages > 1) addPageNumber(totalPages);
  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-4">
      <Button size="small" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant={currentPage === 1 ? "outlined" : "contained"}>
        Previous
      </Button>
      {pages.map((p, idx) => (
        <Button key={idx} size="small" onClick={() => p.number !== "..." && onPageChange(p.number)} variant={p.number === "..." ? "outlined" : p.isCurrent ? "contained" : "outlined"}>
          {p.number}
        </Button>
      ))}
      <Button size="small" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant={currentPage === totalPages ? "outlined" : "contained"}>
        Next
      </Button>
    </div>
  );
};

export default function InternationalReports() {
  return (
    <div className="py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      <Listing />
    </div>
  );
}
