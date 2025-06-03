// import React, { useEffect, useState } from "react";

// function CompanyHome() {
//   const [companyInfo, setCompanyInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   useEffect(() => {
//     async function fetchCompanyInfo() {
//       if (!token) {
//         setError("No auth token found. Please login.");
//         setLoading(false);
//         return;
//       }
//       try {
//         const res = await fetch("http://localhost:5000/api/company-info", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) {
//           const data = await res.json();
//           throw new Error(data.error || "Failed to fetch company info");
//         }
//         const data = await res.json();
//         setCompanyInfo(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCompanyInfo();
//   }, [token]);

//   function handleLogout() {
//     localStorage.removeItem("user");
//     window.location.href = "/login"; // change as needed
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Loading company info...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600">
//         Error: {error}
//       </div>
//     );
//   if (!companyInfo) return null;

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans relative">
//       {/* Fixed logout button at top-right */}
//       <button
//         onClick={handleLogout}
//         className="fixed top-4 right-4 text-white font-semibold px-5 py-2 rounded-md shadow-md transition duration-300 ease-in-out z-50"
//         style={{ backgroundColor: "#dc2626" }} // Tailwind bg-red-600 hex (#dc2626) as inline style to force red bg
//       >
//         Logout
//       </button>

//       {/* Main content card */}
//       <main className="flex justify-center pt-32 px-4 min-h-screen">
//         <div
//           className="bg-white rounded-xl shadow-lg max-w-md w-full"
//           style={{
//             paddingTop: "4rem",
//             paddingRight: "2.5rem",
//             paddingBottom: "2.5rem",
//             paddingLeft: "2.5rem",
//           }}
//         >
//           {/* Logo with explicit margin-top */}
//           {companyInfo.logo_url && (
//             <img
//               src={companyInfo.logo_url}
//               alt={`${companyInfo.name} logo`}
//               className="mx-auto mb-6 mt-10 max-h-40 object-contain rounded-md shadow-sm"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "/default-logo.png";
//               }}
//             />
//           )}

//           {/* Company Name */}
//           <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
//             {companyInfo.name}
//           </h1>

//           {/* Email */}
//           <p className="text-gray-700 mb-1 text-center">
//             Email: {companyInfo.email}
//           </p>

//           {/* Database Name */}
//           <p className="text-gray-700 text-center">
//             Database: {companyInfo.db_name || "N/A"}
//           </p>

//           {/* Chatbot Link */}
//           {companyInfo.chatbot_link && (
//             <p className="text-blue-600 text-center mt-2">
//               Chatbot Link:{" "}
//               <a
//                 href={companyInfo.chatbot_link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="underline"
//               >
//                 {companyInfo.chatbot_link}
//               </a>
//             </p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CompanyHome;


import React, { useEffect, useState } from "react";

function CompanyHome() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [editing, setEditing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    async function fetchCompanyInfo() {
      if (!token) {
        setError("No auth token found. Please login.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/company-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch company info");
        }
        const data = await res.json();
        setCompanyInfo(data);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyInfo();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    if (!form.name?.trim()) {
      setError("Company name cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      const trimmedForm = {
        ...form,
        name: form.name.trim(),
        email: form.email?.trim() || "",
        db_name: form.db_name?.trim() || "",
        chatbot_link: form.chatbot_link?.trim() || "",
        logo_url: form.logo_url?.trim() || "",
        db_host: form.db_host?.trim() || "",
        db_root: form.db_root?.trim() || "",
        db_password: form.db_password?.trim() || "",
      };

      const res = await fetch("http://localhost:5000/api/company-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trimmedForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update info");
      }

      const updated = await res.json();
      setCompanyInfo(updated);
      setForm(updated);
      setSuccessMsg("Company info updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(companyInfo);
    setError(null);
    setSuccessMsg(null);
    setEditing(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading company info...
      </div>
    );
  if (error && !form.name)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  if (!companyInfo) return null;

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 text-white font-semibold px-5 py-2 rounded-md shadow-md transition duration-300 ease-in-out z-50"
        style={{ backgroundColor: "#dc2626" }}
      >
        Logout
      </button>

      <main className="flex justify-center pt-32 px-4 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-10">
          {/* Logo container */}
          <div
            style={{
              height: 160,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1.5rem",
              marginTop: "2.5rem",
            }}
          >
            {form.logo_url ? (
              <img
                src={form.logo_url}
                alt={`${form.name} logo`}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "0.375rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-logo.png";
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.375rem",
                }}
              />
            )}
          </div>

          {/* Company Name */}
          <label className="block mb-2 font-semibold">Company Name</label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* Email */}
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* Database Name */}
          <label className="block mb-2 font-semibold">Database Name</label>
          <input
            type="text"
            name="db_name"
            value={form.db_name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* DB Host */}
          <label className="block mb-2 font-semibold">Database Host</label>
          <input
            type="text"
            name="db_host"
            value={form.db_host || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* DB Root */}
          <label className="block mb-2 font-semibold">Database Root</label>
          <input
            type="text"
            name="db_user"
            value={form.db_user || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* DB Password */}
          <label className="block mb-2 font-semibold">Database Password</label>
          <input
            type="password"
            name="db_password"
            value={form.db_password || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            disabled={!editing}
          />

          {/* Chatbot Link (Not editable) */}
          <label className="block mb-2 font-semibold">Chatbot Link</label>
          <input
            type="url"
            name="chatbot_link"
            value={form.chatbot_link || ""}
            className="w-full border px-3 py-2 rounded mb-6 bg-gray-100 cursor-not-allowed"
            disabled
            readOnly
          />

          {/* Logo URL (editable only in edit mode) */}
          <label className="block mb-2 font-semibold">Logo URL</label>
          <input
            type="url"
            name="logo_url"
            value={form.logo_url || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`w-full border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !editing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />

          {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Edit
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CompanyHome;

