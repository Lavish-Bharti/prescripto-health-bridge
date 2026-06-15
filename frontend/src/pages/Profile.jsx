import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, api, setUser, role } = useApp();
  const navigate = useNavigate();
  const [editing,      setEditing]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || null);
  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
    dob:     user?.dob     || '',
    gender:  user?.gender  || '',
  });

  if (!role) { navigate('/login'); return null; }

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const { data } = await api.put('/user/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) { setUser(data.user); toast.success('Profile updated!'); setEditing(false); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title text-2xl md:text-3xl">My Profile</h1>
            <p className="text-muted mt-1 text-sm">Manage your personal information</p>
          </div>
          {!editing
            ? <button onClick={() => setEditing(true)} className="btn-outline text-sm">Edit Profile</button>
            : <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setImagePreview(user?.image || null); }} className="btn-ghost text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>}
        </div>

        {/* Avatar */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary-light flex items-center justify-center">
                {imagePreview
                  ? <img src={imagePreview} alt={user?.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl font-display font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>}
              </div>
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-dark transition-colors">
                  <span className="text-white text-xs">📷</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-dark">{user?.name}</h2>
              <p className="text-muted text-sm mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge bg-green-100 text-green-700 text-xs">✓ Verified Patient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8 space-y-5">
          <h3 className="font-semibold text-dark text-base border-b border-slate-100 pb-3">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: 'Full Name',    field: 'name',    type: 'text',  placeholder: 'John Doe',           value: user?.name },
              { label: 'Phone',        field: 'phone',   type: 'tel',   placeholder: '+1 (555) 000-0000',  value: user?.phone },
              { label: 'Date of Birth',field: 'dob',     type: 'date',  placeholder: '',                   value: user?.dob },
              { label: 'Address',      field: 'address', type: 'text',  placeholder: 'Your address',        value: user?.address },
            ].map(({ label, field, type, placeholder, value }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-dark mb-1.5">{label}</label>
                {editing
                  ? <input type={type} value={form[field]} onChange={f(field)} placeholder={placeholder} className="input-field" />
                  : <p className="text-slate-600 text-sm py-3 px-4 bg-slate-50 rounded-xl">{value || '—'}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
              <p className="text-slate-600 text-sm py-3 px-4 bg-slate-50 rounded-xl">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Gender</label>
              {editing ? (
                <select value={form.gender} onChange={f('gender')} className="input-field">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : <p className="text-slate-600 text-sm py-3 px-4 bg-slate-50 rounded-xl capitalize">{user?.gender || '—'}</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}