import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    
      const data = await res.json();
      if (res.ok) {
        const { role, token } = data;
        localStorage.setItem("user", JSON.stringify({ role, token }));
    
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "company") {
          navigate("/company-home");
        } else {
          navigate("/");  // for regular user or default home
        }
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
    
    setLoading(false);
    
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#111",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ marginBottom: ".5rem", display: "block" }}>Email</span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              style={{
                width: "100%",
                padding: ".75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
              }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "1.5rem" }}>
            <span style={{ marginBottom: ".5rem", display: "block" }}>Password</span>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: ".75rem",
                borderRadius: "6px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
              }}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: ".75rem",
              backgroundColor: "#e53935",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: "#ff5252", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "#e53935", textDecoration: "none", fontWeight: "bold" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
