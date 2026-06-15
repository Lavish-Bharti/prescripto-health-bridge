import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 hero-bg rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">❤️</span>
              </div>
              <span className="text-xl font-display font-bold text-white">Prescripto</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your trusted healthcare companion. Book appointments with top doctors instantly.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/doctors', 'Find Doctors'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-slate-500 hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Specialities */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Specialities</h4>
            <ul className="space-y-2.5">
              {['Cardiologist','Dermatologist','Neurologist','Pediatrician','Orthopedist'].map(s => (
                <li key={s}><Link to={`/doctors?speciality=${s}`} className="text-sm text-slate-500 hover:text-primary transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                { emoji:'📍', text:'54709 Willms Station, Washington, USA' },
                { emoji:'📞', text:'+1 (555) 234-5678' },
                { emoji:'✉️', text:'support@prescripto.com' },
              ].map(({ emoji, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-slate-500">
                  <span className="flex-shrink-0">{emoji}</span>{text}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Prescripto. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-600 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-slate-600 hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}