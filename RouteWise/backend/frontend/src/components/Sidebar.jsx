import { BriefcaseBusiness, Building2, ClipboardList, LayoutDashboard, Map, MapPinned, Route, SlidersHorizontal, Users, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navigation = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Assign Jobs', to: '/admin/assign-job', icon: ClipboardList },
    { label: 'Sales Team', to: '/admin/salespersons', icon: Users },
    { label: 'Map View', to: '/admin/map-view', icon: MapPinned },
  ],
  SALESPERSON: [
    { label: 'Dashboard', to: '/sales/dashboard', icon: BriefcaseBusiness },
    { label: 'Route Map', to: '/sales/route-map', icon: Route },
    { label: 'My Thresholds', to: '/sales/thresholds', icon: SlidersHorizontal },
    { label: 'Nearby Customers', to: '/sales/nearby-customers', icon: Map },
  ],
  FINANCE: [{ label: 'Dashboard', to: '/finance/dashboard', icon: Building2 }],
}

export default function Sidebar({ role, onNavigate, onClose }) {
  return (
    <aside className="flex h-full w-full flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-2 rounded-[28px] border border-amber-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5">
      <Link to="/" onClick={onNavigate} className="min-w-0 flex-1 transition hover:opacity-80">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-950 p-3 text-white"><Route size={22} /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Chakra Finance</p>
            <h2 className="text-xl font-semibold text-slate-950">RouteWise</h2>
          </div>
        </div>
      </Link>
      {onClose && <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-white lg:hidden" aria-label="Close navigation"><X size={18} /></button>}
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {(navigation[role] || []).map((item) => {
          const ItemIcon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-300/60' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <ItemIcon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
