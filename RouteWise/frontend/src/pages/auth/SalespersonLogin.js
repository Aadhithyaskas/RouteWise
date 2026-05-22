import { useEffect, useState, useCallback } from "react";
import API from "../../api/api";

export default function useSalespersonLogic(spId) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // New: for button loading states

  const fetchJobs = useCallback(async () => {
    if (!spId) return;
    setLoading(true);
    try {
      const numericId = Number(spId);
      const res = await API.get(`/admin-api/salesperson/${numericId}/jobs/`);
      setJobs(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError("Unable to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [spId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const completeJob = async (jobId) => {
    // 1. Optimistic Update: Change UI immediately for that "snappy" feel
    const previousJobs = [...jobs];
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "COMPLETED" } : job
      )
    );

    try {
      setIsProcessing(true);
      await API.post(`/admin-api/job/${jobId}/complete/`);
      // Optional: Trigger a sound effect or toast notification here
    } catch (err) {
      // 2. Rollback: If the API fails, revert the UI state
      setJobs(previousJobs);
      console.error("Complete Job Error:", err);
      alert("Could not complete job. Connection lost.");
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    jobs, 
    loading, 
    error, 
    completeJob, 
    isProcessing, 
    refetch: fetchJobs 
  };
}