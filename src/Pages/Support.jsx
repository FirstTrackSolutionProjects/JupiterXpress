// ShipRunway\src\pages\Support.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserTickets } from '../services/ticketServices/userTicketService';
import { toast } from 'react-toastify'; 

// Helper function for styling ticket status
const getStatusClasses = (status) => {
    switch (status) {
        case 'OPEN':
            return 'bg-yellow-100 text-yellow-800';
        case 'IN_PROGRESS':
            return 'bg-blue-100 text-blue-800';
        case 'RESOLVED':
            return 'bg-green-100 text-green-800';
        case 'CLOSED':
            return 'bg-gray-200 text-gray-700';
        default:
            return 'bg-gray-500 text-white';
    }
};

export default function UserSupportPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleRaiseNewTicket = () => {
        window.dispatchEvent(new CustomEvent('OPEN_SUPPORT_CHAT'));
    };

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetchUserTickets();
                setTickets(data);
            } catch (error) {
                toast.error(error.message);
                // Redirect if unauthorized or other critical error
                if (error.message.includes("log in")) { 
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, [navigate]);

    const handleViewTicket = (ticketId) => {
        // Since we removed the top-level route, this navigation is now relative to /dashboard, which is correct.
        navigate(`/dashboard/support/${ticketId}`);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading support tickets...</div>;
    }
    
    if (tickets.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Support Tickets</h2>
                <p className="text-gray-600">You have no active or historical tickets.</p>
                <button 
                    onClick={handleRaiseNewTicket}
                    className="mt-4 bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-800 transition"
                >
                    Raise a New Ticket
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Tickets</h1>
                    <p className="text-gray-500 mt-1">Track and manage your inquiries</p>
                </div>
                <button 
                    onClick={handleRaiseNewTicket}
                    className="hidden md:flex bg-purple-700 text-white py-2.5 px-6 rounded-xl font-bold hover:bg-purple-800 transition-all shadow-lg shadow-purple-900/10 active:scale-95 items-center gap-2"
                >
                    Raise Ticket
                </button>
            </div>

            <div className="grid gap-4">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.ticket_id} 
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                        onClick={() => handleViewTicket(ticket.ticket_id)}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-purple-700 bg-purple-700/5 px-2 py-0.5 rounded-full">#{ticket.ticket_id}</span>
                                <h2 className="text-lg font-bold text-gray-900 truncate">{ticket.category}</h2>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{ticket.sub_category || ticket.description}</p>
                        </div>
                        <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-3 md:gap-1.5">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getStatusClasses(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">
                                {new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={handleRaiseNewTicket}
                className="mt-6 bg-sky-950 text-white py-2 px-4 rounded hover:bg-sky-900 transition"
            >
                Raise a New Ticket
            </button>
        </div>
    );
}
