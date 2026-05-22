import useSalespersonLogic from "../hooks/useSalespersonLogic";
import JobCard from "../../components/salesperson/JobCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SalespersonJobs() {
  const navigate = useNavigate();
  const [salespersonId, setSalespersonId] = useState(null);

  const [minJobs, setMinJobs] = useState(1);
  const [maxJobs, setMaxJobs] = useState(10);
  const [minDuration, setMinDuration] = useState(5);
  const [maxDuration, setMaxDuration] = useState(60);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setSalespersonId(id);
  }, []);

  const { jobs, loading, error, completeJob, updateThresholds } = useSalespersonLogic(salespersonId);

  const handleSubmit = async () => {
    if (!salespersonId) return;
    try {
      await updateThresholds(salespersonId, {
        min_time: minDuration,
        max_time: maxDuration,
        min_job: minJobs,
        max_job: maxJobs
      });
      // Using a modern non-blocking notification would be better than alert
      alert("Settings Saved! 🚀");
    } catch (err) {
      alert("Failed to update.");
    }
  };

  if (loading) return <div style={styles.loader}>Optimizing your day...</div>;

  const pendingJobs = jobs.filter((j) => j.status === "PENDING");
  const optimizedJobs = jobs.filter((j) => j.status === "OPTIMIZED");
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>My Job Queue</h2>
          <p style={styles.pageSubtitle}>Manage your route and productivity</p>
        </div>
        <button onClick={() => navigate("/map")} style={styles.mapButton}>
          <span style={{ marginRight: "8px" }}>🗺️</span> View Map
        </button>
      </header>

      {/* Settings Section - Now a sleek Card */}
      <section style={styles.settingsCard}>
        <h4 style={styles.sectionHeading}>Queue Thresholds</h4>
        <div style={styles.inputGrid}>
          <div style={styles.inputItem}>
            <label style={styles.label}>Min Jobs</label>
            <input style={styles.input} type="number" value={minJobs} onChange={(e) => setMinJobs(Number(e.target.value))} />
          </div>
          <div style={styles.inputItem}>
            <label style={styles.label}>Max Jobs</label>
            <input style={styles.input} type="number" value={maxJobs} onChange={(e) => setMaxJobs(Number(e.target.value))} />
          </div>
          <div style={styles.inputItem}>
            <label style={styles.label}>Min Duration (m)</label>
            <input style={styles.input} type="number" value={minDuration} onChange={(e) => setMinDuration(Number(e.target.value))} />
          </div>
          <button onClick={handleSubmit} style={styles.saveButton}>
            Update
          </button>
        </div>
      </section>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.columnContainer}>
        {/* Optimized Section - The Primary Focus */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>
            <span style={styles.activeDot} /> Recommended Route ({optimizedJobs.length})
          </div>
          {optimizedJobs.length > 0 ? (
            optimizedJobs.map((job) => <JobCard key={job.id} job={job} onComplete={completeJob} />)
          ) : (
            <div style={styles.emptyState}>No optimized jobs found.</div>
          )}
        </section>

        {/* Pending Section */}
        <section style={styles.section}>
          <div style={styles.sectionLabel}>Pending Queue ({pendingJobs.length})</div>
          {pendingJobs.map((job) => <JobCard key={job.id} job={job} onComplete={completeJob} />)}
        </section>

        {/* Completed Section - Collapsed/Dimmed vibe */}
        <section style={{ ...styles.section, opacity: 0.7 }}>
          <div style={styles.sectionLabel}>Recently Finished ({completedJobs.length})</div>
          {completedJobs.map((job) => <JobCard key={job.id} job={job} />)}
        </section>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  pageTitle: { margin: 0, fontSize: "1.75rem", fontWeight: "800", color: "#0f172a" },
  pageSubtitle: { margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" },
  mapButton: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
    transition: "transform 0.2s",
  },
  settingsCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "40px",
  },
  sectionHeading: { marginTop: 0, marginBottom: "16px", fontSize: "0.85rem", textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.05em" },
  inputGrid: { display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" },
  inputItem: { display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 120px" },
  label: { fontSize: "0.75rem", fontWeight: "700", color: "#475569" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" },
  saveButton: { padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" },
  section: { marginBottom: "32px" },
  sectionLabel: { display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#475569", marginBottom: "16px", fontSize: "0.9rem" },
  activeDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" },
  emptyState: { padding: "20px", textAlign: "center", color: "#94a3b8", border: "2px dashed #e2e8f0", borderRadius: "12px" },
  errorBanner: { padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px", fontWeight: "500" },
  loader: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#6366f1", fontWeight: "700" }
};