import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function DoctorDashboard() {
  const { doctor, appointments, fetchAppointments, updateAppointmentStatus, api, setDoctor, role, loading } = useApp();
  const navigate = useNavigate();
  const [tab,  setTab]  = useState('appointments');
  const [form, setForm] = useState({ fees: '', experience: '', available: true, about: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role !== 'doctor') { navigate('/login'); return; }
    fetchAppointments();
  }, [role]);

  useEffect(() => {
    if (doctor) setForm({ fees: doctor.fees || '', experience: doctor.experience || '', available: doctor.available ?? true, about: doctor.about || '' });
  }, [doctor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/doctor/profile', form);
      if (data.success) { setDoctor(data.doctor); toast.success('Profile updated!'); }
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    earnings:  appointments.filter(a => a.status === 'completed').length * (doctor?.fees || 0),
  };

  if (role !== 'doctor') return null;

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title text-2xl md:text-3xl">Doctor Dashboard</h1>
            <p className="text-muted mt-1 text-sm">Welcome back, Dr. {doctor?.name}</p>
          </div>
          <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${doctor?.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${doctor?.available ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {doctor?.available ? 'Accepting Patients' : 'Not Available'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',     value: stats.total,     emoji: '📋' },
            { label: 'Pending',   value: stats.pending,   emoji: '⏳' },
            { label: 'Confirmed', value: stats.confirmed, emoji: '✅' },
            { label: 'Completed', value: stats.completed, emoji: '🏁' },
            { label: 'Earnings',  value: `$${stats.earnings}`, emoji: '💰' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="card p-5 text-center">
              <p className="text-2xl mb-1">{emoji}</p>
              <p className="text-2xl font-display font-bold text-dark">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-100 p-1 mb-6 w-fit">
          {[['appointments','📅 Appointments'], ['profile','👤 My Profile']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          loading ? <LoadingSpinner text="Loading appointments..." /> : appointments.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="font-display font-semibold text-xl text-dark mb-2">No appointments yet</h3>
              <p className="text-muted text-sm">Your appointments will appear here once patients book.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-xl font-display font-bold text-primary">
                      {apt.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-dark">{apt.user?.name || 'Patient'}</h3>
                          <p className="text-xs text-muted">{apt.user?.email}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="text-sm text-muted">📅 {new Date(apt.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                        <span className="text-sm text-muted">⏰ {apt.time}</span>
                      </div>
                    </div>
                    {apt.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => updateAppointmentStatus(apt._id, 'confirmed')}
                          className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-xl font-medium transition-colors">
                          ✓ Confirm
                        </button>
                        <button onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                          className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl font-medium transition-colors">
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => updateAppointmentStatus(apt._id, 'completed')}
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-xl font-medium transition-colors flex-shrink-0">
                        ✓ Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="card p-8 max-w-2xl">
            <h3 className="font-semibold text-dark text-base mb-6 pb-3 border-b border-slate-100">Update Your Profile</h3>
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Consultation Fee ($)</label>
                  <input type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} className="input-field" placeholder="e.g. 100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Experience</label>
                  <input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field" placeholder="e.g. 5 years" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">About</label>
                <textarea rows={4} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} className="input-field resize-none" placeholder="Write about your expertise..." />
              </div>
              <div className="flex items-center justify-between py-3 bg-slate-50 rounded-xl px-4">
                <div>
                  <p className="text-sm font-medium text-dark">Accepting Appointments</p>
                  <p className="text-xs text-muted">Toggle your availability</p>
                </div>
                <button onClick={() => setForm({ ...form, available: !form.available })}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${form.available ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 m-0.5 ${form.available ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-3 w-full flex items-center justify-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}