import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LearningPath() {
  const navigate = useNavigate();

  // Local states
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [learningPath, setLearningPath] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

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
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default LearningPath;
