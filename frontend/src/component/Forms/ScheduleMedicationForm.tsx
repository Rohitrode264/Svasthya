"use client";
import React, { useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { useMedicationSchedule } from "../../hooks/useMedicationSchedule";
import { Clock, Calendar, Plus, Trash2, AlertCircle } from "lucide-react";

interface ScheduleMedicationFormProps {
    medicationId: string;
    instructions?: string;
    onSuccess?: () => void;
}

export const ScheduleMedicationForm: React.FC<ScheduleMedicationFormProps> = ({ medicationId, instructions, onSuccess }) => {
    const { createSchedule, loading, message } = useMedicationSchedule();

    const [times, setTimes] = useState<Record<string, string>>({ morning: "08:00", evening: "20:00" });
    const [duration, setDuration] = useState<{ type: string; days?: number }>({ type: "auto" });

    const handleTimeChange = (key: string, value: string) => {
        setTimes(prev => ({ ...prev, [key]: value }));
    };

    const addTime = () => {
        const key = `time_${Date.now()}`;
        setTimes(prev => ({ ...prev, [key]: "08:00" }));
    };

    const removeTime = (key: string) => {
        const next = { ...times };
        delete next[key];
        setTimes(next);
    };

    const submit = async () => {
        await createSchedule({
            medicationId,
            frequency: Object.keys(times),
            times,
            duration,
            instructions,
        }, onSuccess);
    };

    return (
        <Card title="Schedule Reminders" subtitle="Set reminder times and duration">
            <div className="space-y-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-teal-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Reminder Times</h3>
                    </div>

                    {Object.entries(times).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1 capitalize">{key.replace('_', ' ')}</label>
                                <input
                                    type="time"
                                    value={value}
                                    onChange={(e) => handleTimeChange(key, e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                                />
                            </div>
                            {Object.keys(times).length > 1 && (
                                <Button variant="outline" size="sm" type="button" onClick={() => removeTime(key)} className="mt-6">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button variant="outline" size="sm" type="button" onClick={addTime} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Add Another Time
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration Type</label>
                        <select
                            value={duration.type}
                            onChange={(e) => setDuration(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                        >
                            <option value="auto">Auto (based on quantity)</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>

                    {duration.type === "manual" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                            <input
                                type="number"
                                min={1}
                                value={duration.days ?? 7}
                                onChange={(e) => setDuration(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                            />
                        </div>
                    )}
                </div>

                {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${message.includes("successfully")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"}`}>
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                <Button variant="secondary" onClick={submit} loading={loading} disabled={loading}>
                    <Calendar className="w-4 h-4 mr-2" /> Create Schedule
                </Button>
            </div>
        </Card>
    );
};

export default ScheduleMedicationForm;


