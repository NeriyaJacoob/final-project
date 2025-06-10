import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export default function FilePanel() {
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/target-files`).then(res => {
      const fetched = res.data.files || [];
      const filtered = fetched.filter(p => !p.includes("block_ransom"));
      setFiles(filtered.map(p => ({ path: p, label: p.split('/').pop() })));
      filtered.forEach(p => {
        axios
          .get(`${API_BASE}/api/file?path=${encodeURIComponent(p)}`)
          .then(r => {
            setFileContents(prev => ({ ...prev, [p]: r.data.content || "" }));
          })
          .catch(() => {
            setFileContents(prev => ({ ...prev, [p]: "// ⚠️ קובץ לא נמצא או שגיאה בגישה" }));
          });
      });
    });
  }, []);

  const handleSave = async path => {
      setSaving(path);
      console.log(`Saving file: ${path}`, fileContents[path]);
      
      try {
        const response = await axios.post(`${API_BASE}/api/file`, {
          path,
          content: fileContents[path],
        });
        console.log('Save response:', response.data);
        
        if (response.data.status === 'success') {
          alert('✅ קובץ נשמר בהצלחה');
        }
      } catch (err) {
        console.error('Save error:', err.response?.data || err.message);
        alert(`שגיאה בשמירת הקובץ: ${err.response?.data?.error || err.message}`);
      }
      setSaving(null);
    };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-12">
      <h1 className="text-3xl font-bold text-center mb-8">🔐 עריכת קבצי מטרה</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <div key={file.path} className="bg-gray-800 rounded-2xl shadow-xl border border-red-700 overflow-hidden">
            <div className="bg-red-700 py-2 px-4 flex justify-between items-center">
              <span className="text-xl font-semibold">📄 {file.label}</span>
              <button
                onClick={() => handleSave(file.path)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full transition"
              >
                {saving === file.path ? "⏳ שומר..." : "💾 שמור"}
              </button>
            </div>
            <textarea
              className="w-full h-56 bg-gray-900 text-green-400 font-mono p-4 resize-none outline-none"
              value={fileContents[file.path] || ""}
              placeholder={file.label === "sample.txt" ? "📌 כאן יופיע הקובץ לדוגמה להצפנה (sample.txt)" : ""}
              onChange={e => setFileContents(prev => ({ ...prev, [file.path]: e.target.value }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}