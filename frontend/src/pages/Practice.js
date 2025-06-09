import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

import { ChevronDown, ChevronRight } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const TASKS = [
  {
    id: 'infection',
    label: '🧬 חסימת הדבקה',
    description:
      'הווירוס מזריק קוד לקבצי Python או Bash בתיקיית המטרה. מטרתך לזהות תהליך שמנסה להפעיל trigger_ransom.py מתוך קובץ אחר ולהגיב בהתאם.',
    tools: ['trigger_ransom.py ממוקם ב־/tmp/data', 'השתמש בפונקציה kill_process'],
  },
  // שאר המשימות...
];

export default function PracticeEditor() {
  const [studentCode, setStudentCode] = useState('');
  const [output, setOutput] = useState('');
  const [activeTask, setActiveTask] = useState(TASKS[0].id);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showToolbox, setShowToolbox] = useState(true);

  const runSimulation = async () => {
    try {
      await axios.post(`${API_BASE}/save-antivirus`, { code: studentCode });
      const res = await axios.post(`${API_BASE}/simulate`, { task: activeTask });
      setOutput(res.data.stdout || res.data.stderr || '');
    } catch {
      setOutput('❌ שגיאה בהרצה');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-2 overflow-auto">
        <div className="font-bold mb-4">🗂️ משימות תרגול</div>
        {TASKS.map(task => (
          <Card key={task.id} className="mb-2 bg-gray-700 text-sm">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setExpandedTasks(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
            >
              <span>{task.label}</span>
              {expandedTasks[task.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
            {expandedTasks[task.id] && (
              <CardContent className="p-2 text-xs">
                <p>{task.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-gray-800 py-2 px-4 flex justify-between">
          <span className="font-semibold">💻 עורך אנטי וירוס</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowToolbox(!showToolbox)}
          >
            🧰 ארגז כלים
          </Button>
        </header>
        <textarea
          className="flex-1 bg-gray-950 text-green-400 font-mono p-4 resize-none outline-none"
          value={studentCode}
          onChange={e => setStudentCode(e.target.value)}
          placeholder="כתוב כאן את קוד האנטי וירוס שלך"
          dir="ltr"
        />

        <footer className="bg-gray-800 p-4 flex justify-end gap-2">
          <Button variant="success" onClick={runSimulation}>
            🚀 הפעל סימולציה
          </Button>
        </footer>

        {output && (
          <pre className="bg-black p-4 text-green-300 overflow-auto max-h-60">
            {output}
          </pre>
        )}
      </main>

      {showToolbox && (
        <aside className="w-64 bg-gray-800 p-4 overflow-auto border-l border-gray-700">
          <div className="font-bold mb-2">🧰 כלים זמינים</div>
          <ul className="list-disc pl-4 text-xs">
            <li>os, subprocess, open, remove, chmod</li>
            <li>פונקציה kill_process לעצירת תהליכים</li>
          </ul>
        </aside>
      )}
    </div>
  );
}
