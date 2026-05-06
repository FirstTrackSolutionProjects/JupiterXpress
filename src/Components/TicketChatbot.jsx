import React from "react";
import { useEffect, useRef, useState } from "react";
// Removed useNavigate
import { toast } from 'react-toastify'; 
import { raiseTicketService } from "../services/ticketServices/raiseTicketService"; 

const BOT_DELAY = 500;

// The OPTIONS constant remains here
const OPTIONS = {
  "Pickup Issue": {
    options: [
      "Pickup not attempted",
      "Pickup delayed",
      "Pickup cancelled by courier",
      "Pickup reschedule request",
    ],
    prompts: {
      "Pickup not attempted": "Please provide the Order ID/AWB and confirm the pickup address.",
      "Pickup delayed": "Please provide the Order ID/AWB.",
      "Pickup cancelled by courier": "Please provide the Order ID/AWB and any reason provided by the rider.",
      "Pickup reschedule request": "Please provide the Order ID/AWB and your preferred new date and time slot.",
    }
  },

  "Delivery Delay": {
    options: [
      "Delivery delayed beyond SLA",
      "Shipment pending at delivery center",
      "Delivery attempt unsuccessful",
      "Delivery reschedule request",
    ],
    prompts: {
      "Delivery delayed beyond SLA": "Please provide the Order ID/AWB.",
      "Shipment pending at delivery center": "Please provide the Order ID/AWB.",
      "Delivery attempt unsuccessful": "Please provide the Order ID/AWB and the consignee's active contact number.",
      "Delivery reschedule request": "Please provide the Order ID/AWB and the preferred delivery date.",
    }
  },

  "COD / Payment Issue": {
    options: [
      "COD amount mismatch",
      "COD remittance pending",
      "COD not received for delivered order",
      "Payment issue with cancelled shipment",
    ],
    prompts: {
      "COD amount mismatch": "Please provide the Order ID/AWB and the amount discrepancy details (Expected vs Received).",
      "COD remittance pending": "Please provide the Date range and the total pending amount.",
      "COD not received for delivered order": "Please provide the Order ID/AWB and proof of delivery if available.",
      "Payment issue with cancelled shipment": "Please provide the Order ID/AWB and the amount to be refunded.",
    }
  },

  "Wallet Recharge Issue": {
    options: [
      "Wallet recharge failed",
      "Recharge successful but balance not updated",
      "Incorrect wallet balance",
      "Wallet transaction statement required",
    ],
    prompts: {
      "Wallet recharge failed": "Please provide the Transaction ID, Amount, and Date of attempt.",
      "Recharge successful but balance not updated": "Please provide the Transaction ID and Amount.",
      "Incorrect wallet balance": "Please provide details of the discrepancy you noticed.",
      "Wallet transaction statement required": "Please specify the start and end dates for the statement.",
    }
  },

  "Weight Dispute": {
    options: [
      "Incorrect charged weight",
      "Weight updated after pickup",
      "Weight dispute for delivered shipment",
      "Request weight verification",
    ],
    prompts: {
      "Incorrect charged weight": "Please provide the Order ID/AWB, Actual weight (kg), and Charged weight (kg).",
      "Weight updated after pickup": "Please provide the Order ID/AWB.",
      "Weight dispute for delivered shipment": "Please provide the Order ID/AWB.",
      "Request weight verification": "Please provide the Order ID/AWB and confirm the package is available for re-weighing.",
    }
  },

  "Pricing / Tracking Issue": {
    options: [
      "Unexpected shipment charges",
      "Rate calculation incorrect",
      "Tracking not updated",
      "Tracking details incorrect",
    ],
    prompts: {
      "Unexpected shipment charges": "Please provide the Order ID/AWB and details of the charge you're disputing.",
      "Rate calculation incorrect": "Please provide the Origin/Destination pincodes and shipment weight.",
      "Tracking not updated": "Please provide the Order ID/AWB.",
      "Tracking details incorrect": "Please provide the Order ID/AWB and the correct status/location.",
    }
  },
};

// Accepts onClose prop instead of using useNavigate
export default function TicketChatbot({ onClose }) {
  // Removed const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [step, setStep] = useState("WELCOME");
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSubCategory, setCurrentSubCategory] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const addBot = (text) =>
    setMessages((prev) => [...prev, { from: "bot", text }]);

  const addUser = (text) =>
    setMessages((prev) => [...prev, { from: "user", text }]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    setTimeout(() => {
      addBot("👋 Welcome to JupiterXpress Support!");
      setTimeout(() => {
        addBot("Please select the category of your issue to raise a ticket:");
        setCurrentOptions([
          "Pickup Issue",
          "Delivery Delay",
          "COD / Payment Issue",
          "Wallet Recharge Issue",
          "Weight Dispute",
          "Pricing / Tracking Issue",
          "Other",
        ]);
        setStep("MAIN");
      }, BOT_DELAY);
    }, BOT_DELAY);
  }, []);


  const submitTicket = async (category, subCategory, description) => {
    setIsLoading(true);
    
    toast.info("Attempting to create ticket...");

    const data = {
        category,
        subCategory,
        description,
    };

    console.log("Submitting Payload:", data); 

    try {
        const response = await raiseTicketService(data);
        addBot(`📝 Ticket #${response.ticketId} created successfully. Our team will contact you.`);
        toast.success(`Ticket ${response.ticketId} Raised!`);
        // Use onClose instead of navigate
        setTimeout(() => onClose(), 2000); 
    } catch (error) {
        console.error("Ticket Submission Failed:", error); 
        addBot("❌ Failed to create ticket. Please provide a more detailed description below.");
        toast.error(error.message || "Ticket creation failed.");
        setIsLoading(false);
        setStep("DETAILS"); 
        setShowInput(true);
    }
  };

  const handleOption = (option) => {
    if (isLoading) return; 
    addUser(option);
    setCurrentOptions([]);

    setTimeout(() => {
      if (step === "MAIN") {
        if (option === "Other") {
          setCurrentCategory(option);
          addBot("Please describe your issue below:");
          setStep("DETAILS"); 
          setShowInput(true);
        } else {
          setCurrentCategory(option);
          addBot("Please select the specific issue:");
          setCurrentOptions(OPTIONS[option].options);
          setStep("SUB");
        }
      } else if (step === "SUB") {
        setCurrentSubCategory(option);
        const prompt = OPTIONS[currentCategory].prompts[option];
        addBot(prompt);
        setStep("DETAILS");
        setShowInput(true);
      }
    }, BOT_DELAY);
  };

  const submitDetails = () => {
    if (!inputText.trim() || isLoading) return;
    
    addUser(inputText);
    setShowInput(false);
    
    const category = currentCategory === 'Other' ? 'Other' : currentCategory;
    const subCategory = currentCategory === 'Other' ? null : currentSubCategory;
    const description = inputText.trim();

    setInputText("");
    submitTicket(category, subCategory, description);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden font-inter text-gray-900">
      
        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2 duration-300"}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm border
                ${msg.from === "user" 
                  ? "bg-blue-600 text-white border-blue-600 rounded-br-none" 
                  : "bg-white text-gray-800 border-gray-100 rounded-bl-none"}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {currentOptions.length > 0 && !isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {currentOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOption(opt)}
                  className={`bg-white border border-gray-200 rounded-xl py-3 px-4 text-xs md:text-sm font-bold text-gray-700 hover:border-sky-950 hover:bg-sky-950/5 transition-all shadow-sm active:scale-95
                    ${opt === 'Other' ? 'sm:col-span-2' : ''}`}
                  disabled={isLoading}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {showInput && !isLoading && (
            <div className="flex flex-col gap-2 mt-4 animate-in slide-in-from-bottom-4 duration-500">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter details here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-950 focus:border-transparent outline-none text-sm resize-none shadow-inner min-h-[80px]"
                disabled={isLoading}
                rows={2}
              />
              <button
                onClick={submitDetails}
                className="w-full bg-sky-950 text-white px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-sky-950/20"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Submit Support Request'}
              </button>
            </div>
          )}
          
          {/* Display loading message if submitting a ticket */}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="px-4 py-2.5 rounded-2xl text-sm max-w-[85%] bg-white border border-gray-100 text-gray-500">
                    Creating your support ticket...
                </div>
            </div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
    </div>
  );
}
