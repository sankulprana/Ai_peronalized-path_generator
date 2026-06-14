import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();

  // Local states
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [courses, setCourses] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [learnerHours, setLearnerHours] = useState({ target: 10, completed: 0 });

  // Refs for Chart.js
  const doughnutRef = useRef(null);
  const barRef = useRef(null);
  const doughnutInstance = useRef(null);
  const barInstance = useRef(null);

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  // Authentication check
  useEffect(() => {
    if (!userId) {
      alert('No learner profile found. Please complete the Profile first.');
      navigate('/profile');
    }
  }, [userId, navigate]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE}/dashboard/${userId}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setCourses(result.courses || []);
        const completed = (result.courses || []).filter(c => c.completed).length;
        const total = (result.courses || []).length;
        setCompletedCount(completed);
        setTotalCount(total);
        setProgressPercentage(total > 0 ? Math.round((completed / total) * 100) : 0);
        
        let targetHours = 10;
        try {
          const profile = localStorage.getItem('learnerProfile');
          if (profile) {
            targetHours = JSON.parse(profile).weeklyStudyHours || 10;
          }
        } catch (e) {}
        
        // Sum completed hours
        let completedHoursSum = 0;
        (result.courses || []).forEach(c => {
          if (c.completed && c.duration) {
            const num = String(c.duration).match(/\d+/);
            if (num) completedHoursSum += parseInt(num[0], 10);
          }
        });

        setLearnerHours({
          target: targetHours,
          completed: completedHoursSum
        });
      } else {
        loadOfflineFallback();
      }
    } catch (error) {
      console.warn('Network error fetching dashboard. Loading offline fallback:', error);
      loadOfflineFallback();
    }
  };

  const loadOfflineFallback = () => {
    // Check if learningPath exists in local cache
    const cachedPath = localStorage.getItem('learningPath');
    let pathCourses = [];
    if (cachedPath) {
      try {
        const path = JSON.parse(cachedPath);
        pathCourses = (path.courses || []).map(c => ({
          title: c.title,
          provider: c.provider,
          duration: c.duration,
          level: c.level,
          completed: false
        }));
      } catch (e) {}
    }

    if (pathCourses.length === 0) {
      pathCourses = [
        { title: "HTML and CSS: Design and Build Websites", provider: "Udemy", duration: "12 hours", level: "Beginner", completed: true },
        { title: "The Complete JavaScript Course 2026: From Zero to Expert!", provider: "Coursera", duration: "48 hours", level: "Intermediate", completed: false },
        { title: "React - The Complete Guide (incl. Hooks, React Router, Redux)", provider: "Udemy", duration: "36 hours", level: "Intermediate", completed: false }
      ];
    }

    setCourses(pathCourses);
    const completed = pathCourses.filter(c => c.completed).length;
    const total = pathCourses.length;
    setCompletedCount(completed);
    setTotalCount(total);
    setProgressPercentage(total > 0 ? Math.round((completed / total) * 100) : 0);

    let targetHours = 10;
    try {
      const profile = localStorage.getItem('learnerProfile');
      if (profile) {
        targetHours = JSON.parse(profile).weeklyStudyHours || 10;
      }
    } catch (e) {}

    let completedHoursSum = 0;
    pathCourses.forEach(c => {
      if (c.completed && c.duration) {
        const num = String(c.duration).match(/\d+/);
        if (num) completedHoursSum += parseInt(num[0], 10);
      }
    });

    setLearnerHours({
      target: targetHours,
      completed: completedHoursSum
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  // Render/Update charts when courses or hours change
  useEffect(() => {
    // 1. Doughnut Chart
    if (doughnutRef.current) {
      if (doughnutInstance.current) {
        doughnutInstance.current.destroy();
      }

      const notStarted = totalCount - completedCount;

      doughnutInstance.current = new Chart(doughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Not Started'],
          datasets: [{
            data: [completedCount, notStarted > 0 ? notStarted : 0],
            backgroundColor: ['#10b981', '#1e293b'],
            borderColor: ['rgba(16, 185, 129, 0.2)', 'rgba(255, 255, 255, 0.05)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#f8fafc' }
            }
          }
        }
      });
    }

    // 2. Bar Chart
    if (barRef.current) {
      if (barInstance.current) {
        barInstance.current.destroy();
      }

      barInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Study Budget Hours'],
          datasets: [
            {
              label: 'Target Budget',
              data: [learnerHours.target],
              backgroundColor: '#6366f1'
            },
            {
              label: 'Completed Duration',
              data: [learnerHours.completed],
              backgroundColor: '#a855f7'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#cbd5e1' } },
            y: { ticks: { color: '#cbd5e1' } }
          },
          plugins: {
            legend: {
              labels: { color: '#f8fafc' }
            }
          }
        }
      });
    }

    return () => {
      if (doughnutInstance.current) doughnutInstance.current.destroy();
      if (barInstance.current) barInstance.current.destroy();
    };
  }, [courses, completedCount, totalCount, learnerHours]);

  // Handle Checkbox toggle
  const handleCheckboxToggle = async (title, currentVal) => {
    const nextCompleted = !currentVal;
    
    // Optimistic UI updates
    const updatedCourses = courses.map(c => {
      if (c.title === title) {
        return { ...c, completed: nextCompleted };
      }
      return c;
    });

    setCourses(updatedCourses);
    const completed = updatedCourses.filter(c => c.completed).length;
    setCompletedCount(completed);
    setProgressPercentage(totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0);

    let completedHoursSum = 0;
    updatedCourses.forEach(c => {
      if (c.completed && c.duration) {
        const num = String(c.duration).match(/\d+/);
        if (num) completedHoursSum += parseInt(num[0], 10);
      }
    });
    setLearnerHours(prev => ({ ...prev, completed: completedHoursSum }));

    try {
      const response = await fetch(`${API_BASE}/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          courseTitle: title,
          completed: nextCompleted
        })
      });

      if (!response.ok) {
        console.error('Failed to sync toggle status with server.');
      }
    } catch (e) {
      console.warn('Network sync failed. Saved status offline in browser state.', e);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Page Title */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-white mb-2">
              <i className="bi bi-speedometer2 text-primary-light me-2"></i>Learner Dashboard
            </h1>
            <p className="text-muted">Track your course progression, hours, and skill outcomes</p>
          </div>

          {/* Progress Tracker Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-icon primary">
                  <i className="bi bi-book"></i>
                </div>
                <div className="stat-label">Total Courses</div>
                <div className="stat-value">{totalCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-icon success">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completedCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-icon warning">
                  <i className="bi bi-percent"></i>
                </div>
                <div className="stat-label">Overall Progress</div>
                <div className="stat-value">{progressPercentage}%</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-icon info">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-label">Spent Hours</div>
                <div className="stat-value">{learnerHours.completed}h</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="glass-card h-100" style={{ minHeight: '350px' }}>
                <h5 className="mb-4 text-white fw-bold">
                  <i className="bi bi-pie-chart-fill text-emerald me-2"></i>Completion Ratio
                </h5>
                <div style={{ position: 'relative', height: '230px', width: '100%' }}>
                  <canvas ref={doughnutRef}></canvas>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-card h-100" style={{ minHeight: '350px' }}>
                <h5 className="mb-4 text-white fw-bold">
                  <i className="bi bi-bar-chart-steps text-primary-light me-2"></i>Weekly Hours Analysis
                </h5>
                <div style={{ position: 'relative', height: '230px', width: '100%' }}>
                  <canvas ref={barRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Course Checklist Card */}
          <div className="glass-card">
            <h5 className="mb-4 text-white fw-bold">
              <i className="bi bi-card-checklist text-primary-light me-2"></i>Study Checklist & Milestones
            </h5>
            
            {courses.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-inbox mb-2" style={{ fontSize: '2.5rem', opacity: 0.5 }}></i>
                <p>No roadmap courses generated. Go to <strong>Learning Path</strong> page to generate one!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '50px' }}>Status</th>
                      <th scope="col">Course Title</th>
                      <th scope="col">Provider</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, idx) => (
                      <tr key={idx} style={{ background: course.completed ? 'rgba(16, 185, 129, 0.02)' : 'transparent' }}>
                        <td>
                          <div className="form-check m-0">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              checked={course.completed}
                              onChange={() => handleCheckboxToggle(course.title, course.completed)}
                              style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                            />
                          </div>
                        </td>
                        <td className={course.completed ? "text-decoration-line-through text-muted" : "fw-bold text-white"}>
                          {course.title}
                        </td>
                        <td className="text-muted">{course.provider || 'N/A'}</td>
                        <td>
                          <span className="duration-badge">{course.duration || 'N/A'}</span>
                        </td>
                        <td>
                          <span className={`level-badge level-${String(course.level || 'Beginner').toLowerCase()}`}>
                            {course.level || 'Beginner'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
