// src/pages/TheoryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const content = [
  { title: "מהי תוכנת כופר?", text: "תוכנת כופר (Ransomware) היא סוג של תוכנה זדונית שמצפינה את הקבצים במחשב הקורבן ודורשת תשלום (בדרך כלל במטבעות קריפטוגרפיים) לשחרורם.", icon: "🔐" },
  { title: "שלב החדירה", text: "הכופרה נכנסת למחשב באמצעות מיילים מזויפים, קבצים נגועים או ניצול פרצות אבטחה.", icon: "📥" },
  { title: "שלב ההדבקה", text: "לאחר הכניסה – הקוד הזדוני מופעל ומתחיל להדביק קבצים ותהליכים ברקע.", icon: "🦠" },
  { title: "שלב ההצפנה", text: "הכופרה סורקת את המחשב, מאתרת קבצים חשובים (מסמכים, תמונות וכו') ומצפינה אותם.", icon: "🗝️" },
  { title: "שלב דרישת הכופר", text: "מופיעה הודעת כופר שדורשת תשלום ומציינת מהן ההשלכות אם לא תשלם.", icon: "💸" },
  { title: "דרכי תגובה", text: "אל תשלם. יש לדווח לאבטחת מידע, לנסות לשחזר מגיבויים, ולעצור את ההפצה במערכות אחרות.", icon: "🛑" },
  { title: "מניעה מראש", text: "שמור על עדכוני מערכת, השתמש באנטי-וירוס, ואל תלחץ על קישורים או קבצים לא מזוהים.", icon: "🛡️" },
  { title: "הפצה בארגונים", text: "כופרה יכולה להתפשט ברשת ארגונית במהירות – מחשבים משותפים, שרתים ותיקיות פתוחות.", icon: "🌐" },
  { title: "מקרי אמת", text: "WannaCry, NotPetya, Ryuk – תוכנות שפגעו בארגונים גדולים וגרמו לנזקים עצומים.", icon: "📚" },
  { title: "סיכום והמלצות", text: "תמיד לגבות, לעדכן, לחשוד – ולהגיב במהירות. ידע הוא ההגנה הראשונה שלך.", icon: "✅" },
];

export default function TheoryPage() {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const index = parseInt(pageNumber) - 1;
  const data = content[index];

  const [visitedPages, setVisitedPages] = useState(() => {
    const saved = sessionStorage.getItem("visitedTheoryPages");
    return saved ? JSON.parse(saved) : [];
  });

useEffect(() => {
  if (!data) navigate("/theory/page/1");

  if (!visitedPages.includes(index)) {
    const updated = [...visitedPages, index];
    setVisitedPages(updated);
    sessionStorage.setItem("visitedTheoryPages", JSON.stringify(updated));

    // עדכן שרת
    fetch(`${API_BASE}/progress/theory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: index + 1 })
    }).catch((err) => console.error("שגיאה בעדכון התקדמות:", err));
  }
}, [data, index, navigate]);


  const goNext = () => navigate(`/theory/page/${Math.max(1, index)}`);
  const goPrev = () => navigate(`/theory/page/${Math.min(content.length, index + 2)}`);

  return (
    <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center relative p-10">
      {/* חץ שמאל (לעמוד הבא →) */}
      {index < content.length - 1 && (
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-5xl text-white/60 hover:text-white transition-colors duration-200 cursor-pointer select-none"
          onClick={goPrev}
        >
          ←
        </div>
      )}

      {/* חץ ימין (לעמוד קודם ←) */}
      {index > 0 && (
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-5xl text-white/60 hover:text-white transition-colors duration-200 cursor-pointer select-none"
          onClick={goNext}
        >
          →
        </div>
      )}

      <div className="max-w-4xl w-full bg-blue-800 p-10 rounded-3xl shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-6">{data?.icon} {data?.title}</h2>
        <p className="text-lg leading-relaxed mb-10">{data?.text}</p>

        <div className="flex justify-center gap-2 mt-6 flex-row-reverse">
          {content.map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${visitedPages.includes(i) ? "bg-white border-white" : "border-white/40"}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ב-App.jsx:
// <Route path="/theory/page/:pageNumber" element={<TheoryPage />} />