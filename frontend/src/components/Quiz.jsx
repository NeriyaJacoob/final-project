import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question: "מה הסיכון בשמירת מפתח הצפנה בקוד?",
      options: [
        "אין בעיה אם הקובץ מוסתר",
        "תוקף יכול לחשוף אותו בקלות",
        "המפתח מוצפן עם הקוד",
        "זה משפר ביצועים"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "כיצד ניתן לחסום הדמיית כופר בלומדה זו?",
      options: [
        "למחוק את תמונת ההאקר",
        "לערוך את הקוד",
        "ליצור קובץ בשם block_ransom",
        "לכבות את המחשב"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "מהי המשמעות של חתימה BME1 בתחילת קובץ?",
      options: [
        "שם קובץ מוצפן",
        "גרסה של התוכנה",
        "סימן לקובץ שהוצפן על ידי הכופר",
        "סוג של מערכת הפעלה"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "מהי מטרת דרישת הכופר הגרפית שמוצגת בסיום הסימולציה?",
      options: [
        "לשדר למשתמש שההצפנה הצליחה",
        "לגרום לפאניקה אמיתית אצל הקורבן",
        "לאפשר תשלום ישיר בביטקוין",
        "זה מסך חסימה של מערכת ההפעלה"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "מה קורה אם קובץ block_ransom קיים במערכת בעת ניסיון הפעלה של הכופר?",
      options: [
        "הקבצים יוצפנו בכל מקרה",
        "המשתמש יקבל הודעה על שגיאה",
        "הכופר לא ירוץ כלל",
        "הכופר ינסה לעקוף את החסימה"
      ],
      correct: 2
    },
    {
      id: 6,
      question: "מדוע חשוב לוודא ש־__init__.py קיים בתיקיות הקוד?",
      options: [
        "כדי לוודא שהתיקייה תוצפן",
        "כדי שהתיקייה תזוהה כ־package בפייתון",
        "כדי שהכופר יוכל למחוק קבצים",
        "אין צורך בקובץ הזה בלומדה"
      ],
      correct: 1
    },
    {
      id: 7,
      question: "מה היתרון של פיצול הצפנה לחלק מהקובץ בלבד (CHUNK_SIZE) כמו בקוד?",
      options: [
        "שומר על ביצועים ומדמה כופר אמיתי",
        "מאפשר שחזור קובץ חלקי",
        "חוסך שימוש ב־RSA",
        "זה באג, לא יתרון"
      ],
      correct: 0
    }
  ];

  const handleSelect = (qid, index) => {
    setAnswers({ ...answers, [qid]: index });
  };

  const score = questions.filter(q => answers[q.id] === q.correct).length;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 rtl">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🧠 מבדק ידע</h1>

      {questions.map(q => (
        <div key={q.id} className="mb-6 bg-gray-800 p-4 rounded-xl shadow">
          <p className="font-semibold mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={`cursor-pointer px-4 py-2 rounded transition border ${
                    selected
                      ? 'bg-yellow-500 text-black border-yellow-400'
                      : 'hover:bg-gray-700 border-gray-600'
                  }`}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => {
  setSubmitted(true);

  fetch(`${API_BASE}/progress/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      score: score,
      total: questions.length
    })
  }).catch(err => console.error("שגיאה בשמירת תוצאה:", err));
}}

          className="bg-green-600 hover:bg-green-700 px-6 py-3 mt-4 rounded text-white font-bold"
        >
          📊 סיים ובדוק
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-xl font-semibold mb-4">
            ✅ ענית נכונה על {score} מתוך {questions.length}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-bold"
          >
            ⬅️ חזרה לתפריט הראשי
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
