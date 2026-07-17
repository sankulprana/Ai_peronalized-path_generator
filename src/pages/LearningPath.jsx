import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LearningPath() {
  const navigate = useNavigate();

  // Local states
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [learningPath, setLearningPath] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Roadmap details and interaction states
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'challenge'
  const [milestoneQuizAnswers, setMilestoneQuizAnswers] = useState({});
  const [milestoneChallengeCode, setMilestoneChallengeCode] = useState({});

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  const handleToggleActiveMilestone = (id) => {
    setActiveMilestoneId(activeMilestoneId === id ? null : id);
  };

  const handleQuizAnswerSelect = (milestoneId, questionIdx, optionIdx) => {
    setMilestoneQuizAnswers({
      ...milestoneQuizAnswers,
      [milestoneId]: {
        ...(milestoneQuizAnswers[milestoneId] || {}),
        [questionIdx]: optionIdx
      }
    });
  };

  const handleChallengeCodeChange = (milestoneId, val) => {
    setMilestoneChallengeCode({
      ...milestoneChallengeCode,
      [milestoneId]: val
    });
  };

  const handleResetChallengeCode = (milestoneId, placeholder) => {
    setMilestoneChallengeCode({
      ...milestoneChallengeCode,
      [milestoneId]: placeholder
    });
  };

  const handleSubmitMilestoneQuiz = async (milestoneId, questions) => {
    const answers = milestoneQuizAnswers[milestoneId] || {};
    let score = 0;
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        score += 1;
      }
    });
    
    try {
      const response = await fetch(`${API_BASE}/submit-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          milestoneId,
          score,
          totalQuestions: questions.length
        })
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(`Quiz submitted successfully! Score: ${score}/${questions.length}. +30 XP earned!`);
        
        const updatedPath = { ...learningPath };
        updatedPath.milestones = updatedPath.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return { ...ms, status: 'completed' };
          }
          return ms;
        });
        localStorage.setItem('learningPath', JSON.stringify(updatedPath));
        setLearningPath(updatedPath);
        
        window.dispatchEvent(new Event('progress-change'));
      }
    } catch (e) {
      console.error(e);
      alert("Offline Mode: Quiz submitted! Perfect score simulation.");
    }
  };

  const handleSubmitChallenge = async (milestoneId, testCaseStr) => {
    const code = milestoneChallengeCode[milestoneId] || "";
    
    let passed = false;
    try {
      const evaluator = new Function('code', `return ${testCaseStr}`);
      passed = evaluator(code);
    } catch (err) {
      console.error("Test evaluation error", err);
    }
    
    if (!passed) {
      alert("❌ Test cases failed. Check your logic and syntax and try again!");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/submit-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          milestoneId,
          code
        })
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert("🎉 Challenge passed and submitted successfully! +40 XP earned!");
        
        const updatedPath = { ...learningPath };
        updatedPath.milestones = updatedPath.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return { ...ms, status: 'completed' };
          }
          return ms;
        });
        localStorage.setItem('learningPath', JSON.stringify(updatedPath));
        setLearningPath(updatedPath);
        
        window.dispatchEvent(new Event('progress-change'));
      }
    } catch (e) {
      console.error(e);
      alert("Offline: Coding challenge submitted successfully!");
    }
  };

  const handleToggleMilestoneCompleted = async (milestoneId, completed) => {
    try {
      const response = await fetch(`${API_BASE}/toggle-milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          milestoneId,
          completed
        })
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        const updatedPath = { ...learningPath };
        updatedPath.milestones = updatedPath.milestones.map(ms => {
          if (ms.id === milestoneId) {
            return { ...ms, status: completed ? 'completed' : 'not-started' };
          }
          return ms;
        });
        localStorage.setItem('learningPath', JSON.stringify(updatedPath));
        setLearningPath(updatedPath);
        
        window.dispatchEvent(new Event('progress-change'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Authentication check
  useEffect(() => {
    if (!userId) {
      alert('No learner profile found. Please complete the Profile and Assessment first.');
      navigate('/profile');
    }
  }, [userId, navigate]);

  // Load existing path on mount
  useEffect(() => {
    const cachedPath = localStorage.getItem('learningPath');
    if (cachedPath) {
      try {
        setLearningPath(JSON.parse(cachedPath));
      } catch (e) {
        console.error('Error parsing cached learningPath:', e);
      }
    }
  }, []);

  const getCourseUrl = (course) => {
    const title = course.title || '';
    const provider = String(course.provider || '').toLowerCase();
    
    if (provider.includes('udemy')) {
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(title)}`;
    } else if (provider.includes('coursera')) {
      return `https://www.coursera.org/search?query=${encodeURIComponent(title)}`;
    } else if (provider.includes('edx')) {
      return `https://www.edx.org/search?q=${encodeURIComponent(title)}`;
    } else if (provider.includes('pluralsight')) {
      return `https://www.pluralsight.com/search?q=${encodeURIComponent(title)}`;
    }
    
    return `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + (course.provider || ''))}`;
  };

  const handleGeneratePath = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/generate-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Generate path error:', result);
        alert(result.error || 'Failed to generate learning path. Please try again.');
        setIsGenerating(false);
        return;
      }

      localStorage.setItem('learningPath', JSON.stringify(result.learningPath));
      setLearningPath(result.learningPath);
    } catch (error) {
      console.error('Network error while generating learning path:', error);
      alert('Unable to connect to the server. Serving simulated offline roadmap.');
      
      // Simulated offline path generator fallback
      const simulatedPath = {
        skills: [
          { name: "Responsive Layouts & HTML/CSS", level: "Beginner", description: "Learn semantic grids, custom media queries, and modern flexbox setups.", priority: "High" },
          { name: "JavaScript Advanced Syntax", level: "Intermediate", description: "Master ES6 features, promises, asynchronous event handlers, and data structures.", priority: "High" },
          { name: "React Components & React Router SPA", level: "Intermediate", description: "Build scalable routing networks, client states, and interactive user components.", priority: "Medium" }
        ],
        courses: [
          { title: "HTML and CSS: Design and Build Websites", provider: "Udemy", level: "Beginner", duration: "12 hours", rating: 4.8, students: 2500, description: "Solidify foundation in building grids and landing pages." },
          { title: "The Complete JavaScript Course 2026: From Zero to Expert!", provider: "Coursera", level: "Intermediate", duration: "48 hours", rating: 4.9, students: 6800, description: "Master modern JS core engines, classes, and callbacks." },
          { title: "React - The Complete Guide (incl. Hooks, React Router, Redux)", provider: "Udemy", level: "Intermediate", duration: "36 hours", rating: 4.7, students: 5000, description: "Comprehensive React SPA builder masterclass." }
        ]
      };
      localStorage.setItem('learningPath', JSON.stringify(simulatedPath));
      setLearningPath(simulatedPath);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateTotalDuration = () => {
    if (!learningPath || !learningPath.courses) return '0h';
    let totalHours = 0;
    learningPath.courses.forEach(course => {
      if (course.duration) {
        const match = String(course.duration).match(/\d+/);
        if (match) {
          totalHours += parseInt(match[0], 10);
        }
      }
    });
    return `${totalHours}h`;
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Page Title & Button */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
            <div>
              <h1 className="fw-bold text-white mb-1">
                <i className="bi bi-compass-fill text-primary-light me-2"></i>Personalized Learning Path
              </h1>
              <p className="text-muted mb-0">AI-curated study curriculum, prioritized skills, and online training</p>
            </div>
            
            <button 
              type="button" 
              className="btn btn-gradient px-4 py-3"
              disabled={isGenerating}
              onClick={handleGeneratePath}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Analyzing preferences...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  {learningPath ? "Regenerate Learning Path" : "Generate Learning Path"}
                </>
              )}
            </button>
          </div>

          {/* Empty State */}
          {!learningPath && (
            <div className="glass-card text-center py-5">
              <div className="empty-state">
                <i className="bi bi-compass text-primary-light mb-4" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                <h4 className="text-white fw-bold mb-2">Ready to Start Your Learning Journey?</h4>
                <p className="text-muted mb-4">Click the button above to generate your personalized learning path based on your profile and assessment.</p>
              </div>
            </div>
          )}

          {/* Content View */}
          {learningPath && (
            <div className="animate-fade-in">
              <div className="row g-4">
                
                {/* Left Side: Skills */}
                <div className="col-md-6">
                  <div className="glass-card h-100">
                    <h5 className="mb-4 text-white fw-bold">
                      <i className="bi bi-star-fill text-warning me-2"></i>Recommended Skills
                    </h5>
                    
                    <div id="recommendedSkills">
                      {learningPath.skills?.map((skill, index) => {
                        const levelClass = `level-${String(skill.level || 'Beginner').toLowerCase()}`;
                        return (
                          <div key={index} className="skill-card">
                            <div className="skill-name mb-2">
                              {index + 1}. {skill.name}
                            </div>
                            <div className="text-muted small mb-3">
                              {skill.description}
                            </div>
                            <div className="d-flex gap-2">
                              <span className={`level-badge ${levelClass}`}>
                                <i className="bi bi-bar-chart me-1"></i> {skill.level || 'Beginner'}
                              </span>
                              {skill.priority && (
                                <span className={`badge bg-${skill.priority === 'High' ? 'danger' : skill.priority === 'Medium' ? 'warning' : 'info'} bg-opacity-20 text-${skill.priority === 'High' ? 'danger' : skill.priority === 'Medium' ? 'warning' : 'info'}`}>
                                  {skill.priority} Priority
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side: Courses */}
                <div className="col-md-6">
                  <div className="glass-card h-100">
                    <h5 className="mb-4 text-white fw-bold">
                      <i className="bi bi-book-fill text-primary-light me-2"></i>Suggested Courses
                    </h5>
                    
                    <div id="suggestedCourses">
                      {learningPath.courses?.map((course, index) => {
                        const levelClass = `level-${String(course.level || 'Beginner').toLowerCase()}`;
                        return (
                          <div 
                            key={index} 
                            className="course-card" 
                            onClick={() => window.open(getCourseUrl(course), '_blank')}
                            title="Click to search course provider"
                          >
                            <div className="course-header mb-2">
                              <div className="flex-grow-1">
                                <div className="course-title fw-bold">
                                  {index + 1}. {course.title}
                                </div>
                                <div className="text-muted small">
                                  <i className="bi bi-building me-1"></i> {course.provider || 'Unknown'}
                                </div>
                              </div>
                              <span className={`level-badge ${levelClass}`}>
                                {course.level || 'Beginner'}
                              </span>
                            </div>
                            <p className="text-muted small mb-3">{course.description}</p>
                            
                            <div className="d-flex align-items-center gap-3 text-muted small">
                              <div>
                                <i className="bi bi-clock me-1 text-emerald"></i>
                                <span className="duration-badge">{course.duration || 'N/A'}</span>
                              </div>
                              {course.rating && (
                                <div>
                                  <i className="bi bi-star-fill text-warning me-1"></i>
                                  <span>{course.rating}</span>
                                </div>
                              )}
                              {course.students && (
                                <div>
                                  <i className="bi bi-people me-1"></i>
                                  <span>{course.students} Learners</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress Summary cards */}
              <div className="row g-4 mt-2">
                <div className="col-md-4">
                  <div className="glass-card text-center p-3 mb-0">
                    <div className="score-label">Total Courses</div>
                    <div className="score-value">{learningPath.courses?.length || 0}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card text-center p-3 mb-0">
                    <div className="score-label">Total Duration</div>
                    <div className="score-value">{calculateTotalDuration()}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card text-center p-3 mb-0">
                    <div className="score-label">Skills to Master</div>
                    <div className="score-value">{learningPath.skills?.length || 0}</div>
                  </div>
                </div>
              </div>
              {/* Timeline Accordion Roadmap */}
              {learningPath.milestones && learningPath.milestones.length > 0 && (
                <div className="row g-4 mt-3">
                  <div className="col-12">
                    <div className="glass-card text-start">
                      <h3 className="mb-4 text-white fw-bold">
                        <i className="bi bi-calendar2-range-fill text-primary-light me-2"></i>
                        Interactive Learning Roadmap
                      </h3>
                      
                      <div className="timeline-container position-relative">
                        {/* Vertical line */}
                        <div className="position-absolute bg-secondary bg-opacity-25" style={{ left: '20px', top: '20px', bottom: '20px', width: '2px' }}></div>
                        
                        {learningPath.milestones.map((ms, index) => {
                          const isCompleted = ms.status === 'completed';
                          const isActive = activeMilestoneId === ms.id;
                          
                          return (
                            <div key={ms.id} className="timeline-item d-flex gap-4 mb-4 position-relative" style={{ paddingLeft: '45px' }}>
                              {/* Node icon indicator */}
                              <div 
                                className={`position-absolute rounded-circle d-flex align-items-center justify-content-center border border-2 transition-all ${
                                  isCompleted 
                                    ? 'bg-emerald border-emerald text-white' 
                                    : isActive 
                                      ? 'bg-primary border-primary text-white animate-pulse'
                                      : 'bg-dark border-secondary border-opacity-50 text-white-50'
                                }`}
                                style={{ 
                                  left: '5px', 
                                  top: '0', 
                                  width: '32px', 
                                  height: '32px', 
                                  zIndex: 2, 
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleToggleActiveMilestone(ms.id)}
                              >
                                {isCompleted ? (
                                  <i className="bi bi-check-lg" style={{ fontSize: '0.9rem' }}></i>
                                ) : (
                                  <span style={{ fontSize: '0.85rem' }}>{index + 1}</span>
                                )}
                              </div>
                              
                              {/* Content body */}
                              <div className="flex-grow-1">
                                <div 
                                  className="glass-card mb-0 p-3" 
                                  style={{ 
                                    cursor: 'pointer',
                                    borderLeft: isCompleted ? '4px solid #10b981' : isActive ? '4px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                                    background: isActive ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)'
                                  }}
                                  onClick={() => handleToggleActiveMilestone(ms.id)}
                                >
                                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div>
                                      <span className="text-primary-light text-xs fw-bold uppercase tracking-wider">{ms.phase}</span>
                                      <h4 className="text-white fw-bold m-0 mt-1">{ms.title}</h4>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="badge bg-primary bg-opacity-25 text-primary-light">+{ms.xpReward || 50} XP</span>
                                      {isCompleted && (
                                        <span className="badge bg-success bg-opacity-25 text-emerald">
                                          <i className="bi bi-check-circle me-1"></i>Completed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-muted text-sm mt-2 mb-0">{ms.description}</p>
                                  
                                  {/* Collapsible area details */}
                                  {isActive && (
                                    <div className="mt-4 border-top border-secondary border-opacity-25 pt-3" onClick={(e) => e.stopPropagation()}>
                                      {/* 1. Resources recommendations */}
                                      <div className="mb-4">
                                        <h6 className="text-white fw-bold mb-3"><i className="bi bi-bookmark-star-fill text-warning me-2"></i>Curated Learning Resources</h6>
                                        <div className="row g-3">
                                          {ms.resources?.youtube && (
                                            <div className="col-md-6">
                                              <a href={ms.resources.youtube} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-3 p-2.5 rounded bg-dark bg-opacity-40 text-decoration-none border border-secondary border-opacity-10 hover-glow">
                                                <i className="bi bi-youtube text-danger" style={{ fontSize: '2rem' }}></i>
                                                <div>
                                                  <div className="text-white fw-bold text-sm">{ms.resources.youtubeTitle || 'Video Lecture'}</div>
                                                  <div className="text-muted text-xs">Watch Tutorial Video</div>
                                                </div>
                                              </a>
                                            </div>
                                          )}
                                          {ms.resources?.docs && (
                                            <div className="col-md-6">
                                              <a href={ms.resources.docs} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-3 p-2.5 rounded bg-dark bg-opacity-40 text-decoration-none border border-secondary border-opacity-10 hover-glow">
                                                <i className="bi bi-file-earmark-text-fill text-info" style={{ fontSize: '2rem' }}></i>
                                                <div>
                                                  <div className="text-white fw-bold text-sm">{ms.resources.docsTitle || 'Documentation'}</div>
                                                  <div className="text-muted text-xs">Official Reference docs</div>
                                                </div>
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* 2. Interactive Practice Quiz / Challenge Tabs */}
                                      <div className="glass-card bg-black bg-opacity-30 border border-secondary border-opacity-25 p-3 rounded-3 mb-3">
                                        <div className="d-flex gap-2 mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                                          <button 
                                            type="button" 
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${activeTab === 'quiz' ? 'btn-primary' : 'btn-link text-white-50 text-decoration-none'}`}
                                            onClick={() => setActiveTab('quiz')}
                                          >
                                            <i className="bi bi-card-checklist me-1"></i>Practice Quiz
                                          </button>
                                          <button 
                                            type="button" 
                                            className={`btn btn-sm fw-bold px-3 py-1.5 ${activeTab === 'challenge' ? 'btn-primary' : 'btn-link text-white-50 text-decoration-none'}`}
                                            onClick={() => setActiveTab('challenge')}
                                          >
                                            <i className="bi bi-code-slash me-1"></i>Coding Challenge
                                          </button>
                                        </div>
                                        
                                        {/* TAB A: Quiz */}
                                        {activeTab === 'quiz' && (
                                          <div className="animate-fade-in text-start">
                                            {ms.quiz?.questions ? (
                                              <div>
                                                {ms.quiz.questions.map((q, qidx) => (
                                                  <div key={qidx} className="mb-3">
                                                    <div className="text-white fw-bold text-sm mb-2">{qidx + 1}. {q.question}</div>
                                                    <div className="row g-2">
                                                      {q.options.map((opt, oidx) => {
                                                        const isSelected = milestoneQuizAnswers[ms.id]?.[qidx] === oidx;
                                                        return (
                                                          <div key={oidx} className="col-sm-6">
                                                            <button
                                                              type="button"
                                                              className={`btn btn-sm w-100 text-start p-2 rounded border ${
                                                                isSelected 
                                                                  ? 'btn-primary' 
                                                                  : 'bg-dark bg-opacity-20 border-secondary border-opacity-20 text-white-50'
                                                              }`}
                                                              onClick={() => handleQuizAnswerSelect(ms.id, qidx, oidx)}
                                                            >
                                                              {opt}
                                                            </button>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                ))}
                                                <button
                                                  type="button"
                                                  className="btn btn-emerald btn-sm mt-2 px-4"
                                                  onClick={() => handleSubmitMilestoneQuiz(ms.id, ms.quiz.questions)}
                                                >
                                                  Submit Quiz Answers
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="text-muted text-center py-3">No practice quiz for this milestone.</div>
                                            )}
                                          </div>
                                        )}
                                        
                                        {/* TAB B: Challenge Coding Playground */}
                                        {activeTab === 'challenge' && (
                                          <div className="animate-fade-in text-start">
                                            {ms.challenge ? (
                                              <div>
                                                <h6 className="text-white fw-bold mb-1">{ms.challenge.title}</h6>
                                                <p className="text-muted text-xs mb-3">{ms.challenge.description}</p>
                                                
                                                <textarea
                                                  className="form-control font-monospace text-xs mb-3 bg-dark bg-opacity-50 text-success"
                                                  rows="6"
                                                  value={milestoneChallengeCode[ms.id] !== undefined ? milestoneChallengeCode[ms.id] : ms.challenge.placeholder}
                                                  onChange={(e) => handleChallengeCodeChange(ms.id, e.target.value)}
                                                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                                ></textarea>
                                                
                                                <div className="d-flex justify-content-between">
                                                  <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleResetChallengeCode(ms.id, ms.challenge.placeholder)}
                                                  >
                                                    Reset Code
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm px-4"
                                                    onClick={() => handleSubmitChallenge(ms.id, ms.challenge.testCase)}
                                                  >
                                                    Run Tests & Submit
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-muted text-center py-3">No coding challenge for this milestone.</div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Completed Milestone Toggle manually */}
                                      <div className="mt-3 d-flex justify-content-end">
                                        <button
                                          type="button"
                                          className={`btn btn-sm ${isCompleted ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                          onClick={() => handleToggleMilestoneCompleted(ms.id, !isCompleted)}
                                        >
                                          <i className={`bi ${isCompleted ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                                          {isCompleted ? 'Mark as Incomplete' : 'Mark Milestone as Completed'}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default LearningPath;
