import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.href = '/login'; }
  return Promise.reject(err);
});

export function AppProvider({ children }) {
  const [user,         setUser]         = useState(null);
  const [doctor,       setDoctor]       = useState(null);
  const [role,         setRole]         = useState(localStorage.getItem('role') || null);
  const [loading,      setLoading]      = useState(false);
  const [doctors,      setDoctors]      = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const r     = localStorage.getItem('role');
    if (!token || !r) return;
    setRole(r);
    if (r === 'user')   api.get('/user/profile').then(res   => { if (res.data.success) setUser(res.data.user); }).catch(() => {});
    if (r === 'doctor') api.get('/doctor/profile').then(res => { if (res.data.success) setDoctor(res.data.doctor); }).catch(() => {});
  }, []);

  const fetchDoctors = useCallback(async (params = {}) => {
    setLoading(true);
    try { const { data } = await api.get('/doctors', { params }); if (data.success) setDoctors(data.doctors); }
    catch { toast.error('Failed to fetch doctors'); }
    finally { setLoading(false); }
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = role === 'doctor' ? '/doctor/appointments' : '/appointments/user';
      const { data } = await api.get(endpoint);
      if (data.success) setAppointments(data.appointments);
    } catch { toast.error('Failed to fetch appointments'); }
    finally { setLoading(false); }
  }, [role]);

  const authLogin = async (endpoint, body, r) => {
    setLoading(true);
    try {
      const { data } = await api.post(endpoint, body);
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', r);
        setRole(r);
        if (r === 'user')   setUser(data.user);
        if (r === 'doctor') setDoctor(data.doctor);
        toast.success('Welcome back!');
        return true;
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
    return false;
  };

  const loginUser   = (e, p) => authLogin('/user/login',   { email:e, password:p }, 'user');
  const loginDoctor = (e, p) => authLogin('/doctor/login', { email:e, password:p }, 'doctor');
  const loginAdmin  = (e, p) => authLogin('/admin/login',  { email:e, password:p }, 'admin');

  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/user/register', formData);
      if (data.success) {
        localStorage.setItem('token', data.token); localStorage.setItem('role', 'user');
        setRole('user'); setUser(data.user);
        toast.success('Account created!'); return true;
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('role');
    setUser(null); setDoctor(null); setRole(null); setAppointments([]);
    toast.success('Logged out successfully');
  };

  const bookAppointment = async (doctorId, date, time) => {
    setLoading(true);
    try {
      const { data } = await api.post('/appointments/book', { doctorId, date, time });
      if (data.success) { toast.success('Appointment booked!'); return true; }
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setLoading(false); }
    return false;
  };

  const cancelAppointment = async (id) => {
    try {
      const { data } = await api.put(`/appointments/${id}/cancel`);
      if (data.success) { setAppointments(p => p.map(a => a._id === id ? { ...a, status:'cancelled' } : a)); toast.success('Appointment cancelled'); return true; }
    } catch (err) { toast.error(err.response?.data?.message || 'Cancellation failed'); }
    return false;
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/appointments/${id}/status`, { status });
      if (data.success) { setAppointments(p => p.map(a => a._id === id ? { ...a, status } : a)); toast.success(`Appointment ${status}`); return true; }
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    return false;
  };

  return (
    <AppContext.Provider value={{
      user, doctor, role, loading, doctors, appointments, api,
      setUser, setDoctor,
      loginUser, loginDoctor, loginAdmin, registerUser, logout,
      fetchDoctors, fetchAppointments,
      bookAppointment, cancelAppointment, updateAppointmentStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);