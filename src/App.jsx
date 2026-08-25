import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import StudyPlanner from "./pages/StudyPlanner";
import Resources from "./pages/Resources";
import DoubtSolver from "./pages/DoubtSolver";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { HeaderProvider } from "./context/HeaderContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <HeaderProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex min-w-0 flex-1 flex-col">
                  <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />

                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/roadmap" element={<Roadmap />} />
                      <Route path="/study-planner" element={<StudyPlanner />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/doubt-solver" element={<DoubtSolver />} />
                      <Route path="/progress" element={<Progress />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </HeaderProvider>
    </AuthProvider>
  );
}

