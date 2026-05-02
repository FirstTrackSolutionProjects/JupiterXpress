// ShipRunway\src\pages\AdminAnalytics.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify'; 
import { fetchTicketAnalytics } from '../services/ticketServices/adminTicketService';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Card component for displaying metrics
const MetricCard = ({ title, value, unit = '', color = '#082f49' }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline mt-2">
            <p className="text-3xl font-extrabold text-gray-900 leading-none">
                {value}
            </p>
            {unit && <span className="ml-1 text-sm font-semibold text-gray-500">{unit}</span>}
        </div>
        <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: color }}></div>
    </div>
);

// Helper for status bar colors
const STATUS_COLORS = {
    'OPEN': 'bg-yellow-500',
    'IN_PROGRESS': 'bg-blue-500',
    'RESOLVED': 'bg-green-500',
    'CLOSED': 'bg-gray-500',
    'Other': 'bg-red-500' // For miscellaneous categories
};

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTicketAnalytics();
            setAnalytics(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    if (loading) {
        return <div className="p-8 text-center">Loading Support Analytics...</div>;
    }

    if (!analytics) {
        return <div className="p-8 text-center text-red-500">Could not load analytics data.</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Support System Analytics</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <MetricCard 
                    title="Total Tickets" 
                    value={analytics.totalTickets} 
                />
                <MetricCard 
                    title="Open Tickets" 
                    value={analytics.ticketsByStatus.find(s => s.status === 'OPEN')?.count || 0}
                />
                <MetricCard 
                    title="Resolved Tickets" 
                    value={analytics.ticketsByStatus.find(s => s.status === 'RESOLVED')?.count || 0} 
                />
                <MetricCard 
                    title="Resolution Rate" 
                    value={analytics.resolutionRate} 
                    unit="%"
                />
            </div>

            {/* Status Breakdown Bar */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
                <h2 className="text-xl font-semibold mb-4">Tickets by Status</h2>
                <div className="flex w-full h-8 rounded-lg overflow-hidden border border-gray-300">
                    {analytics.ticketsByStatus.map((item) => {
                        const width = (item.count / analytics.totalTickets) * 100;
                        return (
                            <div
                                key={item.status}
                                className={`${STATUS_COLORS[item.status]} h-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold`}
                                style={{ width: `${width}%` }}
                                title={`${item.status.replace('_', ' ')}: ${item.count}`}
                            >
                                {item.count > 0 && `${item.count}`}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                    {STATUS_OPTIONS.map(status => (
                        <div key={status} className="flex items-center space-x-1">
                            <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}></span>
                            <span>{status.replace('_', ' ')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Tickets by Category (Volume)</h2>
                <div className="space-y-3">
                    {analytics.ticketsByCategory.map((item, index) => (
                        <div key={item.category} className="flex items-center">
                            <span className="w-48 font-medium text-gray-700">{item.category}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                <div
                                    className={`${index === 0 ? 'bg-red-500' : 'bg-blue-400'} h-full rounded-full transition-all duration-500`}
                                    style={{ width: `${(item.count / analytics.totalTickets) * 100}%` }}
                                ></div>
                            </div>
                            <span className="ml-4 w-10 text-right font-bold text-gray-800">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}