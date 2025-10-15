import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

export const useAddMedication = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addMedication = async (
    userId: string,
    formData: any,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/meds/add`,
        {
          userId,
          ...formData,
          quantity: formData.quantity ? Number(formData.quantity) : undefined,
          refillThreshold: formData.refillThreshold ? Number(formData.refillThreshold) : undefined,
        },
        {
          headers: token ? { Authorization: `token ${token}` } : undefined,
        }
      );

      if (res.status === 201) {
        setMessage(" Medication added successfully!");
        onSuccess?.();
      }
    } catch (err: any) {
      setMessage(` ${err.response?.data?.error || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return { addMedication, loading, message };
};
