import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Assessment() {
  const navigate = useNavigate();

  // Local states
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  // Authentication check
  useEffect(() => {
    if (!userId) {
      alert('No learner profile found. Please complete the Profile page first.');
      navigate('/profile');
    }
  }, [userId, navigate]);

  // Load skills on mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('assessmentSkills');
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (e) {
        console.error('Error loading skills:', e);
      }
    }
  }, []);

  // Save skills in local storage when updated
  const saveSkills = (updatedSkills) => {
    setSkills(updatedSkills);
    localStorage.setItem('assessmentSkills', JSON.stringify(updatedSkills));
    
    // Update local assessmentData summary
    const totalSkills = updatedSkills.length;
    const totalScore = updatedSkills.reduce((sum, skill) => sum + skill.level, 0);
    const averageLevel = totalSkills > 0 ? (totalScore / totalSkills).toFixed(1) : 0;

    const assessmentData = {
      skills: updatedSkills,
      totalSkills: totalSkills,
      averageLevel: parseFloat(averageLevel),
      totalScore: totalScore,
      assessedAt: new Date().toISOString()
    };
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
  };

  // Add a skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillName.trim() || !skillLevel) {
      alert('Please fill in both fields');
      return;
    }

    if (skills.some(skill => skill.name.toLowerCase() === skillName.trim().toLowerCase())) {
      alert('This skill has already been added!');
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      level: parseInt(skillLevel)
    };

    const updated = [...skills, newSkill];
    saveSkills(updated);
    
    // Reset inputs
    setSkillName('');
    setSkillLevel('');
  };

  // Delete a skill
  const handleDeleteSkill = (id) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      const updated = skills.filter(skill => skill.id !== id);
      saveSkills(updated);
    }
  };

  // Calculate scores
  const totalSkillsCount = skills.length;
  const totalScoreValue = skills.reduce((sum, skill) => sum + skill.level, 0);
  const averageLevelValue = totalSkillsCount > 0 ? (totalScoreValue / totalSkillsCount).toFixed(1) : 0;

  // Submit assessment
  const handleProceed = async () => {
    if (skills.length === 0) {
      alert('Please add at least one skill before proceeding');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: userId,
        skills: skills.map(s => ({ name: s.name, level: s.level }))
      };

      const response = await fetch(`${API_BASE}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Assessment submission failed:', result);
        alert(result.error || 'Failed to submit assessment. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Save backend results
      localStorage.setItem('assessmentData', JSON.stringify(result.assessment));
      localStorage.setItem('assessmentCompleted', 'true');
      
      // Go directly to Learning Path generation router page
      navigate('/learning-path');
    } catch (error) {
      console.error('Network error during assessment submission:', error);
      alert('Unable to connect to the server. Proceeding in offline simulation mode.');
      localStorage.setItem('assessmentCompleted', 'true');
      navigate('/learning-path');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          
          {/* Page Title */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-white mb-2">
              <i className="bi bi-patch-check-fill text-primary-light me-2"></i>Skills Assessment
            </h1>
            <p className="text-muted">Rate your current expertise to customize recommendations</p>
          </div>

          {/* Form to add skills */}
          <div className="glass-card mb-4">
            <h5 className="mb-3 text-primary-light fw-bold">
              <i className="bi bi-plus-circle-fill me-2"></i>Add Skill to Assess
            </h5>
            <form onSubmit={handleAddSkill} className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Skill Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={skillName} 
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g., JavaScript, Python, SQL" 
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Skill Level (1-5)</label>
                <select 
                  className="form-select" 
                  value={skillLevel} 
                  onChange={(e) => setSkillLevel(e.target.value)}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="1">Level 1 - Beginner</option>
                  <option value="2">Level 2 - Novice</option>
                  <option value="3">Level 3 - Intermediate</option>
                  <option value="4">Level 4 - Advanced</option>
                  <option value="5">Level 5 - Expert</option>
                </select>
              </div>
              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-add-skill">
                  <i className="bi bi-plus-lg me-1"></i> Add Skill
                </button>
              </div>
            </form>
          </div>

          {/* Skills List Card */}
          <div className="glass-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-white fw-bold">
                <i className="bi bi-list-check text-primary-light me-2"></i>Your Skills
              </h5>
              <span className="badge bg-secondary px-3 py-2" style={{ borderRadius: '20px' }}>
                {totalSkillsCount} Skill{totalSkillsCount !== 1 ? 's' : ''}
              </span>
            </div>

            {skills.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox mb-3" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                <h4>No skills added yet</h4>
                <p>Start by adding your first skill above</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Skill Name</th>
                      <th scope="col">Level</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <tr key={skill.id} className="align-middle">
                        <td>{index + 1}</td>
                        <td className="fw-bold">{skill.name}</td>
                        <td>
                          <span className={`level-badge level-${skill.level}`}>
                            Level {skill.level}
                          </span>
                        </td>
                        <td className="text-end">
                          <button 
                            type="button" 
                            className="btn btn-delete btn-sm"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assessment Score Card */}
          <div className="glass-card mb-4">
            <h5 className="mb-4 text-white fw-bold">
              <i className="bi bi-graph-up text-primary-light me-2"></i>Assessment Score
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="score-card">
                  <div className="score-label">Total Skills</div>
                  <div className="score-value">{totalSkillsCount}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="score-card">
                  <div className="score-label">Average Level</div>
                  <div className="score-value">{averageLevelValue}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="score-card">
                  <div className="score-label">Total Score</div>
                  <div className="score-value">{totalScoreValue}</div>
                </div>
              </div>
            </div>
            <div className="alert alert-info mt-4 mb-0 bg-white bg-opacity-5 border border-info border-opacity-10 text-info" style={{ borderRadius: '14px' }}>
              <i className="bi bi-info-circle me-1"></i> 
              <strong>Score Calculation:</strong> Total Score = Sum of all skill levels. Average Level = Total Score ÷ Number of Skills.
            </div>
          </div>

          {/* Proceed Card */}
          <div className="glass-card text-center py-4">
            <button 
              type="button" 
              className="btn btn-gradient btn-lg w-100 py-3"
              disabled={skills.length === 0 || isSubmitting}
              onClick={handleProceed}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating Pathways...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-right-circle me-2"></i> Proceed to Generate Learning Path
                </>
              )}
            </button>
            <div className="text-muted mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
              {skills.length === 0 ? (
                <span>
                  <i className="bi-info-circle-fill text-warning me-1"></i> Add at least one skill to proceed
                </span>
              ) : (
                <span className="text-emerald">
                  <i className="bi-check-circle-fill me-1"></i> Ready to generate your personalized learning path!
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Assessment;
