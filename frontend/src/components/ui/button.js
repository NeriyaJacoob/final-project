export function Button({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}
