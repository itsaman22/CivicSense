# 🚀 DEPLOYMENT GUIDE - Localhost URLs to Update

## Frontend Files with localhost URLs:

### 1. UserDashboard.jsx (5 instances)
- Line 51: `http://localhost:5000/api/issues` (fetch issues)
- Line 169: `http://localhost:5000/api/issues/${issueId}/upvote` (upvote)  
- Line 192: `http://localhost:5000/api/issues/${issueId}/downvote` (downvote)
- Line 215: `http://localhost:5000/api/issues/${issueId}/report` (report)
- Line 244: `http://localhost:5000/api/issues/${issueId}/comment` (comment)
- Line 449: `http://localhost:5000/api/issues` (post new issue)

### 2. AdminDashboard.jsx (2 instances)
- Line 16: `http://localhost:5000/api/issues` (fetch all issues)
- Line 49: `http://localhost:5000/api/issues/${issueId}/status` (update status)

### 3. vite.config.js (1 instance)
- Line 11: `target: 'http://localhost:5000'` (proxy configuration)

## Backend Files (Console logs only - not critical):
- Backend/server.js: Lines 54-55 (console messages)
- Backend/.env.example: Line 31 (frontend URL reference)

## 🛠️ DEPLOYMENT OPTIONS:

### Option 1: Manual Replacement (Quick & Simple)
Replace all `http://localhost:5000` with your production API URL:
- Find: `http://localhost:5000`  
- Replace: `https://your-backend-api.herokuapp.com` (or your deployment URL)

### Option 2: Use the API Config System (Recommended)
I've created `Frontend/src/config/api.js` for you. To use it:

1. **Set Environment Variable:**
   ```bash
   # Create Frontend/.env file
   VITE_API_URL=https://your-backend-api.herokuapp.com
   ```

2. **Import and use in components:**
   ```javascript
   import { buildApiUrl, API_ENDPOINTS } from '../config/api';
   
   // Instead of: 'http://localhost:5000/api/issues'
   // Use: buildApiUrl(API_ENDPOINTS.ISSUES)
   ```

### Option 3: Platform-Specific Environment Variables
Set `VITE_API_URL` in your deployment platform:

**Vercel:**
```bash
vercel env add VITE_API_URL
```

**Netlify:**
```bash
netlify env:set VITE_API_URL https://your-backend-api.herokuapp.com
```

**Railway/Heroku:**
Add in dashboard: `VITE_API_URL=https://your-backend-api.herokuapp.com`

## 🎯 RECOMMENDED QUICK FIX:

For immediate deployment, do a global find & replace:
1. Open VS Code
2. Press Ctrl+Shift+H (Find and Replace in Files) 
3. Find: `http://localhost:5000`
4. Replace: `https://YOUR-ACTUAL-BACKEND-URL.com`
5. Replace All in Frontend folder only

## 📝 IMPORTANT NOTES:

- Auth.jsx already uses relative URLs (✅ Ready for deployment)
- Backend server.js console logs don't affect functionality
- Update vite.config.js proxy for development only
- Remember to update CORS settings in backend for production domain
