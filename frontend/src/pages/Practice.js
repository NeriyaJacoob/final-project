import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const TASKS = [
  {
    id: 'infection',
    label: '🧬 חסימת הדבקה',
    description:
      'הווירוס מזריק קוד לקבצי Python או Bash בתיקיית המטרה. מטרתך לזהות תהליך שמנסה להפעיל trigger_ransom.py מתוך קובץ אחר ולהגיב בהתאם.',
    tools: [
      'הקובץ trigger_ransom.py ממוקם ב־/tmp/data',
      'האנטי וירוס שלך רץ ברקע כל הזמן',
      'לאחר זיהוי השתמש בפונקציה kill_process כדי לעצור את התהליך'
    ]
  },
  {
    id: 'encrypt',
    label: '🔐 מניעת הצפנה',
    description:
      'הכופרה מצפינה את תחילת הקובץ (10KB) עם מפתח AES. מטרתך למנוע את פעולת ההצפנה לפני שמתרחש שינוי בפועל לקובץ.',
    tools: [
      'הצפנה מתבצעת גם היא על קבצים ב־/tmp/data',
      'אם זיהית ניסיון הצפנה – עצור את התהליך בעזרת kill_process'
    ]
  },
  {
    id: 'decrypt',
    label: '🗝️ פענוח קבצים',
    description:
      'יש קבצים שהוצפנו מראש. המשימה שלך היא לזהות אותם לפי חתימה ("BME1") ולבצע את תהליך הפענוח בעזרת מפתח ידוע מראש.',
    tools: [
      'הקבצים המוצפנים מתחילים במחרוזת BME1',
      'השתמש במפתח שסופק כדי לפענח ולהחזיר את הקובץ המקורי'
    ]
  }
];

export default function PracticeExercise() {
  const [studentCode, setStudentCode] = useState('');
  const [output, setOutput] = useState('');
  const [showToolbox, setShowToolbox] = useState(false);
  const [currentTask, setCurrentTask] = useState(TASKS[0]);

  const runSimulation = async () => {
    try {
      await axios.post(`${API_BASE}/save-antivirus`, { code: studentCode });
      const res = await axios.post(`${API_BASE}/simulate`, { task: currentTask.id });
      setOutput(res.data.stdout || res.data.stderr || '');
    } catch {
      setOutput('❌ שגיאה בהרצה');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">עורך אנטי וירוס 💻</h1>
        <button
          onClick={() => setShowToolbox(!showToolbox)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
        >
          ארגז כלים 🧰
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="bg-gray-800 w-60 p-2 overflow-y-auto">
          <h2 className="mb-3 font-semibold">משימות תרגול 📂</h2>
          {TASKS.map(task => (
            <button
              key={task.id}
              className={`w-full text-left px-3 py-2 rounded mb-2 ${currentTask.id === task.id ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setCurrentTask(task)}
            >
              {task.label}
            </button>
          ))}

          <div className="bg-gray-900 text-xs mt-4 p-2 rounded">
            <p className="font-bold mb-1">🧠 {currentTask.label}</p>
            <p>{currentTask.description}</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="flex flex-1 overflow-auto font-mono bg-black text-green-400">
            <textarea
              className="flex-1 bg-black text-green-400 p-4 outline-none resize-none border-r border-gray-700"
              value={studentCode}
              onChange={e => setStudentCode(e.target.value)}
              dir="ltr"
              spellCheck="false"
            />
            <div className="bg-gray-900 text-gray-500 px-2 py-4 text-left select-none">
              {studentCode.split('\n').map((_, idx) => (
                <div key={idx} className="h-5 leading-5">{idx + 1}</div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 py-2 mx-4 my-2 rounded shadow"
            onClick={runSimulation}
          >
            🚀 הפעל סימולציה
          </button>

          {output && (
            <pre className="bg-black m-4 p-4 rounded overflow-auto text-green-300 max-h-48">
              {output}
            </pre>
          )}
        </main>

        {showToolbox && (
          <aside className="bg-gray-800 w-64 p-4 border-l border-gray-700 overflow-auto">
            <h3 className="font-semibold mb-2">כלים זמינים 🛠️</h3>
            <ul className="list-disc text-sm pr-4">
              {currentTask.tools.map((tool, i) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}