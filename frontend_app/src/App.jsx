import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Landing from './pages/Landing/index';
import Guide from './pages/Guide/index';
import Assessment from './pages/Assessment/index';
import Meals from './pages/Meals/index';
import Exercises from './pages/Exercises/index';
import History from './pages/History/index';
import Patients from './pages/Patients/index';
import CalendarSchedule from './pages/Calendar/index';
import Admin from './pages/Admin/index';
import Dashboard from './pages/Dashboard/index';
import RecordDetail from './pages/History/RecordDetail';
import Profile from './pages/Profile/index';
import Appointments from './pages/Appointments/index';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Đang tải hệ thống...</div>;
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {}
          <Route path="/" element={<Landing />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} /> {}
            <Route path="/assessment" element={<Assessment />} /> {}
            <Route path="/meals" element={<Meals />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:recordId" element={<RecordDetail />} />    
            <Route path="/patients" element={<Patients />} /> 
            <Route path="/calendar" element={<CalendarSchedule />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>

        </Routes>
        <ToastContainer 
          position="bottom-right" 
          autoClose={3500} 
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="!bg-[#252526] !text-[#cccccc] !rounded-md !shadow-2xl !border !border-[#454545] !font-sans !text-[13px] !mb-3 !min-h-0 !py-2 !px-3"
          bodyClassName="!m-0 !p-1 !font-medium"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;