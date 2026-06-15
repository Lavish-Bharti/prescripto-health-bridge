import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM',
  '05:00 PM','05:30 PM',
];

const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function generateDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, bookAppointment, loading, role } = useApp();
  const [doctor,       setDoctor]       = useState(null);
  const [fetching,     setFetching]     = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booking,      setBooking]      = useState(false);
  const [activeTab,    setActiveTab]    = useState('about');
  const dates = generateDates();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        if (data.success) setDoctor(data.doctor);
      } catch {
        toast.error('Doctor not found');
        navigate('/doctors');
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleBook = async () => {
    if (!role) { toast.info('Please login to book'); navigate('/login'); return; }
    if (!selectedDate || !selectedTime) { toast.warning('Select a date and time'); return; }
    setBooking(true);
    const ok = await bookAppointment(id, selectedDate.toISOString().split('T')[0], selectedTime);
    if (ok) navigate('/appointments');
    setBooking(false);
  };

  if (fetching) return <div className="pt-16"><LoadingSpinner text="Loading doctor profile..." /></div>;
  if (!doctor)  return null;

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Doctors
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Profile + Tabs */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile card */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-primary-light flex items-center justify-center">
                  {doctor.image
                    ? <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    : <span className="text-5xl font-display font-bold text-primary">{doctor.name?.[0]}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-display font-bold text-dark">Dr. {doctor.name}</h1>
                      <p className="text-muted mt-0.5">{doctor.degree} · {doctor.speciality}</p>
                    </div>
                    <span className={`badge text-xs font-semibold px-3 py-1.5 ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {doctor.available ? '● Available Today' : '○ Unavailable'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {[
                      { label: `${doctor.rating || '4.8'} Rating`,  sub: `${doctor.reviewCount || 128} reviews` },
                      { label: doctor.experience,                    sub: 'Experience' },
                      { label: `$${doctor.fees}`,                   sub: 'Consultation Fee' },
                    ].map(({ label, sub }) => (
                      <div key={sub} className="bg-slate-50 rounded-xl px-4 py-2.5 text-center">
                        <p className="text-sm font-semibold text-dark">{label}</p>
                        <p className="text-xs text-muted mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-slate-100">
                {['about','education','reviews'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab ? 'text-primary border-b-2 border-primary bg-primary-light/40' : 'text-muted hover:text-dark'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-4">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {doctor.about || `Dr. ${doctor.name} is a highly experienced ${doctor.speciality} with ${doctor.experience} of practice. Committed to exceptional patient care.`}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {[
                        { label: 'Speciality', value: doctor.speciality },
                        { label: 'Experience', value: doctor.experience },
                        { label: 'Language',   value: doctor.language || 'English' },
                        { label: 'Hospital',   value: doctor.hospital || 'City Medical Center' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-muted mb-1">{label}</p>
                          <p className="text-sm font-medium text-dark">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    {[
                      { degree: doctor.degree || 'MBBS', school: 'Harvard Medical School',   year: '2005–2010' },
                      { degree: 'MD — ' + doctor.speciality, school: 'Johns Hopkins University', year: '2010–2014' },
                      { degree: 'Fellowship',               school: 'Mayo Clinic',            year: '2014–2016' },
                    ].map((edu, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🎓</div>
                        <div>
                          <p className="font-semibold text-dark text-sm">{edu.degree}</p>
                          <p className="text-muted text-xs">{edu.school} · {edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah M.', rating: 5, comment: 'Excellent doctor! Very thorough and caring.', date: '2 days ago' },
                      { name: 'John D.',  rating: 5, comment: 'Professional and knowledgeable. Highly recommend.', date: '1 week ago' },
                      { name: 'Emma K.', rating: 4, comment: 'Great experience overall. Worth the wait.', date: '2 weeks ago' },
                    ].map((r, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-dark text-sm">{r.name}</p>
                          <span className="text-xs text-muted">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className={j < r.rating ? 'text-yellow-400' : 'text-slate-200'}>★</span>
                          ))}
                        </div>
                        <p className="text-sm text-slate-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="font-display font-semibold text-lg text-dark mb-5">Book Appointment</h2>

              {/* Date */}
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
                {dates.map((date, i) => {
                  const sel = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button key={i} onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                      className={`flex-shrink-0 flex flex-col items-center py-2.5 px-3 rounded-xl border transition-all min-w-[52px] ${
                        sel ? 'bg-primary border-primary text-white' : 'border-slate-200 hover:border-primary text-dark'
                      }`}>
                      <span className={`text-xs font-medium ${sel ? 'text-white/80' : 'text-muted'}`}>
                        {i === 0 ? 'Today' : DAY_NAMES[date.getDay()]}
                      </span>
                      <span className="text-lg font-bold leading-tight">{date.getDate()}</span>
                      <span className={`text-xs ${sel ? 'text-white/80' : 'text-muted'}`}>{MONTH_NAMES[date.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time */}
              {selectedDate && (
                <>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Select Time</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {TIME_SLOTS.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)}
                        className={`text-xs py-2 px-3 rounded-xl border transition-all font-medium ${
                          selectedTime === time ? 'bg-primary border-primary text-white' : 'border-slate-200 hover:border-primary text-slate-600'
                        }`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Summary */}
              {selectedDate && selectedTime && (
                <div className="bg-primary-light rounded-xl p-4 mb-5 text-sm space-y-1">
                  <p className="font-semibold text-primary mb-2">Booking Summary</p>
                  <p className="text-slate-600">📅 {selectedDate.toDateString()}</p>
                  <p className="text-slate-600">⏰ {selectedTime}</p>
                  <p className="text-slate-600">💰 ${doctor.fees} consultation fee</p>
                </div>
              )}

              <button onClick={handleBook} disabled={booking || loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
                  booking || loading ? 'bg-slate-400 cursor-not-allowed' : 'hero-bg hover:opacity-90 shadow-md'
                }`}>
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    Booking...
                  </span>
                ) : 'Confirm Appointment'}
              </button>
              <p className="text-xs text-muted text-center mt-3">Free cancellation up to 24 hours before</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}