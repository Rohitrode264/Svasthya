import { useCallback, useState } from "react";
import { BASE_URL } from "../config";

// Types
export interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    isVerified: boolean;
    createdAt: string;
    medications: Medication[];
    doseLogs: DoseLog[];
    alerts: Alert[];
}

export interface Medication {
    id: string;
    name: string;
    brand: string | null;
    strength: string | null;
    quantity: number | null;
    refillThreshold: number | null;
    instructions: string | null;
    createdAt: string;
    schedules: MedSchedule[];
    reminders: Reminder[];
}

export interface MedSchedule {
    id: string;
    timeOfDay: string;
    recurrence: string;
    createdAt: string;
}

export interface Reminder {
    id: string;
    scheduledAt: string;
    sent: boolean;
    createdAt: string;
}

export interface DoseLog {
    id: string;
    takenAt: string;
    status: "TAKEN" | "MISSED" | "SKIPPED";
    note: string | null;
    createdAt: string;
    medication: {
        name: string;
        brand: string | null;
    };
}

export interface Alert {
    id: string;
    type: string;
    message: string | null;
    lat: number | null;
    lng: number | null;
    delivered: boolean;
    createdAt: string;
}

export interface UserStats {
    id: string;
    name: string | null;
    email: string;
    _count: {
        medications: number;
        doseLogs: number;
        alerts: number;
    };
    recentDoses: number;
    missedDoses: number;
}

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    relation: string | null;
    createdAt: string;
}

export interface DoseStatistics {
    period: string;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
    skippedDoses: number;
    adherenceRate: number;
}

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [doseStats, setDoseStats] = useState<DoseStatistics | null>(null);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

    const fetchProfile = useCallback(async (userId: string) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${BASE_URL}/profiles/${userId}/overview`, {
                headers: authHeaders()
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch profile: ${res.statusText}`);
            }

            const data = await res.json();
            setProfile(data);
        } catch (e: any) {
            setMessage(e.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`${BASE_URL}/profiles/${userId}/stats`, {
                headers: authHeaders()
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch stats: ${res.statusText}`);
            }

            const data = await res.json();
            setStats(data);
        } catch (e: any) {
            console.error("Failed to fetch stats:", e);
        }
    }, []);

    const fetchDoseStatistics = useCallback(async (userId: string, days: number = 30) => {
        try {
            const res = await fetch(`${BASE_URL}/doses/${userId}/statistics?days=${days}`, {
                headers: authHeaders()
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch dose statistics: ${res.statusText}`);
            }

            const data = await res.json();
            setDoseStats(data);
        } catch (e: any) {
            console.error("Failed to fetch dose statistics:", e);
        }
    }, []);

    const updateProfile = useCallback(async (userId: string, data: { name?: string; email?: string }) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${BASE_URL}/profiles/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders()
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`Failed to update profile: ${res.statusText}`);
            }

            const updatedData = await res.json();
            setProfile(prev => prev ? { ...prev, ...updatedData } : null);
            setMessage("Profile updated successfully");
        } catch (e: any) {
            setMessage(e.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmergencyContacts = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`${BASE_URL}/emergency-contacts/${userId}`, {
                headers: authHeaders()
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch emergency contacts: ${res.statusText}`);
            }

            const data = await res.json();
            setEmergencyContacts(data.contacts || []);
        } catch (e: any) {
            console.error("Failed to fetch emergency contacts:", e);
        }
    }, []);

    const createEmergencyContact = useCallback(async (data: { name: string; phone?: string; email?: string; relation?: string }) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${BASE_URL}/emergency-contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders()
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`Failed to create emergency contact: ${res.statusText}`);
            }

            const newContact = await res.json();
            setEmergencyContacts(prev => [newContact.newContact, ...prev]);
            setMessage("Emergency contact added successfully");
        } catch (e: any) {
            setMessage(e.message || "Failed to add emergency contact");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteEmergencyContact = useCallback(async (contactId: string) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(`${BASE_URL}/api/emergency-contacts/${contactId}`, {
                method: 'DELETE',
                headers: authHeaders()
            });

            if (!res.ok) {
                throw new Error(`Failed to delete emergency contact: ${res.statusText}`);
            }

            setEmergencyContacts(prev => prev.filter(contact => contact.id !== contactId));
            setMessage("Emergency contact deleted successfully");
        } catch (e: any) {
            setMessage(e.message || "Failed to delete emergency contact");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        message,
        profile,
        stats,
        doseStats,
        emergencyContacts,
        fetchProfile,
        fetchStats,
        fetchDoseStatistics,
        fetchEmergencyContacts,
        updateProfile,
        createEmergencyContact,
        deleteEmergencyContact
    };
};
