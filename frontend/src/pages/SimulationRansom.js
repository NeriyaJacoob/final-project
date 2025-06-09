import React from "react";
import { Link } from "react-router-dom";
import "./styles/SimulationRansom.css";
import MatrixBackground from "../components/MatrixBackground";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const SimulationRansom = () => {
  const triggerRansom = async () => {
    try {
      const res = await fetch(`${API_BASE}/test-ransom`, { method: "POST" });
      const data = await res.json();
      alert(data.status || data.error);
    } catch {
      alert("❌ שגיאה בהרצת דרישת הכופר");
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen text-white">

      <div className="relative z-10 section">
        <h2>💣 דרישת כופר</h2>
        <p>מציג דרישת כופר ואת הקוד הגרפי.</p>
        <p>
          לאחר הצפנה מוצגת הודעת כופר במסך מלא כדי להלחיץ את המשתמש...
        </p>
        <p>
          🎯 <b>משימת התלמיד:</b> לזהות תהליך עם GUI חשוד או קובץ שמפעיל ממשק גרפי.
        </p>

        <button className="btn" onClick={triggerRansom}>▶️ הפעל דרישה</button>
        <br /><br />
        <Link to="/simulation">
          <button className="btn returnBtn">⬅️ חזרה לסימולציות</button>
        </Link>
      </div>
    </div>
  );
};

export default SimulationRansom;
