// ShipRunway\src\pages\Dashboard\AdminSupport.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { fetchAllTickets, updateTicketStatus } from '../services/ticketServices/adminTicketService';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Helper function (same as Phase 1 components)
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

export default function AdminSupport() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllTickets();
            setTickets(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const handleViewTicket = (ticketId) => {
        // Navigates to the admin conversation page
        navigate(`/dashboard/admin/support/${ticketId}`);
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        if (newStatus === 'DEFAULT') return;

        try {
            await updateTicketStatus(ticketId, newStatus);
            toast.success(`Ticket #${ticketId} status set to ${newStatus}.`);
            // Optimistically update UI or refresh
            setTickets(prev => prev.map(t => 
                t.ticket_id === ticketId ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading all support tickets for admin...</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and respond to merchant inquiries</p>
              </div>
              <div className="bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-700 animate-pulse"></span>
                <span className="text-sm font-bold text-gray-600">Active Tickets: {tickets.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0 rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr 
                                key={ticket.ticket_id}
                                className="cursor-pointer hover:bg-gray-50 transition" 
                                onClick={() => handleViewTicket(ticket.ticket_id)} // <--- CLICK HANDLER ADDED
                            >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{ticket.ticket_id}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.fullName} (UID: {ticket.uid})
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.category}
                                </td>
                                {/* Note: We stop propagation on the select box */}
                                <td className="px-4 py-4 max-w-xs truncate text-sm text-gray-500" title={ticket.description}>
                                    {ticket.description}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}> 
                                    <select
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={ticket.status}
                                        // Stop propagation so clicking the dropdown doesn't trigger the row navigation
                                        onChange={(e) => { 
                                            e.stopPropagation();
                                            handleStatusChange(ticket.ticket_id, e.target.value);
                                        }}
                                    >
                                        <option value="DEFAULT" disabled>Change Status</option>
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>
                                                {status.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
