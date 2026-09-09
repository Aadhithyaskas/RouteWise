import { Camera, CheckCircle2, MapPinned } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { useAuth } from '../../context/useAuth.js'
import { salesApi } from '../../services/api.js'

export default function JobDetailPage() {
  const { jobId } = useParams()
  const location = useLocation()
  const { userId } = useAuth()
  const [job, setJob] = useState(location.state?.job || null)
  const [loading, setLoading] = useState(!location.state?.job)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (job || !userId) return
    const loadJob = async () => {
      try {
        const response = await salesApi.jobs(userId)
        setJob((response.jobs || []).find((item) => String(item.id) === jobId) || null)
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [job, jobId, userId])

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await salesApi.completeJob(jobId)
      toast.success('Job marked as completed.')
      setJob((current) => ({ ...current, status: 'COMPLETED' }))
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to complete this job.')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading job details..." />
  }

  if (!job) {
    return <SectionCard title="Job unavailable" subtitle="This job could not be found in your active queue." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title={job.customer}
        description="Review the assigned customer location, finish the visit, and upload supporting evidence."
      />

      <SectionCard
        title="Customer details"
        subtitle="The current jobs endpoint exposes operational fields only, so this page mirrors the available backend payload."
        action={
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" loading={completing} onClick={handleComplete}>
              <CheckCircle2 size={16} />
              Complete job
            </Button>
            <Link to={`/sales/customers/${job.customer_id}/upload-photo`} state={{ job }}>
              <Button variant="secondary" className="gap-2">
                <Camera size={16} />
                Upload visit photo
              </Button>
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-950/35 p-5">
            <p className="text-sm text-slate-300">Status</p>
            <p className="mt-2 text-2xl font-semibold text-white">{job.status}</p>
          </div>
          <div className="rounded-3xl bg-slate-950/35 p-5">
            <p className="text-sm text-slate-300">Latitude</p>
            <p className="mt-2 text-2xl font-semibold text-white">{job.lat}</p>
          </div>
          <div className="rounded-3xl bg-slate-950/35 p-5">
            <p className="text-sm text-slate-300">Longitude</p>
            <p className="mt-2 text-2xl font-semibold text-white">{job.lng}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <MapPinned className="text-cyan-300" size={18} />
            <p className="text-sm text-slate-300">Address</p>
          </div>
          <p className="mt-3 text-base text-white">{job.address}</p>
        </div>
      </SectionCard>
    </div>
  )
}
