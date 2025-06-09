import { useNavigate } from "react-router-dom";
import React from "react";

const stages = [
  { title: "החדירה למערכת", img: "/images/inject.jpg", path: "/theory/injection" },
  { title: "הדבקה", img: "/images/infect.jpg", path: "/theory/infection" },
  { title: "תקיפה", img: "/images/attack.jpg", path: "/theory/attack" },
  { title: "דרישת כופר", img: "/images/ransom.jpg", path: "/theory/ransom" }
];

const Theory = () => {
  const navigate = useNavigate();

  return (
    <div className="text-blue-100 bg-blue-950 min-h-screen px-10 py-8 space-y-8">
      <div className="flex flex-wrap justify-center items-center gap-6">
        {stages.map((stage, i) => (
          <React.Fragment key={stage.title}>
            {i !== 0 && (
              <span className="text-4xl text-blue-300">➜</span>
            )}
            <div className="bg-blue-800 p-4 rounded-xl shadow-lg flex flex-col items-center w-44">
              <img src={stage.img} alt={stage.title} className="w-20 h-20 object-contain mb-2" />
              <div className="font-bold text-lg mb-2">{stage.title}</div>
              <button
                className="bg-white text-blue-900 font-semibold px-3 py-1 rounded hover:bg-blue-200 transition"
                onClick={() => navigate(stage.path)}
              >
                סיכונים
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold">🔐 מהי תוכנת כופר?</h2>
        <p className="leading-relaxed">
          תוכנת כופר (Ransomware) היא נוזקה שמצפינה את הקבצים במחשב הקורבן ודורשת תשלום
          בתמורה למפתח הפענוח. לעיתים, הכופרה גם מאיימת להדליף מידע רגיש אם לא יבוצע תשלום.
        </p>

        <h2 className="text-2xl font-bold">🎯 מטרת הלומדה</h2>
        <p className="leading-relaxed">
          הלומדה נבנתה כדי ללמד אותך כיצד Ransomware פועל בשלבים — חדירה, הדבקה, תקיפה ודרישת כופר —
          ולתת לך כלים לזהות, להבין, ולבלום כל שלב בתהליך. בכל שלב תוכל לקרוא, לצפות בסימולציות, ולבצע תרגול מעשי.
        </p>

        <h2 className="text-2xl font-bold">🚀 איך להפעיל משימות בהצלחה?</h2>
        <ul className="list-disc pr-5 space-y-1">
          <li>📘 קרא היטב את ההסבר התיאורטי בכל שלב</li>
          <li>💣 עבור לסימולציה כדי לראות את ההתקפה מתבצעת</li>
          <li>🧪 נסה לזהות ולהגיב במצב תרגול (למשל לזהות קובץ נגוע או לחסום אותו)</li>
          <li>📊 בסוף, עבור לסיכום כדי לראות את הביצועים שלך ולקבל המלצות</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-lg transition"
        >
          ⬅️ חזרה לתוכן העניינים
        </button>
      </div>
    </div>
  );
};

export default Theory;
