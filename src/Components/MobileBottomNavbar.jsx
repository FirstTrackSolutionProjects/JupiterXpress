// src/Components/MobileBottomNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaClipboardList, FaHistory, FaWallet, FaPlusSquare, FaInfoCircle, FaPhone, FaRss, FaTags, FaUsers, FaUserCheck, FaUserCircle } from 'react-icons/fa';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
// The useWallet import and its usage are removed as per user's request not to show wallet balance.

const MobileBottomNavbar = ({ isDashboardRoute, sidebarOpen, closeSidebar, setShowWalletRechargeModal, isAdmin }) => {
    const location = useLocation();
    const { isAuthenticated, verified } = useAuth();
    // Use the passed prop for admin status
    const merchantDashboardItems = [
        { icon: FaUserCircle, name: 'Dash', path: '/dashboard' },
        { icon: FaBox, name: 'Parcels', path: '/dashboard/parcels/domestic' },
        { icon: FaPlusSquare, name: 'Create', path: '/dashboard/order/domestic/create' },
        { icon: FaClipboardList, name: 'Support', path: '/dashboard/support' },
        { icon: FaHistory, name: 'History', path: '/dashboard/transaction-history' },
    ];

    const adminDashboardItems = [
        { icon: FaUserCircle, name: 'Dash', path: '/dashboard' },
        { icon: FaUsers, name: 'Merchant', path: '/dashboard/manage/merchant/verified' },
        { icon: FaBox, name: 'Shipment', path: '/dashboard/manage/merchant/shipments/domestic' },
        { icon: FaClipboardList, name: 'Reports', path: '/dashboard/manage/merchant/shipments/domestic/reports' },
        { icon: FaClipboardList, name: 'Support', path: '/dashboard/admin/support' },
    ];

    const publicNavItems = [
        { icon: FaHome, name: 'Home', path: '/' },
        { icon: FaClipboardList, name: 'Track', path: '/tracking' },
        { icon: FaTags, name: 'Pricing', path: '/domestic' },
        { icon: FaPhone, name: 'Contact', path: '/contact-send' },
        ...(isAuthenticated ? [{ icon: FaUserCircle, name: 'Dash', path: '/dashboard' }] : []),
    ];

    const currentNavItems = isDashboardRoute
        ? (isAdmin ? adminDashboardItems : merchantDashboardItems)
        : publicNavItems;

    const handleLinkClick = (itemPath, itemAction) => {
        if (itemAction === 'openWalletModal' && isDashboardRoute && verified) {
            setShowWalletRechargeModal(true);
        }
        // ONLY call closeSidebar (which is App.jsx's toggleSidebar) if the sidebar is currently OPEN
        // and we are on a mobile device. This ensures it only closes the sidebar, not opens it.
        // The mobile bottom navbar is for mobile devices only.
        if (closeSidebar && sidebarOpen) { // check if sidebar is open
            closeSidebar(); // Toggle it to close
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around py-4 md:hidden z-50"> {/* Increased py-2 to py-4 */}
            {currentNavItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path === '/dashboard' && location.pathname === '/dashboard/') ||
                    (item.path === '/dashboard/parcels/domestic' && location.pathname.startsWith('/dashboard/parcels')) ||
                    (item.path === '/dashboard/shipment/reports' && location.pathname.startsWith('/dashboard/shipment/reports')) ||
                    (item.path === '/dashboard/transaction-history' && location.pathname.startsWith('/dashboard/transaction-history')) ||
                    (item.path === '/dashboard/manage/merchant/verified' && location.pathname === '/dashboard/manage/merchant/verified') ||
                    (item.path === '/dashboard/manage/merchant/shipments/domestic' && location.pathname === '/dashboard/manage/merchant/shipments/domestic') ||
                    (item.path === '/dashboard/manage/merchant/shipments/domestic/reports' && location.pathname.includes('/reports')) ||
                    (item.path === '/dashboard/submissions/merchant-verification' && location.pathname.startsWith('/dashboard/submissions')) ||
                    (item.path === '/pricing' && location.pathname.startsWith('/pricing'));

                // For the wallet item, it should now look like a standard item but open a modal on click.
                // The wallet balance display has been removed as per the user's request.
                if (item.action === 'openWalletModal' && isDashboardRoute && verified) {
                    return (
                        <div
                            key={item.name}
                            onClick={() => handleLinkClick(item.path, item.action)}
                            className={`flex flex-col items-center text-xs px-2 py-1 rounded-md flex-1 min-w-0
                                ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        >
                            <item.icon className="text-xl mb-1" />
                            <span>{item.name}</span>
                        </div>
                    );
                } else {
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => handleLinkClick(item.path, item.action)}
                            className={`flex flex-col items-center text-xs px-2 py-1 rounded-md flex-1 min-w-0
                                ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        >
                            <item.icon className="text-xl mb-1" />
                            <span>{item.name}</span>
                        </Link>
                    );
                }
            })}
        </div>
    );
};

export default MobileBottomNavbar;