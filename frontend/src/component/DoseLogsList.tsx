import React, { useEffect } from "react";
import { useDoseLogs } from "../hooks/useDoseLogs";

interface DoseLogsListProps {
    userId: string;
}

export const DoseLogsList: React.FC<DoseLogsListProps> = ({ userId }) => {
    const { fetchUserLogs, logs, loading, message } = useDoseLogs();

    // ✅ Always treat logs as an array
    const safeLogs = Array.isArray(logs) ? logs : [];

    useEffect(() => {
        if (userId) fetchUserLogs(userId, { limit: 50, days: 30 });
    }, [userId, fetchUserLogs]);

    if (loading && safeLogs.length === 0)
        return <p className="text-center text-gray-400 py-4">Loading...</p>;

    if (message && safeLogs.length === 0)
        return <p className="text-center text-red-500 py-4">{message}</p>;

    return (
        <div className="space-y-3 max-h-80 overflow-y-auto">
            {safeLogs.map((log) => (
                <div
                    key={log.id}
                    className="p-3 border border-gray-100 rounded-lg bg-white/70 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800">
                            {log.medication?.name || "Medication"}
                        </div>
                        <div
                            className={`text-xs px-2 py-1 rounded-full ${log.status === "TAKEN"
                                    ? "bg-green-100 text-green-700"
                                    : log.status === "MISSED"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {log.status}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {new Date(log.takenAt).toLocaleString()}
                    </div>
                    {log.note && <div className="text-sm text-gray-700 mt-1">{log.note}</div>}
                </div>
            ))}

            {safeLogs.length === 0 && !loading && (
                <p className="text-center text-gray-400 py-4">No dose logs yet.</p>
            )}
        </div>
    );
};

export default DoseLogsList;
