export default function Button({ children, type = 'button', variant = 'primary', className = '', loading = false, ...props }) {
  const variants = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-400',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    light: 'bg-slate-950 text-white hover:bg-slate-800',
    lightSecondary: 'bg-white text-slate-950 border border-slate-200 hover:bg-slate-50',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  )
}
