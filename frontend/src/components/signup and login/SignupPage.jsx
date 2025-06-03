// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "user",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Signup successful! Redirecting to login...");
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         setMessage(data.error || "Signup failed");
//       }
//     } catch (err) {
//       setMessage("Error connecting to server");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//       backgroundColor: "#000",
//       color: "#fff",
//       fontFamily: "Arial, sans-serif"
//     }}>
//       <div style={{
//         width: "100%",
//         maxWidth: "400px",
//         backgroundColor: "#111",
//         padding: "2rem",
//         borderRadius: "12px",
//         boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)"
//       }}>
//         <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Signup</h2>
//         <form onSubmit={handleSubmit}>
//           <label style={{ display: "block", marginBottom: "1rem" }}>
//             <span style={{ marginBottom: ".5rem", display: "block" }}>Email</span>
//             <input
//               type="email"
//               name="email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="email@example.com"
//               style={{
//                 width: "100%",
//                 padding: ".75rem",
//                 borderRadius: "6px",
//                 border: "1px solid #555",
//                 backgroundColor: "#222",
//                 color: "#fff"
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "1rem" }}>
//             <span style={{ marginBottom: ".5rem", display: "block" }}>Password</span>
//             <input
//               type="password"
//               name="password"
//               required
//               minLength={6}
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter password"
//               style={{
//                 width: "100%",
//                 padding: ".75rem",
//                 borderRadius: "6px",
//                 border: "1px solid #555",
//                 backgroundColor: "#222",
//                 color: "#fff"
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "1.5rem" }}>
//             <span style={{ marginBottom: ".5rem", display: "block" }}>Role</span>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: ".75rem",
//                 borderRadius: "6px",
//                 border: "1px solid #555",
//                 backgroundColor: "#222",
//                 color: "#fff"
//               }}
//             >
//               <option value="user">User</option>
//               <option value="company">Company</option>
//               {/* Removed admin option */}
//             </select>
//           </label>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: ".75rem",
//               backgroundColor: "#e53935",
//               border: "none",
//               borderRadius: "6px",
//               color: "#fff",
//               fontWeight: "bold",
//               cursor: "pointer"
//             }}
//           >
//             {loading ? "Signing up..." : "Signup"}
//           </button>
//         </form>

//         {message && (
//           <p style={{ marginTop: "1rem", color: "#ff5252", textAlign: "center" }}>
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignupPage;


import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    companyName: "",
    dbHost: "",
    dbUser: "",
    dbPassword: "",
    dbName: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }

    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: ".75rem",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#222",
    color: "#fff",
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000",
      color: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#111",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Signup</h2>
        <form onSubmit={handleSubmit}>

          {/* Role */}
          <label style={{ display: "block", marginBottom: "1.5rem" }}>
            <span style={{ marginBottom: ".5rem", display: "block" }}>Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="user">User</option>
              <option value="company">Company</option>
            </select>
          </label>

          {/* Email */}
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ marginBottom: ".5rem", display: "block" }}>Email</span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              style={inputStyle}
            />
          </label>

          {/* Password */}
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ marginBottom: ".5rem", display: "block" }}>Password</span>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={inputStyle}
            />
          </label>

          {/* Company Fields */}
          {formData.role === "company" && (
            <>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>Company Name</span>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Inc."
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>DB Host</span>
                <input
                  type="text"
                  name="dbHost"
                  value={formData.dbHost}
                  onChange={handleChange}
                  placeholder="localhost"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>DB User</span>
                <input
                  type="text"
                  name="dbUser"
                  value={formData.dbUser}
                  onChange={handleChange}
                  placeholder="root"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>DB Password</span>
                <input
                  type="password"
                  name="dbPassword"
                  value={formData.dbPassword}
                  onChange={handleChange}
                  placeholder="password"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>DB Name</span>
                <input
                  type="text"
                  name="dbName"
                  value={formData.dbName}
                  onChange={handleChange}
                  placeholder="company_db"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                <span style={{ marginBottom: ".5rem", display: "block" }}>Company Logo</span>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={inputStyle}
                />
              </label>
            </>
          )}

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
              cursor: "pointer"
            }}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: "#ff5252", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
