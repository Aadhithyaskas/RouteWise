import { useEffect, useState, useCallback } from "react";
import API from "../../api/api";

export default function useSalespersonLogic(spId) {
  const [jobs, setJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize fetchJobs so it can be safely used in updateThresholds and useEffect
  const fetchJobs = useCallback(async () => {
    if (!spId) return;
    try {
      setLoading(true);
      const res = await API.get(`/admin-api/salesperson/${Number(spId)}/jobs/`);
      setJobs(res.data.jobs || []);
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Unable to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }, [spId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ✅ The Update Function
  const updateThresholds = async (salespersonId, thresholdData) => {
    try {

      // Constructs URL to match Django: path('thresholds/<int:sp_id>/', SetThresholds.as_view())
      const res = await API.post(`/admin-api/salesperson/${salespersonId}/threshold/`, thresholdData);
      
      // Refresh the job list immediately after updating thresholds 
      // This ensures the user sees the re-optimized queue right away
      await fetchJobs();
      
      return res.data;
    } catch (err) {
      console.error("Update Threshold Error:", err);
      throw err; // Allow the component to handle the alert
    }
  };

  const completeJob = async (jobId) => {
    try {
      await API.post(`/admin-api/job/${jobId}/complete/`);
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "COMPLETED" } : job
        )
      );
    } catch (err) {
      console.error("Complete Job Error:", err);
    }
  };

  return { jobs, alerts, loading, error, completeJob, updateThresholds };
}