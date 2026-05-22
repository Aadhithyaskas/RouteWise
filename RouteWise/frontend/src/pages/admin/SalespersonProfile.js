import { useEffect, useState } from "react";
import API from "../../api/api";
import CustomerCard from "../../components/admin/CustomerCard";

export default function SalespersonProfile({ spId }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchNearby();
  }, [spId]);

  const fetchNearby = async () => {
    setIsRefreshing(true);
    try {
      const res = await API.get(`/customer-api/unassigned/`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAssign = async (customerId) => {
    try {
      await API.post("admin-api/assign-job/", {
        customer_id: customerId,
        salesperson_id: spId,
      });
      fetchNearby(); 
    } catch (err) {
      alert("Assignment failed. Please check the console.");
    }
  };

  // Filter logic for a "Catchy" live-search experience
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header with Search & Stats */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.title}>Nearby Opportunities</h2>
          <p style={styles.subtitle}>Available leads in this agent's proximity</p>
        </div>
        
        <div style={styles.controls}>
          <input 
            type="text" 
            placeholder="Search leads..." 
            style={styles.searchBar}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            style={{...styles.refreshBtn, animation: isRefreshing ? "spin 1s linear infinite" : "none"}}
            onClick={fetchNearby}
          >
            ↻
          </button>
        </div>
      </div>

      {/* Modern Grid Layout */}
      {filteredCustomers.length > 0 ? (
        <div style={styles.grid}>
          {filteredCustomers.map(c => (
            <CustomerCard 
              key={c.id || c.customer_id} 
              customer={c} 
              onAssign={() => handleAssign(c.id || c.customer_id)} 
            />
          ))}
        </div>
      ) : (
        <div style={styles.noResults}>
          <p>No customers found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    animation: "fadeIn 0.4s ease-out",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
    gap: "20px",
    flexWrap: "wrap"
  },
  title: { 
    color: "#0f172a", 
    fontSize: "1.5rem", 
    fontWeight: "800", 
    margin: 0,
    letterSpacing: "-0.02em" 
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.9rem",
    margin: "4px 0 0 0"
  },
  controls: {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },
  searchBar: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    width: "240px",
    outline: "none",
    transition: "all 0.2s",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  },
  refreshBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    color: "#64748b"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
    gap: "24px" 
  },
  noResults: {
    textAlign: "center",
    padding: "60px",
    background: "#f8fafc",
    borderRadius: "20px",
    border: "2px dashed #e2e8f0",
    color: "#94a3b8"
  }
};