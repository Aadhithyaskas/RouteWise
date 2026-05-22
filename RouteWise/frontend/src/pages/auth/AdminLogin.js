// src/pages/auth/AdminLogin.js
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("admin-api/auth/login/", {
        role: "ADMIN",
        email,
        password,
      });
      login(res.data);
      navigate("/admin-dashboard");
    } catch (err) {
      alert("Invalid admin credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Admin Portal</h2>
        <p style={styles.subtitle}>Manage your team and routes</p>
        
        <input style={styles.input} type="email" placeholder="Admin Email" onChange={(e) => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        
        <button style={styles.button} disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Login as Admin"}
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>Need an admin account? <Link to="/register" style={styles.link}>Register</Link></p>
          <p style={styles.footerText}>Are you a salesperson? <Link to="/salesperson-login" style={styles.link}>Login here</Link></p>
        </div>
      </form>
    </div>
  );
}

// Styles are extended from your existing definitions
const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f1f5f9" },
  card: { background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "15px", width: "380px" },
  title: { textAlign: "center", color: "#1e293b", margin: 0, fontSize: "1.5rem", fontWeight: "bold" },
  subtitle: { textAlign: "center", color: "#64748b", fontSize: "0.9rem", marginBottom: "10px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" },
  button: { padding: "12px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  footer: { marginTop: "10px", textAlign: "center" },
  footerText: { fontSize: "0.85rem", color: "#64748b", margin: "5px 0" },
  link: { color: "#6366f1", fontWeight: "600", textDecoration: "none" }
};