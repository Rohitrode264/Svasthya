"use client";
import React, { useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { Card } from "../Card";
import { useAddMedication } from "../../hooks/useAddMedication";
import { useParams } from "react-router-dom";
import { Pill, AlertCircle } from "lucide-react";

interface MedicationData {
  name: string;
  brand?: string;
  strength?: string;
  quantity?: number;
  refillThreshold?: number;
  instructions?: string;
}

interface AddMedicationFormProps {
  onSuccess?: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onSuccess }) => {
  const { userId } = useParams();
  const { addMedication, loading, message } = useAddMedication();

  const [form, setForm] = useState<MedicationData>({
    name: "",
    brand: "",
    strength: "",
    quantity: undefined,
    refillThreshold: undefined,
    instructions: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Medication name is required";
    if (form.quantity && form.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (form.refillThreshold && form.refillThreshold < 0) newErrors.refillThreshold = "Refill threshold cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!userId) {
      alert("User ID not found");
      return;
    }

    await addMedication(userId, form, onSuccess);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Add New Medication" subtitle="Enter medication details">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-teal-500" />
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Medication Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g., Paracetamol"
              />
              <Input
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g., Tylenol"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Strength"
                name="strength"
                value={form.strength}
                onChange={handleChange}
                placeholder="e.g., 500mg"
              />
              <Input
                label="Quantity"
                type="number"
                name="quantity"
                value={form.quantity ?? ""}
                onChange={handleChange}
                error={errors.quantity}
                placeholder="Number of tablets"
              />
            </div>

            <Input
              label="Refill Threshold"
              type="number"
              name="refillThreshold"
              value={form.refillThreshold ?? ""}
              onChange={handleChange}
              error={errors.refillThreshold}
              placeholder="Alert when tablets reach this number"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 resize-none"
                placeholder="e.g., Take with food, avoid alcohol..."
              />
            </div>
          </div>

          {/* Scheduling has been moved to a separate form per medication */}

          {/* Status Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${message.includes("successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              <Pill className="w-4 h-4 mr-2" />
              Add Medication
            </Button>

          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddMedicationForm;
