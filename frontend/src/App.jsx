import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider, useAlert } from './context/AlertContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard & Base App Pages
import Dashboard from './pages/dashboard';
import Roadmap from './pages/roadmap';
import Community from './pages/community';

// New Architecture Pages & Guards
import SelectPath from './pages/select-path';
import PlacementGuard from './components/guards/PlacementGuard';
import PlacementFlow from './pages/placement/PlacementFlow';
import Profile from './pages/profile';
import Courses from './pages/courses';
import MockTest from './pages/mock/MockTest';
import MockInterview from './pages/mock/MockInterview';
import GradesPage from './pages/grades/index.jsx';
import Notifications from './pages/notifications';

// Chatbot
import Chatbot from './components/chatbot/Chatbot';

// Protected Route Component (Non-Destructive Wrapper)
const ProtectedRoute = ({ children }) => {
  const { token, loading, user } = useAuth();
  const location = useLocation();
  const { addAlert } = useAlert();
  
  // Use a ref to prevent repeated alerts on every render
  const alertShown = React.useRef(false);

  React.useEffect(() => {
    if (loading || !token) return;
    
    // Once user is loaded, we can check for careerPath correctly
    const careerPath = user?.selected_path || localStorage.getItem('careerPath');
    
    if (!careerPath && location.pathname !== '/select-path' && !alertShown.current) {
       addAlert('Please select your target path before proceeding.', 'warning');
       alertShown.current = true;
    }
    
    if (careerPath && location.pathname !== '/select-path' && !alertShown.current) {
        let allowedPrefix = '';
        if (careerPath === 'Higher Education') allowedPrefix = '/higher';
        else if (careerPath === 'Placement Preparation') allowedPrefix = '/placement';
        else if (careerPath === 'Government Exams') allowedPrefix = '/government';
        
        const isHigher = location.pathname.startsWith('/higher');
        const isPlacement = location.pathname.startsWith('/placement');
        const isGov = location.pathname.startsWith('/government');
        
        if ((isHigher || isPlacement || isGov) && !location.pathname.startsWith(allowedPrefix)) {
            addAlert(`Redirected securely to your designated track: ${careerPath}`, 'info');
            alertShown.current = true;
        }
    }
  }, [user, loading, token, location.pathname, addAlert]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  const careerPath = user?.selected_path || localStorage.getItem('careerPath');
  
  if (!careerPath && location.pathname !== '/select-path') {
     return <Navigate to="/select-path" replace />;
  }
  
  if (careerPath && location.pathname !== '/select-path') {
    let allowedPrefix = '';
    if (careerPath === 'Higher Education') allowedPrefix = '/higher';
    else if (careerPath === 'Placement Preparation') allowedPrefix = '/placement';
    else if (careerPath === 'Government Exams') allowedPrefix = '/government';
    
    const isHigher = location.pathname.startsWith('/higher');
    const isPlacement = location.pathname.startsWith('/placement');
    const isGov = location.pathname.startsWith('/government');
    
    if ((isHigher || isPlacement || isGov) && !location.pathname.startsWith(allowedPrefix)) {
        return <Navigate to={`${allowedPrefix}/dashboard`} replace />;
    }
  }
  
  return children;
};

// Placeholder components for routes
// Removed placeholders in favor of real components

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Extension: Select Path UI */}
      <Route path="/select-path" element={<ProtectedRoute><SelectPath /></ProtectedRoute>} />

      {/* Extension: Dynamic Prefixes added without modifying old route definitions below */}
      
      {/* Higher Education Route Group */}
      <Route path="/higher" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="courses" element={<Courses />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="mock-test" element={<MockTest />} />
        <Route path="mock-interview" element={<MockInterview />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Placement Preparation Route Group (With Mandatory Guargs) */}
      <Route path="/placement" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="upload" element={<PlacementFlow />} />
        <Route path="dashboard" element={<PlacementGuard><Dashboard /></PlacementGuard>} />
        <Route path="roadmap" element={<PlacementGuard><Roadmap /></PlacementGuard>} />
        <Route path="courses" element={<PlacementGuard><Courses /></PlacementGuard>} />
        <Route path="grades" element={<PlacementGuard><GradesPage /></PlacementGuard>} />
        <Route path="community" element={<PlacementGuard><Community /></PlacementGuard>} />
        <Route path="profile" element={<PlacementGuard><Profile /></PlacementGuard>} />
        <Route path="mock-test" element={<PlacementGuard><MockTest /></PlacementGuard>} />
        <Route path="mock-interview" element={<PlacementGuard><MockInterview /></PlacementGuard>} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Government Exams Route Group */}
      <Route path="/government" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="courses" element={<Courses />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="mock-test" element={<MockTest />} />
        <Route path="mock-interview" element={<MockInterview />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Backwards-Compatible Global Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="courses" element={<Courses />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const ChatbotWrapper = () => {
  const { token, loading } = useAuth();
  if (loading || !token) return null;
  return <Chatbot />;
};

function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <AppRoutes />
          <ChatbotWrapper />
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
