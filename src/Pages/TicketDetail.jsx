// ShipRunway\src\pages\TicketDetail.jsx (MODIFIED for Phase 3)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTicketDetails, fetchTicketMessages, submitUserReply } from '../services/ticketServices/userTicketService';
import { toast } from 'react-toastify';

// Helper function (same as in Support.jsx)
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

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef(null);

    const loadData = useCallback(async () => {
        try {
            const ticketData = await fetchTicketDetails(id);
            const messageData = await fetchTicketMessages(id);
            setTicket(ticketData);
            setMessages(messageData);
        } catch (error) {
            toast.error(error.message);
            navigate('/dashboard/support'); 
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        // Scroll to bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || submitting) return;
        
        setSubmitting(true);
        try {
            await submitUserReply(id, replyText);
            toast.success("Reply sent. Status updated to OPEN.");
            setReplyText('');
            // Reload all data to get the new message and updated status
            await loadData(); 
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading ticket #{id} details...</div>;
    }

    if (!ticket) {
        return <div className="p-8 text-center text-red-500">Ticket not found.</div>;
    }


    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
            <button 
                onClick={() => navigate('/dashboard/support')} // <-- FIX: Use the full dashboard route
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
                &larr; Back to All Tickets
            </button>

            <div className="bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-3xl font-bold text-sky-950 mb-2">Ticket #{ticket.ticket_id}</h1>
                
                <div className="flex items-center space-x-3 mb-6 border-b pb-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
                        Status: {ticket.status.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-gray-500">Opened: {new Date(ticket.created_at).toLocaleString()}</p>
                </div>

                {/* Initial Ticket Details */}
                <div className="mb-8 space-y-3">
                    <p className="text-gray-700">Category: <span className="font-semibold text-sky-900">{ticket.category}</span></p>
                    {ticket.sub_category && <p className="text-gray-700">Sub-Category: <span className="font-semibold text-sky-900">{ticket.sub_category}</span></p>}
                    {ticket.order_id && <p className="text-gray-700">Order ID: <span className="font-semibold text-sky-900">{ticket.order_id}</span></p>}
                    
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                        <p className="font-medium text-gray-700 mb-1">Initial Issue:</p>
                        <p className="whitespace-pre-wrap text-gray-800 border-l-4 border-sky-950 pl-3 py-1">
                            {ticket.description}
                        </p>
                    </div>
                </div>

                {/* Conversation History */}
                <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto mb-4 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-2 text-sky-950">Conversation History</h3>
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 italic">No replies yet. Awaiting admin response.</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.message_id} className={`flex mb-4 ${msg.sent_by_admin ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-xl p-3 rounded-xl shadow-md 
                                    ${msg.sent_by_admin 
                                        ? 'bg-sky-950 text-white' 
                                        : 'bg-blue-600 text-white'}`
                                }>
                                    <p className="text-[10px] uppercase font-bold mb-1 opacity-80">
                                        {msg.sent_by_admin ? msg.fullName || 'Admin' : 'You'}
                                    </p>
                                    <p className="whitespace-pre-wrap text-sm">{msg.message_text}</p>
                                    <p className="text-[10px] mt-1 text-right opacity-70">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Reply Form */}
                <form onSubmit={handleReplySubmit} className="mt-4">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-950 focus:border-sky-950"
                        disabled={submitting}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            className="bg-sky-950 text-white py-2 px-6 rounded-lg font-semibold hover:bg-sky-900 transition disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? 'Sending...' : 'Send Reply'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}