import { useEffect, useState } from "react";
import { Box, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import getAllInternationalShipmentsService from "../services/shipmentServices/internationalShipmentServices/getAllInternationalShipmentsService";
import getActiveInternationalServicesService from "../services/serviceServices/getActiveInternationalServicesService";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Tracking cards (unchanged functional rendering)
const WorldFirstCourierTrackingCard = ({ scan }) => (
  <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
    <div className="flex flex-col items-center justify-center">
      <div className="font-bold">{scan?.Status}</div>
      <div>{scan.Location}</div>
      <div>
        {scan.EventDate1} {scan.EventTime1}
      </div>
    </div>
  </div>
);

const FlightGoCard = ({ scan }) => (
  <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
    <div>{scan.event_at}</div>
    <div>{scan.event_location}</div>
    <div>{scan.event_description}</div>
  </div>
);

const QuickShipNowCard = ({ scan }) => (
  <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
    <div>{scan.event_at}</div>
    <div>{scan.event_location}</div>
    <div>{scan.event_description}</div>
  </div>
);

const QuickShipNow2Card = ({ scan }) => (
  <div className="w-full bg-white relative items-center px-8 py-2 flex-col border-b">
    <div>{scan.event_at}</div>
    <div>{scan.event_location}</div>
    <div>{scan.event_description}</div>
  </div>
);

const DillikingCard = ({ scan }) => {
  const date = scan.event_date;
  const time = scan.event_time;
  const formattedDate = `${date.substr(0, 4)}/${date.substr(2, 2)}/${date.substr(6, 2)}`;
  const formattedTime = `${time.substr(0, 2)}:${time.substr(2, 2)}`;
  return (
    <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold">{scan.remark}</div>
        <div>{scan.location}</div>
        <div>{`${formattedDate} ${formattedTime}`}</div>
      </div>
    </div>
  );
};

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
    switch (report?.service) {
      case 7:
        return status?.[0]?.docket_events?.map((scan, i) => <FlightGoCard key={i} scan={scan} />);
      case 8:
        return status?.length ? status.map((scan, i) => <DillikingCard key={i} scan={scan} />) : <div>No Tracking Events Available</div>;
      case 11:
        return status?.length ? status.map((scan, i) => <WorldFirstCourierTrackingCard key={i} scan={scan} />) : <div>No Tracking Events Available</div>;
      case 12:
        return status?.[0]?.docket_events?.map((scan, i) => <QuickShipNowCard key={i} scan={scan} />);
      case 13:
        return status?.[0]?.docket_events?.map((scan, i) => <QuickShipNow2Card key={i} scan={scan} />);
      default:
        return <div>No Tracking Events Available</div>;
    }
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

const Listing = () => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState(null); // set when API returns full array (no pagination)
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filters, setFilters] = useState({
    awb: "",
    iid: "",
    serviceId: "",
    startDate: "",
    endDate: "",
  });
  const [services, setServices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const params = {
        awb: filters.awb || undefined,
        iid: filters.iid || undefined,
        serviceId: filters.serviceId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page,
      };
      const data = await getAllInternationalShipmentsService(params);
      // Support both array and paginated object shapes
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
        setAllReports(sorted);
        const total = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
        setTotalPages(total);
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setReports(sorted.slice(start, end));
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
  }, [page, filters.awb, filters.iid, filters.serviceId, filters.startDate, filters.endDate]);

  const awbCol = { field: "awb", headerName: "AWB", width: 160 };
  const columns = [
    { field: "ref_id", headerName: "Reference ID", width: 140 },
    { field: "iid", headerName: "Order ID", width: 130 },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : ""),
    },
    ...(isAdmin ? [awbCol] : []),
    { field: "service_name", headerName: "Service", width: 180 },
    { field: "status", headerName: "Status", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setSelectedReport(params.row);
              setIsViewOpen(true);
            }}
          >
            View Status
          </Button>
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
          <Box display="flex" gap={1} sx={{ minWidth: "fit-content" }}>
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
          </Box>
        </Box>

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={reports}
            columns={columns}
            loading={isLoading}
            hideFooter={true}
            disableSelectionOnClick
            getRowId={getRowId}
          />
        </Box>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
      </Paper>

      <ViewDialog isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} report={selectedReport} />
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
