import { useState } from "react";
import API from "../../api/api";

export default function CustomerForm() {
 const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  district: "",
  latitude: "",
  longitude: "",
  loan_amount: "",
  loan_type: "",
  annual_income: "",
  bank_name: "",
  ifsc_code: "",
  account_number: "",
  pan_number: "",
  aadhar_number: ""
});

  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm({ ...form, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => alert("Location access denied.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude) return alert("Please capture location first.");
    setLoading(true);
    try {
      await API.post("customer-api/request/", form);
      alert("Request Sent!");
      setForm({ name: "", email: "", phone: "", address: "", district: "", latitude: null, longitude: null });
    } catch (err) { alert("Submission failed."); }
    finally { setLoading(false); }
  };

return (
  <div style={styles.container}>
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{ textAlign: "center" }}>Loan Application Request</h2>

      {/* Basic Details */}
      <input style={styles.input} placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })} required />

      <input style={styles.input} type="email" placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} required />

      <input style={styles.input} placeholder="Phone Number"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} required />

      <input style={styles.input} placeholder="Complete Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })} required />

      <input style={styles.input} placeholder="District"
        onChange={(e) => setForm({ ...form, district: e.target.value })} required />

      {/* Loan Details */}
      <select style={styles.input}
        onChange={(e) => setForm({ ...form, loan_type: e.target.value })} required>
        <option value="">Select Loan Type</option>
        <option value="PERSONAL">Personal Loan</option>
        <option value="HOME">Home Loan</option>
        <option value="VEHICLE">Vehicle Loan</option>
        <option value="BUSINESS">Business Loan</option>
      </select>

      <input style={styles.input} type="number" placeholder="Loan Amount"
        onChange={(e) => setForm({ ...form, loan_amount: e.target.value })} required />

      <input style={styles.input} type="number" placeholder="Annual Income"
        onChange={(e) => setForm({ ...form, annual_income: e.target.value })} required />

      {/* Bank Details */}
      <input style={styles.input} placeholder="Bank Name"
        onChange={(e) => setForm({ ...form, bank_name: e.target.value })} required />

      <input style={styles.input} placeholder="IFSC Code"
        onChange={(e) => setForm({ ...form, ifsc_code: e.target.value })} required />

      <input style={styles.input} placeholder="Account Number"
        onChange={(e) => setForm({ ...form, account_number: e.target.value })} required />

      {/* KYC Details */}
      <input style={styles.input} placeholder="PAN Number"
        onChange={(e) => setForm({ ...form, pan_number: e.target.value })} required />

      <input style={styles.input} placeholder="Aadhar Number"
        onChange={(e) => setForm({ ...form, aadhar_number: e.target.value })} required />

      {/* Location */}
      <button type="button" onClick={getCurrentLocation} style={styles.locBtn}>
        {form.latitude ? "Location Captured ✓" : "Pin Current Location"}
      </button>

      <button type="submit" disabled={loading} style={styles.subBtn}>
        {loading ? "Sending..." : "Request Callback"}
      </button>
    </form>
  </div>
);

}

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "50px", background: "#f8fafc", minHeight: "100vh" },
  form: { background: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 10px 15px rgba(0,0,0,0.05)", width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1rem" },
  locBtn: { padding: "10px", background: "#f1f5f9", border: "1px dashed #6366f1", color: "#6366f1", cursor: "pointer", fontWeight: "600", borderRadius: "8px" },
  subBtn: { padding: "14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }
};