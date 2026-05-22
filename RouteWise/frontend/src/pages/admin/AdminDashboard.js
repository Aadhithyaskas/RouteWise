import { useEffect, useState } from "react";
import API from "../../api/api";
import SalespersonCard from "../../components/admin/SalespersonCard";
import SalespersonProfile from "./SalespersonProfile";
import Loader from "../../components/common/Loader";

export default function AdminDashboard() {
  const [salespeople, setSalespeople] = useState([]);
  const [selectedSP, setSelectedSP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get("/admin-api/salespersons/")
      .then((res) => {
        setSalespeople(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Network Error: Unable to connect to the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar - Glassy & Refined */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div>
            <h3 style={styles.sidebarTitle}>Team Members</h3>
            <p style={styles.sidebarSubtitle}>Manage active field reps</p>
          </div>
          <span style={styles.countBadge}>{salespeople.length}</span>
        </div>

        <div style={styles.listContainer}>
          {loading ? (
            <div style={styles.loaderCenter}><Loader /></div>
          ) : error ? (
            <div style={styles.errorContainer}>
              <span style={{fontSize: '20px'}}>⚠️</span>
              {error}
            </div>
          ) : (
            salespeople.map((sp) => (
              <SalespersonCard 
                key={sp.id} 
                salesperson={sp} 
                onSelect={setSelectedSP} 
                isActive={selectedSP === sp.id} // Added active state prop
              />
            ))
          )}
        </div>
      </aside>

      {/* Main Content - Minimalist & Deep */}
      <main style={styles.main}>
        {selectedSP ? (
          <div style={styles.profileWrapper}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Agent Overview</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedSP(null)}>✕</button>
            </div>
            
            <SalespersonCard
              salesperson={salespeople.find(sp => sp.id === selectedSP)}
            />

            <div style={styles.contentDivider} />
            
            <SalespersonProfile spId={selectedSP} />
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIllustration}>
               {/* Decorative background element */}
               <div style={styles.blob}></div>
               <span style={styles.emptyIcon}>👤</span>
            </div>
            <h3 style={styles.emptyHeading}>No Agent Selected</h3>
            <p style={styles.emptyText}>
              Pick a team member from the list to view <br/>
              their current route and customer assignments.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { 
    display: "grid", 
    gridTemplateColumns: "350px 1fr", // Slightly wider sidebar
    height: "calc(100vh - 70px)", 
    background: "#f1f5f9", // Cool light-blue grey
    fontFamily: "'Inter', sans-serif"
  },
  sidebar: { 
    borderRight: "1px solid rgba(226, 232, 240, 0.8)", 
    padding: "32px 20px", 
    overflowY: "auto", 
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)", // Modern glass effect
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    padding: "0 8px"
  },
  sidebarTitle: { 
    color: "#0f172a", 
    fontSize: "1.1rem", 
    fontWeight: "800", 
    margin: 0,
    letterSpacing: "-0.02em"
  },
  sidebarSubtitle: {
    margin: "4px 0 0 0",
    fontSize: "0.8rem",
    color: "#64748b"
  },
  countBadge: {
    background: "#6366f1",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  main: { 
    padding: "40px 60px", 
    overflowY: "auto",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
  profileWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  sectionTitle: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#94a3b8",
    fontWeight: "700"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "1.2rem"
  },
  contentDivider: {
    height: "1px",
    background: "linear-gradient(to right, #e2e8f0, transparent)",
    margin: "32px 0"
  },
  emptyState: { 
    display: "flex", 
    flexDirection: "column",
    justifyContent: "center", 
    alignItems: "center", 
    height: "100%", 
    textAlign: "center",
    animation: "fadeIn 0.5s ease-out"
  },
  emptyIllustration: {
    position: "relative",
    marginBottom: "24px"
  },
  blob: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120px",
    height: "120px",
    background: "#e0e7ff",
    borderRadius: "50%",
    filter: "blur(40px)",
    zIndex: 0
  },
  emptyIcon: { fontSize: "4rem", position: "relative", zIndex: 1 },
  emptyHeading: { color: "#1e293b", margin: "0 0 8px 0", fontWeight: "700" },
  emptyText: { color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6" },
  errorContainer: {
    padding: "24px",
    background: "#fff",
    color: "#b91c1c",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid #fee2e2",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  loaderCenter: { padding: "40px", display: "flex", justifyContent: "center" }
};