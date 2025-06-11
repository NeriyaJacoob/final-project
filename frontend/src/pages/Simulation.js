import { useNavigate } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";

export default function Simulations() {
  const navigate = useNavigate();

  const simulations = [
    { icon: "🛡️", label: "הצפנה", path: "/simulation/encrypt" },
    { icon: "💣", label: "כופר", path: "/simulation/ransom" },
    { icon: "🧬", label: "הדבקה", path: "/simulation/infection" }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden simulation-page">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixBackground />
      </div>

      {/* שכבת הצללה כהה לשיפור קריאות */}
      <div className="fixed inset-0 z-10 bg-black/60 pointer-events-none"></div>

      {/* עיצוב קדמי ממורכז ומורחב */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-12 tracking-wide drop-shadow-lg">
          🔬 עמוד הסימולציות
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {simulations.map((sim, i) => (
            <button
              key={i}
              onClick={() => navigate(sim.path)}
              className="bg-purple-800/80 hover:bg-purple-700 text-white font-semibold text-2xl rounded-2xl py-8 px-6 shadow-xl transition duration-200 transform hover:scale-105 backdrop-blur-md"
            >
              <div className="text-4xl mb-2">{sim.icon}</div>
              {sim.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
