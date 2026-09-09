import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { adminApi } from '../../services/api.js'

const emptyForm = {
  min_job_threshold: '',
  max_job_threshold: '',
  min_time_threshold: '',
  max_time_threshold: '',
}

export default function SalespersonThresholdSettingsPage() {
  const navigate = useNavigate()
  const { salespersonId } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [salesperson, setSalesperson] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const loadSalesperson = async () => {
      try {
        const data = await adminApi.getSalespersonThresholds(salespersonId)
        setSalesperson(data)
        setForm({
          min_job_threshold: String(data.min_job_threshold ?? ''),
          max_job_threshold: String(data.max_job_threshold ?? ''),
          min_time_threshold: String(data.min_time_threshold ?? ''),
          max_time_threshold: String(data.max_time_threshold ?? ''),
        })
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Unable to load threshold settings.')
      } finally {
        setLoading(false)
      }
    }

    loadSalesperson()
  }, [salespersonId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const payload = {
        min_job_threshold: Number(form.min_job_threshold),
        max_job_threshold: Number(form.max_job_threshold),
        min_time_threshold: Number(form.min_time_threshold),
        max_time_threshold: Number(form.max_time_threshold),
      }

      const data = await adminApi.updateSalespersonThresholds(salespersonId, payload)
      setSalesperson(data)
      toast.success('Threshold settings updated successfully.')
      navigate('/admin/salespersons')
    } catch (error) {
      const data = error?.response?.data
      const message =
        (Array.isArray(data) && data[0]) ||
        data?.non_field_errors?.[0] ||
        data?.error ||
        'Unable to save threshold settings.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading threshold settings..." />
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title={`${salesperson?.name || 'Salesperson'} threshold settings`}
        description="Set job-capacity and service-time boundaries for this salesperson so optimization respects real-world workload limits."
        actions={
          <Link to="/admin/salespersons">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft size={16} />
              Back to sales team
            </Button>
          </Link>
        }
      />

      <SectionCard title="Threshold configuration" subtitle={`District: ${salesperson?.district || 'Unknown'}`}>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Minimum job threshold</label>
            <input className={inputClass} type="number" min="0" name="min_job_threshold" value={form.min_job_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Maximum job threshold</label>
            <input className={inputClass} type="number" min="0" name="max_job_threshold" value={form.max_job_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Minimum time threshold (minutes)</label>
            <input className={inputClass} type="number" min="0" name="min_time_threshold" value={form.min_time_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Maximum time threshold (minutes)</label>
            <input className={inputClass} type="number" min="0" name="max_time_threshold" value={form.max_time_threshold} onChange={handleChange} />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="w-full gap-2 md:w-auto" loading={saving}>
              <Save size={16} />
              Save thresholds
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
