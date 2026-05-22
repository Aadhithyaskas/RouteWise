import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function SalespersonLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("admin-api/auth/login/", {
        role: "SALESPERSON",
        email: form.email,
        password: form.password
      });

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);
      navigate("/salesperson-jobs");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCircle1}></div>
      <div style={styles.glassCircle2}></div>
      
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>💼</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <span style={styles.subtitle}>Salesperson Portal</span>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: "8px" }}>⚠️</span>
            {error}
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="name@company.com"
            style={styles.input}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            style={styles.input}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <p style={styles.footerText}>
          Need help? <span style={styles.link}>Contact Admin</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  // Decorative floating elements for "Catchiness"
  glassCircle1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    top: "-100px",
    right: "-100px",
    opacity: 0.1,
    zIndex: 0,
  },
  glassCircle2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "#6366f1",
    bottom: "-50px",
    left: "-50px",
    opacity: 0.05,
    zIndex: 0,
  },
  card: {
    padding: "40px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    zIndex: 1,
    border: "1px solid #ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
  },
  logoBadge: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#6366f1",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
    marginLeft: "4px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#f8fafc",
  },
  errorBox: {
    padding: "12px",
    background: "#fff1f2",
    color: "#e11d48",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: "500",
    border: "1px solid #ffe4e6",
    textAlign: "center",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
  },
  buttonDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  footerText: {
    textAlign: "center",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  link: {
    color: "#6366f1",
    fontWeight: "600",
    cursor: "pointer",
  }
};