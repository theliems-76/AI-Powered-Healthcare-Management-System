import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Lazy loading cho tất cả các Pages (Tối ưu Code Splitting)
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/Auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('./pages/Auth/VerifyEmail'));
const Landing = React.lazy(() => import('./pages/Landing/index'));
const Guide = React.lazy(() => import('./pages/Guide/index'));
const Assessment = React.lazy(() => import('./pages/Assessment/index'));
const Meals = React.lazy(() => import('./pages/Meals/index'));
const Exercises = React.lazy(() => import('./pages/Exercises/index'));
const History = React.lazy(() => import('./pages/History/index'));
const Patients = React.lazy(() => import('./pages/Patients/index'));
const CalendarSchedule = React.lazy(() => import('./pages/Calendar/index'));
const Admin = React.lazy(() => import('./pages/Admin/index'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/index'));
const RecordDetail = React.lazy(() => import('./pages/History/RecordDetail'));
const Profile = React.lazy(() => import('./pages/Profile/index'));
const Appointments = React.lazy(() => import('./pages/Appointments/index'));

// Sub-pages của Admin
const AdminUsers = React.lazy(() => import('./pages/Admin/Users'));
const AdminExerciseTab = React.lazy(() => import('./pages/Admin/components/AdminExerciseTab'));
const AdminDishTab = React.lazy(() => import('./pages/Admin/components/AdminDishTab'));
const AuditLogsTab = React.lazy(() => import('./pages/Admin/components/AuditLogsTab'));
const AdminNotificationsTab = React.lazy(() => import('./pages/Admin/components/AdminNotificationsTab'));
const AdminFeedbacksTab = React.lazy(() => import('./pages/Admin/components/AdminFeedbacksTab'));
const AdminKnowledgeTab = React.lazy(() => import('./pages/Admin/components/AdminKnowledgeTab'));
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Đang tải hệ thống...</div>;
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Đang tải trang...</div>}>
          <Routes>
            {/* ... */}
            <Route path="/" element={<Landing />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} /> {/* ... */}
              <Route path="/assessment" element={<Assessment />} /> {/* ... */}
              <Route path="/meals" element={<Meals />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/history" element={<History />} />
              <Route path="/history/:recordId" element={<RecordDetail />} />    
              <Route path="/patients" element={<Patients />} /> 
              <Route path="/calendar" element={<CalendarSchedule />} />
              <Route path="/admin" element={<Admin />}>
                  <Route index element={<Navigate to="/admin/users" replace />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="exercises" element={<AdminExerciseTab />} />
                  <Route path="dishes" element={<AdminDishTab />} />
                  <Route path="logs" element={<AuditLogsTab />} />
                  <Route path="notifications" element={<AdminNotificationsTab />} />
                  <Route path="feedbacks" element={<AdminFeedbacksTab />} />
                  <Route path="knowledge" element={<AdminKnowledgeTab />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="/appointments" element={<Appointments />} />
            </Route>

          </Routes>
        </React.Suspense>
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 99999 }}
          toastClassName="!bg-primary !text-on-primary !rounded-xl !shadow-2xl !shadow-primary/30 !border !border-primary-container !font-sans !text-sm !mb-3 !min-h-0 !py-3 !px-4 overflow-hidden"
          bodyClassName="!m-0 !p-1 !font-bold"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;