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
  const [achievements, setAchievements] = useState({ xp: 0, streak: 0, badges: [], last_active: null });

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

        // Fetch achievements
        try {
          const achRes = await fetch(`${API_BASE}/achievements/${userId}`);
          const achData = await achRes.json();
          if (achRes.ok && achData.success) {
            setAchievements(achData.achievements);
            localStorage.setItem('achievements', JSON.stringify(achData.achievements));
          }
        } catch (err) {
          console.warn("Failed to fetch achievements:", err);
        }
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

    const cachedAchievements = localStorage.getItem('achievements');
    if (cachedAchievements) {
      try {
        setAchievements(JSON.parse(cachedAchievements));
      } catch (e) {}
    } else {
      setAchievements({
        xp: 150,
        streak: 3,
        badges: ['first_steps', 'streak_starter'],
        last_active: new Date().toISOString().split('T')[0]
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  useEffect(() => {
    const handleProgressChange = () => {
      fetchDashboardData();
    };
    window.addEventListener('progress-change', handleProgressChange);
    return () => {
      window.removeEventListener('progress-change', handleProgressChange);
    };
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
          <div className="row g-4 mb-4">
            {/* Row 1: Gamified Stats */}
            <div className="col-md-3 col-sm-6">
              <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div className="stat-icon warning text-danger">
                  <i className="bi bi-fire"></i>
                </div>
                <div className="stat-label">Daily Streak</div>
                <div className="stat-value">{achievements.streak} Days</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="stat-icon warning">
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <div className="stat-label">Total Experience</div>
                <div className="stat-value">{achievements.xp} XP</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
                <div className="stat-icon primary">
                  <i className="bi bi-trophy-fill text-primary"></i>
                </div>
                <div className="stat-label">Learner Level</div>
                <div className="stat-value">Lvl {Math.floor(achievements.xp / 100) + 1}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="stat-icon success">
                  <i className="bi bi-patch-check-fill text-emerald"></i>
                </div>
                <div className="stat-label">Badges Unlocked</div>
                <div className="stat-value">{(achievements.badges || []).length} Earned</div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {/* Row 2: Progress Stats */}
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-label text-muted small">Total Courses</div>
                <div className="stat-value text-white-50">{totalCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-label text-muted small">Completed Courses</div>
                <div className="stat-value text-white-50">{completedCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-label text-muted small">Overall Progress</div>
                <div className="stat-value text-white-50">{progressPercentage}%</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-label text-muted small">Hours Completed</div>
                <div className="stat-value text-white-50">{learnerHours.completed}h / {learnerHours.target}h</div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="glass-card mb-5 text-start">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold text-white">Level Progression</div>
              <div className="text-muted small">
                {achievements.xp % 100} / 100 XP to Level {Math.floor(achievements.xp / 100) + 2}
              </div>
            </div>
            <div className="progress bg-dark bg-opacity-50" style={{ height: '10px', borderRadius: '5px' }}>
              <div 
                className="progress-bar bg-gradient" 
                role="progressbar" 
                style={{ 
                  width: `${achievements.xp % 100}%`,
                  borderRadius: '5px',
                  background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)'
                }}
                aria-valuenow={achievements.xp % 100} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
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

          {/* Achievements & Badges Showcase */}
          <div className="glass-card mb-5">
            <h5 className="mb-4 text-white fw-bold text-start">
              <i className="bi bi-trophy-fill text-warning me-2"></i>Achievements & Badges Showcase
            </h5>
            <div className="row row-cols-2 row-cols-md-6 g-3">
              {Object.entries({
                'first_steps': { name: 'First Steps', desc: 'Started path and earned XP', icon: 'bi-rocket-takeoff text-primary' },
                'streak_starter': { name: 'Streak Starter', desc: 'Daily study streak', icon: 'bi-fire text-danger' },
                'xp_champion': { name: 'XP Champion', desc: 'Accumulated 150+ XP', icon: 'bi-award text-warning' },
                'quiz_master': { name: 'Quiz Master', desc: 'Completed milestone quiz', icon: 'bi-patch-check-fill text-success' },
                'code_warrior': { name: 'Code Warrior', desc: 'Passed coding challenge', icon: 'bi-code-square text-info' },
                'web_wizard': { name: 'Domain Wizard', desc: 'Completed all milestones', icon: 'bi-gem text-purple' }
              }).map(([key, badge]) => {
                const userBadges = achievements.badges || [];
                const isUnlocked = userBadges.includes(key) || (key === 'web_wizard' && userBadges.some(b => b.endsWith('_wizard')));
                
                let displayBadge = badge;
                if (key === 'web_wizard') {
                  const wizardBadge = userBadges.find(b => b.endsWith('_wizard'));
                  if (wizardBadge) {
                    displayBadge = {
                      name: wizardBadge.split('_')[0].toUpperCase() + ' Wizard',
                      desc: `Completed all ${wizardBadge.split('_')[0]} milestones`,
                      icon: 'bi-gem text-purple'
                    };
                  }
                }

                return (
                  <div key={key} className="col">
                    <div className="p-3 text-center rounded-3 h-100" style={{
                      background: isUnlocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                      border: isUnlocked ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                      opacity: isUnlocked ? 1 : 0.4,
                      filter: isUnlocked ? 'none' : 'grayscale(100%)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="mb-2 position-relative d-inline-block">
                        <i className={`bi ${displayBadge.icon}`} style={{ fontSize: '2rem' }}></i>
                        {!isUnlocked && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark border border-secondary" style={{ fontSize: '0.65rem' }}>
                            <i className="bi bi-lock-fill text-muted"></i>
                          </span>
                        )}
                      </div>
                      <div className="fw-bold text-white small">{displayBadge.name}</div>
                      <div className="text-muted" style={{ fontSize: '10px', lineHeight: '1.2' }}>{displayBadge.desc}</div>
                    </div>
                  </div>
                );
              })}
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
