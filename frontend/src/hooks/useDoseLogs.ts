import { useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

export type DoseStatus = "TAKEN" | "MISSED" | "SKIPPED";

interface DoseLogInput {
    userId: string;
    medicationId: string;
    status: DoseStatus;
    note?: string;
}

export const useDoseLogs = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [logs, setLogs] = useState<any[]>([]);

    const logDose = useCallback(async (input: DoseLogInput, onSuccess?: () => void) => {
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${BASE_URL}/medication/log`,
                {
                    medicationId: input.medicationId,
                    status: input.status,
                    note: input.note,
                },
                {
                    headers: token ? { Authorization: `token ${token}` } : undefined,
                }
            );
            if (res.status === 201) {
                setMessage("Dose logged successfully");
                onSuccess?.();
            }
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Failed to log dose");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserLogs = useCallback(async (userId: string, params?: { limit?: number; status?: DoseStatus; days?: number }) => {
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_URL}/medication/user/${userId}/logs`, {
                params,
                headers: token ? { Authorization: `token ${token}` } : undefined,
            });
            setLogs(res.data || []);
        } catch (err: any) {
            setMessage(err.response?.data?.error || "Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    }, []);

    return { logDose, fetchUserLogs, logs, loading, message };
};


