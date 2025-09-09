# 🚀 MongoDB Atlas Setup Instructions

## ✅ Quick Setup Checklist

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Verify your email

### Step 2: Create a Cluster
1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** as cloud provider
3. Choose region closest to you
4. Name your cluster (e.g., "CivicSense")
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `civicsense-user`
5. Password: Create a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access From Anywhere" (for development)
4. Click "Add Entry"

### Step 5: Get Connection String
1. Go to "Clusters" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

### Step 6: Configure Environment Variables
1. Copy `.env.example` to `.env` in your Backend folder
2. Replace the connection string:

```env
MONGODB_URI=mongodb+srv://civicsense-user:YOUR_PASSWORD@civicsense.xxxxx.mongodb.net/civicsense?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-12345
```

**Important**: Replace `YOUR_PASSWORD` with your actual database user password!

### Step 7: Install Dependencies
```bash
cd Backend
npm install
```

### Step 8: Start Your Server
```bash
npm run dev
```

## 🎉 Success!
If you see "✅ Connected to MongoDB Atlas successfully!" your setup is complete!

## 🔧 Troubleshooting

### Connection Issues
- **Error: Authentication failed**
  - Check username/password in connection string
  - Make sure database user exists

- **Error: Network timeout**
  - Check if your IP is whitelisted
  - Try "Allow access from anywhere"

- **Error: MONGODB_URI not found**
  - Make sure `.env` file exists in Backend folder
  - Check if MONGODB_URI is spelled correctly

### Need Help?
Check the console logs - they will guide you to the solution! 🔍
