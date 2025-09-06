# CivicSense Backend - Simple Version (Beginner Friendly)

This is a beginner-friendly version of the CivicSense API. Everything is kept simple and easy to understand!

## What You Need

1. **Node.js** installed on your computer
2. Basic knowledge of JavaScript
3. A code editor (like VS Code)

## Quick Start (Just 3 Steps!)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Simple Server
```bash
npm run simple
```

### Step 3: Test the API
Open your browser and go to: `http://localhost:5000`

That's it! Your API is running! 🎉

## What Can You Do?

### 1. Register a New User
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Send this data**:
```json
{
  "name": "Your Name",
  "email": "your@email.com", 
  "password": "yourpassword"
}
```

### 2. Login
- **URL**: `http://localhost:5000/api/auth/login`
- **Method**: POST
- **Send this data**:
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

### 3. View All Issues
- **URL**: `http://localhost:5000/api/issues`
- **Method**: GET
- Just visit this URL in your browser!

### 4. Create New Issue
- **URL**: `http://localhost:5000/api/issues`
- **Method**: POST
- **Send this data**:
```json
{
  "title": "Broken Traffic Light",
  "description": "The traffic light is not working",
  "category": "Infrastructure",
  "location": "Main Street"
}
```

## Test Accounts

You can use these accounts to test login:

**Admin Account:**
- Email: `admin@civic.com`
- Password: `admin123`

**Regular User:**
- Email: `user@civic.com`
- Password: `user123`

## All Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Welcome message |
| `/api/auth/register` | POST | Sign up new user |
| `/api/auth/login` | POST | User login |
| `/api/issues` | GET | See all issues |
| `/api/issues` | POST | Report new issue |
| `/api/issues/:id` | GET | Get one issue |
| `/api/categories` | GET | See all categories |
| `/api/users` | GET | See all users |
| `/api/admin/dashboard` | GET | Admin statistics |

## How to Test API (For Beginners)

### Option 1: Use Your Browser
- For GET requests, just type the URL in your browser
- Example: `http://localhost:5000/api/issues`

### Option 2: Use a Tool Like Postman
1. Download Postman (free)
2. Create new request
3. Set method (GET, POST, etc.)
4. Enter URL
5. Add JSON data if needed
6. Click Send

### Option 3: Use VS Code Extension
- Install "REST Client" extension
- Create a `.http` file
- Write your requests

## File Structure (Simple Version)

```
Backend/
├── server_simple.js          # Main server (simple version)
├── routes/
│   ├── auth_simple.js         # Login/Register (simple)
│   ├── issues_simple.js       # Issues management (simple)  
│   ├── users_simple.js        # User management (simple)
│   ├── categories_simple.js   # Categories (simple)
│   └── admin_simple.js        # Admin functions (simple)
├── middleware/
│   └── auth_simple.js         # Login checking (simple)
└── package.json               # Project info
```

## Understanding the Code

### 1. Arrays Instead of Database
We use simple JavaScript arrays to store data:
```javascript
let users = [
  { id: 1, name: "John", email: "john@email.com" }
];
```

### 2. Simple Routes
Each route is easy to understand:
```javascript
router.get('/issues', (req, res) => {
  res.json({
    success: true,
    data: { issues: issues }
  });
});
```

### 3. No Complex Authentication
Simple token checking:
```javascript
if (token.startsWith('token_')) {
  // User is logged in
}
```

## Next Steps (When You're Ready)

1. **Learn Database**: Replace arrays with real database (MongoDB, PostgreSQL)
2. **Security**: Add password hashing, better authentication
3. **Validation**: Add input validation
4. **File Upload**: Add image upload for issues
5. **Real-time**: Add websockets for live updates

## Getting Help

- Check the console for error messages
- All responses are in JSON format
- Look at the simple code - it's designed to be readable!

## Common Issues

**Port Already in Use?**
- Change PORT in `server_simple.js` from 5000 to 3001

**Can't POST Data?**
- Make sure you're sending JSON data
- Use correct headers: `Content-Type: application/json`

**Errors in Console?**
- Check that all dependencies are installed: `npm install`

---

Happy coding! 🚀 This simple version is perfect for learning the basics of building APIs!
