import { Save, Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { salesApi } from '../../services/api.js'

const emptyForm = {
  min_job_threshold: '',
  max_job_threshold: '',
  min_time_threshold: '',
  max_time_threshold: '',
}

export default function SalesThresholdSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [salesperson, setSalesperson] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const data = await salesApi.myThresholds()
        setSalesperson(data)
        setForm({
          min_job_threshold: String(data.min_job_threshold ?? ''),
          max_job_threshold: String(data.max_job_threshold ?? ''),
          min_time_threshold: String(data.min_time_threshold ?? ''),
          max_time_threshold: String(data.max_time_threshold ?? ''),
        })
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Unable to load your threshold settings.')
      } finally {
        setLoading(false)
      }
    }

    loadThresholds()
  }, [])

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

      const data = await salesApi.updateMyThresholds(payload)
      setSalesperson(data)
      toast.success('Your threshold settings have been updated.')
    } catch (error) {
      const data = error?.response?.data
      const message =
        (Array.isArray(data) && data[0]) ||
        data?.non_field_errors?.[0] ||
        data?.error ||
        'Unable to save your threshold settings.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading your thresholds..." />
  }

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="My threshold settings"
        description="Adjust your own workload and visit-time boundaries so RouteWise optimization reflects the pace you can realistically handle."
      />

      <SectionCard
        title="Personal optimization limits"
        subtitle={`${salesperson?.name || 'Salesperson'}${salesperson?.district ? ` • ${salesperson.district}` : ''}`}
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Minimum job threshold</label>
            <input className={inputClass} type="number" min="0" name="min_job_threshold" value={form.min_job_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Maximum job threshold</label>
            <input className={inputClass} type="number" min="0" name="max_job_threshold" value={form.max_job_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Minimum time threshold (minutes)</label>
            <input className={inputClass} type="number" min="0" name="min_time_threshold" value={form.min_time_threshold} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Maximum time threshold (minutes)</label>
            <input className={inputClass} type="number" min="0" name="max_time_threshold" value={form.max_time_threshold} onChange={handleChange} />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" className="gap-2" loading={saving}>
              <Save size={16} />
              Save my thresholds
            </Button>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <Settings2 size={16} className="text-cyan-300" />
              These limits are used during job assignment and route optimization.
            </div>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
