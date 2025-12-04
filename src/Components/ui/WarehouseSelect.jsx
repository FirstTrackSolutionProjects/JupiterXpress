import { useState, useMemo, useEffect } from "react";

const WarehouseSelect = ({ warehouses = [], onChange, isInternational=false, value }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return warehouses;
    return warehouses.filter(w => (w.warehouseName || "").toLowerCase().includes(q));
  }, [warehouses, query]);

  const selectItem = (warehouse) => {
    setSelected(warehouse);
    setOpen(false);
    // By default, return the warehouse id to parent for form binding
    onChange && onChange(warehouse?.wid ?? warehouse);
  };

  useEffect(() => {
    if (value == null || value === "") {
      setSelected(null);
      return;
    }
    const match = warehouses.find(w => String(w.wid) === String(value)) || null;
    setSelected(match);
  }, [value, warehouses]);

  return (
    <div className="relative">
      {/* Selected box */}
      <div
        className="border p-2 rounded cursor-pointer bg-white"
        onClick={() => { setOpen(!open); if (!open) setQuery(""); }}
      >
        {selected ? (
          <div>
            <p>{selected.warehouseName}</p>
          </div>
        ) : (
          <span>Select warehouse...</span>
        )}
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute mt-1 w-full border bg-white rounded shadow-lg z-10 max-h-96 overflow-x-hidden overflow-y-auto">
          <div className="p-2 border-b sticky top-0 bg-white">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border px-2 py-1 rounded text-sm"
              placeholder="Search warehouse name..."
            />
          </div>
          {filtered.map((w) => (
            <div
              key={w.wid}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectItem(w)}
            >
              <p>{w.warehouseName}</p>
              <p className="text-sm text-gray-500">{isInternational ? w.international_address : w.address}</p>
              <p className="text-sm text-gray-500">{w.city}, {w.state}, {w.country} - {w.pin}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No warehouses match "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}

export default WarehouseSelect;