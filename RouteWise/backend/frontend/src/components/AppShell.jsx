import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { useAuth } from '../context/useAuth.js'

export default function AppShell() {
  const { role } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_25%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6 lg:grid-cols-[290px_1fr]">
        <button type="button" onClick={() => setMenuOpen(true)} className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white shadow-xl lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
        {menuOpen && <button type="button" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="Close navigation overlay" />}
        <div className={`fixed inset-y-0 left-0 z-40 w-[min(290px,calc(100vw-2rem))] p-4 transition-transform duration-200 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-auto lg:p-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <Sidebar role={role} onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
        </div>
        <main className="min-w-0">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
