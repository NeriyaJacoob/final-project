// 🔐 דף צפייה ועריכת קבצי המטרה (React)
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

const FILES = [
  { path: "/tmp/TestInfected/hello.py", label: "hello.py" },
  { path: "/tmp/TestInfected/test.sh", label: "test.sh" },
  { path: "/tmp/block_ransom", label: "block_ransom" },
  { path: "/tmp/detection_result.txt", label: "detection_result.txt" },
];

export default function FilePanel() {
  const [fileContents, setFileContents] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    FILES.forEach(file => {
      axios.get(`${API_BASE}/api/file?path=${encodeURIComponent(file.path)}`)
        .then(res => {
          setFileContents(prev => ({ ...prev, [file.path]: res.data.content || "" }));
        })
        .catch(() => {
          setFileContents(prev => ({ ...prev, [file.path]: "// ⚠️ קובץ לא נמצא או שגיאה בגישה" }));
        });
    });
  }, []);

  const handleSave = async (path) => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/api/file`, { path, content: fileContents[path] });
    } catch {
      alert("שגיאה בשמירת הקובץ");
    }
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {FILES.map(file => (
        <div key={file.path} className="bg-slate-800 rounded-xl shadow p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-white text-lg">📝 {file.label}</h2>
            <button
              onClick={() => handleSave(file.path)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              💾 שמור
            </button>
          </div>
          <textarea
            className="w-full h-48 bg-black text-green-300 font-mono p-2 rounded border border-slate-500"
            value={fileContents[file.path] || ""}
            onChange={(e) => setFileContents(prev => ({ ...prev, [file.path]: e.target.value }))}
          />
        </div>
      ))}
      {saving && <p className="col-span-full text-yellow-400">שומר שינויים...</p>}
    </div>
  );
}
