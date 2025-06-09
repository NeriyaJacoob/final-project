import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./styles/Tools.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const Tools = () => {
  const [key, setKey] = useState('');
  const navigate = useNavigate();


  const generateKey = async () => {
    try {
      const res = await fetch(`${API_BASE}/generate-key`);
      const data = await res.json();
      setKey(data.key);
    } catch {
      setKey("❌ שגיאה ביצירת מפתח");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(key);
    alert("🔑 מפתח הועתק");
  };

  return (
    <div className="section space-y-4">
      <h2>🛠️ ארגז כלים</h2>
      <p>כאן נמצאים הכלים שיעזרו לך בביצוע המשימות.</p>

      <h3 className="text-xl">🔐 יצירת מפתח הצפנה</h3>
      <p className="text-sm">לחץ על הכפתור כדי ליצור מפתח AES-256 אקראי, אותו ניתן להעתיק לקוד שלך.</p>
      <button className="btn" onClick={generateKey}>🎲 צור מפתח חדש</button>
      {key && (
        <div className="keyContainer">
          <p className="keyText">{key}</p>
          <button className="btn" onClick={copyToClipboard}>📋 העתק</button>
        </div>
      )}

      <button className="btn" onClick={() => navigate("/")}>⬅️ חזרה לתוכן הראשי</button>
    </div>
  );
};
export default Tools;
