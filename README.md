# 🚀 ShareUpTime Social Media Platform

## 📱 Complete Full-Stack Social Media Solution

ShareUpTime is a comprehensive social media platform with both **backend API** and **mobile application** components, designed for modern social networking with features like posts, stories, messaging, groups, and real-time interactions.

### 🏗️ Project Structure

```bash
shareuptime-social-media/
├── backend/                 # 🖥️ Node.js TypeScript API Server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   ├── dist/                # Compiled JavaScript
│   └── node_modules/        # Dependencies
└── mobile-app/              # 📱 React Native Mobile App
    ├── app/
    │   ├── components/      # UI components
    │   ├── screens/         # App screens
    │   ├── navigation/      # Navigation setup
    │   ├── redux/           # State management
    │   ├── services/        # API services
    │   ├── assets/          # Images, icons
    │   └── config/          # App configuration
    ├── android/             # Android build files
    ├── ios/                 # iOS build files
    └── node_modules/        # Dependencies
```

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (primary) + MongoDB (fallback)
- **Cache**: Redis (with in-memory fallback)
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO WebSocket
- **File Upload**: Multer + Sharp image processing
- **Email**: Nodemailer integration
- **API Documentation**: Comprehensive endpoint docs

### Mobile App

- **Framework**: React Native 0.74.5
- **Language**: TypeScript + JavaScript hybrid
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation v6
- **UI Components**: 110+ custom components
- **Screens**: 52 navigation screens
- **Assets**: 116 optimized media files
- **API Integration**: Real-time backend communication
- **Media**: Image picker and upload capabilities
- **Build**: Android & iOS production ready

## 🌟 Key Features

### 🔐 Authentication & User Management

- User registration and login
- JWT token-based authentication
- Profile management with image uploads
- Password reset and email verification
- Secure session management

### 📝 Social Features

- Create and share posts with images/videos
- Like, comment, and share functionality
- User-to-user following system
- Feed algorithms and content discovery
- Story creation and viewing

### 💬 Messaging System

- Real-time chat messaging
- Group conversations
- Media sharing in messages
- Message status indicators
- Conversation management

### 👥 Groups & Communities

- Create and join groups
- Group-specific posting and discussions
- Admin and moderation features
- Event planning and coordination
- Group discovery and recommendations

### 🎥 Media & Content

- Image and video uploads
- Automatic image optimization
- Multiple image formats support
- File size management
- Media galleries and albums

### 🔄 Real-time Features

- Live notifications
- WebSocket connections
- Instant message delivery
- Real-time post interactions
- User online status
- Live activity feeds

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ (Backend)
- React Native CLI (Mobile)
- PostgreSQL database
- Redis cache (optional)
- Domain and SSL certificate

### Backend Deployment

1. **Environment Setup**:
   ```bash
   npm install
   npm run build
   ```

2. **Database Configuration**:
   - PostgreSQL primary database
   - MongoDB fallback support
   - Redis cache optimization

3. **Production Start**:
   ```bash
   npm start
   ```

### Mobile App Deployment

1. **Android Build**:
   ```bash
   npx react-native build-android --mode=release
   ```

2. **iOS Build**:
   ```bash
   npx react-native build-ios --mode=Release
   ```

## 📊 Project Statistics

- **Total Components**: 110+ UI/UX components
- **Screen Count**: 52 navigation screens  
- **Asset Files**: 116 optimized media assets
- **Backend Endpoints**: 25+ REST API endpoints
- **WebSocket Events**: 15+ real-time events
- **Database Tables**: 12 core data models
- **Test Coverage**: API integration tests included

## 🔧 Development Commands

### Backend Development

```bash
cd backend
npm install
npm run dev          # Development server
npm run build        # Production build
npm start           # Production server
npm test            # Run tests
```

### Mobile Development

```bash
cd mobile-app
npm install
npx react-native start     # Metro bundler
npx react-native run-android   # Android development
npx react-native run-ios       # iOS development
npm run build              # Production build
```

## 📞 Contact & Support

- **Email**: `shareuptimex@gmail.com`
- **Repository**: `https://github.com/Shareup-dev/shareuptime-social-media`
- **Developer**: ShareUpTime Team
- **License**: Private/Commercial
- **Version**: 2.0.0 (October 2025)

## 🎯 Current Status

✅ **Production Ready** - Full-stack platform ready for deployment
✅ **Mobile Apps** - Android & iOS build-ready
✅ **Backend API** - Complete RESTful services
✅ **Real-time** - WebSocket integration active
✅ **Database** - PostgreSQL schema deployed
✅ **Documentation** - Comprehensive guides included

**ShareUpTime** - Connecting people, sharing moments, building communities 🌟