import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  useEffect(() => {
    // Add scroll shadows to navbar when scrolling down
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
          navbar.style.boxShadow = 'none';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <section className="text-center py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="badge bg-primary bg-opacity-10 text-primary-light px-3 py-2 rounded-pill mb-4" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              <i className="bi bi-stars"></i> NEXT-GENERATION PERSONALIZED EDUCATION
            </span>
            <h1 className="display-4 text-white mb-4" style={{ fontWeight: 800, letterSpacing: '-1px' }}>
              Shape Your Future with <br />
              <span className="text-primary-light">AI Personalized Learning</span>
            </h1>
            <p className="lead text-muted mb-5" style={{ fontSize: '1.25rem' }}>
              Generate custom learning roadmaps, curated courses, and daily study plans tailored to your goals, experience level, and preferred study style.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/profile" className="btn btn-gradient btn-lg px-4 py-3">
                <i className="bi bi-arrow-right-circle me-2"></i> Get Started Now
              </Link>
              <Link to="/demo-hub" className="btn btn-outline-custom btn-lg px-4 py-3">
                <i className="bi bi-play-circle me-2"></i> Explore Demo Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="text-white fw-bold">Tailored Learning at Your Fingertips</h2>
          <p className="text-muted">How our AI Personalized Path Generator works</p>
        </div>
        
        <div className="row g-4">
          {/* Feature 1: Interactive Assessment */}
          <div className="col-md-4">
            <div className="glass-card text-center h-100">
              <div className="stat-icon primary mb-4">
                <i className="bi bi-clipboard2-check"></i>
              </div>
              <h3 className="h4 text-white fw-bold mb-3">Interactive Assessment</h3>
              <p className="text-muted">
                Answer simple questions to gauge your existing skill levels, strengths, and goals.
              </p>
            </div>
          </div>

          {/* Feature 2: AI-based Recommendations */}
          <div className="col-md-4">
            <div className="glass-card text-center h-100">
              <div className="stat-icon success mb-4">
                <i className="bi bi-cpu"></i>
              </div>
              <h3 className="h4 text-white fw-bold mb-3">AI Recommendations</h3>
              <p className="text-muted">
                Receive curated resources and course listings matching your level, learning style, and weekly hours budget.
              </p>
            </div>
          </div>

          {/* Feature 3: Live Progress Tracking */}
          <div className="col-md-4">
            <div className="glass-card text-center h-100">
              <div className="stat-icon warning mb-4">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h3 className="h4 text-white fw-bold mb-3">Progress Dashboard</h3>
              <p className="text-muted">
                Track your course milestones, view average skill score charts, and manage your study habits dynamically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-5 pt-5 text-center border-top border-white border-opacity-10">
        <p className="text-white fw-bold mb-1">AI-Powered Personalized Learning Path Generator</p>
        <p className="text-muted small">A College Project designed to revolutionize personalized learning through AI.</p>
        <p className="text-muted small mt-3">&copy; 2026 LearningPath AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
