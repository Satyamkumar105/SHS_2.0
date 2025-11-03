# Student Helpline System (SHS) - Complete Backend Guide
## Node.js + Express + MongoDB

---

## 📂 Project Structure

```
shs-fullstack/
├── client/                    # Your React App (already created)
│   └── index.html
├── server/                    # Backend (we're creating this)
│   ├── models/
│   │   ├── User.js
│   │   ├── Notice.js
│   │   ├── Material.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notices.js
│   │   ├── materials.js
│   │   └── contacts.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🚀 Setup Steps

### Step 1: Create Backend Folder

```bash
# Create server folder
mkdir server
cd server

# Initialize npm
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install -D nodemon
```

### Step 3: Create Environment File

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shs_database
JWT_SECRET=your_secret_key_change_in_production_12345
NODE_ENV=development
```

---

## 📁 Backend Files

### 1. Database Configuration

**server/config/db.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 2. Database Models

**server/models/User.js**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EE']
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

**server/models/Notice.js**
```javascript
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Academic', 'Event', 'Exam', 'Holiday', 'Urgent']
  },
  branch: {
    type: String,
    enum: ['All', 'CSE', 'ECE', 'ME', 'CE', 'EE'],
    default: 'All'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    filename: String,
    url: String
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
```

**server/models/Material.js**
```javascript
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EE']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  type: {
    type: String,
    required: true,
    enum: ['Notes', 'Assignment', 'PYQ', 'Reference', 'Book', 'Other']
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', materialSchema);
```

**server/models/Contact.js**
```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
```

---

### 3. Authentication Middleware

**server/middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
```

---

### 4. API Routes

**server/routes/auth.js**
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, branch } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { rollNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or roll number already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      branch
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rollNumber: req.user.rollNumber,
        branch: req.user.branch,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**server/routes/notices.js**
```javascript
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { auth, authorize } = require('../middleware/auth');

// Get all notices
router.get('/', async (req, res) => {
  try {
    const { branch, category } = req.query;
    
    let filter = { isActive: true };
    
    if (branch && branch !== 'All') {
      filter.$or = [{ branch: 'All' }, { branch }];
    }
    
    if (category) {
      filter.category = category;
    }

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notice (Faculty/Admin only)
router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      postedBy: req.user._id
    });

    await notice.save();
    await notice.populate('postedBy', 'name role');

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update notice
router.put('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name role');

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notice
router.delete('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**server/routes/materials.js**
```javascript
const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { auth, authorize } = require('../middleware/auth');

// Get all materials
router.get('/', async (req, res) => {
  try {
    const { branch, semester, subject, type } = req.query;
    
    let filter = { isApproved: true };
    
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload material
router.post('/', auth, async (req, res) => {
  try {
    const material = new Material({
      ...req.body,
      uploadedBy: req.user._id,
      isApproved: req.user.role === 'faculty' || req.user.role === 'admin'
    });

    await material.save();
    await material.populate('uploadedBy', 'name');

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**server/routes/contacts.js**
```javascript
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth, authorize } = require('../middleware/auth');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      userId: req.body.userId || null
    });

    await contact.save();

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact status
router.patch('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### 5. Main Server File

**server/server.js**
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/contacts', require('./routes/contacts'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
```

---

### 6. Package.json Scripts

**server/package.json** - Add these scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

---

## 🌱 Database Seeding

**server/seed.js**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Notice = require('./models/Notice');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Notice.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shs.edu.in',
      password: hashedPassword,
      rollNumber: 'ADMIN001',
      branch: 'CSE',
      role: 'admin',
      isVerified: true
    });

    // Create sample notices
    const notices = [
      {
        title: 'Mid-Semester Exam Schedule',
        description: 'Mid-semester examinations will be conducted from 15th to 20th December 2025.',
        category: 'Exam',
        branch: 'All',
        postedBy: admin._id,
        priority: 'High'
      },
      {
        title: 'Workshop on AI and Machine Learning',
        description: 'A workshop on AI/ML will be organized by CSE department on 10th December.',
        category: 'Event',
        branch: 'CSE',
        postedBy: admin._id,
        priority: 'Medium'
      }
    ];

    await Notice.insertMany(notices);

    console.log('✅ Database seeded successfully!');
    console.log('Admin credentials: admin@shs.edu.in / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
```

---

## 🚀 Running the Backend

```bash
# 1. Start MongoDB (make sure it's installed)
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 2. Go to server folder
cd server

# 3. Install dependencies (if not done)
npm install

# 4. Seed the database
npm run seed

# 5. Start development server
npm run dev
```

Server will run on: **http://localhost:5000**

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (faculty/admin)
- `PUT /api/notices/:id` - Update notice (faculty/admin)
- `DELETE /api/notices/:id` - Delete notice (faculty/admin)

### Materials
- `GET /api/materials` - Get all study materials
- `POST /api/materials` - Upload material
- `POST /api/materials/:id/download` - Increment download count

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin)
- `PATCH /api/contacts/:id` - Update status (admin)

---

## 🧪 Testing with Postman

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Satyam Kumar",
  "email": "satyam@student.edu.in",
  "password": "password123",
  "rollNumber": "21CS001",
  "branch": "CSE"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "satyam@student.edu.in",
  "password": "password123"
}
```

### 3. Get Notices
```
GET http://localhost:5000/api/notices?branch=CSE
```

---

## 🔗 Connecting Frontend to Backend

Update your React Contact component to connect to API:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    alert(data.message);
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    alert('Error sending message. Please try again.');
  }
};
```

---

## 📦 Production Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create shs-backend

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

### Environment Variables on Heroku
```bash
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production
```

---

## ✅ Features

- ✅ User Authentication (JWT)
- ✅ Role-based Access Control
- ✅ Notice Management
- ✅ Study Material Management
- ✅ Contact Form Handling
- ✅ MongoDB Database
- ✅ RESTful API
- ✅ Error Handling
- ✅ CORS Support
- ✅ Password Encryption

---

## 🎯 Next Steps

1. Add file upload (using Multer + Cloudinary)
2. Implement email notifications
3. Add real-time updates (Socket.io)
4. Create admin dashboard
5. Add pagination
6. Implement search functionality

Your complete SHS backend is now ready! 🚀
