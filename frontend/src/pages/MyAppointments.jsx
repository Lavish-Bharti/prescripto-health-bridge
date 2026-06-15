import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

export default function MyAppointments() {
  const { appointments, fetchAppointments, cancelAppointment, loading, role } = useApp();
  const navigate  = useNavigate();
  const [tab,       setTab]       = useState('all');
  const [cancelling,setCancelling] = useState(null);

  useEffect(() => {
    if (!role) { navigate('/login'); return; }
    fetchAppointments();
  }, [role]);

  const filtered = tab === 'all' ? appointments : appointments.filter(a => a.status?.toLowerCase() === tab);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'all' ? appointments.length : appointments.filter(a => a.status?.toLowerCase() === t).length;
    return acc;
  }, {});

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(id);
    await cancelAppointment(id);
    setCancelling(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title text-2xl md:text-3xl">My Appointments</h1>
            <p className="text-muted mt-1 text-sm">{appointments.length} total appointments</p>
          </div>
          <Link to="/doctors" className="btn-primary text-sm">+ Book New</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',     count: counts.all,       bg: 'bg-white border-slate-200',          text: 'text-dark' },
            { label: 'Pending',   count: counts.pending,   bg: 'bg-yellow-50 border-yellow-200',      text: 'text-yellow-700' },
            { label: 'Confirmed', count: counts.confirmed, bg: 'bg-green-50 border-green-200',        text: 'text-green-700' },
            { label: 'Completed', count: counts.completed, bg: 'bg-blue-50 border-blue-200',          text: 'text-blue-700' },
          ].map(({ label, count, bg, text }) => (
            <div key={label} className={`${bg} border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-display font-bold ${text}`}>{count}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-100 p-1 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'
              }`}>
              {t}
              {counts[t] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-white/25 text-white' : 'bg-slate-100 text-muted'}`}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? <LoadingSpinner text="Loading appointments..." /> : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="font-display font-semibold text-xl text-dark mb-2">No appointments found</h3>
            <p className="text-muted text-sm mb-6">
              {tab === 'all' ? "You haven't booked any appointments yet." : `No ${tab} appointments.`}
            </p>
            <Link to="/doctors" className="btn-primary text-sm">Find a Doctor</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => (
              <div key={apt._id} className="card p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary-light overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {apt.doctor?.image
                      ? <img src={apt.doctor.image} alt={apt.doctor?.name} className="w-full h-full object-cover" />
                      : <span className="text-2xl font-display font-bold text-primary">{apt.doctor?.name?.[0]}</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-dark">Dr. {apt.doctor?.name || 'Unknown Doctor'}</h3>
                        <p className="text-sm text-muted">{apt.doctor?.speciality}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-sm text-muted">
                        📅 {apt.date ? new Date(apt.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' }) : '—'}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted">⏰ {apt.time}</span>
                      <span className="flex items-center gap-1.5 text-sm text-muted">💰 ${apt.doctor?.fees}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <Link to={`/doctors/${apt.doctorId}`}
                      className="text-xs border border-slate-200 rounded-xl px-3 py-2 text-muted hover:text-primary hover:border-primary transition-colors">
                      View Profile
                    </Link>
                    {['pending','confirmed'].includes(apt.status?.toLowerCase()) && (
                      <button onClick={() => handleCancel(apt._id)} disabled={cancelling === apt._id}
                        className="text-xs border border-red-200 text-red-500 hover:bg-red-50 rounded-xl px-3 py-2 transition-colors disabled:opacity-50">
                        {cancelling === apt._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}