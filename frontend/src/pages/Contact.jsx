import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [form,    setForm]    = useState({ name:'', email:'', subject:'', message:'' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name:'', email:'', subject:'', message:'' });
    setSending(false);
  };

  const f = field => e => setForm({ ...form, [field]: e.target.value });

  const INFO = [
    { emoji:'📍', label:'Address', value:'54709 Willms Station, Suite 350, Washington, USA' },
    { emoji:'📞', label:'Phone',   value:'+1 (555) 234-5678' },
    { emoji:'✉️', label:'Email',   value:'support@prescripto.com' },
    { emoji:'🕐', label:'Hours',   value:'Mon – Sat: 8:00 AM – 8:00 PM' },
  ];

  return (
    <div className="pt-16 min-h-screen">

      {/* Hero */}
      <section className="hero-bg py-16 px-4 text-center">
        <p className="text-sky-200 font-semibold text-sm uppercase tracking-wider mb-3">Get In Touch</p>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">Have a question or need help? Our support team is available 6 days a week.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-display font-semibold text-dark mb-6">Reach Us Directly</h2>
            {INFO.map(({ emoji, label, value }) => (
              <div key={label} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{emoji}</div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm text-dark">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              <h2 className="text-xl font-display font-semibold text-dark mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Your Name</label>
                    <input required value={form.name} onChange={f('name')} placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
                    <input required type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Subject</label>
                  <select value={form.subject} onChange={f('subject')} className="input-field">
                    <option value="">Select a topic</option>
                    {['Booking Issue','Account Problem','Doctor Inquiry','Payment Question','Technical Support','General Feedback','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Message</label>
                  <textarea required rows={6} value={form.message} onChange={f('message')} placeholder="Describe your issue in detail..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {sending
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>Sending...</>
                    : '✉️  Send Message'}
                </button>
                <p className="text-xs text-muted text-center">We typically respond within 24 hours on business days.</p>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}