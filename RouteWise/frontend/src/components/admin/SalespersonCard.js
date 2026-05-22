import React, { useState } from "react";

const SalespersonCard = ({ salesperson, onSelect }) => {
  const [hover, setHover] = useState(false);
  if (!salesperson) return null;

  // Generate a soft gradient based on the name length for variety
  const getAvatarGradient = (name = "S") => {
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"];
    const index = name.length % colors.length;
    return `linear-gradient(135deg, ${colors[index]} 0%, #4338ca 100%)`;
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(hover && onSelect ? styles.cardHover : {}),
        cursor: onSelect ? "pointer" : "default",
      }}
      onClick={() => onSelect && onSelect(salesperson.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ ...styles.avatar, background: getAvatarGradient(salesperson.name) }}>
        {salesperson.name?.charAt(0).toUpperCase()}
      </div>

      <div style={styles.details}>
        <div style={styles.topRow}>
          <h4 style={styles.name}>{salesperson.name}</h4>
          <span style={styles.badge}>Sales Rep</span>
        </div>
        
        <div style={styles.metaRow}>
          <span style={styles.metaItem}>
            <span style={{ fontSize: "10px", marginRight: "4px" }}>📍</span>
            {salesperson.district}
          </span>
          <span style={styles.separator}>•</span>
          <span style={styles.email}>{salesperson.email}</span>
        </div>
      </div>

      {onSelect && (
        <div style={{ ...styles.chevron, color: hover ? "#6366f1" : "#cbd5e1" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: "14px",
    marginBottom: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  cardHover: {
    borderColor: "#e0e7ff",
    transform: "translateX(4px)", // Subtle slide-in effect
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
    background: "#f8fafc",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "12px", // Slightly rounded square is more modern than a circle
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    marginRight: "16px",
    fontSize: "1.2rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "2px",
  },
  name: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em",
  },
  badge: {
    fontSize: "10px",
    padding: "2px 6px",
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: "4px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  metaItem: {
    fontSize: "0.8rem",
    color: "#6366f1",
    fontWeight: "600",
  },
  separator: {
    color: "#e2e8f0",
    fontSize: "12px",
  },
  email: {
    fontSize: "0.8rem",
    color: "#94a3b8",
  },
  chevron: {
    transition: "transform 0.2s ease, color 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
};

export default SalespersonCard;