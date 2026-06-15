import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/* ─────────────────────────── LOGIN ─────────────────────────── */
export function Login() {
  const { loginUser, loginDoctor, loginAdmin, role, loading } = useApp();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('user');
  const [form,       setForm]       = useState({ email: '', password: '' });
  const [showPass,   setShowPass]   = useState(false);

  useEffect(() => {
    if (role === 'user')   navigate('/');
    if (role === 'doctor') navigate('/doctor/dashboard');
    if (role === 'admin')  navigate('/admin/dashboard');
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ok = false;
    if (activeRole === 'user')   ok = await loginUser(form.email, form.password);
    if (activeRole === 'doctor') ok = await loginDoctor(form.email, form.password);
    if (activeRole === 'admin')  ok = await loginAdmin(form.email, form.password);
    if (ok) {
      if (activeRole === 'user')   navigate('/');
      if (activeRole === 'doctor') navigate('/doctor/dashboard');
      if (activeRole === 'admin')  navigate('/admin/dashboard');
    }
  };

  const roles = [
    { key: 'user',   label: 'Patient', emoji: '👤' },
    { key: 'doctor', label: 'Doctor',  emoji: '🩺' },
    { key: 'admin',  label: 'Admin',   emoji: '⚙️' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 hero-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-2xl">❤️</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-dark">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your Prescripto account</p>
        </div>

        <div className="card p-8">
          {/* Role Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6 gap-1">
            {roles.map(({ key, label, emoji }) => (
              <button key={key} onClick={() => setActiveRole(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeRole === key ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-dark'
                }`}>
                <span>{emoji}</span> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-dark">Password</label>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>Signing in...</>
                : `Sign In as ${roles.find(r => r.key === activeRole)?.label}`}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs font-semibold text-yellow-700 mb-1">Demo Credentials</p>
            <div className="text-xs text-yellow-600 space-y-0.5">
              <p>Patient: patient@demo.com / password123</p>
              <p>Doctor:  doctor@demo.com  / password123</p>
              <p>Admin:   admin@demo.com   / admin123</p>
            </div>
          </div>

          {activeRole === 'user' && (
            <p className="text-center text-sm text-muted mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── REGISTER ─────────────────────────── */
export function Register() {
  const { registerUser, role, loading } = useApp();
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed,   setAgreed]   = useState(false);

  useEffect(() => { if (role === 'user') navigate('/'); }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      const { toast } = await import('react-toastify');
      toast.error('Passwords do not match');
      return;
    }
    if (!agreed) {
      const { toast } = await import('react-toastify');
      toast.error('Please agree to the terms');
      return;
    }
    const { confirmPassword, ...data } = form;
    const ok = await registerUser(data);
    if (ok) navigate('/');
  };

  const strength = [form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password)];
  const strengthColors = ['bg-red-400', 'bg-yellow-400', 'bg-green-400'];

  return (
    <div className="min-h-screen pt-16 bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 hero-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-2xl">❤️</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-dark">Create your account</h1>
          <p className="text-muted text-sm mt-1">Join Prescripto for free today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters" className="input-field pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {strength.map((met, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${met ? strengthColors[strength.filter(Boolean).length - 1] : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Confirm Password</label>
              <input type="password" required value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password" className="input-field" />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary" />
              <span className="text-sm text-muted">
                I agree to the{' '}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </span>
            </label>
            <button type="submit" disabled={loading || !agreed}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>Creating account...</>
                : 'Create Free Account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}