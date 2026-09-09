import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, MapPin, UserRoundCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { adminApi, financeApi } from '../../services/api.js'

export default function AssignJobPage() {
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [salespersons, setSalespersons] = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedSalesperson, setSelectedSalesperson] = useState('')

  const activeSalesperson = salespersons.find((salesperson) => String(salesperson.id) === selectedSalesperson)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [salesData, customerData] = await Promise.all([adminApi.salespersons(), financeApi.unassignedCustomers()])
      setSalespersons(salesData)
      setCustomers(customerData)
      if (!selectedSalesperson && salesData.length) {
        setSelectedSalesperson(String(salesData[0].id))
      }
    } finally {
      setLoading(false)
    }
  }, [selectedSalesperson])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAssign = async (customerId) => {
    if (!selectedSalesperson) {
      toast.error('Choose a salesperson before assigning.')
      return
    }

    setSubmittingId(customerId)
    try {
      await adminApi.assignJob({ customer_id: customerId, salesperson_id: Number(selectedSalesperson) })
      toast.success('Customer assigned successfully.')
      await loadData()
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to assign this customer.')
    } finally {
      setSubmittingId(null)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading assignments..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Assign field jobs"
        description="Match unassigned customers with the right Chakra Finance field officer while keeping workload thresholds under control."
      />

      <SectionCard title="Salesperson selection" subtitle="Choose the team member who should receive the next assignment.">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm font-medium text-slate-900 outline-none shadow-sm"
              value={selectedSalesperson}
              onChange={(event) => setSelectedSalesperson(event.target.value)}
            >
              {salespersons.map((salesperson) => (
                <option key={salesperson.id} value={salesperson.id}>
                  {salesperson.name} - {salesperson.district}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          {activeSalesperson && (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <UserRoundCheck className="text-sky-700" size={18} />
                    <h3 className="text-lg font-semibold text-slate-950">{activeSalesperson.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{activeSalesperson.email}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  {activeSalesperson.active_jobs} active jobs
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 shadow-sm">
                  <MapPin size={14} className="text-amber-700" />
                  {activeSalesperson.district}
                </span>
                <span className="rounded-full bg-white px-3 py-2 shadow-sm">
                  Job threshold: {activeSalesperson.min_job_threshold}-{activeSalesperson.max_job_threshold}
                </span>
                <span className="rounded-full bg-white px-3 py-2 shadow-sm">
                  Time threshold: {activeSalesperson.min_time_threshold}-{activeSalesperson.max_time_threshold} min
                </span>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Unassigned customers" subtitle="These applications are ready for first contact and field verification.">
        {!customers.length ? (
          <EmptyState title="Everything is assigned" description="There are no pending customers waiting for field allocation." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {customers.map((customer) => (
              <article key={customer.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{customer.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{customer.address}</p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">{customer.district}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>Latitude: {customer.latitude}</p>
                  <p>Longitude: {customer.longitude}</p>
                </div>
                <Button className="mt-5 w-full bg-slate-950 text-white hover:bg-slate-800" loading={submittingId === customer.id} onClick={() => handleAssign(customer.id)}>
                  Assign customer
                </Button>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
