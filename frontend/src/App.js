 import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import { Login, Register } from './pages/Auth';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';

function ProtectedRoute({ children, allowedRole }) {
  const { role } = useApp();
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/doctors"     element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />

        {/* Patient */}
        <Route path="/appointments" element={
          <ProtectedRoute allowedRole="user"><MyAppointments /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>
        } />

        {/* Doctor */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <AIChatbot />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}