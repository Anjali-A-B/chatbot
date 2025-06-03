import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Admin = () => {
  const [guidelines, setGuidelines] = useState("");
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const textareaRef = useRef(null);
  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/guidelines")
      .then((res) => res.json())
      .then((data) => {
        setGuidelines(data.guidelines);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load guidelines.");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/admin/guidelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidelines }),
      });

      const result = await response.json();
      setMessage(result.message || "Saved successfully.");
    } catch (err) {
      setMessage("Failed to save.");
    }

    setSaving(false);
    setEditable(false);
  };

  const handleEdit = () => {
    setEditable(true);
    setTimeout(() => {
      const promptIndex = guidelines.indexOf("### Question:");
      if (textareaRef.current && promptIndex !== -1) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(promptIndex, promptIndex);
      }
    }, 100); // delay to ensure DOM is updated
  };

  const handleAddNew = () => {
    const guidelineMatch = guidelines.match(/\n\d+\./g);
    const nextNumber = guidelineMatch ? guidelineMatch.length + 1 : 1;

    const newGuideline = `\n${nextNumber}. New instruction here.`;
    setGuidelines((prev) => prev + newGuideline);
    setEditable(true);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }, 100);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  
    // Match the key you used to store the token
    localStorage.removeItem("user");
  
    // Redirect to login
    navigate("/login");
  };
  
  

  return (
     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
    {/* Flex container for title and logout */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
      <h1 style={{ fontSize: "2rem" }}>📘 Guidelines Manager</h1>

      <button
        onClick={handleLogout}
        style={{ 
          ...buttonStyle, 
          backgroundColor: "#dc3545", 
          cursor: "pointer",
          height: "2.5rem",
          fontSize: "1rem",
        }}
      >
        Logout
      </button>
    </div>

      {loading ? (
        <p>Loading guidelines...</p>
      ) : (
        <div>
          <textarea
            ref={textareaRef}
            readOnly={!editable}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            rows={20}
            cols={100}
            style={{
              width: "100%",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              resize: "vertical",
              backgroundColor: editable ? "#fff" : "#f9f9f9",
              fontFamily: "monospace",
            }}
          />

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            {!editable && (
              <button onClick={handleEdit} style={buttonStyle}>
                ✏️ Edit
              </button>
            )}
            <button onClick={handleAddNew} style={buttonStyle}>
              ➕ Add New Guideline
            </button>
            {editable && (
              <button onClick={handleSave} style={buttonStyle} disabled={saving}>
                {saving ? "Saving..." : "💾 Save"}
              </button>
            )}
          </div>

          {message && (
            <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
};

export default Admin;
