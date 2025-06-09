import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/SimulationEncrypt.css";
import MatrixBackground from "../components/MatrixBackground";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const SimulationEncrypt = () => {
  const [folder, setFolder] = useState("");

  const encrypt = async () => {
    if (!folder) return alert("📁 נא למלא נתיב");
    try {
      const res = await fetch(`${API_BASE}/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder })
      });
      const data = await res.json();
      alert(`✅ הוצפן: ${data.folder}`);
    } catch {
      alert("❌ שגיאה בהצפנה");
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen text-white">

      {/* תוכן קדמי */}
      <div className="relative z-10 section">
        <h2>🛡️ הצפנת קבצים</h2>
        <div className="simulation-info">
          <h3>🧠 מטרת הסימולציה</h3>
          <p>לדמות תהליך הצפנה של תיקייה במחשב הקורבן...</p>

          <h3>🔐 על חשיבות המפתח</h3>
          <p>מפתח ההצפנה הוא הלב של התהליך...</p>

          <h3>📉 חולשות אפשריות של כופרות</h3>
          <ul>
            <li>מפתח שנשאר בזיכרון ה־RAM</li>
            <li>קובץ זמני שלא נמחק</li>
            <li>תיעוד בלוגים של הפעולה</li>
          </ul>

          <h3>🎯 משימת התלמיד</h3>
          <p>לזהות בזמן אמת תהליך הצפנה ולבלום אותו מראש.</p>
        </div>

        <input
          type="text"
          placeholder="📁 נתיב תיקייה"
          value={folder}
          onChange={e => setFolder(e.target.value)}
        />
        <button className="btn" onClick={encrypt}>🚀 הפעל הצפנה</button>

        <br />
        <button
          className="btn bg-green-700 hover:bg-green-800 text-white mt-4"
          onClick={() => {
            fetch(`${API_BASE}/decrypt`, { method: "POST" })
              .then(res => res.json())
              .then(data => alert(data.message))
              .catch(() => alert("❌ שגיאה בפענוח הקבצים"));
          }}
        >
          🔓 פענח קבצים
        </button>

        <br /><br />
        <Link to="/simulation">
          <button className="btn returnBtn">⬅️ חזרה לסימולציות</button>
        </Link>
      </div>
    </div>
  );
};

export default SimulationEncrypt;
