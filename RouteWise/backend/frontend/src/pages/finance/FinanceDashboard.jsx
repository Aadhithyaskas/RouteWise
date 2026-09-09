import { ArrowDownUp, Clock3, Eye, Image, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import DataTable from '../../components/DataTable.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { financeApi } from '../../services/api.js'

export default function FinanceDashboard() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('PENDING_FIRST')

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setCustomers(await financeApi.reviewQueue())
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  if (loading) {
    return <LoadingSpinner label="Loading finance dashboard..." />
  }

  const stats = {
    pending: customers.filter((customer) => customer.status === 'PENDING').length,
    withPhoto: customers.filter((customer) => Boolean(customer.visit_photo)).length,
    withoutPhoto: customers.filter((customer) => !customer.visit_photo).length,
  }

  const statusRank = { PENDING: 0, APPROVED: 1, REJECTED: 2 }
  const visibleCustomers = [...customers]
    .filter((customer) => statusFilter === 'ALL' || customer.status === statusFilter)
    .sort((left, right) => {
      const difference = (statusRank[left.status] ?? 99) - (statusRank[right.status] ?? 99)
      return sortOrder === 'PENDING_FIRST' ? difference : -difference
    })

  const columns = [
    { key: 'name', label: 'Customer' },
    { key: 'district', label: 'District' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'visit_photo',
      label: 'Visit Photo',
      render: (row) => (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.visit_photo ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {row.visit_photo ? 'Available' : 'Missing'}
        </span>
      ),
    },
    { key: 'address', label: 'Address' },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Link to={`/finance/customers/${row.id}`}>
          <Button variant="lightSecondary" className="gap-2">
            <Eye size={16} />
            Review
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Chakra Finance decision desk"
        description="Review field-verified applications in a lighter, approval-first workspace built for daily underwriting operations."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock3 className="text-amber-600" size={20} />
            <p className="text-sm font-medium text-slate-500">Pending review</p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.pending}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Image className="text-emerald-600" size={20} />
            <p className="text-sm font-medium text-slate-500">Photo attached</p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.withPhoto}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="text-rose-600" size={20} />
            <p className="text-sm font-medium text-slate-500">Missing photo</p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.withoutPhoto}</p>
        </div>
      </div>

      <SectionCard
        className="border-slate-200 bg-[#fcfcfd] shadow-sm"
        title="Completed field verifications"
        subtitle="The current finance queue API supplies completed field visits that are awaiting a decision."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="finance-status-filter">Filter by status</label>
            <select
              id="finance-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="ALL">All available statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((current) => (current === 'PENDING_FIRST' ? 'FINAL_FIRST' : 'PENDING_FIRST'))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
              aria-label="Toggle status sort order"
            >
              <ArrowDownUp size={16} />
              {sortOrder === 'PENDING_FIRST' ? 'Pending first' : 'Final first'}
            </button>
          </div>
        }
      >
        <DataTable columns={columns} data={visibleCustomers} emptyMessage="No available cases match this status filter." variant="light" />
      </SectionCard>
    </div>
  )
}
