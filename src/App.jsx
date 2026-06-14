import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AICopilot from './components/AICopilot';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import LearningPath from './pages/LearningPath';
import Dashboard from './pages/Dashboard';
import DemoHub from './pages/DemoHub';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demo-hub" element={<DemoHub />} />
          </Routes>
        </main>
        <AICopilot />
      </div>
    </Router>
  );
}

export default App;
