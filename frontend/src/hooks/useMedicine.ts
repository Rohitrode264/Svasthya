import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

interface Medication {
  id: string;
  name: string;
  brand?: string;
  strength?: string;
  quantity?: number;
  refillThreshold?: number;
  instructions?: string;
  schedules?: any[];
  reminders?: any[];
  doseLogs?: any[];
}

export const useMedications = (userId?: string) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/medication/user/${userId}`);
      console.log(data);
      setMedications(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch medications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [userId]);

  return { medications, loading, error, refetch: fetchMedications };
};
