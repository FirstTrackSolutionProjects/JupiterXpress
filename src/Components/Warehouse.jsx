import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
const AddForm = ({ mode, setMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    country: "India",
    username: localStorage.getItem("username"),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/.netlify/functions/warehouseCreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => alert(result.message))
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6 ${
          mode == 1 ? "" : "hidden"
        }`}
      >
        <div className="w-[728px] h-16 px-4  relative flex">
          <div className="text-2xl font-medium">ADD WAREHOUSE</div>
          <div
            onClick={(e) => {
              e.preventDefault();
              setMode(0);
            }}
            className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
          >
            X
          </div>
        </div>
        <form
          action=""
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Warehouse Name</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                placeholder="Warehouse Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="phone">Mobile Number</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="phone"
                name="phone"
                placeholder="Ex. 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="email">Email</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="email"
                name="email"
                placeholder="Ex. merchant123@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="address">Address</label>
            <input
              className="w-full border py-2 px-4 rounded-3xl"
              type="text"
              id="address"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pin">Pincode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pin"
                name="pin"
                placeholder="Enter Pincode"
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="city">City</label>
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
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2 flex flex-col justify-center">
              <label htmlFor="state">State</label>
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
              <label htmlFor="country">Country</label>
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
          {/* <div className="flex-1 mx-2 mb-2 min-w-[300px] flex justify-center space-x-3">
            <input
                className=" border py-2 px-4 rounded-3xl"
                type="checkbox"
                id="same"
                name="same"
                value={formData.same}
                onChange={handleChange}
              />
              <label htmlFor="same">Return address is same as Pickup address</label>
              
            </div> */}
          <button
            type="submit"
            className="border bg-white mx-2  py-2 px-4 rounded-3xl"
          >
            Create Warehouse
          </button>
        </form>
      </div>
    </>
  );
};

const ManageForm = ({isManage, setIsManage, name, address, pin, phone}) => {
  const [formData, setFormData] = useState({
    name: name,
    phone: phone,
    address: address,
    pin: pin,
    username: localStorage.getItem("username"),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/.netlify/functions/warehouseUpdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => alert(result.message))
      .catch((error) => alert(error.message));
  };
  return (
    <>
      <div
        className={`absolute  z-20 bg-white w-full p-4 flex flex-col items-center space-y-6 ${
          isManage ? "" : "hidden"
        }`}
      >
        <div className="w-[728px] h-16 px-4  relative flex">
          <div className="text-2xl font-medium">MANAGE WAREHOUSE</div>
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
        <form
          action=""
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="name">Warehouse Name</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="name"
                name="name"
                placeholder="Warehouse Name"
                value={formData.name}
              />
            </div>
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="phone">Mobile Number</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="phone"
                name="phone"
                placeholder="Ex. 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
            <label htmlFor="address">Address</label>
            <input
              className="w-full border py-2 px-4 rounded-3xl"
              type="text"
              id="address"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex mb-2 flex-wrap ">
            <div className="flex-1 mx-2 mb-2 min-w-[300px] space-y-2">
              <label htmlFor="pin">Pincode</label>
              <input
                className="w-full border py-2 px-4 rounded-3xl"
                type="text"
                id="pin"
                name="pin"
                placeholder="XXXXXX"
                value={formData.pin}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="border bg-white mx-2  py-2 px-4 rounded-3xl"
          >
            Edit Warehouse
          </button>
        </form>
      </div>
    </>
  );
};

const Card = ({ name, address, pin, phone }) => {
  const [isManage, setIsManage] = useState(false);
  return (
    <>
      <ManageForm isManage={isManage} setIsManage={setIsManage} name={name} address={address} pin={pin} phone={phone} />
      <div className="w-full h-16 bg-white relative items-center px-8 flex border-b">
        <div>{name}</div>
        <div className="absolute right-8 cursor-pointer" onClick={()=>setIsManage(true)}>Manage</div>
      </div>
    </>
  );
};

const Listing = ({ mode, setMode }) => {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    const getWarehouses = async () => {
      const response = await fetch("/.netlify/functions/getWarehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      const rows = response.rows;
      setWarehouses(rows);
    };
    getWarehouses();
  }, []);
  return (
    <>
      <div
        className={`w-full p-4 flex flex-col items-center space-y-6 ${
          mode == 0 ? "" : "hidden"
        }`}
      >
        <div className="w-full h-16 px-4  relative flex">
          <div className="text-2xl font-medium">WAREHOUSES</div>
          <div
            onClick={(e) => {
              e.preventDefault();
              setMode(1);
            }}
            className="px-5 py-1 bg-blue-500 absolute rounded-3xl text-white  right-4"
          >
            Add
          </div>
        </div>
        <div className="w-full">
          {warehouses.map((warehouse, index) => (
            <Card name={warehouse.name} address={warehouse.address} phone={warehouse.phone} pin={warehouse.pincode} />
          ))}
        </div>
      </div>
    </>
  );
};

const Warehouse = () => {
  const [mode, setMode] = useState(0);
  return (
    <>
      <div className=" py-16 w-full h-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
        <Listing mode={mode} setMode={setMode} />
        <AddForm mode={mode} setMode={setMode} />
      </div>
    </>
  );
};

export default Warehouse;
