import React, { useState } from "react";

const CustomerCard = ({ customer, onAssign }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.content}>
        <div style={styles.info}>
          <div style={styles.headerGroup}>
            <h4 style={styles.name}>{customer.name}</h4>
            {customer.distance_km && (
              <span style={styles.distanceBadge}>
                {customer.distance_km} km
              </span>
            )}
          </div>
          <p style={styles.address}>{customer.address}</p>
        </div>
        
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4f46e5")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6366f1")}
          onClick={() => onAssign(customer.id || customer.customer_id)}
        >
          Assign Job
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    position: "relative",
    border: "1px solid #f1f5f9",
    // Premium soft shadow
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  cardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    borderColor: "#e2e8f0",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  headerGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "800", // Extra bold for impact
    color: "#0f172a",
    letterSpacing: "-0.025em",
  },
  address: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#64748b",
    lineHeight: "1.5",
    maxWidth: "90%",
  },
  distanceBadge: {
    fontSize: "0.7rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6366f1",
    background: "#f5f3ff",
    padding: "4px 10px",
    borderRadius: "12px",
    border: "1px solid #e0e7ff",
  },
  button: {
    backgroundColor: "#6366f1", // Vibrant Indigo instead of dark slate
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "0.875rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2)",
    whiteSpace: "nowrap",
  },
};

export default CustomerCard;