import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, doctor, role, logout } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 pb-0.5 ${isActive(path) ? 'text-primary border-b-2 border-primary' : 'text-slate-600 hover:text-primary'}`;

  const currentName   = role === 'user' ? user?.name   : role === 'doctor' ? doctor?.name   : role === 'admin' ? 'Admin' : null;
  const currentAvatar = role === 'user' ? user?.image  : role === 'doctor' ? doctor?.image  : null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-slate-200/80 shadow-sm' : 'bg-white/90'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 hero-bg rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">❤️</span>
            </div>
            <span className="text-xl font-display font-bold text-dark tracking-tight">Prescripto</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/"        className={navLinkClass('/')}>Home</Link>
            <Link to="/doctors" className={navLinkClass('/doctors')}>Find Doctors</Link>
            {role === 'user'   && <Link to="/appointments"    className={navLinkClass('/appointments')}>My Appointments</Link>}
            {role === 'doctor' && <Link to="/doctor/dashboard" className={navLinkClass('/doctor/dashboard')}>Dashboard</Link>}
            {role === 'admin'  && <Link to="/admin/dashboard"  className={navLinkClass('/admin/dashboard')}>Admin Panel</Link>}
            <Link to="/about"   className={navLinkClass('/about')}>About</Link>
            <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!role ? (
              <>
                <Link to="/login"    className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            ) : (
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center overflow-hidden">
                    {currentAvatar
                      ? <img src={currentAvatar} alt={currentName} className="w-full h-full object-cover" />
                      : <span className="text-primary font-semibold text-sm">{currentName?.[0]?.toUpperCase()}</span>}
                  </div>
                  <span className="text-sm font-medium text-dark">{currentName?.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-glass border border-slate-100 py-2 z-50">
                    {role === 'user' && (
                      <>
                        <Link to="/profile"      onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">👤 My Profile</Link>
                        <Link to="/appointments" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">📅 Appointments</Link>
                      </>
                    )}
                    {role === 'doctor' && <Link to="/doctor/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">📊 Dashboard</Link>}
                    {role === 'admin'  && <Link to="/admin/dashboard"  onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">⚙️ Admin Panel</Link>}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1">
            {[
              { to:'/',            label:'Home' },
              { to:'/doctors',     label:'Find Doctors' },
              ...(role === 'user'   ? [{ to:'/appointments', label:'My Appointments' }, { to:'/profile', label:'Profile' }] : []),
              ...(role === 'doctor' ? [{ to:'/doctor/dashboard', label:'Dashboard' }] : []),
              ...(role === 'admin'  ? [{ to:'/admin/dashboard',  label:'Admin Panel' }] : []),
              { to:'/about',   label:'About' },
              { to:'/contact', label:'Contact' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4 flex gap-2">
              {!role ? (
                <>
                  <Link to="/login"    className="btn-outline text-sm flex-1 text-center">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm flex-1 text-center">Register</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-sm text-red-500 border border-red-200 rounded-xl py-2.5 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}