import { useCallback, useState } from "react";
import { BASE_URL } from "../config";

// Types
export interface DashboardStats {
    user: {
        id: string;
        name: string | null;
        email: string;
        createdAt: string;
    };
    profile: {
        id: string;
        displayName: string;
        notes: string | null;
    };
    stats: {
        totalMedications: number;
        totalDoseLogs: number;
        recentDoses: number;
        missedDoses: number;
        adherenceRate: number;
        totalPosts: number;
        totalLikes: number;
        totalFollowers: number;
    };
    upcomingReminders: Reminder[];
    recentActivity: Activity[];
}

export interface Reminder {
    id: string;
    medicationId: string;
    scheduledAt: string;
    sent: boolean;
    createdAt: string;
    medication: {
        id: string;
        name: string;
        brand: string | null;
        strength: string | null;
    };
}

export interface Activity {
    id: string;
    type: "dose_taken" | "dose_missed" | "medication_added" | "post_created";
    description: string;
    timestamp: string;
    metadata?: any;
}

const authHeaders = () => {
    return { Authorization: localStorage.getItem('token') || "" }
};

export const useDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);

    const fetchDashboardData = useCallback(async (userId: string) => {
        setLoading(true);
        setMessage("");
        try {
            // Fetch user profile and stats
            const [profileRes, statsRes, remindersRes, activityRes] = await Promise.all([
                fetch(`${BASE_URL}/profiles/${userId}/overview`, {
                    headers: authHeaders()
                }),
                fetch(`${BASE_URL}/profiles/${userId}/stats`, {
                    headers: authHeaders()
                }),
                fetch(`${BASE_URL}/reminders/user/${userId}/upcoming`, {
                    headers: authHeaders()
                }),
                fetch(`${BASE_URL}/profiles/${userId}/activity`, {
                    headers: authHeaders()
                })
            ]);

            if (!profileRes.ok || !statsRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const profileData = await profileRes.json();
            const statsData = await statsRes.json();
            const remindersData = remindersRes.ok ? await remindersRes.json() : [];
            const activityData = activityRes.ok ? await activityRes.json() : { activities: [] };

            // Calculate adherence rate
            const adherenceRate = statsData.totalDoses > 0
                ? Math.round((statsData.recentDoses / statsData.totalDoses) * 100)
                : 0;

            const dashboardStats: DashboardStats = {
                user: {
                    id: profileData.id,
                    name: profileData.name,
                    email: profileData.email,
                    createdAt: profileData.createdAt
                },
                profile: {
                    id: profileData.profiles?.[0]?.id || "",
                    displayName: profileData.profiles?.[0]?.displayName || profileData.name || "User",
                    notes: profileData.profiles?.[0]?.notes || null
                },
                stats: {
                    totalMedications: statsData._count?.medications || 0,
                    totalDoseLogs: statsData._count?.doseLogs || 0,
                    recentDoses: statsData.recentDoses || 0,
                    missedDoses: statsData.missedDoses || 0,
                    adherenceRate,
                    totalPosts: 0, // Will be implemented when posts are integrated
                    totalLikes: 0, // Will be implemented when posts are integrated
                    totalFollowers: 0 // Will be implemented when social features are added
                },
                upcomingReminders: remindersData || [],
                recentActivity: activityData.activities || []
            };

            setDashboardData(dashboardStats);
        } catch (e: any) {
            setMessage(e.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        message,
        dashboardData,
        fetchDashboardData
    };
};
