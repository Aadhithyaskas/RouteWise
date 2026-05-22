import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";

export default function Register() {
const [form, setForm] = useState({ 
  name: "", 
  email: "", 
  password: "", 
  company_name: "", // Note: Your model has company_id; ensure backend maps this!
  role: "SALESPERSON",
  phone: "",
  district: "",
  address: "",
  age: "",
  aadhar_number: ""
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  
  // LOG THIS: See exactly what you are sending
  console.log("Sending Payload:", form);

  try {
    const response = await API.post("admin-api/auth/register/", form);
    console.log("Success Response:", response.data);
    alert("Registration Successful!");
    navigate("/");
  } catch (err) {
    // LOG THIS: See the specific error from the server
    console.error("Backend Error:", err.response?.data);
    setError(err.response?.data?.detail || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>RW</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join the RouteWise logistics network</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              style={styles.input} 
              type="text"
              placeholder="Enter your name" 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              style={styles.input} 
              type="email" 
              placeholder="email@example.com" 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Company Name</label>
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Company Name" 
              onChange={e => setForm({...form, company_name: e.target.value})} 
              required 
            />
          </div>
          {/* Role Selector - Keep this at the top to toggle the form */}
<div style={styles.inputGroup}>
  <label style={styles.label}>Select Role</label>
  <select 
    style={styles.select} 
    value={form.role}
    onChange={e => setForm({...form, role: e.target.value})}
  >
    <option value="SALESPERSON">Salesperson</option>
    <option value="ADMIN">Administrator</option>
  </select>
</div>
  <div style={styles.inputGroup}>
      <label style={styles.label}>Phone Number</label>
      <input 
        style={styles.input} type="text" placeholder="9876543210"
        onChange={e => setForm({...form, phone: e.target.value})} required 
      />
    </div>


{/* Conditional Fields for Salesperson */}
{form.role === "SALESPERSON" && (
  <>
    {/* <div style={styles.inputGroup}>
      <label style={styles.label}>Phone Number</label>
      <input 
        style={styles.input} type="text" placeholder="9876543210"
        onChange={e => setForm({...form, phone: e.target.value})} required 
      />
    </div> */}

    <div style={styles.row}>
       <div style={{...styles.inputGroup, flex: 1}}>
          <label style={styles.label}>District</label>
          <input 
            style={styles.input} type="text"
            onChange={e => setForm({...form, district: e.target.value})} required 
          />
       </div>
       <div style={{...styles.inputGroup, flex: 1}}>
          <label style={styles.label}>Age</label>
          <input 
            style={styles.input} type="number"
            onChange={e => setForm({...form, age: e.target.value})} required 
          />
       </div>
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.label}>Aadhar Number</label>
      <input 
        style={styles.input} type="text" placeholder="12-digit number"
        onChange={e => setForm({...form, aadhar_number: e.target.value})} required 
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.label}>Address</label>
      <textarea 
        style={{...styles.input, height: '80px'}} 
        onChange={e => setForm({...form, address: e.target.value})} required 
      />
    </div>
  </>
)}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              style={styles.input} 
              type="password" 
              placeholder="••••••••" 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
            />
          </div>

          <button 
            style={{...styles.button, ...(loading ? styles.disabled : {})}} 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account? <Link to="/" style={styles.link}>Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "440px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    width: "50px",
    height: "50px",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  title: {
    fontSize: "1.8rem",
    color: "#1e293b",
    margin: "0 0 8px 0",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    margin: 0,
  },
  errorBanner: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "20px",
    border: "1px solid #fee2e2",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s",
    "&:focus": {
        borderColor: "#6366f1",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
    }
  },
  select: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  disabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
  },
  footer: {
    marginTop: "16px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  link: {
    color: "#6366f1",
    fontWeight: "700",
    textDecoration: "none",
    marginLeft: "4px",
  }
};