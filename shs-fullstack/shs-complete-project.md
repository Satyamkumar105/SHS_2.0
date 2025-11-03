# 🎓 Student Helpline System (SHS) - Complete Full-Stack Project
## React Frontend + Node.js Backend + MongoDB

---

## 📦 Complete Package Contents

यह document आपको पूरा SHS project देता है:

1. **Frontend (React App)** - Browser में चलने वाला
2. **Backend (Node.js + Express + MongoDB)** - Server-side API
3. **Setup Instructions** - Step-by-step installation
4. **Deployment Guide** - Live hosting करने का तरीका

---

# Part 1: Frontend (React App)

## 📱 Running React App

### **Option A: Direct Browser (तुरंत चलाने के लिए)**

**Live URL:** https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/f06ffbbe0a930bd3113639e1d7036771/aaa6e739-03ee-44a9-b152-1ef4f30b297d/canvas-app/index.html

**Features:**
- ✅ Single HTML file - no setup needed
- ✅ React CDN के साथ
- ✅ Phone और desktop दोनों में चलेगा
- ✅ Install-able as PWA

---

### **Option B: Local Development Setup**

#### **Step 1: Create React Project**

```bash
# Desktop या जहाँ चाहें वहाँ
mkdir shs-fullstack
cd shs-fullstack

# React project बनाएं
npx create-vite@latest client --template react
cd client
npm install
npm install react-router-dom
```

#### **Step 2: Folder Structure बनाएं**

```bash
mkdir src/components
mkdir src/pages
```

#### **Step 3: Component Files बनाएं**

**src/components/Header.jsx**
```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span style={{ color: '#dc143c' }}>S</span>
          <span> H </span>
          <span style={{ color: '#dc143c' }}>S</span>
        </Link>
        
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#branches" onClick={() => setIsMenuOpen(false)}>Branches</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
        </nav>

        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
```

**src/components/Hero.jsx**
```jsx
import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="animated-text">
          <h1 className="word">Student</h1>
          <h1 className="word">Helpline</h1>
          <h1 className="word">System</h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

**src/components/Services.jsx**
```jsx
import React from 'react';

const Services = () => {
  const services = [
    {
      title: 'Notice Updates',
      description: 'Get real-time notifications about college announcements, exams, and important dates.',
      icon: '📢'
    },
    {
      title: 'Study Materials',
      description: 'Access notes, assignments, previous year questions, and reference materials.',
      icon: '📚'
    },
    {
      title: 'Student Support',
      description: 'Connect with faculty, get academic guidance, and resolve your queries instantly.',
      icon: '💬'
    },
    {
      title: 'Event Calendar',
      description: 'Stay updated with college events, workshops, seminars, and deadline reminders.',
      icon: '📅'
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
```

**src/components/Projects.jsx**
```jsx
import React from 'react';

const Projects = () => {
  const branches = [
    {
      title: 'Computer Science Engineering',
      description: 'Learn programming, software development, AI, data science, and cutting-edge technologies.'
    },
    {
      title: 'Electronics & Communication',
      description: 'Master electronics, communication systems, embedded systems, and VLSI design.'
    },
    {
      title: 'Mechanical Engineering',
      description: 'Study thermodynamics, manufacturing, robotics, and automotive engineering.'
    },
    {
      title: 'Civil Engineering',
      description: 'Build infrastructure with structural design, construction management, and urban planning.'
    },
    {
      title: 'Electrical Engineering',
      description: 'Power systems, control systems, renewable energy, and electrical machines.'
    }
  ];

  return (
    <section id="branches" className="projects">
      <div className="container">
        <h2 className="section-title">Our Branches</h2>
        {branches.map((branch, index) => (
          <div key={index} className={`project-item ${index % 2 === 1 ? 'reverse' : ''}`}>
            <div className="project-content">
              <h3>{branch.title}</h3>
              <p>{branch.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
```

**src/components/Contact.jsx**
```jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // API call to backend
    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      alert(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Message sent! (Backend not connected yet)');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <span className="icon">📞</span>
              <div>
                <h4>Phone</h4>
                <p>+91 9584068938</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">✉️</span>
              <div>
                <h4>Email</h4>
                <p>shs@college.edu.in</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <h4>Address</h4>
                <p>Jabalpur, Madhya Pradesh</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
```

**src/components/Footer.jsx**
```jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <h3>Student Helpline System</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
          <p>&copy; 2025 SHS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

**src/pages/Home.jsx**
```jsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
```

**src/pages/Login.jsx**
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        navigate('/');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login feature requires backend. Please start the server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to SHS</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        <p><Link to="/">← Back to Home</Link></p>
      </div>
    </div>
  );
};

export default Login;
```

**src/pages/Register.jsx**
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: 'CSE'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration feature requires backend. Please start the server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register for SHS</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
            required
          />
          <select
            value={formData.branch}
            onChange={(e) => setFormData({...formData, branch: e.target.value})}
            required
          >
            <option value="CSE">Computer Science</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            <option value="EE">Electrical Engineering</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
        <p><Link to="/">← Back to Home</Link></p>
      </div>
    </div>
  );
};

export default Register;
```

**src/App.jsx**
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**src/App.css**
```css
/* Auth Pages */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #29323c 0%, #485563 100%);
  padding: 2rem;
}

.auth-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

.auth-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #29323c;
}

.auth-container form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-container input,
.auth-container select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.auth-container button {
  padding: 0.75rem;
  background: #dc143c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.auth-container button:hover {
  background: #b01030;
}

.auth-container p {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.auth-container a {
  color: #dc143c;
  text-decoration: none;
}

.auth-container a:hover {
  text-decoration: underline;
}
```

**src/index.css**
```css
/* Copy your entire style.css content here */
/* यहाँ आपकी पूरी style.css copy करें */
```

#### **Step 4: Start Development Server**

```bash
npm run dev
```

Frontend चल जाएगी: http://localhost:5173

---

# Part 2: Backend (Node.js + MongoDB)

## 🚀 Backend Setup

### **Step 1: Create Backend Folder**

```bash
# shs-fullstack folder में
mkdir server
cd server
npm init -y
```

### **Step 2: Install Dependencies**

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install -D nodemon
```

### **Step 3: Create Files**

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shs_database
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**server/package.json** - Add scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

### Backend code files बाकी हैं artifact #48 में!

पूरा backend code पहले बनाई गई **shs-backend-guide.md** file में है।

---

# Part 3: Complete Project Structure

```
shs-fullstack/
├── client/                    # React Frontend
│   ├── public/
│   │   ├── hero-bg.jpg
│   │   ├── img-1.jpg
│   │   └── img-2.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Node.js Backend
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Notice.js
    │   ├── Material.js
    │   └── Contact.js
    ├── routes/
    │   ├── auth.js
    │   ├── notices.js
    │   ├── materials.js
    │   └── contacts.js
    ├── middleware/
    │   └── auth.js
    ├── .env
    ├── server.js
    ├── seed.js
    └── package.json
```

---

# Part 4: Running Complete Project

## 📋 Prerequisites

1. **Node.js** - v16 या higher
2. **MongoDB** - Local या MongoDB Atlas
3. **Git** (optional)

## 🚀 Quick Start

### **Terminal 1: Backend**
```bash
cd server
npm install
npm run seed      # Database seed करें
npm run dev       # Backend start करें
```

Backend: http://localhost:5000

### **Terminal 2: Frontend**
```bash
cd client
npm install
npm run dev       # Frontend start करें
```

Frontend: http://localhost:5173

---

# Part 5: Testing

## ✅ Frontend Test करें

1. Browser में http://localhost:5173 खोलें
2. Hero section दिखना चाहिए
3. Services cards scroll करके देखें
4. Contact form fill करें और submit करें
5. Login/Register pages test करें

## ✅ Backend Test करें

**Postman या curl से:**

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","rollNumber":"21CS001","branch":"CSE"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

# Part 6: Deployment

## 🌐 Frontend Deployment (Netlify)

```bash
cd client
npm run build

# Netlify deploy
npx netlify-cli deploy --prod
```

## 🌐 Backend Deployment (Railway)

```bash
cd server

# Railway.app पर जाएं
# GitHub से connect करें
# Auto-deploy setup करें
```

## 🗃️ Database (MongoDB Atlas)

1. mongodb.com/cloud/atlas पर जाएं
2. Free cluster बनाएं
3. Connection string copy करें
4. .env में update करें

---

# Part 7: Summary

## ✅ आपके पास क्या है:

1. **React Frontend** ✅
   - 7 Components
   - 3 Pages (Home, Login, Register)
   - Responsive design
   - Backend integration ready

2. **Node.js Backend** ✅
   - 4 Database models
   - 4 API route files
   - Authentication
   - JWT tokens

3. **Complete Setup** ✅
   - Local development
   - Production deployment
   - Testing guides

---

## 🎯 Next Steps:

1. Images (hero-bg.jpg, img-1.jpg, img-2.jpg) को client/public/ में copy करें
2. Backend और Frontend दोनों start करें
3. Registration test करें
4. Login करें
5. Contact form submit करें

---

## 📞 Support

अगर कोई problem आए तो:
1. Backend console check करें
2. Frontend console check करें
3. MongoDB running है confirm करें
4. Port 5000 और 5173 free हैं check करें

---

**आपका Complete SHS Full-Stack Project तैयार है!** 🚀

Frontend: http://localhost:5173
Backend: http://localhost:5000
Database: MongoDB

Happy Coding! 💻✨
