const styles = {
  PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
  OPTIMIZED: 'bg-sky-50 text-sky-800 ring-sky-200',
  COMPLETED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-800 ring-rose-200',
}

export default function StatusBadge({ status }) {
  const label = status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Unknown'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{label}</span>
}
