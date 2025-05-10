import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_APP_API_URL
const ViewWeightDisputePopup = ({ open, onClose, disputeId }) => {
    if (!open) return;
    const [formData, setFormData] = useState({
        ord_id: "",
        dispute_deduction: "",
        dispute_boxes: []
    })

    const getDisputeInfo = async (req, res) => {
        try {
            const response = await fetch(`${API_URL}/weight-disputes/${disputeId}`, {
                method: "GET",
                headers: {
                    "Authorization": localStorage.getItem("token"),
                    "Accept": "application/json"
                }
            })
            if (!response.ok){
                toast.error("Unable to get dispute info! Please try again");
                return;
            }
            const data = await response.json();
            setFormData(data?.data);
        } catch (error){
            console.log(error)
            toast.error("Something went wrong! Please try again");
        }
    }

    useEffect(()=> {
        getDisputeInfo();
    },[])

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md relative max-h-[80%] overflow-hidden">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <h1 className="text-xl text-center my-4 font-bold">CREATE WEIGHT DISPUTE</h1>
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 2rem)' }}>
            <form className="flex flex-col space-y-6 py-8">
                {
                    formData?.ord_id && formData?.dispute_boxes?.length > 0 ? 
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col">
                        <label htmlFor="ord_id" className="font-semibold">Order Id</label>
                        <input 
                            type="text"
                            id="ord_id"
                            name="ord_id"
                            className="w-full px-2 py-1 rounded-lg border border-black"
                            value={formData.ord_id}
                            disabled
                        />
                        </div>
                        {
                            formData?.dispute_boxes?.map((box, index)=>(
                        <div className="h-84 p-4 rounded-lg bg-gray-300 space-y-2">
                            <div className="flex space-x-2">
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="length" className="text-sm">Length (In cm)</label>
                                    <input key={index} id="length" name="length" type="text" disabled value={formData?.dispute_boxes?.[index]?.length} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="actual_length" className="text-sm">Actual Length (In cm)</label>
                                    <input key={index} id="actual_length" name="actual_length"  type="text" disabled value={formData?.dispute_boxes?.[index]?.actual_length} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="breadth" className="text-sm">Breadth (In cm)</label>
                                    <input key={index} id="breadth" name="breadth" type="text"  disabled value={formData?.dispute_boxes?.[index]?.breadth} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="actual_breadth" className="text-sm">Actual Breadth (In cm)</label>
                                    <input key={index} id="actual_breadth" name="actual_breadth" type="text" disabled value={formData?.dispute_boxes?.[index]?.actual_breadth} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="height" className="text-sm">Height (In cm)</label>
                                    <input key={index} id="height" name="height" type="text" disabled value={formData?.dispute_boxes?.[index]?.height} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="actual_height" className="text-sm">Actual Height (In cm)</label>
                                    <input key={index} id="actual_height" name="actual_height" type="text" disabled value={formData?.dispute_boxes?.[index]?.actual_height} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="weight" className="text-sm">Weight (In gm)</label>
                                    <input key={index} id="weight" name="weight" type="text" disabled value={formData?.dispute_boxes?.[index]?.weight} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                                <div className="flex flex-col space-y-1 w-full">
                                    <label htmlFor="actual_weight" className="text-sm">Actual Weight (In gm)</label>
                                    <input key={index} id="actual_weight" name="actual_weight" type="text" disabled value={formData?.dispute_boxes?.[index]?.actual_weight} className="rounded-lg py-1 px-2 w-full" />
                                </div>
                            </div>
                        </div> 
                    ))
                        }
                        <div className="flex flex-col space-y-1 w-full">
                            <label htmlFor="dispute_deduction" className="text-sm">Dispute Deduction (In ₹)</label>
                            <input id="dispute_deduction" name="dispute_deduction" type="text" disabled value={formData?.dispute_deduction} className="rounded-lg py-1 px-2 w-full" />
                        </div>
                    </div>
                    :
                    <div className="w-full text-center">
                        Retrieving dispute info...
                    </div>
                }

            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default ViewWeightDisputePopup;
  