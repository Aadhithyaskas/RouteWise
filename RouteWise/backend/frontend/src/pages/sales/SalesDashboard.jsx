import { ArrowRight, Camera, Route, Send } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { useAuth } from '../../context/useAuth.js'
import { salesApi } from '../../services/api.js'

export default function SalesDashboard() {
  const { userId } = useAuth()
  const [jobs, setJobs] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationSending, setLocationSending] = useState(false)
  const [optimizedFromLiveLocation, setOptimizedFromLiveLocation] = useState(false)

  const loadJobs = useCallback(async () => {
    if (!userId) return

    try {
      const response = await salesApi.jobs(userId)
      setJobs(response.jobs || [])
      setAlerts(response.alerts || [])
      setOptimizedFromLiveLocation(Boolean(response.optimized_from_live_location))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    if (!userId || !navigator.geolocation) return undefined

    const sendLocation = async (position) => {
      setLocationSending(true)
      try {
        await salesApi.updateLocation({
          salesperson_id: userId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        await loadJobs()
      } catch {
        toast.error('Unable to update live location.')
      } finally {
        setLocationSending(false)
      }
    }

    const watcher = navigator.geolocation.watchPosition(sendLocation, () => {
      toast.error('Location permission is required for live route updates.')
    })

    return () => navigator.geolocation.clearWatch(watcher)
  }, [loadJobs, userId])

  if (loading) {
    return <LoadingSpinner label="Loading your field jobs..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="Field dashboard"
        description="Your RouteWise job board is optimized for the quickest next visit, with nearby customer discovery built in."
        actions={
          <>
            <Link to="/sales/route-map">
              <Button variant="secondary" className="gap-2">
                <Route size={16} />
                Open route map
              </Button>
            </Link>
            <Button variant="secondary" className="gap-2">
              <Send size={16} />
              {locationSending ? 'Updating location...' : 'Live location active'}
            </Button>
          </>
        }
      />

      {!optimizedFromLiveLocation && (
        <SectionCard title="Location guidance">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Enable location access so RouteWise can optimize stops from your latest live position instead of fallback ordering.
          </div>
        </SectionCard>
      )}

      {alerts.length > 0 && (
        <SectionCard title="Optimization alerts">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {alert}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Assigned jobs" subtitle="Jobs are rendered in the backend-provided priority order.">
        {!jobs.length ? (
          <EmptyState title="No active jobs" description="Your queue is clear for now. Check nearby customers for fresh opportunities." />
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <article key={job.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">Priority #{index + 1}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{job.status}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-950">{job.customer}</h3>
                    <p className="mt-2 text-sm text-slate-600">{job.address}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/sales/jobs/${job.id}`} state={{ job }}>
                      <Button variant="lightSecondary" className="gap-2">
                        <Route size={16} />
                        Open job
                      </Button>
                    </Link>
                    <Link to={`/sales/customers/${job.customer_id}/upload-photo`} state={{ job }}>
                      <Button variant="light" className="gap-2">
                        <Camera size={16} />
                        Upload photo
                      </Button>
                    </Link>
                  </div>
                </div>
                <Link className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-700" to={`/sales/jobs/${job.id}`} state={{ job }}>
                  View customer details
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
