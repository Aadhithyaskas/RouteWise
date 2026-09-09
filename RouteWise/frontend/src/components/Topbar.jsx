import { LogOut, UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Topbar() {
  const { email, role, logout } = useAuth()

  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-amber-700">{role}</p>
        <p className="mt-1 text-sm text-slate-600">Field visits, customer review, and operational controls in one workspace.</p>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-sky-700">
          Home
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <UserCircle2 className="text-sky-700" size={18} />
          <span className="text-sm text-slate-800">{email}</span>
        </div>
        <Button variant="lightSecondary" className="gap-2" onClick={logout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  )
}
