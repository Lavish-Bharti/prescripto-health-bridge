import React from 'react';

const STYLES = {
  pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-green-100 text-green-700 border border-green-200',
  cancelled: 'bg-red-100 text-red-600 border border-red-200',
  completed: 'bg-blue-100 text-blue-700 border border-blue-200',
};
const DOTS = {
  pending: 'bg-yellow-400 animate-pulse', confirmed: 'bg-green-500',
  cancelled: 'bg-red-400', completed: 'bg-blue-500',
};

export default function StatusBadge({ status }) {
  const s = status?.toLowerCase() || 'pending';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STYLES[s] || STYLES.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOTS[s] || DOTS.pending}`}></span>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}