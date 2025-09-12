# 🌍 CivicSense: Crowdsourced Civic Issue Reporting System

CivicSense is a full-stack web application that enables citizens to report, track, and manage civic issues in their community.  
It empowers people to highlight problems like potholes, garbage, or broken streetlights, while administrators can manage, categorize, and resolve reported issues efficiently.

---

## 🚀 Features

- 🔐 **User Authentication** – Secure login and registration (JWT-based)
- 📝 **Issue Reporting** – Submit civic issues with descriptions, categories, and images
- 🖼️ **Image Upload & Display** – Attach and view images for each issue
- 📊 **Admin Dashboard** – Manage, categorize, and update statuses of reported issues
- 👤 **User Dashboard** – Track your reported issues with real-time updates
- 📂 **Category Management** – Organize issues into categories for clarity
- 📱 **Responsive UI** – Modern and mobile-friendly interface (React + Vite)
- 🗄️ **MongoDB Database** – Secure data storage for users and issues

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

---

## 📂 Project Structure

```
CivicSense-main/
├── Backend/           # Node.js/Express backend
│   ├── models/        # Mongoose models (User, Issue)
│   ├── routes/        # API routes (auth, issues, users, admin, categories)
│   ├── middleware/    # Authentication middleware
│   ├── config/        # Database configuration
│   ├── server.js      # Main server file
│   └── ...
├── Frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── styles/      # CSS files
│   │   └── ...
│   ├── public/        # Static assets
│   └── ...
└── ...
```

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud, e.g. MongoDB Atlas)

---

### 🔧 Backend Setup
```bash
# Navigate to backend
cd CivicSense-main/Backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret

# Start backend server
npm start
```

#### Example `.env` file:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civicsense
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

### 🎨 Frontend Setup
```bash
# Navigate to frontend
cd CivicSense-main/Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

➡️ Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage

1. Register as a new user and log in.
2. Report civic issues with details and optional images.
3. Track the status of your issues on your dashboard.
4. Admins can log in to view, categorize, and resolve issues.

---

## 📸 Screenshots


Here are some previews of CivicSense in action:

- **Login Page**
 <img width="1460" height="800" alt="login" src="https://github.com/user-attachments/assets/68f45d88-3ddf-4b0c-aca9-0474d5fd524c" />

  

- **User Dashboard**  
  
<img width="1469" height="723" alt="User Dashboard" src="https://github.com/user-attachments/assets/152f510e-ef95-4265-ba64-d362cb6d420a" />


- **Report Issue Form**
 <img width="1461" height="799" alt="Report Issue" src="https://github.com/user-attachments/assets/f89efb0b-157b-4c1b-9ea3-46284190fd06" />



- **Admin Panel**

 <img width="1466" height="797" alt="Admin Panel" src="https://github.com/user-attachments/assets/dfa1d171-a66b-4a77-a440-c1b7f7d2c1ea" />

  
---

## 📡 API Endpoints (Sample)

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Log in as a user/admin    |
| GET    | `/api/issues`        | Get all issues            |
| POST   | `/api/issues`        | Report a new issue        |
| PUT    | `/api/issues/:id`    | Update issue status       |

*(Full API documentation coming soon)*

---




## 🤝 Contributing

Contributions are welcome! 🎉  
To contribute:  
1. Fork this repo  
2. Create a new branch (`git checkout -b feature-xyz`)  
3. Commit your changes (`git commit -m "Added xyz feature"`)  
4. Push to your fork (`git push origin feature-xyz`)  
5. Create a Pull Request  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/)  
- [React](https://react.dev/)  
- [MongoDB](https://www.mongodb.com/)  
- [Vite](https://vitejs.dev/)

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Issues](https://img.shields.io/github/issues/ritesh-developer/CivicSense)
![Stars](https://img.shields.io/github/stars/ritesh-developer/CivicSense)
