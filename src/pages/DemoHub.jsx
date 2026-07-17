import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto';

function DemoHub() {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState('feedback');

  // Global Auth
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // Feedback states
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ total: 0, avg: 0, nps: 0 });
  const [fbName, setFbName] = useState('');
  const [fbOverall, setFbOverall] = useState(5);
  const [fbReco, setFbReco] = useState(5);
  const [fbCust, setFbCust] = useState(5);
  const [fbComments, setFbComments] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState(null);

  // Planner states
  const [plannerHours, setPlannerHours] = useState('10');
  const [plannerSchedule, setPlannerSchedule] = useState([]);

  // Pro Upgrade states
  const [userPlan, setUserPlan] = useState(localStorage.getItem('userPlan') || 'free');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'loading' | 'success'
  const [loadingText, setLoadingText] = useState('Authorizing card details...');
  
  // Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Confetti particles state
  const [confetti, setConfetti] = useState([]);

  // Chart Refs
  const sentimentRef = useRef(null);
  const featuresRef = useRef(null);
  const ratingRef = useRef(null);
  const styleRef = useRef(null);
  const levelRef = useRef(null);
  const domainRef = useRef(null);

  // Chart Instances
  const sentimentInstance = useRef(null);
  const featuresInstance = useRef(null);
  const ratingInstance = useRef(null);
  const styleInstance = useRef(null);
  const levelInstance = useRef(null);
  const domainInstance = useRef(null);

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000'
    : window.location.origin;

  // Authentication check
  useEffect(() => {
    if (!userId) {
      alert('Please log in or bypass to Demo Gmail to explore the Demo Hub.');
      navigate('/profile');
    }
  }, [userId, navigate]);

  // Load Feedbacks and Analytics on tab mount
  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchFeedbackData();
    } else if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab]);

  // Trigger Study Planner and Certificate details on mount
  useEffect(() => {
    generateSchedule();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const response = await fetch(`${API_BASE}/feedbacks`);
      const result = await response.json();
      if (response.ok && result.success) {
        setFeedbackList(result.feedbacks || []);
        setFeedbackStats({
          total: result.metrics.total_feedbacks || 0,
          avg: result.metrics.avg_overall || 0,
          nps: result.metrics.nps || 0
        });
        renderFeedbackCharts(result.metrics);
      }
    } catch (e) {
      console.warn("Feedback fetch failed. Running offline fallback.", e);
      loadFeedbackOffline();
    }
  };

  const loadFeedbackOffline = () => {
    const mockFeedbacks = [
      { name: "Sankul Prana", overall_rating: 5, recommendation_rating: 5, customization_rating: 5, comments: "Absolutely love the customization logic!", sentiment: "Positive", date: "Just Now", requested_features: "Mobile App,Interactive Quizzes" },
      { name: "John Doe", overall_rating: 4, recommendation_rating: 4, customization_rating: 3, comments: "Very solid roadmap tool.", sentiment: "Positive", date: "2026-06-12", requested_features: "Mobile App" }
    ];
    setFeedbackList(mockFeedbacks);
    setFeedbackStats({ total: 2, avg: 4.5, nps: 50 });
    
    const mockMetrics = {
      sentiment: { Positive: 2, Neutral: 0, Negative: 0 },
      features: { "Mobile App": 2, "Deeper Analytics": 0, "Interactive Quizzes": 1, "Slack Integration": 0 },
      avg_overall: 4.5,
      avg_recommendation: 4.5,
      avg_customization: 4.0
    };
    renderFeedbackCharts(mockMetrics);
  };

  const renderFeedbackCharts = (metrics) => {
    // 1. Sentiment Pie Chart
    if (sentimentRef.current) {
      if (sentimentInstance.current) sentimentInstance.current.destroy();
      sentimentInstance.current = new Chart(sentimentRef.current, {
        type: 'pie',
        data: {
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{
            data: [metrics.sentiment.Positive, metrics.sentiment.Neutral, metrics.sentiment.Negative],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: '#cbd5e1' } }
          }
        }
      });
    }

    // 2. Feature requests horizontal bar
    if (featuresRef.current) {
      if (featuresInstance.current) featuresInstance.current.destroy();
      const labels = Object.keys(metrics.features);
      const data = Object.values(metrics.features);
      
      featuresInstance.current = new Chart(featuresRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Votes',
            data,
            backgroundColor: '#6366f1',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 3. Average Rating breakdowns
    if (ratingRef.current) {
      if (ratingInstance.current) ratingInstance.current.destroy();
      ratingInstance.current = new Chart(ratingRef.current, {
        type: 'bar',
        data: {
          labels: ['Overall Satisfaction', 'Recommendation Relevance', 'Customization Logic'],
          datasets: [{
            data: [metrics.avg_overall, metrics.avg_recommendation, metrics.avg_customization],
            backgroundColor: ['#a855f7', '#818cf8', '#ec4899'],
            borderRadius: 8,
            maxBarThickness: 40
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { min: 0, max: 5, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1', stepSize: 1 } },
            x: { grid: { display: false }, ticks: { color: '#cbd5e1' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`${API_BASE}/analytics-data`);
      const result = await response.json();
      if (response.ok && result.success) {
        setAnalyticsData(result);
        renderAnalyticsCharts(result);
      }
    } catch (e) {
      console.warn("Analytics fetch failed. Rendering fallback charts.", e);
      loadAnalyticsOffline();
    }
  };

  const loadAnalyticsOffline = () => {
    const mockData = {
      styles: { visual: 12, text: 8, interactive: 15 },
      experience: { beginner: 18, intermediate: 12, advanced: 5 },
      domains: { "web-development": 15, "data-science": 10, "ai-ml": 8, "cybersecurity": 4, "other": 2 },
      age_groups: { "Under 20": 5, "20-24": 18, "25-29": 10, "30+": 4 }
    };
    setAnalyticsData(mockData);
    renderAnalyticsCharts(mockData);
  };

  const renderAnalyticsCharts = (data) => {
    // 1. Style doughnut
    if (styleRef.current) {
      if (styleInstance.current) styleInstance.current.destroy();
      const labels = Object.keys(data.styles).map(s => s.charAt(0).toUpperCase() + s.slice(1));
      styleInstance.current = new Chart(styleRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: Object.values(data.styles),
            backgroundColor: ['#a855f7', '#6366f1', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } }
        }
      });
    }

    // 2. Experience level bar
    if (levelRef.current) {
      if (levelInstance.current) levelInstance.current.destroy();
      const labels = Object.keys(data.experience).map(l => l.charAt(0).toUpperCase() + l.slice(1));
      levelInstance.current = new Chart(levelRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: Object.values(data.experience),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 3. Domain popularity polar area
    if (domainRef.current) {
      if (domainInstance.current) domainInstance.current.destroy();
      const labels = Object.keys(data.domains).map(d => d.replace('-', ' ').toUpperCase());
      domainInstance.current = new Chart(domainRef.current, {
        type: 'polarArea',
        data: {
          labels,
          datasets: [{
            data: Object.values(data.domains),
            backgroundColor: [
              'rgba(99, 102, 241, 0.6)',
              'rgba(168, 85, 247, 0.6)',
              'rgba(236, 72, 153, 0.6)',
              'rgba(16, 185, 129, 0.6)',
              'rgba(245, 158, 11, 0.6)'
            ],
            borderColor: 'rgba(255,255,255,0.1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              angleLines: { color: 'rgba(255,255,255,0.05)' },
              ticks: { display: false }
            }
          },
          plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } } }
        }
      });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComments.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      name: fbName,
      overall_rating: fbOverall,
      recommendation_rating: fbReco,
      customization_rating: fbCust,
      comments: fbComments,
      requested_features: selectedFeatures.join(',')
    };

    try {
      const response = await fetch(`${API_BASE}/submit-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Feedback submitted successfully!');
        setFbName('');
        setFbComments('');
        setSelectedFeatures([]);
        setFbOverall(5);
        setFbReco(5);
        setFbCust(5);
        fetchFeedbackData();
      } else {
        alert('Error: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.warn('Network offline. Simulating local feedback submission:', error);
      alert('Network offline. Appending simulated review.');
      
      const localReview = {
        name: fbName,
        overall_rating: fbOverall,
        recommendation_rating: fbReco,
        customization_rating: fbCust,
        comments: fbComments,
        requested_features: selectedFeatures.join(','),
        sentiment: fbOverall >= 4 ? 'Positive' : fbOverall === 3 ? 'Neutral' : 'Negative',
        date: new Date().toISOString()
      };

      setFeedbackList(prev => [localReview, ...prev]);
      setFbName('');
      setFbComments('');
      setSelectedFeatures([]);
    }
  };

  const toggleFeatureCheckbox = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    } else {
      setSelectedFeatures(prev => [...prev, feature]);
    }
  };

  // Timetable planner logic
  const generateSchedule = (hoursOverride) => {
    const hours = parseInt(hoursOverride || plannerHours);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    let hoursPerDay = Array(7).fill(0);
    if (hours === 5) {
      for(let i=0; i<5; i++) hoursPerDay[i] = 1;
    } else if (hours === 10) {
      for(let i=0; i<5; i++) hoursPerDay[i] = 2;
    } else if (hours === 15) {
      for(let i=0; i<5; i++) hoursPerDay[i] = 2.5;
      hoursPerDay[5] = 1.25; hoursPerDay[6] = 1.25;
    } else if (hours === 20) {
      for(let i=0; i<5; i++) hoursPerDay[i] = 3;
      hoursPerDay[5] = 2.5; hoursPerDay[6] = 2.5;
    } else {
      for(let i=0; i<5; i++) hoursPerDay[i] = 5;
      hoursPerDay[5] = 2.5; hoursPerDay[6] = 2.5;
    }

    // Try parsing the actual learning path milestones
    let cachedMilestones = [];
    try {
      const cachedPath = localStorage.getItem('learningPath');
      if (cachedPath) {
        cachedMilestones = JSON.parse(cachedPath).milestones || [];
      }
    } catch (e) {
      console.error('Error loading roadmap milestones for planner:', e);
    }

    let milestoneIdx = 0;
    const schedule = days.map((day, idx) => {
      const dayHrs = hoursPerDay[idx];
      let assignedMilestone = null;
      
      if (dayHrs > 0 && cachedMilestones.length > 0) {
        assignedMilestone = cachedMilestones[milestoneIdx % cachedMilestones.length];
        milestoneIdx += 1;
      }
      
      return {
        day,
        hours: dayHrs,
        topic: assignedMilestone ? assignedMilestone.title : (dayHrs > 0 ? 'Hands-on Practice' : 'Rest Day'),
        milestoneId: assignedMilestone ? assignedMilestone.id : null,
        completed: assignedMilestone ? (assignedMilestone.status === 'completed') : false
      };
    });

    setPlannerSchedule(schedule);
  };

  const handleToggleMilestoneCompleted = async (milestoneId, completed) => {
    if (!milestoneId) return;
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
        // Update local learningPath cache
        const cachedPath = localStorage.getItem('learningPath');
        if (cachedPath) {
          try {
            const path = JSON.parse(cachedPath);
            path.milestones = path.milestones.map(ms => {
              if (ms.id === milestoneId) {
                return { ...ms, status: completed ? 'completed' : 'not-started' };
              }
              return ms;
            });
            localStorage.setItem('learningPath', JSON.stringify(path));
          } catch (e) {}
        }
        
        // Regenerate schedule to update UI checkbox state
        generateSchedule(plannerHours);
        
        // Fire progression event
        window.dispatchEvent(new Event('progress-change'));
      }
    } catch (e) {
      console.error(e);
      // Offline fallback: toggle locally
      const cachedPath = localStorage.getItem('learningPath');
      if (cachedPath) {
        try {
          const path = JSON.parse(cachedPath);
          path.milestones = path.milestones.map(ms => {
            if (ms.id === milestoneId) {
              return { ...ms, status: completed ? 'completed' : 'not-started' };
            }
            return ms;
          });
          localStorage.setItem('learningPath', JSON.stringify(path));
        } catch (e) {}
      }
      generateSchedule(plannerHours);
      window.dispatchEvent(new Event('progress-change'));
    }
  };

  // Checkout Upgrade
  const openUpgradeModal = () => {
    setCheckoutStep('form');
    setCardName(googleUser()?.name.toUpperCase() || 'DEMO LEARNER');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setIsCardFlipped(false);
    setIsCheckoutOpen(true);
    setConfetti([]);
  };

  const googleUser = () => {
    try {
      const u = localStorage.getItem('googleUser');
      return u ? JSON.parse(u) : null;
    } catch(e) { return null; }
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardExpiry(val);
  };

  const handleCvcChange = (e) => {
    setCardCvc(e.target.value.replace(/\D/g, ''));
  };

  const processUpgradeSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('loading');
    setLoadingText('Routing payment to secure processor...');

    setTimeout(() => {
      setLoadingText('Updating account privileges...');
    }, 1200);

    setTimeout(() => {
      localStorage.setItem('userPlan', 'pro');
      setUserPlan('pro');
      setCheckoutStep('success');
      triggerConfettiParticles();
    }, 2500);
  };

  const downgradePlan = () => {
    if (window.confirm('Are you sure you want to cancel your Pro Plan subscription?')) {
      localStorage.setItem('userPlan', 'free');
      setUserPlan('free');
      alert('Plan downgraded to Basic.');
    }
  };

  const triggerConfettiParticles = () => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];
    const particles = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100 + '%',
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 8 + 6 + 'px',
        height: Math.random() * 12 + 6 + 'px',
        duration: Math.random() * 2 + 1.5 + 's',
        delay: Math.random() * 0.5 + 's'
      });
    }
    setConfetti(particles);
  };

  // Job opening referrals
  const getJobMatches = () => {
    let domain = 'web-development';
    try {
      const profile = localStorage.getItem('learnerProfile');
      if (profile) {
        domain = JSON.parse(profile).currentDomain || 'web-development';
      }
    } catch(e) {}

    const jobsDb = [
      { title: 'Junior Frontend Developer', company: 'TechNova Solutions', loc: 'Remote / NYC', salary: '$70,000 - $85,000', domain: 'web-development', skills: 'HTML, CSS, React, JS' },
      { title: 'Full Stack JavaScript Engineer', company: 'InnoSystems Inc', loc: 'Hybrid / San Francisco', salary: '$95,000 - $115,000', domain: 'web-development', skills: 'Node.js, Express, React, SQL' },
      { title: 'Junior Data Analyst', company: 'DataMetrics Corp', loc: 'Remote', salary: '$65,000 - $80,000', domain: 'data-science', skills: 'Python, Pandas, SQL, Excel' },
      { title: 'Machine Learning Research Assistant', company: 'NeuralLabs AI', loc: 'On-site / Boston', salary: '$85,000 - $105,000', domain: 'ai-ml', skills: 'Python, PyTorch, Linear Algebra' },
      { title: 'Cybersecurity Associate Analyst', company: 'Fortress Secure', loc: 'Remote / Austin', salary: '$75,000 - $90,000', domain: 'cybersecurity', skills: 'Linux, Wireshark, Ethical Hacking' }
    ];

    const matches = jobsDb.filter(j => j.domain === domain);
    return matches.length > 0 ? matches : jobsDb.slice(0, 2);
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="container mt-4 mb-5">
      
      {/* Title */}
      <div className="text-center mb-5 d-print-none">
        <h1 className="fw-bold text-white mb-2">
          <i className="bi bi-cpu text-primary-light me-2"></i>Simulation Workspace Hub
        </h1>
        <p className="text-muted">Interactive demo modules, real-time reviews tracker, study timetable and billing features</p>
      </div>

      {/* Tabs list (Nav pill style) */}
      <div className="nav-pills-custom d-print-none">
        <button className={activeTab === 'feedback' ? "nav-link active" : "nav-link"} onClick={() => setActiveTab('feedback')}>
          <i className="bi bi-chat-left-heart me-1"></i> Feedback & Sentiment Analyzer
        </button>
        <button className={activeTab === 'analytics' ? "nav-link active" : "nav-link"} onClick={() => setActiveTab('analytics')}>
          <i className="bi bi-bar-chart-line me-1"></i> Demographics Analytics
        </button>
        <button className={activeTab === 'planner' ? "nav-link active" : "nav-link"} onClick={() => setActiveTab('planner')}>
          <i className="bi bi-calendar-event me-1"></i> Study Planner
        </button>
        <button className={activeTab === 'upgrade' ? "nav-link active" : "nav-link"} onClick={() => setActiveTab('upgrade')}>
          <i className="bi bi-credit-card me-1"></i> Upgrade & Certifications
        </button>
      </div>

      {/* Tab: Feedback */}
      {activeTab === 'feedback' && (
        <div className="row g-4 d-print-none">
          <div className="col-md-5">
            <div className="glass-card">
              <h5 className="mb-4 text-white fw-bold">
                <i className="bi bi-pencil-square text-primary-light me-2"></i>Submit Live Review
              </h5>
              
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={fbName}
                    onChange={(e) => setFbName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label d-block">Overall Satisfaction</label>
                  <div className="rating-stars" id="fb-overall-stars">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <i 
                        key={val} 
                        className={fbOverall >= val ? "bi bi-star-fill active" : "bi bi-star"}
                        data-value={val}
                        onClick={() => setFbOverall(val)}
                      ></i>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Recommendation Relevance (1-5)</label>
                  <select className="form-select" value={fbReco} onChange={(e) => setFbReco(parseInt(e.target.value))}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Fair</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Customization Logic (1-5)</label>
                  <select className="form-select" value={fbCust} onChange={(e) => setFbCust(parseInt(e.target.value))}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Fair</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={fbComments}
                    onChange={(e) => setFbComments(e.target.value)}
                    placeholder="Write your review details here..."
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">Requested Features</label>
                  {["Mobile App", "Deeper Analytics", "Interactive Quizzes", "Slack Integration"].map((feat) => (
                    <div key={feat} className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={selectedFeatures.includes(feat)}
                        onChange={() => toggleFeatureCheckbox(feat)}
                      />
                      <label className="form-check-label small">{feat}</label>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-gradient w-100">
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="row g-3 mb-4">
              <div className="col-4">
                <div className="glass-card text-center p-3">
                  <div className="score-label">Reviews</div>
                  <div className="score-value text-white fs-3" id="m-total">{feedbackStats.total}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card text-center p-3">
                  <div className="score-label">Avg Rating</div>
                  <div className="score-value text-white fs-3" id="m-avg">{Number(feedbackStats.avg).toFixed(1)}</div>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card text-center p-3">
                  <div className="score-label">NPS Score</div>
                  <div className={`fs-3 fw-bold ${feedbackStats.nps >= 20 ? 'text-emerald' : feedbackStats.nps < 0 ? 'text-danger' : 'text-amber'}`} id="m-nps">
                    {feedbackStats.nps >= 0 ? '+' : ''}{feedbackStats.nps}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card mb-4" style={{ height: '300px' }}>
              <h5 className="text-white fw-bold mb-3">AI Sentiment Classification & Feature Votes</h5>
              <div className="row h-75">
                <div className="col-6 position-relative h-100">
                  <canvas ref={sentimentRef}></canvas>
                </div>
                <div className="col-6 position-relative h-100">
                  <canvas ref={featuresRef}></canvas>
                </div>
              </div>
            </div>

            <div className="glass-card mb-4" style={{ height: '230px' }}>
              <h5 className="text-white fw-bold mb-3">Core Parameter Averages</h5>
              <div className="position-relative h-75">
                <canvas ref={ratingRef}></canvas>
              </div>
            </div>

            <div className="glass-card">
              <h5 className="text-white fw-bold mb-3">Live Reviews Stream</h5>
              <div id="feedback-feed" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {feedbackList.map((item, idx) => (
                  <div key={idx} className="feedback-item">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="text-white">{item.name}</strong>
                        <div className="mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`bi bi-star${star <= item.overall_rating ? '-fill text-warning' : ' text-secondary'} small`}></i>
                          ))}
                        </div>
                      </div>
                      <span className={`sentiment-tag sentiment-${item.sentiment}`}>{item.sentiment}</span>
                    </div>
                    <p className="text-muted small italic">"{item.comments}"</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {item.requested_features?.split(',').filter(x => x).map((feat, fIdx) => (
                          <span key={fIdx} className="badge bg-secondary bg-opacity-25 text-white-50 me-1" style={{ fontSize: '10px' }}>{feat}</span>
                        ))}
                      </div>
                      <span className="text-muted" style={{ fontSize: '10px' }}>{item.date?.substring(0, 10) || 'Just Now'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Analytics */}
      {activeTab === 'analytics' && (
        <div className="row g-4 d-print-none animate-fade-in">
          <div className="col-md-6">
            <div className="glass-card" style={{ height: '350px' }}>
              <h5 className="text-white fw-bold mb-4">Learning Style Distribution</h5>
              <div className="position-relative h-75">
                <canvas ref={styleRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-card" style={{ height: '350px' }}>
              <h5 className="text-white fw-bold mb-4">Experience Level Breakdown</h5>
              <div className="position-relative h-75">
                <canvas ref={levelRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="glass-card" style={{ height: '350px' }}>
              <h5 className="text-white fw-bold mb-4">Domain Popularity Distribution</h5>
              <div className="position-relative h-75">
                <canvas ref={domainRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-card d-flex flex-column justify-content-between">
              <div>
                <h5 className="text-white fw-bold mb-3">Age Groups Counter</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent text-white border-white border-opacity-10 d-flex justify-content-between">
                    <span>Under 20</span>
                    <strong className="text-primary-light" id="dem-u20">{analyticsData?.age_groups?.['Under 20'] || 0}</strong>
                  </li>
                  <li className="list-group-item bg-transparent text-white border-white border-opacity-10 d-flex justify-content-between">
                    <span>20 - 24 years</span>
                    <strong className="text-primary-light" id="dem-2024">{analyticsData?.age_groups?.['20-24'] || 0}</strong>
                  </li>
                  <li className="list-group-item bg-transparent text-white border-white border-opacity-10 d-flex justify-content-between">
                    <span>25 - 29 years</span>
                    <strong className="text-primary-light" id="dem-2529">{analyticsData?.age_groups?.['25-29'] || 0}</strong>
                  </li>
                  <li className="list-group-item bg-transparent text-white border-white border-opacity-10 d-flex justify-content-between">
                    <span>30+ years</span>
                    <strong className="text-primary-light" id="dem-30p">{analyticsData?.age_groups?.['30+'] || 0}</strong>
                  </li>
                </ul>
              </div>
              <div className="mt-4 text-center bg-white bg-opacity-5 p-3 rounded" style={{ border: '1px solid var(--border-color)' }}>
                <div className="text-muted small">Simulated Platform Records</div>
                <h4 className="fw-bold m-0 text-white mt-1">Live DB Metrics</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Planner */}
      {activeTab === 'planner' && (
        <div className="glass-card d-print-none animate-fade-in">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h5 className="text-white fw-bold mb-1">
                <i className="bi bi-calendar3 text-emerald me-2"></i>Weekly study schedule grid
              </h5>
              <p className="text-muted mb-0">AI distributes your weekly hours targets across a structured calendar planner</p>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <select 
                className="form-select bg-transparent text-white" 
                value={plannerHours} 
                onChange={(e) => {
                  setPlannerHours(e.target.value);
                  generateSchedule(e.target.value);
                }}
                style={{ width: '150px' }}
              >
                <option value="5">5 hours/week</option>
                <option value="10">10 hours/week</option>
                <option value="15">15 hours/week</option>
                <option value="20">20 hours/week</option>
                <option value="30">30 hours/week</option>
              </select>
              <button className="btn btn-gradient btn-sm" onClick={() => generateSchedule()}>
                Regenerate Planner
              </button>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-7 g-2" id="calendar-grid">
            {plannerSchedule.map((item, idx) => (
              <div className="col" key={idx}>
                <div className="timetable-cell" style={{ border: item.completed ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)', background: item.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)' }}>
                  <div className="timetable-header">{item.day}</div>
                  {item.hours > 0 ? (
                    <>
                      <span className="badge bg-primary bg-opacity-20 text-primary-light my-2 px-3 py-1 rounded-pill">
                        {item.hours} hrs session
                      </span>
                      <div className="text-white-50 small mt-1">Topic:</div>
                      <div className="fw-bold text-white mb-2" style={{ fontSize: '13px', textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.6 : 1 }}>
                        {item.topic}
                      </div>
                      {item.milestoneId && (
                        <div className="form-check d-flex justify-content-center m-0 mt-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={item.completed}
                            onChange={(e) => handleToggleMilestoneCompleted(item.milestoneId, e.target.checked)}
                            style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                            id={`planner-ms-${idx}`}
                          />
                          <label className="form-check-label text-muted small ms-2" htmlFor={`planner-ms-${idx}`} style={{ cursor: 'pointer', fontSize: '11px' }}>
                            {item.completed ? 'Completed' : 'Mark Done'}
                          </label>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="badge bg-secondary bg-opacity-10 text-muted my-2 px-3 py-1 rounded-pill">
                        Rest Day
                      </span>
                      <div className="text-muted small mt-1">No studies scheduled. Enjoy your break!</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Upgrade & Certs */}
      {activeTab === 'upgrade' && (
        <div className="row g-4 animate-fade-in">
          {/* Left: Tiers pricing */}
          <div className="col-md-5 d-print-none">
            <div className="glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="text-white fw-bold mb-4">Upgrade Path Plan</h5>
                
                {/* Standard Free */}
                <div className="pricing-card mb-3 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold m-0 text-white">Basic Plan</h6>
                      <small className="text-muted">Standard recommendations & assessment</small>
                    </div>
                    <span className="fw-bold text-emerald">Free</span>
                  </div>
                  {userPlan !== 'pro' && (
                    <button className="btn btn-outline-custom w-100 py-2 mt-3 small" disabled>
                      Active Plan
                    </button>
                  )}
                </div>

                {/* Standard Pro */}
                <div className="pricing-card popular p-3">
                  <span className="popular-badge">POPULAR</span>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold m-0 text-white">Pro Study Pathway</h6>
                      <small className="text-muted">Verified Certifications & Unlimited AI Copilot</small>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold text-white d-block">$49/mo</span>
                      <small className="text-muted" style={{ fontSize: '10px' }}>Now $1.00 for Demo</small>
                    </div>
                  </div>
                  
                  {userPlan === 'pro' ? (
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-success w-100 py-2 small" disabled style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}>
                        <i className="bi bi-patch-check-fill text-white"></i> Active Pro
                      </button>
                      <button className="btn btn-outline-danger py-2 small" onClick={downgradePlan}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-gradient w-100 py-2 mt-3 small" onClick={openUpgradeModal}>
                      Upgrade Pro
                    </button>
                  )}
                </div>
              </div>

              {/* Jobs section matching domain */}
              <div className="mt-4">
                <h6 className="text-white fw-bold mb-3"><i className="bi bi-briefcase text-primary-light"></i> Matching Openings</h6>
                <div id="job-referrals-list">
                  {getJobMatches().map((j, idx) => (
                    <div className="job-card p-3 my-2" key={idx}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-white fw-bold mb-1">{j.title}</h6>
                          <span className="text-primary-light small fw-bold">{j.company}</span>
                        </div>
                        <span className="badge bg-emerald bg-opacity-20 text-emerald small">{j.salary}</span>
                      </div>
                      <div className="text-muted small mt-2">Location: {j.loc} | Req: {j.skills}</div>
                      <button className="btn btn-outline-custom py-1 px-3 mt-2 w-100 small" style={{ fontSize: '12px' }} onClick={() => alert('Applications processed through premium referral loops. Application simulated!')}>
                        <i className="bi bi-briefcase-fill"></i> Fast Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Certificate printable view */}
          <div className="col-md-7 col-12">
            <div className="glass-card text-center">
              <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                <h5 className="text-white fw-bold m-0"><i className="bi bi-award text-amber"></i> LearningPath Certificate</h5>
                <button className="btn btn-outline-custom btn-sm" onClick={printCertificate} disabled={userPlan !== 'pro'}>
                  <i className="bi bi-printer"></i> Print Verified Certificate
                </button>
              </div>

              {userPlan !== 'pro' ? (
                <div className="py-5 text-muted d-print-none">
                  <i className="bi bi-shield-slash mb-3" style={{ fontSize: '3.5rem', opacity: 0.4 }}></i>
                  <h5>Certificates Locked</h5>
                  <p className="small px-4">Upgrade your account to Standard Pro plan to unlock verified, print-ready course completion credentials.</p>
                </div>
              ) : (
                <div className="certificate-preview-box">
                  <div className="certificate-title">Certificate of Completion</div>
                  <p className="small text-muted mb-4">VERIFIED STUDY ACCREDITATION</p>
                  <p className="mb-1 text-secondary">This certificate is proudly presented to</p>
                  <h3 className="fw-bold text-dark my-3" id="cert-learner-name" style={{ fontFamily: 'Outfit' }}>
                    {googleUser()?.name || 'Demo Learner'}
                  </h3>
                  <p className="text-secondary mx-4 mb-4" style={{ fontSize: '13px' }}>
                    for successfully mastering and completing all recommended milestones and assessments in the
                  </p>
                  <h5 className="fw-bold text-indigo mb-4" id="cert-domain-name" style={{ color: '#4f46e5' }}>
                    {localStorage.getItem('learnerProfile') ? JSON.parse(localStorage.getItem('learnerProfile')).currentDomain?.replace('-', ' ').toUpperCase() + ' PATHWAY' : 'WEB DEVELOPMENT PATHWAY'}
                  </h5>
                  <hr className="border-dark opacity-10 mx-5 my-4" />
                  <div className="d-flex justify-content-between align-items-center mx-5">
                    <div className="text-start">
                      <small className="d-block text-muted" style={{ fontSize: '10px' }}>DATE OF ISSUE</small>
                      <strong className="text-dark small" id="cert-date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    </div>
                    <div className="text-end">
                      <small className="d-block text-muted" style={{ fontSize: '10px' }}>ISSUED BY</small>
                      <strong className="text-dark small" style={{ letterSpacing: '0.5px' }}>LearningPath AI</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REACT CHECKOUT OVERLAY MODAL */}
      {isCheckoutOpen && (
        <div 
          className="modal-overlay d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            animation: 'fade-in 0.3s ease'
          }}
        >
          <div 
            className="glass-card" 
            style={{
              maxWidth: '450px',
              width: '90%',
              margin: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative'
            }}
          >
            {/* Confetti pieces renderer */}
            {confetti.map((c) => (
              <div 
                key={c.id}
                className="confetti-piece"
                style={{
                  position: 'absolute',
                  width: c.width,
                  height: c.height,
                  backgroundColor: c.color,
                  left: c.left,
                  top: '-20px',
                  borderRadius: '3px',
                  zIndex: 9999,
                  animation: `confetti-fall ${c.duration} linear ${c.delay} forwards`
                }}
              />
            ))}

            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white fw-bold m-0">Secure Upgrade Payment</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setIsCheckoutOpen(false)}
                disabled={checkoutStep === 'loading'}
              ></button>
            </div>

            {/* Checkout: Form Step */}
            {checkoutStep === 'form' && (
              <div>
                {/* Credit Card Visualizer */}
                <div className="mb-4">
                  <div className="credit-card-wrapper">
                    <div className={`credit-card ${isCardFlipped ? 'flipped' : ''}`}>
                      {/* Front face */}
                      <div className="card-face front">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="card-chip"></div>
                          <i className="bi bi-credit-card-2-front" style={{ fontSize: '24px' }}></i>
                        </div>
                        <div className="card-number-display">{cardNumber || '•••• •••• •••• ••••'}</div>
                        <div className="d-flex justify-content-between align-items-end mt-3">
                          <div>
                            <div className="card-label">Card Holder</div>
                            <div className="card-value">{cardName || 'JOHN DOE'}</div>
                          </div>
                          <div className="text-end">
                            <div className="card-label">Expires</div>
                            <div className="card-value">{cardExpiry || 'MM/YY'}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Back face */}
                      <div className="card-face back">
                        <div className="card-magnetic-strip"></div>
                        <div className="card-signature-area mt-3">
                          <div className="card-signature-bar"></div>
                          <div className="card-cvc-display">{cardCvc || '•••'}</div>
                        </div>
                        <div className="text-end small opacity-50 pe-3 mt-2" style={{ fontSize: '9px' }}>SECURE PAYMENT GATEWAY</div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={processUpgradeSubmit}>
                  <div className="mb-3 text-start">
                    <label className="form-label small text-white-50">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="Name on card"
                      required 
                    />
                  </div>
                  <div className="mb-3 text-start">
                    <label className="form-label small text-white-50">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={cardNumber} 
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000" 
                      maxLength="19"
                      required 
                    />
                  </div>
                  <div className="row text-start">
                    <div className="col-6 mb-3">
                      <label className="form-label small text-white-50">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={cardExpiry} 
                        onChange={handleExpiryChange}
                        placeholder="MM/YY" 
                        maxLength="5"
                        required 
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small text-white-50">CVC</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={cardCvc} 
                        onChange={handleCvcChange}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        placeholder="CVC" 
                        maxLength="3"
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gradient w-100 py-3 mt-3 fw-bold">
                    Pay $1.00 & Upgrade
                  </button>
                </form>
              </div>
            )}

            {/* Checkout: Loading Step */}
            {checkoutStep === 'loading' && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary-light mb-4" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="fw-bold text-white">Processing secure payment...</h4>
                <p className="text-white-50">{loadingText}</p>
              </div>
            )}

            {/* Checkout: Success Step */}
            {checkoutStep === 'success' && (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4.5rem' }}></i>
                </div>
                <h3 className="fw-bold text-success mb-2">Payment Successful!</h3>
                <h5 className="text-white mb-3">Welcome to Pro Path!</h5>
                <p className="text-white-50 px-3 mb-4">Your account has been successfully upgraded to Pro. Enjoy unlimited AI Study Copilot, verified certifications, and priority features.</p>
                <button 
                  type="button" 
                  className="btn btn-gradient py-2 px-5" 
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Start Learning
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default DemoHub;
