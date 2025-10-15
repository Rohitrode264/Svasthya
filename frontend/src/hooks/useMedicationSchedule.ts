import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

interface ScheduleData {
    medicationId: string;
    frequency: string[];
    times: { [key: string]: string };
    duration: { type: string; days?: number };
    instructions?: string;
}

export const useMedicationSchedule = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const createSchedule = async (
        scheduleData: ScheduleData,
        onSuccess?: () => void
    ) => {
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${BASE_URL}/schedules`,
                scheduleData,
                {
                    headers: token ? { Authorization: `token ${token}` } : undefined,
                }
            );


            if (res.status === 201) {
                setMessage("Schedule created successfully!");
                onSuccess?.();
            }
        } catch (err: any) {
            setMessage(`Error: ${err.response?.data?.error || "Failed to create schedule"}`);
        } finally {
            setLoading(false);
        }
    };

    const updateSchedule = async (
        scheduleId: string,
        scheduleData: Partial<ScheduleData>,
        onSuccess?: () => void
    ) => {
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${BASE_URL}/schedules/${scheduleId}`,
                scheduleData,
                {
                    headers: token ? { Authorization: `token ${token}` } : undefined,
                }
            );

            if (res.status === 200) {
                setMessage("Schedule updated successfully!");
                onSuccess?.();
            }
        } catch (err: any) {
            setMessage(`Error: ${err.response?.data?.error || "Failed to update schedule"}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteSchedule = async (
        scheduleId: string,
        onSuccess?: () => void
    ) => {
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(
                `${BASE_URL}/schedules/${scheduleId}`,
                {
                    headers: token ? { Authorization: `token ${token}` } : undefined,
                }
            );

            if (res.status === 200) {
                setMessage("Schedule deleted successfully!");
                onSuccess?.();
            }
        } catch (err: any) {
            setMessage(`Error: ${err.response?.data?.error || "Failed to delete schedule"}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        createSchedule,
        updateSchedule,
        deleteSchedule,
        loading,
        message
    };
};
