// Basic card container with optional content area.
export function Card({ children, className = '' }) {
  return <div className={`rounded-lg shadow bg-gray-700 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
