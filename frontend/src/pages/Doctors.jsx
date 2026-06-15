import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SPECIALITIES = [
  'All','Cardiologist','Dermatologist','Neurologist','Pediatrician',
  'Orthopedist','Gynecologist','Psychiatrist','Ophthalmologist',
  'General Physician','Dentist','ENT Specialist',
];

const SORT_OPTIONS = [
  { value: 'rating',    label: 'Highest Rated' },
  { value: 'fees_asc',  label: 'Lowest Fee' },
  { value: 'fees_desc', label: 'Highest Fee' },
  { value: 'experience',label: 'Most Experienced' },
];

export default function Doctors() {
  const { doctors, fetchDoctors, loading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,            setSearch]            = useState(searchParams.get('search') || '');
  const [selectedSpeciality,setSelectedSpeciality] = useState(searchParams.get('speciality') || 'All');
  const [sortBy,            setSortBy]            = useState('rating');
  const [availableOnly,     setAvailableOnly]     = useState(false);
  const [maxFee,            setMaxFee]            = useState(500);

  const load = useCallback(() => {
    const params = {};
    if (search)                        params.search     = search;
    if (selectedSpeciality !== 'All')  params.speciality = selectedSpeciality;
    if (availableOnly)                 params.available  = true;
    params.sort   = sortBy;
    params.maxFee = maxFee;
    fetchDoctors(params);
  }, [search, selectedSpeciality, sortBy, availableOnly, maxFee, fetchDoctors]);

  useEffect(() => { load(); }, [load]);

  const handleSpeciality = (spec) => {
    setSelectedSpeciality(spec);
    const p = {};
    if (spec !== 'All') p.speciality = spec;
    if (search)         p.search     = search;
    setSearchParams(p);
  };

  const reset = () => {
    setSelectedSpeciality('All'); setSearch('');
    setSortBy('rating'); setAvailableOnly(false); setMaxFee(500);
    setSearchParams({});
  };

  return (
    <div className="pt-16 min-h-screen bg-surface">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="section-title text-2xl md:text-3xl">Find Your Doctor</h1>
              <p className="text-muted mt-1 text-sm">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
                {selectedSpeciality !== 'All' && ` · ${selectedSpeciality}`}
              </p>
            </div>
            <div className="flex gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && load()}
                  placeholder="Search by name..."
                  className="input-field pl-10 py-2.5 text-sm" />
              </div>
              <button onClick={load} className="btn-primary text-sm px-4 py-2.5">Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="card p-5 sticky top-24 space-y-6">
            <h3 className="font-semibold text-dark">Filters</h3>

            {/* Speciality */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Speciality</p>
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
                {SPECIALITIES.map(spec => (
                  <button key={spec} onClick={() => handleSpeciality(spec)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                      selectedSpeciality === spec ? 'bg-primary text-white font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                    }`}>
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Sort By</p>
              <div className="space-y-1">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                      sortBy === opt.value ? 'bg-primary-light text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Available toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-dark">Available Only</p>
              <button onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-11 h-6 rounded-full transition-all duration-300 ${availableOnly ? 'bg-primary' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 m-0.5 ${availableOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Max Fee */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-dark">Max Fee</p>
                <span className="text-primary font-semibold text-sm">${maxFee}</span>
              </div>
              <input type="range" min="20" max="500" step="10" value={maxFee}
                onChange={e => setMaxFee(Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>$20</span><span>$500</span>
              </div>
            </div>

            <button onClick={reset}
              className="w-full text-sm text-muted hover:text-primary text-center py-2 border border-slate-200 rounded-xl hover:border-primary transition-colors">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? <LoadingSpinner text="Finding doctors..." /> : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
            </div>
          ) : (
            <div className="text-center py-24 card">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-display font-semibold text-xl text-dark mb-2">No doctors found</h3>
              <p className="text-muted text-sm">Try adjusting your search or filters</p>
              <button onClick={reset} className="mt-5 btn-primary text-sm">Clear Filters</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}