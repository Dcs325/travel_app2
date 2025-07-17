# Job Recommender

A comprehensive job and learning recommendation platform built with React, Firebase, and the Adzuna API. This application provides personalized job recommendations based on user profiles and integrates with real job data.

## 🚀 Features

### Authentication & User Management
- **Multi-provider authentication**: Email/password, Google, and GitHub login
- **Email verification**: Required email verification after signup
- **Forgot password flow**: Secure password reset functionality
- **Persistent sessions**: Automatic login state management

### User Profile System
- **Comprehensive profile modal**: Two-column card layout with modern design
- **Dynamic form fields**: 
  - Career level selection
  - Skills (multi-select dropdown)
  - Industry preferences
  - Location (US states + city input)
  - Salary expectations with proper input handling
  - Work preferences (remote/hybrid/onsite)
- **Real-time validation**: Form validation with user-friendly error messages

### Job Recommendations
- **Personalized recommendations**: Based on user profile data
- **Real job data**: Integration with Adzuna API for live job listings
- **Smart filtering**: Recommendations filtered by user preferences
- **Enhanced UI**: Modern card-based layout for job displays

### Learning Paths
- **Course recommendations**: Personalized learning paths based on career goals
- **Skill-based suggestions**: Courses aligned with user skill gaps
- **Progressive learning**: Structured learning paths for career advancement

### UI/UX Features
- **Modern design**: Clean, responsive interface with Tailwind CSS
- **Centered modals**: Beautiful profile modal with proper centering
- **Form enhancements**: Improved styling and user experience
- **Responsive layout**: Works seamlessly on desktop and mobile
- **Loading states**: Smooth loading indicators and transitions

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Styling**: Tailwind CSS + Custom CSS
- **Job Data**: Adzuna API
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Adzuna API credentials

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd job_recommender
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Adzuna API Configuration
VITE_ADZUNA_APP_ID=your_adzuna_app_id
VITE_ADZUNA_API_KEY=your_adzuna_api_key
```

### 4. Firebase Configuration

#### Authentication Setup
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the following providers:
   - Email/Password
   - Google
   - GitHub

#### Firestore Security Rules
Set your Firestore security rules to:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Start the development server
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## 📱 Usage Guide

### Registration & Login
1. **Sign Up**: Create an account with email/password or use social login
2. **Email Verification**: Verify your email address (required for access)
3. **Login**: Sign in with your credentials

### Profile Setup
1. **Access Profile**: Click on your profile to open the modal
2. **Complete Information**: Fill in all profile fields:
   - Career level and experience
   - Skills and industry preferences
   - Location and salary expectations
   - Work preferences
3. **Save Profile**: Your data is automatically saved to Firestore

### Job Recommendations
- View personalized job recommendations based on your profile
- Recommendations include real job data from Adzuna API
- Filter and sort options available

### Learning Paths
- Browse recommended courses and learning paths
- Track your learning progress
- Get suggestions based on your career goals

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Profile/        # User profile components
│   └── Recommendations/ # Job and course components
├── services/           # Firebase and API services
├── styles/             # CSS files
└── utils/              # Utility functions
```

### Key Components
- `UserProfileModal.jsx`: Main profile management component
- `LoginForm.jsx`: Authentication form with social login
- `SignUpForm.jsx`: Registration form with email verification
- `JobRecommendations.jsx`: Job recommendation display
- `CourseRecommendations.jsx`: Learning path recommendations

### Styling
- Tailwind CSS for utility classes
- Custom CSS files for component-specific styles
- Responsive design with mobile-first approach

## 🐛 Troubleshooting

### Common Issues

**Firebase 400 Error on Signup**
- Check if email is already registered
- Ensure password meets Firebase requirements (min 6 characters)
- Verify Firebase configuration in environment variables

**Tailwind CSS Not Working**
- Ensure PostCSS configuration is correct
- Check that Tailwind directives are in App.css
- Restart development server after configuration changes

**Form Validation Errors**
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Ensure proper data types for form inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for authentication and database
- [Adzuna](https://developer.adzuna.com/) for job data API
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [React](https://reactjs.org/) for the UI framework
