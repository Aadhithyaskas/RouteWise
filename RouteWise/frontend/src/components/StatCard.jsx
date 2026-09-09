import { ArrowUpRight } from 'lucide-react'

export default function StatCard({ icon, label, value, accent = 'from-cyan-400 to-emerald-400', hint }) {
  const Icon = icon

  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200">
      <div className="flex items-start justify-between">
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-slate-950`}>
          <Icon size={22} />
        </div>
        <ArrowUpRight className="text-sky-700 transition duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value ?? 0}</p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
