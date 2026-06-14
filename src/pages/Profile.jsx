import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function UserAvatar({ googleUser, size }) {
  const [imgError, setImgError] = useState(false);
  const initials = googleUser?.name ? googleUser.name.charAt(0).toUpperCase() : 'L';
  
  if (imgError || !googleUser?.picture) {
    return (
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-primary fw-bold text-white bg-gradient animate-fade-in" 
        style={{ 
          width: size, 
          height: size, 
          fontSize: size === '58px' ? '1.35rem' : '2.5rem', 
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          flexShrink: 0
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={googleUser.picture} 
      alt="Avatar" 
      className="rounded-circle border border-2 border-primary animate-fade-in" 
      style={{ width: size, height: size, objectFit: 'cover', flexShrink: 0 }}
      onError={() => setImgError(true)}
    />
  );
}

function Profile() {
  const navigate = useNavigate();
  
  // Local states
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [googleUser, setGoogleUser] = useState(null);
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [age, setAge] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [currentDomain, setCurrentDomain] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [learningStyle, setLearningStyle] = useState('visual');
  const [weeklyStudyHours, setWeeklyStudyHours] = useState('10');
  
  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  // JWT decoder helper
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT decoding failed", e);
      return null;
    }
  };

  // Check auth and profile on mount / auth change
  useEffect(() => {
    const fetchProfile = async (id) => {
      try {
        const response = await fetch(`${API_BASE}/profile/${id}`);
        const result = await response.json();
        if (response.ok && result.success) {
          localStorage.setItem('learnerProfile', JSON.stringify(result.profile));
          setLearnerProfile(result.profile);
        } else {
          // Fallback to local cache
          const localProfile = localStorage.getItem('learnerProfile');
          if (localProfile) {
            setLearnerProfile(JSON.parse(localProfile));
          }
        }
      } catch (e) {
        console.warn("Backend unavailable. Fallback to localStorage.", e);
        const localProfile = localStorage.getItem('learnerProfile');
        if (localProfile) {
          setLearnerProfile(JSON.parse(localProfile));
        }
      }
    };

    const id = localStorage.getItem('userId');
    const uStr = localStorage.getItem('googleUser');
    
    setUserId(id);
    if (id && uStr) {
      setGoogleUser(JSON.parse(uStr));
      fetchProfile(id);
    } else {
      setGoogleUser(null);
      setLearnerProfile(null);
    }
  }, [userId]);

  // Handle Google Sign-in button setup
  useEffect(() => {
    if (!userId && window.google) {
      window.handleGoogleSignIn = (response) => {
        const decoded = decodeJwt(response.credential);
        if (decoded) {
          const u = {
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
          };
          localStorage.setItem('userId', u.email);
          localStorage.setItem('googleUser', JSON.stringify(u));
          window.dispatchEvent(new Event('auth-change'));
          setUserId(u.email);
        }
      };

      window.google.accounts.id.initialize({
        client_id: "788960053307-bs9cg01f8853iffn9i9f6h7p73evmb71.apps.googleusercontent.com",
        callback: window.handleGoogleSignIn
      });

      const btnContainer = document.getElementById("google-signin-btn-container");
      if (btnContainer) {
        window.google.accounts.id.renderButton(
          btnContainer,
          { theme: "filled_blue", size: "large", shape: "pill", type: "standard" }
        );
      }
    }
  }, [userId]);

  // Simulate Gmail Login
  const handleDemoLogin = () => {
    const mockUser = {
      sub: "google_demo_987654321",
      email: "learner.demo@gmail.com",
      name: "Demo Learner",
      picture: "https://lh3.googleusercontent.com/a/ACg8ocI4s0vJ-3B_k6B56U2n5p_M0vL1W54A_sD75o-K_e8-Zg=s96-c"
    };

    localStorage.setItem('userId', mockUser.email);
    localStorage.setItem('googleUser', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('auth-change'));
    setUserId(mockUser.email);
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('googleUser');
    localStorage.removeItem('learnerProfile');
    localStorage.removeItem('assessmentSkills');
    localStorage.removeItem('assessmentData');
    localStorage.removeItem('assessmentCompleted');
    localStorage.removeItem('learningPath');
    window.dispatchEvent(new Event('auth-change'));
    setUserId(null);
    setGoogleUser(null);
    setLearnerProfile(null);
    setIsEditing(false);
  };

  // Start Edit Mode
  const startEditProfile = () => {
    if (learnerProfile) {
      setAge(learnerProfile.age || '');
      setEducationLevel(learnerProfile.educationLevel || '');
      setCurrentDomain(learnerProfile.currentDomain || '');
      setCareerGoal(learnerProfile.careerGoal || '');
      setExperienceLevel(learnerProfile.experienceLevel || 'beginner');
      setLearningStyle(learnerProfile.learningStyle || 'visual');
      setWeeklyStudyHours(String(learnerProfile.weeklyStudyHours || '10'));
      setIsEditing(true);
    }
  };

  // Submit Profile Form
  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (!age || !educationLevel || !currentDomain || !careerGoal) {
      alert("Please fill all required fields.");
      return;
    }

    const learnerProfileData = {
      userId: userId,
      fullName: googleUser.name,
      age: parseInt(age),
      educationLevel,
      currentDomain,
      careerGoal,
      experienceLevel,
      learningStyle,
      weeklyStudyHours: parseInt(weeklyStudyHours),
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(learnerProfileData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error || 'Failed to update preferences. Try again.');
        return;
      }

      localStorage.setItem('learnerProfile', JSON.stringify(result.profile));
      setLearnerProfile(result.profile);
      setSuccessMsg('Preferences saved successfully!');

      setTimeout(() => {
        setSuccessMsg('');
        setIsEditing(false);

        const isFirstOnboarding = !localStorage.getItem('hasCompletedOnboarding');
        if (isFirstOnboarding) {
          localStorage.setItem('hasCompletedOnboarding', 'true');
          navigate('/assessment');
        }
      }, 1500);

    } catch (error) {
      console.error('Network error during onboarding registration:', error);
      // Fallback
      localStorage.setItem('learnerProfile', JSON.stringify(learnerProfileData));
      setLearnerProfile(learnerProfileData);
      setSuccessMsg('Preferences saved in offline mode!');
      setTimeout(() => {
        setSuccessMsg('');
        setIsEditing(false);
        navigate('/assessment');
      }, 1500);
    }
  };

  const formatValue = (str) => {
    if (!str) return '-';
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Render view
  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          {/* STATE 1: Logged Out */}
          {!userId && (
            <div className="glass-card text-center p-5">
              <div className="mb-4">
                <i className="bi bi-shield-lock-fill text-primary-light" style={{ fontSize: '3.5rem' }}></i>
              </div>
              <h1 className="fw-bold mb-3 text-white">Gmail Authentication</h1>
              <p className="text-muted mb-4">
                Securely log in using your Gmail account to access your personalized learning pathways
              </p>

              {/* Google Sign-in Container */}
              <div className="d-flex justify-content-center mb-4">
                <div id="google-signin-btn-container"></div>
              </div>

              <div className="d-flex align-items-center text-muted mb-4 justify-content-center">
                <span className="w-25 border-bottom border-secondary border-opacity-25"></span>
                <span className="mx-3 fw-bold">OR</span>
                <span className="w-25 border-bottom border-secondary border-opacity-25"></span>
              </div>

              {/* Demo Login */}
              <button type="button" className="btn btn-outline-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2" onClick={handleDemoLogin}>
                <i className="bi bi-google text-danger"></i> Continue with Demo Gmail
              </button>
              
              <small className="text-muted d-block mt-3 text-start bg-dark bg-opacity-20 p-3 rounded" style={{ fontSize: '0.825rem', border: '1px solid var(--border-color)' }}>
                <i className="bi bi-info-circle me-1"></i> Google SDK will prompt credentials if running in configured domain. Use <strong>"Demo Gmail"</strong> for instant local testing.
              </small>
            </div>
          )}

          {/* STATE 2: Logged In but needs profile (or editing) */}
          {userId && (!learnerProfile || isEditing) && (
            <div className="glass-card p-4">
              {/* Authenticated User Banner */}
              <div 
                className="d-flex align-items-center gap-3 mb-4 p-3 rounded" 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <UserAvatar googleUser={googleUser} size="58px" />
                <div>
                  <h5 className="m-0 text-white fw-bold">{googleUser?.name || 'Demo Learner'}</h5>
                  <span className="text-white-50" style={{ fontSize: '0.9rem' }}>{googleUser?.email || 'learner.demo@gmail.com'}</span>
                </div>
                <span className="badge bg-primary ms-auto" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', border: 'none', padding: '8px 14px', borderRadius: '20px' }}>
                  <i className="bi bi-google me-1"></i> Authenticated
                </span>
              </div>

              <h1 className="fw-bold mb-2 text-white">
                <i className="bi bi-person-badge text-primary-light me-2"></i>
                {isEditing ? "Edit Preferences" : "Learner Onboarding"}
              </h1>
              <p className="text-muted mb-4">
                {isEditing ? "Modify your study goal or hourly commitments below" : "Complete your learning preferences to let AI generate your pathway"}
              </p>

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{successMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmitProfile}>
                {/* Profile Identity Details (Read-only name) */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary-light fw-bold">
                    <i className="bi bi-person-circle me-2"></i>Profile Identity
                  </h5>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={googleUser?.name || 'Demo Learner'} 
                      disabled 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter age (13-100)"
                      min="13" 
                      max="100" 
                      required 
                    />
                  </div>
                </div>

                <hr className="border-secondary border-opacity-25 my-4" />

                {/* Educational background */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary-light fw-bold">
                    <i className="bi bi-mortarboard me-2"></i>Educational Background
                  </h5>
                  <div className="mb-3">
                    <label className="form-label">Education Level</label>
                    <select 
                      className="form-select" 
                      value={educationLevel} 
                      onChange={(e) => setEducationLevel(e.target.value)}
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="high-school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Target / Current Domain</label>
                    <select 
                      className="form-select" 
                      value={currentDomain} 
                      onChange={(e) => setCurrentDomain(e.target.value)}
                      required
                    >
                      <option value="">Select current domain</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="data-science">Data Science</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="ai-ml">Artificial Intelligence & Machine Learning</option>
                      <option value="business">Business & Management</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <hr className="border-secondary border-opacity-25 my-4" />

                {/* Preferences */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary-light fw-bold">
                    <i className="bi bi-bullseye me-2"></i>Career & Learning Preferences
                  </h5>
                  <div className="mb-3">
                    <label className="form-label">Career Goal</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      placeholder="Describe your career goals and aspirations..."
                      required
                    ></textarea>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-3">
                    <label className="form-label d-block">Experience Level</label>
                    {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                      <div key={lvl} className="form-check form-check-inline">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="experienceLevel" 
                          id={`lvl-${lvl}`} 
                          value={lvl}
                          checked={experienceLevel === lvl}
                          onChange={(e) => setExperienceLevel(e.target.value)}
                        />
                        <label className="form-check-label text-capitalize" htmlFor={`lvl-${lvl}`}>{lvl}</label>
                      </div>
                    ))}
                  </div>

                  {/* Learning Style */}
                  <div className="mb-3">
                    <label className="form-label d-block">Preferred Learning Style</label>
                    {['visual', 'text', 'interactive'].map((style) => (
                      <div key={style} className="form-check form-check-inline">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="learningStyle" 
                          id={`style-${style}`} 
                          value={style}
                          checked={learningStyle === style}
                          onChange={(e) => setLearningStyle(e.target.value)}
                        />
                        <label className="form-check-label text-capitalize" htmlFor={`style-${style}`}>{style}</label>
                      </div>
                    ))}
                  </div>

                  {/* Weekly Hours */}
                  <div className="mb-3">
                    <label className="form-label">Weekly Hours Budget</label>
                    <select 
                      className="form-select" 
                      value={weeklyStudyHours} 
                      onChange={(e) => setWeeklyStudyHours(e.target.value)}
                      required
                    >
                      <option value="5">5 Hours / week</option>
                      <option value="10">10 Hours / week</option>
                      <option value="15">15 Hours / week</option>
                      <option value="20">20 Hours / week</option>
                      <option value="30">30 Hours / week</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-gradient px-4 py-3 flex-grow-1">
                    <i className="bi bi-check-circle me-1"></i> Save Preferences
                  </button>
                  {isEditing && (
                    <button type="button" className="btn btn-outline-custom px-4" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* STATE 3: Onboarding Complete Settings Summary */}
          {userId && learnerProfile && !isEditing && (
            <div className="glass-card p-4">
              <div className="text-center mb-5">
                <div className="d-flex justify-content-center mb-3">
                  <UserAvatar googleUser={googleUser} size="110px" />
                </div>
                <h2 className="fw-bold text-white mb-1">{googleUser?.name || 'Demo Learner'}</h2>
                <p className="text-muted mb-3">{googleUser?.email || 'learner.demo@gmail.com'}</p>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                  <i className="bi bi-shield-check me-1"></i> Gmail Verified Account
                </span>
              </div>

              <h4 className="mb-4 text-primary-light fw-bold">
                <i className="bi bi-sliders2-vertical me-2"></i>Learning Preferences
              </h4>

              <div className="profile-details-grid">
                <div className="detail-item-card">
                  <div className="detail-label">Age</div>
                  <div className="detail-value">{learnerProfile.age || '-'}</div>
                </div>
                <div className="detail-item-card">
                  <div className="detail-label">Education</div>
                  <div className="detail-value">{formatValue(learnerProfile.educationLevel)}</div>
                </div>
                <div className="detail-item-card">
                  <div className="detail-label">Target Domain</div>
                  <div className="detail-value">{formatValue(learnerProfile.currentDomain)}</div>
                </div>
                <div className="detail-item-card">
                  <div className="detail-label">Experience Level</div>
                  <div className="detail-value text-capitalize">{learnerProfile.experienceLevel || '-'}</div>
                </div>
                <div className="detail-item-card">
                  <div className="detail-label">Learning Style</div>
                  <div className="detail-value text-capitalize">{learnerProfile.learningStyle || '-'}</div>
                </div>
                <div className="detail-item-card">
                  <div className="detail-label">Weekly Hours</div>
                  <div className="detail-value">{learnerProfile.weeklyStudyHours || '-'} Hours</div>
                </div>
              </div>

              <div className="detail-item-card w-100 mb-4">
                <div className="detail-label">Career Goal & Aspirations</div>
                <div className="detail-value text-wrap" style={{ fontWeight: 500, fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {learnerProfile.careerGoal || 'No career goal specified'}
                </div>
              </div>

              <div className="action-button-group">
                <button className="btn btn-gradient" onClick={startEditProfile}>
                  <i className="bi bi-pencil-fill me-1"></i> Edit Preferences
                </button>
                <Link className="btn btn-outline-custom" to="/assessment">
                  <i className="bi bi-journal-check me-1"></i> Skills Assessment
                </Link>
                <Link className="btn btn-outline-custom" to="/dashboard">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
