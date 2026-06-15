import React from 'react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Dr. Richard Clarke', role: 'Chief Medical Officer', emoji: '👨‍⚕️' },
  { name: 'Sarah Johnson',       role: 'Head of Operations',    emoji: '👩‍💼' },
  { name: 'Arjun Mehta',         role: 'Lead Engineer',         emoji: '👨‍💻' },
  { name: 'Priya Sharma',        role: 'Product Designer',      emoji: '👩‍🎨' },
];

export default function About() {
  return (
    <div className="pt-16 min-h-screen">

      {/* Hero */}
      <section className="hero-bg py-20 px-4 text-center">
        <p className="text-sky-200 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
          Making Healthcare<br />Accessible to Everyone
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Prescripto was founded with a simple mission: eliminate the frustrating barriers between patients and quality healthcare.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['50+','Expert Doctors'],['10K+','Patients Served'],['15+','Specialities'],['4.9★','Average Rating']].map(([v,l]) => (
            <div key={l}><p className="text-3xl font-display font-bold text-primary">{v}</p><p className="text-sm text-muted mt-1">{l}</p></div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Our Mission</p>
            <h2 className="section-title text-3xl mb-5">Why We Built Prescripto</h2>
            <p className="text-muted leading-relaxed mb-4">
              Healthcare scheduling hasn't changed in decades — phone calls, long hold times, paper forms. We built Prescripto to fix that with technology that respects both doctors' time and patients' needs.
            </p>
            <p className="text-muted leading-relaxed">
              Our platform connects patients with verified specialists in under 60 seconds. Whether you need a routine checkup or specialist consultation, Prescripto gets you there faster.
            </p>
            <Link to="/doctors" className="btn-primary inline-flex mt-6 text-sm">Find a Doctor Today</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji:'❤️', title:'Patient First',       desc:'Every decision starts with: how does this help the patient?' },
              { emoji:'🔒', title:'Privacy & Trust',     desc:'Your health data is sacred. Bank-grade encryption always.' },
              { emoji:'⚡', title:'Speed & Access',      desc:'No waiting. Connect with doctors in seconds.' },
              { emoji:'✅', title:'Verified Quality',    desc:'Every doctor is manually verified with valid licenses.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="card p-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="font-semibold text-dark text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">The People</p>
            <h2 className="section-title text-3xl">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, emoji }) => (
              <div key={name} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{emoji}</div>
                <h3 className="font-semibold text-dark text-sm">{name}</h3>
                <p className="text-xs text-muted mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="hero-bg rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 mb-8">Join thousands of patients who trust Prescripto.</p>
          <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-lg inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  );
}