import React, { useState, useEffect, useRef } from 'react';
import './UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'post', 'myissues'
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: '',
    location: {
      address: '',
      coordinates: { latitude: null, longitude: null },
      city: '',
      state: '',
      pincode: ''
    },
    images: []
  });
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageError, setImageError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Location-related state
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const categories = [
    'Infrastructure',
    'Transportation', 
    'Environment',
    'Public Safety',
    'Sanitation',
    'Parks & Recreation',
    'Public Health',
    'Technology',
    'Other'
  ];

  // State for location filtering info
  const [locationInfo, setLocationInfo] = useState(null);
  const [totalIssues, setTotalIssues] = useState(0);

  // Fetch all issues
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://civicsense-backend-9oc8.onrender.com/api/issues', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setIssues(data.data.issues);
        setTotalIssues(data.data.total);
        
        // Store location filtering information
        if (data.data.userLocation) {
          setLocationInfo(data.data.userLocation);
        } else if (data.data.originalTotal) {
          setTotalIssues(data.data.originalTotal);
        }
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle image file selection
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImageError('');

    if (files.length < 2) {
      setImageError('Please select at least 2 images as proof');
      return;
    }

    if (files.length > 5) {
      setImageError('Maximum 5 images are allowed');
      return;
    }

    // Validate each file
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setImageError(`File "${file.name}" has invalid format. Only JPEG, PNG, and WebP are allowed.`);
        return;
      }

      if (file.size > maxSize) {
        setImageError(`File "${file.name}" is too large. Maximum size is 2MB.`);
        return;
      }

      validFiles.push(file);
    }

    setImageFiles(validFiles);
    processImages(validFiles);
  };

  // Convert images to base64
  const processImages = async (files) => {
    setUploadingImages(true);
    const processedImages = [];

    for (const file of files) {
      try {
        const base64 = await convertToBase64(file);
        processedImages.push({
          data: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
          filename: file.name,
          mimetype: file.type,
          size: file.size
        });
      } catch (error) {
        setImageError(`Error processing ${file.name}: ${error.message}`);
        setUploadingImages(false);
        return;
      }
    }

    setNewIssue(prev => ({
      ...prev,
      images: processedImages
    }));
    setUploadingImages(false);
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleUpvote = async (issueId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://civicsense-backend-9oc8.onrender.com/api/issues/${issueId}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchIssues(); // Refresh issues
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  // Handle downvote
  const handleDownvote = async (issueId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://civicsense-backend-9oc8.onrender.com/api/issues/${issueId}/downvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchIssues(); // Refresh issues
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error downvoting:', error);
    }
  };

  // Handle report issue
  const handleReportIssue = async (issueId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://civicsense-backend-9oc8.onrender.com/api/issues/${issueId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: reportReason })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Issue reported successfully');
        setShowReportModal(null);
        setReportReason('');
        fetchIssues(); // Refresh issues
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
    }
  };

  // Handle add comment
  const handleAddComment = async (issueId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://civicsense-backend-9oc8.onrender.com/api/issues/${issueId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: newComment })
      });
      
      const data = await response.json();
      if (data.success) {
        setNewComment('');
        setShowCommentModal(null);
        fetchIssues(); // Refresh issues
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Location Services using OpenStreetMap Nominatim API
  
  // Get current location using browser geolocation
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates using reverse geocoding
      const address = await reverseGeocode(latitude, longitude);
      
      setNewIssue(prev => ({
        ...prev,
        location: {
          ...address,
          coordinates: { latitude, longitude }
        }
      }));
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  // Reverse geocoding - convert coordinates to address
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CivicSense-App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      return {
        address: data.display_name || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        pincode: data.address?.postcode || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        address: `Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        city: '',
        state: '',
        pincode: ''
      };
    }
  };

  // Search for addresses using forward geocoding
  const searchAddresses = async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'CivicSense-App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search addresses');
      }
      
      const data = await response.json();
      
      const suggestions = data.map(item => ({
        display_name: item.display_name,
        address: {
          address: item.display_name,
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          pincode: item.address?.postcode || ''
        },
        coordinates: {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        }
      }));
      
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Address search error:', error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  // Handle location input change with debouncing
  const handleLocationChange = (value) => {
    setNewIssue(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: value
      }
    }));
    
    // Debounce the search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };

  // Select a location from suggestions
  const selectLocation = (suggestion) => {
    setNewIssue(prev => ({
      ...prev,
      location: {
        address: suggestion.address.address,
        city: suggestion.address.city,
        state: suggestion.address.state,
        pincode: suggestion.address.pincode,
        coordinates: suggestion.coordinates
      }
    }));
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  // Add ref for debouncing
  const searchTimeoutRef = useRef(null);

  // Handle post new issue
  const handlePostIssue = async (e) => {
    e.preventDefault();
    
    if (!newIssue.title || !newIssue.description || !newIssue.category || !newIssue.location.address) {
      alert('Please fill in all fields including location');
      return;
    }

    if (!newIssue.images || newIssue.images.length < 2) {
      alert('Please upload at least 2 images as proof of the issue');
      return;
    }

    if (uploadingImages) {
      alert('Please wait for images to finish processing');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://civicsense-backend-9oc8.onrender.com/api/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIssue)
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Issue posted successfully!');
        setNewIssue({ 
          title: '', 
          description: '', 
          category: '', 
          location: {
            address: '',
            coordinates: { latitude: null, longitude: null },
            city: '',
            state: '',
            pincode: ''
          }, 
          images: [] 
        });
        setImageFiles([]);
        setImageError('');
        setActiveTab('browse'); // Switch to browse tab
        fetchIssues(); // Refresh issues
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error posting issue:', error);
    }
  };

  // Get user's own issues
  const myIssues = issues.filter(issue => 
    issue.reportedBy && issue.reportedBy._id === user.id
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      case 'Rejected': return 'status-rejected';
      default: return 'status-open';
    }
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏛️ CivicSense - User Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 Browse Issues
        </button>
        <button 
          className={`tab ${activeTab === 'post' ? 'active' : ''}`}
          onClick={() => setActiveTab('post')}
        >
          ➕ Post Issue
        </button>
        <button 
          className={`tab ${activeTab === 'myissues' ? 'active' : ''}`}
          onClick={() => setActiveTab('myissues')}
        >
          📋 My Issues ({myIssues.length})
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {/* Browse Issues Tab */}
        {activeTab === 'browse' && (
          <div className="browse-issues">
            <h2>Community Issues</h2>
            
            {/* Location Info Banner */}
            {locationInfo && (
              <div className="location-info-banner">
                <div className="location-info-content">
                  <div className="location-icon">📍</div>
                  <div className="location-text">
                    <strong>Your Area:</strong> {locationInfo.city}, {locationInfo.state}
                    <br />
                    <small>
                      Showing issues within {locationInfo.serviceRadius}km of your location 
                      ({issues.length} of {totalIssues} total issues)
                    </small>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="loading">Loading issues...</div>
            ) : (
              <div className="issues-grid">
                {issues.map(issue => (
                  <div key={issue._id} className="issue-card">
                    <div className="issue-header">
                      <h3>{issue.title}</h3>
                      <span className={`status ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    
                    <p className="issue-description">{issue.description}</p>
                    
                    <div className="issue-meta">
                      <span className="category">📂 {issue.category}</span>
                      <span className="location">📍 {issue.location.address || issue.location}</span>
                      <span className="date">📅 {formatDate(issue.createdAt)}</span>
                      <span className="author">👤 {issue.reportedBy?.name || 'Anonymous'}</span>
                    </div>

                    {/* Voting and Actions */}
                    <div className="issue-actions">
                      <div className="voting">
                        <button 
                          className="vote-btn upvote"
                          onClick={() => handleUpvote(issue._id)}
                        >
                          👍 {issue.upvotes || 0}
                        </button>
                        <button 
                          className="vote-btn downvote"
                          onClick={() => handleDownvote(issue._id)}
                        >
                          👎 {issue.downvotes || 0}
                        </button>
                      </div>
                      
                      <div className="action-buttons">
                        <button 
                          className="action-btn comment"
                          onClick={() => setShowCommentModal(issue._id)}
                        >
                          💬 Comment ({issue.comments?.length || 0})
                        </button>
                        <button 
                          className="action-btn report"
                          onClick={() => setShowReportModal(issue._id)}
                        >
                          🚨 Report
                        </button>
                      </div>
                    </div>

                    {/* Comments Preview */}
                    {issue.comments && issue.comments.length > 0 && (
                      <div className="comments-preview">
                        <h4>Recent Comments:</h4>
                        {issue.comments.slice(-2).map(comment => (
                          <div key={comment._id} className="comment">
                            <strong>{comment.user?.name || 'Anonymous'}:</strong>
                            <span>{comment.comment}</span>
                            <small>{formatDate(comment.createdAt)}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Issue Tab */}
        {activeTab === 'post' && (
          <div className="post-issue">
            <h2>Post a New Issue</h2>
            <form onSubmit={handlePostIssue} className="issue-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  placeholder="Brief title of the issue"
                  maxLength="200"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <div className="location-input-group">
                  <div className="location-input-container">
                    <input
                      type="text"
                      value={newIssue.location.address}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      placeholder="Enter address or location of the issue"
                      className="location-input"
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="current-location-btn"
                      title="Use current location"
                    >
                      {locationLoading ? '📍⏳' : '📍'}
                    </button>
                  </div>
                  
                  {locationError && (
                    <div className="location-error">
                      ⚠️ {locationError}
                    </div>
                  )}
                  
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="location-suggestions">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="location-suggestion"
                          onClick={() => selectLocation(suggestion)}
                        >
                          <div className="suggestion-main">{suggestion.display_name}</div>
                          {suggestion.address.city && (
                            <div className="suggestion-details">
                              {suggestion.address.city}, {suggestion.address.state} {suggestion.address.pincode}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {newIssue.location.coordinates.latitude && (
                    <div className="location-details">
                      <small>
                        📍 Coordinates: {newIssue.location.coordinates.latitude.toFixed(6)}, {newIssue.location.coordinates.longitude.toFixed(6)}
                        {newIssue.location.city && ` • ${newIssue.location.city}, ${newIssue.location.state}`}
                      </small>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  placeholder="Detailed description of the issue"
                  maxLength="1000"
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label>Upload Images * (At least 2 images required as proof)</label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="image-upload-input"
                />
                <div className="image-upload-info">
                  <small>• Minimum 2 images, maximum 5 images</small>
                  <small>• Formats: JPEG, PNG, WebP</small>
                  <small>• Maximum size: 2MB per image</small>
                </div>
                
                {imageError && (
                  <div className="error-message">
                    {imageError}
                  </div>
                )}
                
                {uploadingImages && (
                  <div className="uploading-message">
                    📤 Processing images...
                  </div>
                )}
                
                {imageFiles.length > 0 && (
                  <div className="selected-images">
                    <h4>Selected Images ({imageFiles.length}):</h4>
                    <div className="image-preview-list">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="image-preview-item">
                          <span className="file-name">📷 {file.name}</span>
                          <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={uploadingImages || (newIssue.images && newIssue.images.length < 2)}
              >
                {uploadingImages ? '📤 Processing Images...' : '🚨 Post Issue'}
              </button>
            </form>
          </div>
        )}

        {/* My Issues Tab */}
        {activeTab === 'myissues' && (
          <div className="my-issues">
            <h2>My Posted Issues</h2>
            {myIssues.length === 0 ? (
              <p className="no-issues">You haven't posted any issues yet.</p>
            ) : (
              <div className="issues-grid">
                {myIssues.map(issue => (
                  <div key={issue._id} className="issue-card my-issue">
                    <div className="issue-header">
                      <h3>{issue.title}</h3>
                      <span className={`status ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    
                    <p className="issue-description">{issue.description}</p>
                    
                    <div className="issue-meta">
                      <span className="category">📂 {issue.category}</span>
                      <span className="location">📍 {issue.location.address || issue.location}</span>
                      <span className="date">📅 {formatDate(issue.createdAt)}</span>
                    </div>

                    <div className="issue-stats">
                      <span>👍 {issue.upvotes || 0} upvotes</span>
                      <span>👎 {issue.downvotes || 0} downvotes</span>
                      <span>💬 {issue.comments?.length || 0} comments</span>
                      <span>🚨 {issue.reports?.length || 0} reports</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Comment</h3>
              <button onClick={() => setShowCommentModal(null)}>✕</button>
            </div>
            <div className="modal-content">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows="4"
                maxLength="500"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCommentModal(null)}>Cancel</button>
              <button onClick={() => handleAddComment(showCommentModal)}>
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Report Issue</h3>
              <button onClick={() => setShowReportModal(null)}>✕</button>
            </div>
            <div className="modal-content">
              <p>Why are you reporting this issue?</p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting (e.g., false information, spam, inappropriate content)"
                rows="3"
                maxLength="200"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowReportModal(null)}>Cancel</button>
              <button 
                onClick={() => handleReportIssue(showReportModal)}
                className="report-btn"
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
