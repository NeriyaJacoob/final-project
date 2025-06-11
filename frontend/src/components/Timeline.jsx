import React from 'react'; // Displays a vertical list of log entries.

export default function Timeline({ logs = [] }) {
  return (
    <ul className="border-r-2 border-gray-400 pr-4 space-y-1 text-sm">
      {logs.map((log, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="text-gray-400">{log.time}</span>
          <span>{log.msg}</span>
        </li>
      ))}
    </ul>
  );
}
