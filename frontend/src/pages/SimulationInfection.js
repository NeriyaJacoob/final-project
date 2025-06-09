import React from "react";
import { Link } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const SimulationInfection = () => {
  const triggerInfection = async () => {
    try {
      // אנטי וירוס כבר רץ ברקע, נריץ רק את הסימולציה
      const res = await fetch(`${API_BASE}/infection`, { method: "POST" });
      const data = await res.json();

      alert(data.status || data.error);
    } catch {
      alert("❌ שגיאה בהרצת הדבקה");
    }
  };


  return (
    <div className="relative overflow-hidden min-h-screen text-white">

      <div className="relative z-10 section">
        <h2>🦠 סימולציית הדבקה</h2>

        <p>
          הקוד מחפש קבצים קיימים (כגון `.py` או `.sh`) ומוסיף אליהם קוד הרצה של תוכנה זדונית...
        </p>
        <p>
          🎯 <b>משימת התלמיד:</b> לבדוק שינויים בקבצים, לחפש חתימות כמו `os.system(...)`, ולחסום הדבקה עתידית.
        </p>

        <button className="btn" onClick={triggerInfection}>▶️ הפעל הדבקה</button>

        <br /><br />
        <Link to="/simulation">
          <button className="btn">⬅️ חזרה לרשימת סימולציות</button>
        </Link>
      </div>
    </div>
  );
};

export default SimulationInfection;
