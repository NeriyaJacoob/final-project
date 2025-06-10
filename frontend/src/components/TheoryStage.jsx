import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "החדירה למערכת",
    description: "בשלב זה, תוכנת הכופר חודרת למחשב הקורבן באמצעות נקודות תורפה, הורדות מזויפות או שימוש בסיסמאות גנובות.",
    risks: [
      "גישה מרחוק דרך RDP פתוח",
      "קבצי התקנה חשודים באימיילים",
      "תוספים זדוניים לדפדפן"
    ]
  },
  {
    title: "הדבקה",
    description: "בשלב זה הקובץ הנגוע פועל ומתחיל לשכפל את עצמו, לקבוע התמדה ולעקוף הגנות בסיסיות.",
    risks: [
      "הרצת קובץ ללא אימות חתימה",
      "גישה להרשאות ניהול",
      "אנטי וירוס כבוי או מוסר"
    ]
  },
  {
    title: "תקיפה",
    description: "הכופר מצפין את הקבצים, משבית תהליכים קריטיים ואף מוחק גיבויים.",
    risks: [
      "הצפנת קבצי מערכת וגיבויים",
      "חסימת גישה לכלים חיוניים",
      "מחיקת Shadow Copies"
    ]
  },
  {
    title: "דרישת כופר",
    description: "הכופר מציג דרישת תשלום (בדרך כלל בקריפטו) לשחרור הקבצים.",
    risks: [
      "הפסד מידע רגיש",
      "הדלפת מידע אם לא משולמת דרישה",
      "חוסר ודאות לגבי שחזור הקבצים"
    ]
  }
];

const TheoryStage = ({ stageIndex = 0 }) => {
  const navigate = useNavigate();
  const section = sections?.[stageIndex];

  if (!section) return <div className="text-white p-10">שגיאה: שלב לא קיים</div>;

  const { title, description, risks } = section;

  return (
    <div className="bg-blue-950 text-blue-100 min-h-screen px-10 py-12 rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-300">{title}</h1>
        <p className="text-lg">{description}</p>

        <div>
          <h2 className="text-xl font-bold text-blue-200 mb-2">סיכונים עיקריים:</h2>
          <ul className="list-disc pr-6 space-y-1">
            {risks.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </div>

        {/* תוכן דינמי לכל שלב */}
        {stageIndex === 0 && (
          <ContentBox
            title="🧠 שיטות חדירה נפוצות שכדאי לזהות"
            tips={[
              "פישינג באימייל: שליחת קובץ ZIP או DOC עם קוד זדוני",
              "RDP פתוח: פורטים פתוחים ללא אימות חזק",
              "ניצול פרצות (Exploits): שימוש ב־SMB, EternalBlue וכו׳",
              "התחזות לעדכון: כמו NotPetya שזייף עדכון תוכנה",
              "מאקרו ב־Word: פתיחת מסמך שמפעיל סקריפט",
              "USB נגוע: הדבקה דרך התקנים פיזיים"
            ]}
            hint="🔒 בשלב המעשי תצטרך לזהות ניסיונות כאלה ולחסום אותם."
          />
        )}
        {stageIndex === 1 && (
          <ContentBox
            title="🧬 איך כופרה שורדת במערכת"
            tips={[
              "✅ יצירת משימות מתוזמנות (Scheduled Tasks)",
              "✅ הוספת קובץ ל־Startup או Registry",
              "✅ התחזות לתהליכים לגיטימיים (svchost וכו׳)",
              "✅ עקיפת אנטי וירוס באמצעות obfuscation",
              "✅ שכפול לקבצים מוסתרים או מקומיים"
            ]}
            hint="🔒 תידרש לזהות תהליך חשוד או קובץ שמנסה להתמיד."
          />
        )}
        {stageIndex === 2 && (
          <ContentBox
            title="🧨 שלב ההצפנה והפגיעה"
            tips={[
              "✅ סריקת תיקיות לפי סיומות נפוצות",
              "✅ הצפנה באמצעות AES/RSA",
              "✅ מחיקת קבצי גיבוי (`.bak`, Shadow Copies)",
              "✅ עצירת שירותים חשובים (DB, אנטי וירוס)"
            ]}
            hint="🔒 ככל שתזהה מוקדם יותר, תוכל להציל יותר מידע."
          />
        )}
        {stageIndex === 3 && (
          <ContentBox
            title="💸 דרישת כופר והפעלת לחץ"
            tips={[
              "✅ קובץ README בכל תיקייה",
              "✅ מסך נעילה שמונע גישה",
              "✅ תקשורת עם התוקף דרך Tor",
              "✅ הדלפת מידע אם לא שולם"
            ]}
            hint="🔒 גם אם משלמים – אין הבטחה לשחזור. הגנה מראש היא המפתח."
          />
        )}

        <button
          onClick={() => navigate("/theory")}
          className="mt-8 bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          ⬅️ חזרה לשלבים
        </button>
      </div>
    </div>
  );
};

const ContentBox = ({ title, tips = [], hint }) => (
  <div className="bg-blue-800 p-4 rounded-lg shadow space-y-3">
    <h3 className="text-xl font-semibold">{title}</h3>
    <ul className="list-disc pr-6 space-y-1">
      {tips.map((tip, i) => (
        <li key={i}>{tip}</li>
      ))}
    </ul>
    <p className="italic text-sm text-blue-200">{hint}</p>
  </div>
);

export default TheoryStage;
