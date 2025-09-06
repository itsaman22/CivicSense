import React, { useState } from 'react';
import './HomePage.css';
import Auth from './Auth';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  // Handle authentication success
  const handleAuthSuccess = (userData) => {
    setUser(userData.user);
    console.log('User logged in:', userData);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Civic issues data based on your requirements
  const civicIssues = [
    {
      icon: '🛣️',
      title: 'Broken Roads & Potholes',
      description: 'Major cause of accidents. In 2022, over 4,000 deaths in India were directly linked to potholes and poor road conditions.',
      category: 'infrastructure',
      urgency: 'high'
    },
    {
      icon: '💡',
      title: 'Streetlights Not Working',
      description: 'Leads to unsafe roads, especially for women and children; increases crime & accidents.',
      category: 'safety',
      urgency: 'high'
    },
    {
      icon: '🗑️',
      title: 'Garbage Not Collected',
      description: 'Causes foul smell, spread of diseases like dengue, malaria, typhoid.',
      category: 'environment',
      urgency: 'medium'
    },
    {
      icon: '💧',
      title: 'Water Leakage / Pipe Bursts',
      description: 'Wastes lakhs of liters daily and leads to water shortages.',
      category: 'infrastructure',
      urgency: 'high'
    },
    {
      icon: '🚰',
      title: 'Overflowing Sewage & Drainage',
      description: 'Breeding ground for mosquitoes, major health hazard in monsoons.',
      category: 'health',
      urgency: 'high'
    },
    {
      icon: '🚦',
      title: 'Non-functioning Traffic Signals',
      description: 'Increases road chaos and accidents.',
      category: 'transport',
      urgency: 'medium'
    }
  ];

  // Impact statistics
  const impactStats = [
    {
      icon: '🚑',
      title: 'Accidents & Injuries',
      description: 'Potholes or missing manhole covers can be fatal',
      stat: '4,000+',
      statLabel: 'deaths annually due to potholes'
    },
    {
      icon: '🦟',
      title: 'Public Health Risks',
      description: 'Garbage & sewage overflow attract mosquitoes → dengue/malaria spread',
      stat: '62M',
      statLabel: 'tons of waste generated yearly'
    },
    {
      icon: '💡',
      title: 'Safety Concerns',
      description: 'Dark streets due to broken lights → rise in thefts, harassment',
      stat: '30%',
      statLabel: 'of streetlights often non-functional'
    },
    {
      icon: '💸',
      title: 'Economic Loss',
      description: 'Wasted fuel & traffic jams due to poor road infrastructure',
      stat: '2-3',
      statLabel: 'weeks average resolution time'
    }
  ];

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">🏛️</span>
              <span className="logo-text">CivicSense</span>
            </div>
            
            <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
              <a href="#issues" className="nav-link">Issues</a>
              <a href="#impact" className="nav-link">Impact</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>

            <div className="nav-actions">
              {user ? (
                <div className="user-nav">
                  <span className="welcome-text">
                    Welcome, {user.name}! 
                    {user.role === 'admin' && <span className="admin-badge">🏛️ Admin</span>}
                  </span>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={() => setShowAuth(true)}>
                    Login
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                    Register
                  </button>
                </>
              )}
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Small Issues, Big Impact. <br />
                <span className="text-primary">Let's Fix Them Together.</span>
              </h1>
              <p className="hero-description">
                Report civic issues in your neighborhood. Track their progress. 
                Help build a better community. Your voice matters in creating positive change.
              </p>
              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => user ? console.log('Go to report') : setShowAuth(true)}
                >
                  🚨 Report Issue
                </button>
                <button 
                  className="btn btn-outline btn-lg"
                  onClick={() => user ? console.log('Go to dashboard') : setShowAuth(true)}
                >
                  📊 Track Progress
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">1,500+</span>
                  <span className="stat-label">Issues Reported</span>
                </div>
                <div className="stat">
                  <span className="stat-number">850+</span>
                  <span className="stat-label">Issues Resolved</span>
                </div>
                <div className="stat">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Cities</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="issue-preview">
                <div className="issue-card sample">
                  <div className="issue-header">
                    <span className="issue-icon">🛣️</span>
                    <span className="badge badge-open">Open</span>
                  </div>
                  <h4>Pothole on MG Road</h4>
                  <p>Deep pothole causing accidents...</p>
                  <div className="issue-footer">
                    <span>👍 23 votes</span>
                    <span>📍 Bangalore</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues Section */}
      <section id="issues" className="section issues-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>🔴 Common Civic Issues in India</h2>
            <p>These everyday problems affect millions of Indians. Help us identify and resolve them faster.</p>
          </div>
          
          <div className="grid grid-cols-3">
            {civicIssues.map((issue, index) => (
              <div key={index} className="card issue-card">
                <div className="issue-header">
                  <span className="issue-icon">{issue.icon}</span>
                  <span className={`badge badge-${issue.urgency}`}>
                    {issue.urgency === 'high' ? '🚨 Urgent' : '⚠️ Important'}
                  </span>
                </div>
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
                <div className="issue-category">
                  <span className={`category-tag category-${issue.category}`}>
                    {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="section impact-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>⚠️ What Happens When Resolution is Delayed?</h2>
            <p>Real consequences of unresolved civic issues backed by data</p>
          </div>

          <div className="grid grid-cols-2">
            {impactStats.map((impact, index) => (
              <div key={index} className="card impact-card">
                <div className="impact-visual">
                  <span className="impact-icon">{impact.icon}</span>
                  <div className="impact-stat">
                    <span className="stat-number">{impact.stat}</span>
                    <span className="stat-label">{impact.statLabel}</span>
                  </div>
                </div>
                <div className="impact-content">
                  <h3>{impact.title}</h3>
                  <p>{impact.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-section">
            <div className="cta-content text-center">
              <h3>Every Day We Wait, Problems Get Worse</h3>
              <p>Join thousands of citizens making their communities better</p>
              <div className="cta-actions">
                <button className="btn btn-success btn-lg">
                  🎯 Report. Track. Resolve.
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <h2>How CivicSense Works</h2>
            <p>Simple steps to make a big difference</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>📱 Report</h4>
                <p>Spot an issue? Take a photo and report it with location details.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>👥 Community Support</h4>
                <p>Other citizens vote and comment to show support for the issue.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>🏛️ Authority Action</h4>
                <p>Local authorities get notified and take action on high-priority issues.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>✅ Resolution</h4>
                <p>Track progress and celebrate when issues get resolved!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🗑️</div>
              <div className="stat-info">
                <h3>62 Million Tons</h3>
                <p>Waste generated yearly in India</p>
                <small>Only 70% collected, 20% processed</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <h3>4,000+ Deaths</h3>
                <p>Annually due to potholes</p>
                <small>NCRB data on road accidents</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div className="stat-info">
                <h3>30% Non-functional</h3>
                <p>Streetlights in many cities</p>
                <small>Due to poor maintenance</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>2-3 Weeks</h3>
                <p>Average resolution time</p>
                <small>If complaints get resolved at all</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-final">
        <div className="container">
          <div className="cta-final-content text-center">
            <h2>Ready to Make a Difference?</h2>
            <p>Join the movement of citizens making their communities better, one issue at a time.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg">
                🚀 Get Started Today
              </button>
              <button className="btn btn-outline btn-lg">
                📖 Learn More
              </button>
            </div>
            <div className="trust-indicators">
              <span>Trusted by 10,000+ citizens</span>
              <span>•</span>
              <span>850+ issues resolved</span>
              <span>•</span>
              <span>25+ cities covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">🏛️</span>
                <span className="logo-text">CivicSense</span>
              </div>
              <p>Empowering citizens to create positive change in their communities.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#issues">Report Issue</a></li>
                <li><a href="#track">Track Issues</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Categories</h4>
              <ul>
                <li><a href="#infrastructure">Infrastructure</a></li>
                <li><a href="#transport">Transportation</a></li>
                <li><a href="#environment">Environment</a></li>
                <li><a href="#safety">Safety</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 CivicSense. Made with ❤️ for better communities.</p>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <Auth 
        show={showAuth} 
        onHide={() => setShowAuth(false)}
        onLogin={handleAuthSuccess}
      />
    </div>
  );
};

export default HomePage;
