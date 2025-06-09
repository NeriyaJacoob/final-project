import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// במקום import ישנים
import Layout from "./components/Layout";
import Theory from "./pages/Theory";
import TheoryPage from "./pages/TheoryPage";
import Practice from "./pages/Practice";
import Simulation from "./pages/Simulation";
import Tools from "./pages/Tools";
import Summary from "./pages/Summary";
import SimulationEncrypt from "./pages/SimulationEncrypt";
import SimulationRansom from "./pages/SimulationRansom";
import SimulationInfection from "./pages/SimulationInfection";
import Quiz from "./components/Quiz"; // נשאר ב־components
import TheoryStage from "./components/TheoryStage";
import Home from "./pages/Home"; // אם בשימוש עדיין
import './styles/index.css';
import UserGuide from "./pages/UserGuide";
import FilePanel from "./pages/Target_Files_Panel";

      



export default function App() {
  return (
    
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/theory" element={<Theory />} />
          <Route path="/theory/page/:pageNumber" element={<TheoryPage />} />
          <Route path="/Target_Files_Panel" element={<FilePanel />} />
          <Route path="/theory/injection" element={<TheoryStage stageIndex={0} />} />
          <Route path="/theory/infection" element={<TheoryStage stageIndex={1} />} />
          <Route path="/theory/attack" element={<TheoryStage stageIndex={2} />} />
          <Route path="/theory/ransom" element={<TheoryStage stageIndex={3} />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/simulation/encrypt" element={<SimulationEncrypt />} />
          <Route path="/simulation/ransom" element={<SimulationRansom />} />
          <Route path="/simulation/infection" element={<SimulationInfection />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/practice/quiz" element={<Quiz />} />
          <Route path="/practice/test" element={<div>עמוד ניסוי (בקרוב)</div>} />

        </Route>
      </Routes>
    
  );
}
