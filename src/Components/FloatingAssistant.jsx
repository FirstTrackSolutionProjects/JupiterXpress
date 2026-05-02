import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have useAuth hook setup
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import TicketChatbot from './TicketChatbot'; // Import the new chatbot component

export default function FloatingAssistant() {
    const { isAuthenticated } = useAuth(); 
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => {
            setIsOpen(true);
        };

        window.addEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);

        return () => {
            window.removeEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);
        };
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);
    const handleClose = () => setIsOpen(false);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[1000] flex flex-col items-end"> 
            {/* Chat Modal Window */}
            {isOpen && (
                <div 
                    className="bg-white shadow-2xl rounded-2xl overflow-hidden 
                                w-[calc(100vw-2rem)] sm:w-80 md:w-96 
                                h-auto max-h-[75vh] md:max-h-[600px] 
                                mb-4 border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-brand-green/10"
                >
                    {/* Header */}
                    <div className="bg-sky-950 text-white px-5 py-4 flex justify-between items-center shrink-0">
                        <div>
                            <p className="font-bold text-sm tracking-tight">JupiterXpress Support</p>
                            <p className="text-[10px] text-white/80 font-medium">Online • Typical reply 5m</p>
                        </div>
                        <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Chatbot Content */}
                    <div className="flex-1 overflow-hidden">
                        <TicketChatbot onClose={handleClose} />
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-full shadow-xl text-white transition-all duration-300 flex items-center justify-center 
                            ${isOpen ? 'bg-blue-600 rotate-90 scale-110 shadow-blue-600/40' : 'bg-sky-950 hover:bg-sky-900 hover:scale-110 hover:shadow-sky-950/40'}`}
                aria-label={isOpen ? "Close Support Chat" : "Open Support Chat"}
            >
                {isOpen ? <FaTimes size={26} /> : <FaCommentDots size={26} />}
            </button>
        </div>
    );
}
