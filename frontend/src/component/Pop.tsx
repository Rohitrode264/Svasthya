import React, { useEffect, useState } from "react";

interface PopProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Pop: React.FC<PopProps> = ({ open, onClose, children }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (open) {
            const t = setTimeout(() => setVisible(true), 10);
            return () => clearTimeout(t);
        } else {
            setVisible(false);
        }
    }, [open]);
    if (!open) return null;
    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(), 200);
    };
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${visible ? "" : "pointer-events-none"}`}>
            <div className={`absolute inset-0 transition-opacity duration-200 ${visible ? "bg-black/40 opacity-100" : "bg-black/40 opacity-0"}`} onClick={handleClose} />
            <div className={`relative bg-white w-full max-w-md mx-4 rounded-xl shadow-xl border border-gray-200 p-6 transition-all duration-200 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}>
                {children}
                <div className="mt-4 flex justify-end">
                    <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Close</button>
                </div>
            </div>
        </div>
    );
};


