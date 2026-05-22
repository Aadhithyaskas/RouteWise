import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../src/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>RouteWise</div>

      <div style={styles.links}>
        {/* ---------------- NOT LOGGED IN ---------------- */}
        {!user && (
          <>
            <Link
              to="/salesperson-login"
              style={
                location.pathname === "/salesperson-login"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Salesperson Login
            </Link>
          </>
        )}

        {/* ---------------- ADMIN ---------------- */}
        {user?.role === "ADMIN" && (
          <>
            <Link
              to="/admin-dashboard"
              style={
                location.pathname === "/admin-dashboard"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Dashboard
            </Link>
            <Link
              to="/register"
              style={
                location.pathname === "/register"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Add Personnel
            </Link>
          </>
        )}

        {/* ---------------- SALESPERSON ---------------- */}
        {user?.role === "SALESPERSON" && (
          <>
            <Link
              to="/salesperson-jobs"
              style={
                location.pathname === "/salesperson-jobs"
                  ? styles.activeLink
                  : styles.link
              }
            >
              My Jobs
            </Link>
            <Link
              to="/map"
              style={
                location.pathname === "/map"
                  ? styles.activeLink
                  : styles.link
              }
            >
              View Map
            </Link>
          </>
        )}

        {/* ---------------- LOGOUT ---------------- */}
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};


const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px", height: "64px", background: "#0f172a", color: "#fff" },
  brand: { fontSize: "1.25rem", fontWeight: "700", letterSpacing: "0.5px" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: { color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", transition: "0.2s" },
  activeLink: { color: "#fff", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", borderBottom: "2px solid #6366f1", paddingBottom: "4px" },
  logoutBtn: { background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }
};

export default Navbar;