import { useState } from "react";
import AddMedicationForm from "../../component/Forms/AddMedicationForm";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import { Button } from "../../component/Button";
import { Modal } from "../../component/Wrapper/PopWrapper";
import { useMedications } from "../../hooks/useMedicine";
import { useParams } from "react-router-dom";
import ScheduleMedicationForm from "../../component/Forms/ScheduleMedicationForm";
import LogDoseForm from "../../component/Forms/LogDoseForm";
import DoseLogsList from "../../component/DoseLogsList";
import { Calendar } from "lucide-react";

export const MediMinder = () => {
    const { userId } = useParams(); // ⚙️ Replace with auth/user context
    const { medications, loading, error, refetch } = useMedications(userId);
    const [showAddModal, setShowAddModal] = useState(false);
    const [search, setSearch] = useState("");
    const [scheduleMedId, setScheduleMedId] = useState<string | null>(null);
    const [logDoseMedId, setLogDoseMedId] = useState<string | null>(null);

    const filteredMeds = medications.filter((med) =>
        med.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainWrapper>
            {/* ---- Header ---- */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="flex items-center text-2xl font-semibold text-gray-800 space-x-2">

                    <Calendar className="w-6 h-6 text-lime-600" />
                    <span>MediMinder</span>
                </h1>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    + Add Medication
                </Button>
            </div>

            {/* ---- Search + List ---- */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-lime-100">
                <input
                    type="text"
                    placeholder="Search medications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-200 focus:border-lime-400 mb-4"
                />

                <div className="max-h-screen overflow-y-auto space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-400 py-8">Loading medications...</p>
                    ) : error ? (
                        <p className="text-center text-red-500 py-8">{error}</p>
                    ) : filteredMeds.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No medications found.</p>
                    ) : (
                        filteredMeds.map((med) => {
                            const totalReminders = Array.isArray(med.reminders) ? med.reminders.length : 0;
                            const sentReminders = Array.isArray(med.reminders) ? med.reminders.filter((r: any) => r.sent).length : 0;
                            const scheduleTimes = Array.isArray(med.schedules) ? med.schedules.map((s: any) => s.timeOfDay) : [];
                            return (
                                <div
                                    key={med.id}
                                    className="p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition bg-white/60 backdrop-blur-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{med.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {med.brand || "—"} • {med.strength || "—"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {typeof med.quantity === 'number' ? `${med.quantity} tablets` : "Quantity —"}
                                                {typeof med.refillThreshold === 'number' ? ` • Refill @ ${med.refillThreshold}` : ""}
                                            </p>

                                            {scheduleTimes.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {scheduleTimes.map((t: string) => (
                                                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-lime-100 text-lime-700 border border-lime-200">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 text-xs text-gray-600">
                                                Reminders: <span className="font-medium text-gray-800">{sentReminders}</span> / {totalReminders}
                                            </div>

                                            {med.instructions && (
                                                <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                                                    {med.instructions}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[120px]">
                                            <Button variant="outline" size="sm" onClick={() => setScheduleMedId(med.id)}>
                                                Schedule
                                            </Button>
                                            <Button variant="secondary" size="sm" onClick={() => setLogDoseMedId(med.id)}>
                                                Log Dose
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ---- Add Medication Modal ---- */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddMedicationForm
                    onSuccess={() => {
                        refetch();
                        setShowAddModal(false);
                    }}
                />
            </Modal>

            {/* ---- Schedule Medication Modal ---- */}
            <Modal isOpen={!!scheduleMedId} onClose={() => setScheduleMedId(null)}>
                {scheduleMedId && (
                    <ScheduleMedicationForm
                        medicationId={scheduleMedId}
                        onSuccess={() => {
                            refetch();
                            setScheduleMedId(null);
                        }}
                    />
                )}
            </Modal>

            {/* ---- Log Dose Modal ---- */}
            <Modal isOpen={!!logDoseMedId} onClose={() => setLogDoseMedId(null)}>
                {logDoseMedId && userId && (
                    <LogDoseForm
                        medicationId={logDoseMedId}
                        userId={userId}
                        onSuccess={() => {
                            refetch();
                            setLogDoseMedId(null);
                        }}
                    />
                )}
            </Modal>


        </MainWrapper>
    );
};
