import React from 'react';
import { Link } from 'react-router-dom';

const SPEC_COLORS = {
  Cardiologist:    'bg-red-100 text-red-600',
  Dermatologist:   'bg-pink-100 text-pink-600',
  Neurologist:     'bg-purple-100 text-purple-600',
  Pediatrician:    'bg-yellow-100 text-yellow-600',
  Orthopedist:     'bg-blue-100 text-blue-600',
  Gynecologist:    'bg-rose-100 text-rose-600',
  Psychiatrist:    'bg-indigo-100 text-indigo-600',
  Ophthalmologist: 'bg-teal-100 text-teal-600',
  default:         'bg-primary-light text-primary',
};

export default function DoctorCard({ doctor }) {
  const badgeClass = SPEC_COLORS[doctor.speciality] || SPEC_COLORS.default;

  return (
    <Link to={`/doctors/${doctor._id}`}
      className="card group p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      {/* Avatar */}
      <div className="relative">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-light to-sky-100 flex items-center justify-center">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <span className="text-6xl font-display font-bold text-primary/30">{doctor.name?.[0]}</span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${doctor.available ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {doctor.available ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <span className={`badge text-xs font-medium mb-2 ${badgeClass}`}>{doctor.speciality}</span>
        <h3 className="font-display font-semibold text-dark text-lg leading-tight">Dr. {doctor.name}</h3>
        <p className="text-muted text-sm mt-1">{doctor.degree || 'MBBS'}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <span className="text-yellow-400">★</span>
            <span className="font-medium text-dark">{doctor.rating || '4.8'}</span>
            <span>({doctor.reviewCount || 120})</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Fee</p>
            <p className="font-semibold text-dark text-sm">${doctor.fees}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
          <span>⏱</span>
          {doctor.experience} experience
        </div>
      </div>

      <div className="btn-primary text-sm text-center group-hover:bg-primary-dark transition-colors w-full">
        Book Appointment
      </div>
    </Link>
  );
}