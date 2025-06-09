import React, { useState, useEffect } from "react";
import "./IDE.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export default function IDE() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/antivirus/code`)  // חדש
      .then(res => res.text())
      .then(text => setCode(text));
  }, []);

 const runCode = async () => {
  try {
    // שלב 1: שמור את הקוד הנוכחי
    await fetch(`${API_BASE}/save-antivirus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    // שלב 2: הרץ את הקובץ
    const res = await fetch(`${API_BASE}/run-antivirus`, {
      method: "POST",
    });
    const data = await res.json();
    setOutput(data.result || data.error || "אין פלט");
  } catch {
    setOutput("❌ שגיאה בהרצה");
  }
};


  return (
    <div className="ideContainer">
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="ideTextarea"
      />

      <div className="ideOutput">
        <div className="ideRun">
          <button onClick={runCode} className="ideRunButton">
            ▶️ הרץ אנטי וירוס
          </button>
        </div>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
