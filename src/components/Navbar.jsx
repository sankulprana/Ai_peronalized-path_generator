import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setUserId(localStorage.getItem('userId'));
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('googleUser');
    localStorage.removeItem('learnerProfile');
    localStorage.removeItem('assessmentSkills');
    localStorage.removeItem('assessmentData');
    localStorage.removeItem('assessmentCompleted');
    localStorage.removeItem('learningPath');
    setUserId(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/profile');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <i className="bi bi-graph-up-arrow"></i> LearningPath AI
        </NavLink>
        <button 
          className="navbar-toggler navbar-dark" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/profile">Profile</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/assessment">Assessment</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/learning-path">Learning Path</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/demo-hub">Demo Hub</NavLink>
            </li>
            {userId && (
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <button className="btn btn-outline-danger btn-sm py-1 px-3" onClick={handleLogout} style={{ borderRadius: '10px' }}>
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
