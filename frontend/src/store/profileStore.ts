import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BASE_URL } from '../config';
import axios from 'axios';

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

export interface ProfileCreationForm {
    name: string;
    email: string;
    password: string;
}

// Store State Interface
interface ProfileStore {
    // State
    profile: UserProfile | null;
    loading: boolean;
    message: string;
    stats: UserStats | null;
    doseStats: DoseStatistics | null;
    emergencyContacts: EmergencyContact[];
    currentUserId: string | null;
    showProfileCreation: boolean;
    profileCreationForm: ProfileCreationForm;

    // Actions
    fetchProfile: (userId: string) => Promise<void>;
    createProfile: (formData: ProfileCreationForm) => Promise<void>;
    fetchStats: (userId: string) => Promise<void>;
    fetchDoseStatistics: (userId: string, days?: number) => Promise<void>;
    fetchEmergencyContacts: (userId: string) => Promise<void>;
    updateProfile: (userId: string, data: { name?: string; email?: string }) => Promise<void>;
    createEmergencyContact: (data: { name: string; phone?: string; email?: string; relation?: string }) => Promise<void>;
    deleteEmergencyContact: (contactId: string) => Promise<void>;
    resetProfileState: () => void;

    // Setters
    setProfileCreationForm: (form: ProfileCreationForm) => void;
    setShowProfileCreation: (show: boolean) => void;
    setCurrentUserId: (userId: string | null) => void;
    setMessage: (message: string) => void;
}

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const useProfileStore = create<ProfileStore>()(
    devtools(
        (set, get) => ({
            // Initial State
            profile: null,
            loading: false,
            message: '',
            stats: null,
            doseStats: null,
            emergencyContacts: [],
            currentUserId: null,
            showProfileCreation: false,
            profileCreationForm: {
                name: '',
                email: '',
                password: '',
            },

            // Actions
            fetchProfile: async (userId: string) => {
                set({ loading: true, message: '' });
                try {
                    const res = await axios.get(`${BASE_URL}/profiles/${userId}/overview`, {
                        headers: {Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        
                            // User doesn't have a profile yet
                            set({
                                showProfileCreation: true,
                                currentUserId: userId,
                                message: "Profile not found. Please create your profile.",
                                loading: false
                            
                            
                        })
                    }

                    const data = await res.data;
                    set({
                        profile: data,
                        showProfileCreation: false,
                        loading: false
                    });
                } catch (e: any) {
                    set({
                        message: e.message || "Failed to load profile",
                        loading: false
                    });
                }
            },

            createProfile: async (formData: ProfileCreationForm) => {
                set({ loading: true, message: '' });
                try {
                    const res = await axios.post(`${BASE_URL}/profiles`, {
                        formData,
                        headers:{Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res);
                    }

                    const newProfile = await res.data;
                    set({
                        profile: newProfile,
                        showProfileCreation: false,
                        profileCreationForm: { name: '', email: '', password: '' },
                        message: "Profile created successfully!",
                        loading: false
                    });

                    // Fetch the complete profile data
                    const { currentUserId } = get();
                    if (currentUserId) {
                        await get().fetchProfile(currentUserId);
                    }
                } catch (e: any) {
                    set({
                        message: e.message || "Failed to create profile",
                        loading: false
                    });
                }
            },

            fetchStats: async (userId: string) => {
                try {
                    const res = await axios.get(`${BASE_URL}/profiles/${userId}/stats`, {
                        headers: {Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res);
                    }

                    const data = await res.data;
                    set({ stats: data });
                } catch (e: any) {
                    console.error("Failed to fetch stats:", e);
                }
            },

            fetchDoseStatistics: async (userId: string, days: number = 30) => {
                try {
                    const res = await axios.get(`${BASE_URL}/doses/${userId}/statistics?days=${days}`, {
                        headers: {Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res);
                    }

                    const data = await res.data;
                    set({ doseStats: data });
                } catch (e: any) {
                    console.error("Failed to fetch dose statistics:", e);
                }
            },

            updateProfile: async (userId: string, data: { name?: string; email?: string }) => {
                set({ loading: true, message: '' });
                try {
                    const res = await axios.put(`${BASE_URL}/profiles/${userId}`, {
                        data,
                        headers:{Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res);
                    }

                    const updatedData = await res.data;
                    set(state => ({
                        profile: state.profile ? { ...state.profile, ...updatedData } : null,
                        message: "Profile updated successfully",
                        loading: false
                    }));
                } catch (e: any) {
                    set({
                        message: e.message || "Failed to update profile",
                        loading: false
                    });
                }
            },

            fetchEmergencyContacts: async (userId: string) => {
                try {
                    const res = await axios.get(`${BASE_URL}/contacts/${userId}`, {
                        headers:{Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res);
                    }

                    const data = await res.data;
                    set({ emergencyContacts: data.contacts || [] });
                } catch (e: any) {
                    console.error("Failed to fetch emergency contacts:", e);
                }
            },

            createEmergencyContact: async (data: { name: string; phone?: string; email?: string; relation?: string }) => {
                set({ loading: true, message: '' });
                try {
                    const res = await axios.post(`${BASE_URL}/contacts`, {
                        data,
                        headers:{Authorization:localStorage.getItem('token')}
                    });

                    if (!res) {
                        console.error(res)
                    }

                    const newContact = await res.data;
                    set(state => ({
                        emergencyContacts: [newContact.newContact, ...state.emergencyContacts],
                        message: "Emergency contact added successfully",
                        loading: false
                    }));
                } catch (e: any) {
                    set({
                        message: e.message || "Failed to add emergency contact",
                        loading: false
                    });
                }
            },

            deleteEmergencyContact: async (contactId: string) => {
                set({ loading: true, message: '' });
                try {
                    const res = await fetch(`${BASE_URL}/api/contacts/${contactId}`, {
                        method: 'DELETE',
                        headers: authHeaders()
                    });

                    if (!res.ok) {
                        throw new Error(`Failed to delete emergency contact: ${res.statusText}`);
                    }

                    set(state => ({
                        emergencyContacts: state.emergencyContacts.filter(contact => contact.id !== contactId),
                        message: "Emergency contact deleted successfully",
                        loading: false
                    }));
                } catch (e: any) {
                    set({
                        message: e.message || "Failed to delete emergency contact",
                        loading: false
                    });
                }
            },

            resetProfileState: () => {
                set({
                    profile: null,
                    stats: null,
                    doseStats: null,
                    emergencyContacts: [],
                    message: '',
                    showProfileCreation: false,
                    profileCreationForm: { name: '', email: '', password: '' }
                });
            },

            // Setters
            setProfileCreationForm: (form: ProfileCreationForm) => {
                set({ profileCreationForm: form });
            },

            setShowProfileCreation: (show: boolean) => {
                set({ showProfileCreation: show });
            },

            setCurrentUserId: (userId: string | null) => {
                set({ currentUserId: userId });
            },

            setMessage: (message: string) => {
                set({ message });
            },
        }),
        {
            name: 'profile-store',
        }
    )
);

// Selectors (computed values)
export const useProfileSelectors = () => {
    const profile = useProfileStore(state => state.profile);
    const stats = useProfileStore(state => state.stats);
    const doseStats = useProfileStore(state => state.doseStats);
    const emergencyContacts = useProfileStore(state => state.emergencyContacts);

    return {
        profileExists: profile !== null,
        profileDisplayName: profile?.name || 'User',
        profileEmail: profile?.email || '',
        medicationCount: stats?._count?.medications || 0,
        doseLogCount: stats?._count?.doseLogs || 0,
        recentDoses: stats?.recentDoses || 0,
        missedDoses: stats?.missedDoses || 0,
        adherenceRate: doseStats?.adherenceRate || 0,
        emergencyContactsCount: emergencyContacts.length,
        recentDoseLogs: profile?.doseLogs?.slice(0, 5) || [],
        currentMedications: profile?.medications?.slice(0, 3) || [],
        recentAlerts: profile?.alerts?.slice(0, 3) || [],
    };
};
