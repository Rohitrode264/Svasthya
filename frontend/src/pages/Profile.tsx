"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    User,
    Mail,
    Calendar,
    Pill,
    Activity,
    AlertTriangle,
    Edit3,
    Save,
    X,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    MinusCircle,
    Phone,
    UserPlus,
    Trash2,
    Plus,
    UserCheck
} from "lucide-react";
import { useProfileStore } from "../store/profileStore";
import { MainWrapper } from "../component/Wrapper/MainWrapper";
import { Button } from "../component/Button";
import { Input } from "../component/Input";

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const {
        loading,
        message,
        profile,
        stats,
        doseStats,
        emergencyContacts,
        showProfileCreation,
        profileCreationForm,
        fetchProfile,
        createProfile,
        fetchStats,
        fetchDoseStatistics,
        fetchEmergencyContacts,
        updateProfile,
        createEmergencyContact,
        deleteEmergencyContact,
        setProfileCreationForm,
        setShowProfileCreation,
        setMessage
    } = useProfileStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        email: ""
    });
    const [showAddContact, setShowAddContact] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: "",
        phone: "",
        email: "",
        relation: ""
    });

    useEffect(() => {
        if (userId) {
            fetchProfile(userId);
            fetchStats(userId);
            fetchDoseStatistics(userId);
            fetchEmergencyContacts(userId);
        }
    }, [userId, fetchProfile, fetchStats, fetchDoseStatistics, fetchEmergencyContacts]);

    useEffect(() => {
        if (profile) {
            setEditForm({
                name: profile.name || "",
                email: profile.email
            });
        }
    }, [profile]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            setEditForm({
                name: profile.name || "",
                email: profile.email
            });
        }
    };

    const handleSave = async () => {
        if (!userId) return;

        await updateProfile(userId, {
            name: editForm.name || undefined,
            email: editForm.email
        });

        if (!message.includes("Failed")) {
            setIsEditing(false);
            // Refresh data
            fetchProfile(userId);
            fetchStats(userId);
        }
    };

    const handleAddContact = async () => {
        if (!contactForm.name.trim()) return;

        await createEmergencyContact({
            name: contactForm.name,
            phone: contactForm.phone || undefined,
            email: contactForm.email || undefined,
            relation: contactForm.relation || undefined
        });

        if (!message.includes("Failed")) {
            setShowAddContact(false);
            setContactForm({ name: "", phone: "", email: "", relation: "" });
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (window.confirm("Are you sure you want to delete this emergency contact?")) {
            await deleteEmergencyContact(contactId);
        }
    };

    const handleCreateProfile = async () => {
        if (!profileCreationForm.name.trim() || !profileCreationForm.email.trim() || !profileCreationForm.password.trim()) {
            setMessage("Please fill in all required fields");
            return;
        }

        await createProfile(profileCreationForm);
    };

    const handleCancelProfileCreation = () => {
        setShowProfileCreation(false);
        setProfileCreationForm({ name: '', email: '', password: '' });
        setMessage("");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "TAKEN":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "MISSED":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "SKIPPED":
                return <MinusCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "TAKEN":
                return "text-green-600 bg-green-50";
            case "MISSED":
                return "text-red-600 bg-red-50";
            case "SKIPPED":
                return "text-yellow-600 bg-yellow-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    if (loading && !profile && !showProfileCreation) {
        return (
            <MainWrapper>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </MainWrapper>
        );
    }

    // Profile Creation Form
    if (showProfileCreation) {
        return (
            <MainWrapper>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                    <div className="max-w-2xl mx-auto px-6 py-12">
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserCheck className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
                                <p className="text-gray-600">Set up your health profile to get started with Svasthya</p>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Full Name *"
                                    value={profileCreationForm.name}
                                    onChange={(e) => setProfileCreationForm({ ...profileCreationForm, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                                <Input
                                    label="Email Address *"
                                    type="email"
                                    value={profileCreationForm.email}
                                    onChange={(e) => setProfileCreationForm({ ...profileCreationForm, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                                <Input
                                    label="Password *"
                                    type="password"
                                    value={profileCreationForm.password}
                                    onChange={(e) => setProfileCreationForm({ ...profileCreationForm, password: e.target.value })}
                                    placeholder="Create a secure password"
                                />
                            </div>

                            {message && (
                                <div className={`mt-6 p-4 rounded-lg text-sm ${message.includes("Failed") || message.includes("Please fill") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                <Button
                                    onClick={handleCreateProfile}
                                    variant="primary"
                                    disabled={loading || !profileCreationForm.name.trim() || !profileCreationForm.email.trim() || !profileCreationForm.password.trim()}
                                    icon={<Plus size={20} />}
                                    className="flex-1"
                                >
                                    {loading ? "Creating Profile..." : "Create Profile"}
                                </Button>
                                <Button
                                    onClick={handleCancelProfileCreation}
                                    variant="outline"
                                    icon={<X size={20} />}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    By creating a profile, you agree to our terms of service and privacy policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </MainWrapper>
        );
    }

    if (!profile) {
        return (
            <MainWrapper>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
                        <p className="text-gray-600">Unable to load your profile information.</p>
                    </div>
                </div>
            </MainWrapper>
        );
    }

    return (
        <MainWrapper>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {profile.name || "User Profile"}
                                    </h1>
                                    <p className="text-gray-600">Manage your health information</p>
                                </div>
                            </div>
                            <Button
                                onClick={isEditing ? handleSave : handleEdit}
                                variant={isEditing ? "primary" : "outline"}
                                size="md"
                                icon={isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                            >
                                {isEditing ? "Save Changes" : "Edit Profile"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                                    {isEditing && (
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            size="sm"
                                            icon={<X size={16} />}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <Input
                                            label="Full Name"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter your full name"
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium text-gray-900">{profile.name || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">{profile.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Member Since</p>
                                                <p className="font-medium text-gray-900">{formatDate(profile.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {message && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                                        }`}>
                                        {message}
                                    </div>
                                )}
                            </div>

                            {/* Statistics */}
                            {stats && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Statistics</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl">
                                            <Pill className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-gray-900">{stats._count.medications}</p>
                                            <p className="text-sm text-gray-600">Medications</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-gray-900">{stats._count.doseLogs}</p>
                                            <p className="text-sm text-gray-600">Dose Logs</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-gray-900">{stats.recentDoses}</p>
                                            <p className="text-sm text-gray-600">Recent Doses</p>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                                            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-gray-900">{stats.missedDoses}</p>
                                            <p className="text-sm text-gray-600">Missed Doses</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Adherence Rate */}
                            {doseStats && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Medication Adherence</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Adherence Rate ({doseStats.period})</span>
                                            <span className="text-lg font-bold text-teal-600">{doseStats.adherenceRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(doseStats.adherenceRate, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-lg font-semibold text-green-600">{doseStats.takenDoses}</p>
                                                <p className="text-xs text-gray-600">Taken</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-red-600">{doseStats.missedDoses}</p>
                                                <p className="text-xs text-gray-600">Missed</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-yellow-600">{doseStats.skippedDoses}</p>
                                                <p className="text-xs text-gray-600">Skipped</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Emergency Contacts */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
                                    <Button
                                        onClick={() => setShowAddContact(true)}
                                        variant="outline"
                                        size="sm"
                                        icon={<UserPlus size={16} />}
                                    >
                                        Add Contact
                                    </Button>
                                </div>

                                {showAddContact && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Emergency Contact</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Name *"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="Contact name"
                                            />
                                            <Input
                                                label="Phone"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="Phone number"
                                            />
                                            <Input
                                                label="Email"
                                                type="email"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="Email address"
                                            />
                                            <Input
                                                label="Relation"
                                                value={contactForm.relation}
                                                onChange={(e) => setContactForm(prev => ({ ...prev, relation: e.target.value }))}
                                                placeholder="e.g., Spouse, Parent, Friend"
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                onClick={handleAddContact}
                                                variant="primary"
                                                size="sm"
                                                disabled={!contactForm.name.trim()}
                                            >
                                                Add Contact
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setShowAddContact(false);
                                                    setContactForm({ name: "", phone: "", email: "", relation: "" });
                                                }}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {emergencyContacts.map((contact: any) => (
                                        <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{contact.name}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {contact.phone}
                                                            </div>
                                                        )}
                                                        {contact.email && (
                                                            <div className="flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                {contact.email}
                                                            </div>
                                                        )}
                                                        {contact.relation && (
                                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                                                {contact.relation}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                variant="outline"
                                                size="sm"
                                                icon={<Trash2 size={16} />}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                    {emergencyContacts.length === 0 && (
                                        <div className="text-center py-8">
                                            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-2">No emergency contacts added</p>
                                            <p className="text-sm text-gray-500">Add contacts to ensure help is available when needed</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Dose Logs */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {profile.doseLogs.slice(0, 5).map((log: any) => (
                                        <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                            {getStatusIcon(log.status)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {log.medication.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(log.takenAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    ))}
                                    {profile.doseLogs.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </div>

                            {/* Current Medications */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                                <div className="space-y-3">
                                    {profile.medications.slice(0, 3).map((med: any) => (
                                        <div key={med.id} className="p-3 rounded-lg bg-gray-50">
                                            <p className="font-medium text-gray-900">{med.name}</p>
                                            {med.brand && (
                                                <p className="text-sm text-gray-600">{med.brand}</p>
                                            )}
                                            {med.strength && (
                                                <p className="text-xs text-gray-500">{med.strength}</p>
                                            )}
                                        </div>
                                    ))}
                                    {profile.medications.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">No medications added</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Alerts */}
                            {profile.alerts.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                                    <div className="space-y-3">
                                        {profile.alerts.slice(0, 3).map((alert: any) => (
                                            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                                                    {alert.message && (
                                                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(alert.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
};

export default Profile;