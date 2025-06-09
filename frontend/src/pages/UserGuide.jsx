// src/pages/UserGuide.jsx
import React from "react";

export default function UserGuide() {
  return (
    <div className="bg-gray-900 text-white min-h-screen px-10 py-12">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">📘 מדריך למשתמש</h1>

      <section className="space-y-4 max-w-4xl leading-relaxed">
        <p>
          ברוכים הבאים ללומדה האינטראקטיבית ללמידת תוכנות כופר! מדריך זה יסביר בקצרה איך להשתמש בפלטפורמה.
        </p>

        <h2 className="text-2xl font-bold text-yellow-300">שלבים מרכזיים בלומדה:</h2>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>הדרכה:</strong> מעבר דרך שלבי הלמידה – תיאוריה ➝ סימולציה ➝ תרגול.</li>
          <li><strong>מבדק:</strong> שאלון ידע שמסכם את הלמידה שלך.</li>
          <li><strong>ניסוי:</strong> משימות פתוחות לבדיקה עצמית – למשל זיהוי קבצים נגועים.</li>
        </ul>

        <h2 className="text-2xl font-bold text-yellow-300">טיפים ללמידה:</h2>
        <ul className="list-disc pr-6 space-y-2">
          <li>התחל תמיד מהדרכה כדי להבין את הבסיס.</li>
          <li>צפה בסימולציות כדי לראות הדגמות חיות.</li>
          <li>בצע את התרגולים כדי ליישם את הידע.</li>
          <li>ענה על השאלון ונסה לשפר את התוצאה שלך.</li>
        </ul>

        <p className="mt-6">
          💡 אל תשכח לעבור לסיכום בסוף – שם תוכל לראות את הביצועים שלך ולקבל המלצות להמשך.
        </p>
      </section>
    </div>
  );
}
