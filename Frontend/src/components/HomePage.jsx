import React, { useState } from 'react';
import './HomePage.css';
import Auth from './Auth';

const HomePage = ({ user, onLoginSuccess, onLogout, onNavigateToDashboard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      userType: formData.get('userType'),
      city: formData.get('city'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      newsletter: formData.get('newsletter'),
      privacy: formData.get('privacy')
    };
    
    // Here you would typically send this data to your backend
    console.log('Contact form submitted:', contactData);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    e.target.reset();
  };

  // Handle authentication success
  const handleAuthSuccess = (userData, token) => {
    setShowAuth(false); // Close auth modal
    onLoginSuccess(userData.user, token); // Pass to App component
    console.log('User logged in:', userData);
  };

  // Handle navigation to dashboard
  const handleNavigateToDashboard = () => {
    if (user) {
      // This will be handled by the parent App component
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      } else {
        // For now, we'll just refresh the page to trigger the dashboard render
        window.location.reload();
      }
    } else {
      setShowAuth(true);
    }
  };

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
              <button 
                className="nav-link" 
                onClick={() => scrollToSection('issues')}
              >
                Issues
              </button>
              <button 
                className="nav-link" 
                onClick={() => scrollToSection('impact')}
              >
                Impact
              </button>
              <button 
                className="nav-link" 
                onClick={() => scrollToSection('about')}
              >
                About
              </button>
              <button 
                className="nav-link" 
                onClick={() => scrollToSection('contact')}
              >
                Contact
              </button>
            </div>

            <div className="nav-actions">
              {user ? (
                <div className="user-nav">
                  <span className="welcome-text">
                    Welcome, {user.name}! 
                    {user.role === 'admin' && <span className="admin-badge">🏛️ Admin</span>}
                    {user.role === 'user' && <span className="user-badge">👤 User</span>}
                  </span>
                  <button 
                    className="btn btn-outline" 
                    onClick={handleNavigateToDashboard}
                  >
                    Dashboard
                  </button>
                  <button className="btn btn-outline" onClick={onLogout}>
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
                  onClick={handleNavigateToDashboard}
                >
                  🚨 Report Issue
                </button>
                <button 
                  className="btn btn-outline btn-lg"
                  onClick={handleNavigateToDashboard}
                >
                  📊 {user ? 'Go to Dashboard' : 'Track Progress'}
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
      <section id="impact" className="section stats-section">
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

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>🎯 About CivicSense</h2>
            <p>Bridging the gap between citizens and government for a better India</p>
          </div>
          
          <div className="about-content">
            <div className="about-grid">
              <div className="about-text">
                <h3>Our Mission</h3>
                <p>
                  CivicSense is a revolutionary crowdsourced civic issue reporting system designed to empower 
                  every Indian citizen to create positive change in their communities. We believe that when 
                  citizens and government work together, extraordinary transformations happen.
                </p>
                
                <h3>The Problem We're Solving</h3>
                <p>
                  Every day, millions of Indians face civic issues - from broken roads that cause 4,000+ deaths 
                  annually to non-functioning streetlights that compromise safety. Traditional reporting methods 
                  are slow, inefficient, and often ignored. Citizens feel powerless, and authorities lack 
                  real-time information about ground realities.
                </p>
                
                <h3>Our Solution</h3>
                <p>
                  CivicSense creates a direct, transparent channel between citizens and government authorities. 
                  Through our platform, citizens can report issues with photo evidence, while government 
                  administrators can efficiently manage and resolve problems in their jurisdiction. Our 
                  location-based filtering ensures everyone sees only relevant issues in their area.
                </p>
              </div>
              
              <div className="about-features">
                <h3>Why Choose CivicSense?</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <div>
                      <h4>Targeted Action</h4>
                      <p>Location-based filtering ensures issues reach the right authorities</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">📸</span>
                    <div>
                      <h4>Visual Evidence</h4>
                      <p>Photo documentation provides clear proof of civic problems</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">👥</span>
                    <div>
                      <h4>Community Power</h4>
                      <p>Voting and commenting system validates and prioritizes issues</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <div>
                      <h4>Real-time Updates</h4>
                      <p>Track progress from reporting to resolution</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">🔒</span>
                    <div>
                      <h4>Secure & Transparent</h4>
                      <p>JWT authentication with complete transparency in issue tracking</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">🌍</span>
                    <div>
                      <h4>Scalable Impact</h4>
                      <p>From local neighborhoods to entire cities - built to scale</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="vision-section">
              <h3>Our Vision for India</h3>
              <p>
                We envision an India where every citizen is empowered to contribute to their community's 
                development, where government authorities have real-time access to ground realities, and 
                where civic issues are resolved efficiently through transparent, technology-driven processes. 
                Together, we're building a more responsive, accountable, and citizen-centric governance model.
              </p>
              
              <div className="team-note">
                <h4>Built by Indians, for Indians</h4>
                <p>
                  Our team understands the unique challenges of Indian civic infrastructure because we live 
                  them every day. CivicSense is designed specifically for Indian conditions, government 
                  structures, and community dynamics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>📞 Contact Us</h2>
            <p>Have questions or feedback? We'd love to hear from you!</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Get in Touch</h3>
                
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <h4>Email Us</h4>
                    <p>contact@civicsense.com</p>
                    <small>We respond within 24 hours</small>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <div>
                    <h4>Send a Message</h4>
                    <p>Use the contact form</p>
                    <small>Fill out the form and we'll get back to you</small>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">🤝</span>
                  <div>
                    <h4>Support</h4>
                    <p>Technical help & feedback</p>
                    <small>We're here to help with any questions</small>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Send us a Message</h3>
                <form className="contact-form-wrapper" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select id="subject" name="subject" required>
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="5" 
                      required 
                      placeholder="Tell us about your question or feedback..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-lg">
                    📤 Send Message
                  </button>
                </form>
              </div>
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
