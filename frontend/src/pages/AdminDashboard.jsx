import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',    emoji: '📊' },
  { key: 'doctors',    label: 'Doctors',       emoji: '🩺' },
  { key: 'appointments',label:'Appointments',  emoji: '📋' },
  { key: 'patients',   label: 'Patients',      emoji: '👥' },
  { key: 'add-doctor', label: 'Add Doctor',    emoji: '➕' },
];

const SPECIALITIES = ['Cardiologist','Dermatologist','Neurologist','Pediatrician','Orthopedist','Gynecologist','Psychiatrist','Ophthalmologist','General Physician','Dentist','ENT Specialist'];

export default function AdminDashboard() {
  const { role, api } = useApp();
  const navigate = useNavigate();
  const [tab,   setTab]   = useState('dashboard');
  const [doctors,      setDoctors]      = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [form,  setForm]  = useState({ name:'',email:'',password:'',speciality:'',degree:'',experience:'',fees:'',about:'',available:true });
  const [adding, setAdding] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [role]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, a, u] = await Promise.all([api.get('/admin/doctors'), api.get('/admin/appointments'), api.get('/admin/users')]);
      if (d.data.success) setDoctors(d.data.doctors);
      if (a.data.success) setAppointments(a.data.appointments);
      if (u.data.success) setUsers(u.data.users);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const removeDoctor = async (id) => {
    if (!window.confirm('Remove this doctor?')) return;
    try {
      const { data } = await api.delete(`/admin/doctors/${id}`);
      if (data.success) { setDoctors(p => p.filter(d => d._id !== id)); toast.success('Doctor removed'); }
    } catch { toast.error('Failed to remove'); }
  };

  const addDoctor = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const { data } = await api.post('/admin/add-doctor', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { toast.success('Doctor added!'); setDoctors(p => [...p, data.doctor]); setForm({ name:'',email:'',password:'',speciality:'',degree:'',experience:'',fees:'',about:'',available:true }); setImageFile(null); setTab('doctors'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add'); }
    finally { setAdding(false); }
  };

  const stats = {
    doctors: doctors.length, users: users.length, appointments: appointments.length,
    revenue: appointments.filter(a => a.status === 'completed').reduce((s, a) => s + (a.doctor?.fees || 0), 0),
  };

  if (role !== 'admin') return null;

  return (
    <div className="pt-16 min-h-screen bg-surface flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 fixed top-16 bottom-0 flex flex-col py-4 z-40">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider px-4 mb-4">Admin Panel</p>
        {NAV.map(item => (
          <button key={item.key} onClick={() => setTab(item.key)}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
              tab === item.key ? 'bg-primary-light text-primary border-r-2 border-primary' : 'text-muted hover:bg-slate-50 hover:text-dark'
            }`}>
            <span className="text-base">{item.emoji}</span>{item.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8">

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div>
            <h1 className="section-title text-2xl mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label:'Total Doctors',  value: stats.doctors,        emoji:'🩺', bg:'bg-blue-50 border-blue-100' },
                { label:'Total Patients', value: stats.users,          emoji:'👥', bg:'bg-green-50 border-green-100' },
                { label:'Appointments',   value: stats.appointments,   emoji:'📋', bg:'bg-yellow-50 border-yellow-100' },
                { label:'Revenue',        value:`$${stats.revenue}`,   emoji:'💰', bg:'bg-purple-50 border-purple-100' },
              ].map(({ label, value, emoji, bg }) => (
                <div key={label} className={`card ${bg} border p-6 text-center`}>
                  <div className="text-3xl mb-2">{emoji}</div>
                  <div className="text-2xl font-display font-bold text-dark">{value}</div>
                  <div className="text-xs text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-dark">Recent Appointments</h2>
                <button onClick={() => setTab('appointments')} className="text-xs text-primary hover:underline">View all →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>{['Patient','Doctor','Date','Status'].map(h => <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0,6).map(apt => (
                      <tr key={apt._id} className="border-t border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-dark">{apt.user?.name || '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">Dr. {apt.doctor?.name || '—'}</td>
                        <td className="px-4 py-3 text-sm text-muted">{apt.date ? new Date(apt.date).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {appointments.length === 0 && <div className="text-center py-12 text-muted text-sm">No appointments yet</div>}
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {tab === 'doctors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="section-title text-2xl">Manage Doctors</h1>
              <button onClick={() => setTab('add-doctor')} className="btn-primary text-sm">+ Add Doctor</button>
            </div>
            {loading ? <LoadingSpinner /> : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>{['Doctor','Speciality','Experience','Fee','Status','Action'].map(h => <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {doctors.map(doc => (
                        <tr key={doc._id} className="border-t border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center font-bold text-primary text-sm">
                                {doc.image ? <img src={doc.image} alt={doc.name} className="w-full h-full rounded-xl object-cover" /> : doc.name?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-dark">Dr. {doc.name}</p>
                                <p className="text-xs text-muted">{doc.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{doc.speciality}</td>
                          <td className="px-4 py-3 text-sm text-muted">{doc.experience}</td>
                          <td className="px-4 py-3 text-sm font-medium">${doc.fees}</td>
                          <td className="px-4 py-3"><span className={`badge text-xs ${doc.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{doc.available ? '● Active' : '○ Inactive'}</span></td>
                          <td className="px-4 py-3">
                            <button onClick={() => removeDoctor(doc._id)} className="text-xs text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {doctors.length === 0 && <div className="text-center py-12 text-muted text-sm">No doctors added yet</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {tab === 'appointments' && (
          <div>
            <h1 className="section-title text-2xl mb-6">All Appointments</h1>
            {loading ? <LoadingSpinner /> : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>{['#','Patient','Doctor','Date & Time','Fee','Status'].map(h => <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt, i) => (
                        <tr key={apt._id} className="border-t border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-muted">{i + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-dark">{apt.user?.name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">Dr. {apt.doctor?.name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-muted">{apt.date ? new Date(apt.date).toLocaleDateString() : '—'} · {apt.time}</td>
                          <td className="px-4 py-3 text-sm font-medium">${apt.doctor?.fees || '—'}</td>
                          <td className="px-4 py-3"><StatusBadge status={apt.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && <div className="text-center py-12 text-muted text-sm">No appointments yet</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {tab === 'patients' && (
          <div>
            <h1 className="section-title text-2xl mb-6">All Patients</h1>
            {loading ? <LoadingSpinner /> : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>{['Patient','Email','Phone','Gender','Joined'].map(h => <th key={h} className="text-left text-xs font-semibold text-muted px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className="border-t border-slate-50 hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-xs">{u.name?.[0]?.toUpperCase()}</div>
                              <span className="text-sm font-medium text-dark">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted">{u.email}</td>
                          <td className="px-4 py-3 text-sm text-muted">{u.phone || '—'}</td>
                          <td className="px-4 py-3 text-sm text-muted capitalize">{u.gender || '—'}</td>
                          <td className="px-4 py-3 text-sm text-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <div className="text-center py-12 text-muted text-sm">No patients yet</div>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Doctor Tab */}
        {tab === 'add-doctor' && (
          <div>
            <h1 className="section-title text-2xl mb-6">Add New Doctor</h1>
            <div className="card p-8 max-w-3xl">
              <form onSubmit={addDoctor} className="space-y-5">
                {/* Image */}
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 rounded-2xl bg-primary-light flex items-center justify-center overflow-hidden text-4xl">
                    {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-full h-full object-cover" /> : '👨‍⚕️'}
                  </div>
                  <div>
                    <label className="btn-outline text-sm cursor-pointer inline-block">
                      Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                    </label>
                    <p className="text-xs text-muted mt-1.5">JPG, PNG or WEBP. Max 5MB</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label:'Full Name *',    field:'name',       type:'text',   placeholder:'Dr. John Smith' },
                    { label:'Email *',        field:'email',      type:'email',  placeholder:'doctor@example.com' },
                    { label:'Password *',     field:'password',   type:'password',placeholder:'Min 8 characters' },
                    { label:'Degree *',       field:'degree',     type:'text',   placeholder:'MBBS, MD' },
                    { label:'Experience *',   field:'experience', type:'text',   placeholder:'5 years' },
                    { label:'Fee ($) *',      field:'fees',       type:'number', placeholder:'100' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-dark mb-1.5">{label}</label>
                      <input required type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="input-field" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Speciality *</label>
                    <select required value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} className="input-field">
                      <option value="">Select speciality</option>
                      {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">About Doctor</label>
                  <textarea rows={4} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} placeholder="Write about expertise..." className="input-field resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={adding} className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-60">
                    {adding ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>Adding...</> : '+ Add Doctor'}
                  </button>
                  <button type="button" onClick={() => setTab('doctors')} className="btn-ghost py-3 px-6">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}