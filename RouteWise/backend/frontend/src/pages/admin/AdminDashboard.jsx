import { Activity, ClipboardCheck, Truck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import { adminApi } from '../../services/api.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setStats(await adminApi.dashboard())
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return <LoadingSpinner label="Loading admin performance snapshot..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Operations overview"
        description="Watch team utilization, customer coverage, and fulfillment progress from a single command view."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total customers" value={stats?.total_customers} />
        <StatCard icon={Truck} label="Assigned customers" value={stats?.assigned_customers} accent="from-emerald-400 to-cyan-400" />
        <StatCard icon={ClipboardCheck} label="Pending jobs" value={stats?.pending_jobs} accent="from-amber-300 to-orange-400" />
        <StatCard icon={Activity} label="Active salespersons" value={stats?.active_salespersons} accent="from-fuchsia-400 to-pink-400" />
      </div>

      <SectionCard title="Operational pulse" subtitle="Live indicators for today’s assignment flow and job throughput.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm text-amber-800">Unassigned customers</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{stats?.unassigned_customers ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm text-emerald-800">Completed jobs</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{stats?.completed_jobs ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
            <p className="text-sm text-sky-800">Total salespersons</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{stats?.total_salespersons ?? 0}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
