export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-700 shadow-sm">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-700" />
      <span>{label}</span>
    </div>
  )
}
