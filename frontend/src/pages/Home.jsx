import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SPECIALITIES = [
  { name: 'Cardiologist',    icon: '❤️',  color: 'bg-red-50 border-red-100 hover:bg-red-100' },
  { name: 'Dermatologist',   icon: '✨',  color: 'bg-pink-50 border-pink-100 hover:bg-pink-100' },
  { name: 'Neurologist',     icon: '🧠',  color: 'bg-purple-50 border-purple-100 hover:bg-purple-100' },
  { name: 'Pediatrician',    icon: '👶',  color: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100' },
  { name: 'Orthopedist',     icon: '🦴',  color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
  { name: 'Gynecologist',    icon: '🌸',  color: 'bg-rose-50 border-rose-100 hover:bg-rose-100' },
  { name: 'Psychiatrist',    icon: '🧘',  color: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100' },
  { name: 'Ophthalmologist', icon: '👁️', color: 'bg-teal-50 border-teal-100 hover:bg-teal-100' },
];

const STATS = [
  { value: '50+',  label: 'Expert Doctors' },
  { value: '10K+', label: 'Happy Patients' },
  { value: '15+',  label: 'Specialities' },
  { value: '4.9',  label: 'Average Rating' },
];

export default function Home() {
  const { fetchDoctors, doctors, loading } = useApp();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDoctors({ limit: 8 }); }, [fetchDoctors]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/doctors?search=${encodeURIComponent(search)}` : '/doctors');
  };

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Trusted by 10,000+ patients
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Book Appointments<br />
              <span className="text-sky-200">With Top Doctors</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Connect with verified healthcare professionals instantly. Same-day appointments available.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search doctors, specialities..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-dark focus:outline-none shadow-lg" />
              </div>
              <button type="submit" className="bg-white text-primary font-semibold px-6 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-lg whitespace-nowrap">
                Find Doctor
              </button>
            </form>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Cardiologist', 'Dermatologist', 'Neurologist'].map(s => (
                <button key={s} onClick={() => navigate(`/doctors?speciality=${s}`)}
                  className="text-sm bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full transition-colors border border-white/20">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-display font-bold text-primary">{value}</p>
                <p className="text-sm text-muted mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Browse By</p>
          <h2 className="section-title">Medical Specialities</h2>
          <p className="text-muted mt-3 max-w-xl mx-auto">Find the right specialist for your healthcare needs.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {SPECIALITIES.map(({ name, icon, color }) => (
            <Link key={name} to={`/doctors?speciality=${name}`}
              className={`${color} border rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group`}>
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
              <p className="text-xs font-semibold text-dark leading-tight">{name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Top Rated</p>
              <h2 className="section-title">Featured Doctors</h2>
            </div>
            <Link to="/doctors" className="btn-outline text-sm hidden md:inline-flex">View All →</Link>
          </div>
          {loading ? <LoadingSpinner text="Loading doctors..." /> : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 8).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🩺</p>
              <p className="text-muted font-medium">No doctors available yet.</p>
              <p className="text-sm text-muted mt-1">Connect your backend to see doctors here.</p>
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link to="/doctors" className="btn-outline">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose Prescripto?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Verified Professionals', desc: 'All doctors are verified with valid medical licenses.', bg: 'bg-primary-light', color: 'text-primary' },
            { title: 'Instant Booking',        desc: 'Book in under 60 seconds. Same-day slots available.', bg: 'bg-green-50',     color: 'text-accent' },
            { title: 'Secure & Private',       desc: 'Your health data is encrypted and never shared.',     bg: 'bg-purple-50',    color: 'text-purple-500' },
          ].map(({ title, desc, bg, color }) => (
            <div key={title} className="card p-8 text-center group hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                {title === 'Verified Professionals' ? '✅' : title === 'Instant Booking' ? '⚡' : '🔒'}
              </div>
              <h3 className="font-display font-semibold text-xl text-dark mb-3">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="hero-bg rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of patients who trust Prescripto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link to="/doctors" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/30">
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}