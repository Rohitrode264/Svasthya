"use client";
import React, { useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { useDoseLogs, type DoseStatus } from "../../hooks/useDoseLogs";

interface LogDoseFormProps {
    medicationId: string;
    userId: string;
    onSuccess?: () => void;
}

export const LogDoseForm: React.FC<LogDoseFormProps> = ({ medicationId, userId, onSuccess }) => {
    const { logDose, loading, message } = useDoseLogs();
    const [status, setStatus] = useState<DoseStatus>("TAKEN");
    const [note, setNote] = useState("");

    const submit = async () => {
        await logDose({ userId, medicationId, status, note }, onSuccess);
    };

    return (
        <Card title="Log Dose" subtitle="Record your medication intake">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as DoseStatus)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    >
                        <option value="TAKEN">Taken</option>
                        <option value="MISSED">Missed</option>
                        <option value="SKIPPED">Skipped</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 resize-none"
                        placeholder="e.g., Took after breakfast"
                    />
                </div>

                {message && (
                    <div className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</div>
                )}

                <Button variant="primary" onClick={submit} loading={loading} disabled={loading}>
                    Save
                </Button>
            </div>
        </Card>
    );
};

export default LogDoseForm;


