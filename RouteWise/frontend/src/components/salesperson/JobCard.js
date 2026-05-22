import React, { useState } from "react";

const JobCard = ({ job, onComplete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define status-specific styling
  const statusConfig = {
    COMPLETED: { bg: "#ecfdf5", color: "#059669", label: "Finished", dot: "#10b981" },
    OPTIMIZED: { bg: "#eff6ff", color: "#2563eb", label: "Optimized", dot: "#3b82f6" },
    PENDING: { bg: "#fff7ed", color: "#d97706", label: "In Queue", dot: "#f59e0b" },
  };

  const currentStatus = statusConfig[job.status] || statusConfig.PENDING;

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        borderLeft: `5px solid ${currentStatus.dot}` // Visual side-bar accent
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.content}>
        <div style={styles.header}>
          <h4 style={styles.customerName}>{job.customer}</h4>
          <span style={{ ...styles.badge, backgroundColor: currentStatus.bg, color: currentStatus.color }}>
            <span style={{ ...styles.statusDot, backgroundColor: currentStatus.dot }} />
            {currentStatus.label}
          </span>
        </div>

        <p style={styles.address}>
          <span style={{ marginRight: "6px", opacity: 0.6 }}>📍</span>
          {job.address}
        </p>

        <div style={styles.footer}>
          <div style={styles.timeGroup}>
            <span style={styles.timeIcon}>🕒</span>
            <span>{new Date(job.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={{ margin: "0 4px", opacity: 0.3 }}>•</span>
            <span>{new Date(job.assigned_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {job.status !== "COMPLETED" && (
        <button 
          onClick={() => onComplete(job.id)} 
          style={styles.button}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Finish Task
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column", // Stack on mobile, but flex row on desktop? We'll stick to a clean vertical split
    gap: "16px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)",
    transition: "all 0.3s ease",
    position: "relative",
  },
  cardHover: {
    boxShadow: "0 12px 20px -8px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-2px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  customerName: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: "-0.01em",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  address: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#64748b",
    lineHeight: "1.5",
  },
  footer: {
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeGroup: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  },
  timeIcon: {
    marginRight: "6px",
    fontSize: "12px",
  },
  button: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
  },
};

export default JobCard;