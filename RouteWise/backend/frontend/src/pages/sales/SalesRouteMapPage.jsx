import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { ExternalLink, MapPinned, Route } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { useAuth } from '../../context/useAuth.js'
import { salesApi } from '../../services/api.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const indiaCenter = [20.5937, 78.9629]

const createOrderIcon = (order) =>
  L.divIcon({
    className: 'routewise-order-icon',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:#22d3ee;color:#082032;font-weight:700;border:3px solid rgba(8,32,50,0.45);box-shadow:0 10px 30px rgba(0,0,0,0.28);">${order}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  })

export default function SalesRouteMapPage() {
  const { userId } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [optimizedFromLiveLocation, setOptimizedFromLiveLocation] = useState(false)

  const loadJobs = useCallback(async () => {
    if (!userId) return

    try {
      const response = await salesApi.jobs(userId)
      setJobs(response.jobs || [])
      setOptimizedFromLiveLocation(Boolean(response.optimized_from_live_location))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId || !navigator.geolocation) {
      loadJobs()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setCurrentPosition([position.coords.latitude, position.coords.longitude])
        try {
          await salesApi.updateLocation({
            salesperson_id: userId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        } catch {
          // Keep rendering the map even if live location sync fails.
        } finally {
          await loadJobs()
        }
      },
      () => {
        setCurrentPosition(null)
        loadJobs()
      },
    )
  }, [loadJobs, userId])

  const routePoints = useMemo(() => jobs.map((job) => [job.lat, job.lng]), [jobs])
  const polylinePoints = useMemo(() => {
    if (currentPosition) return [currentPosition, ...routePoints]
    return routePoints
  }, [currentPosition, routePoints])
  const googleMapsRouteUrl = useMemo(() => {
    if (!jobs.length) return ''

    const origin = currentPosition ? `${currentPosition[0]},${currentPosition[1]}` : `${jobs[0].lat},${jobs[0].lng}`
    const destination = `${jobs[jobs.length - 1].lat},${jobs[jobs.length - 1].lng}`
    const waypointJobs = currentPosition ? jobs.slice(0, -1) : jobs.slice(1, -1)
    const waypoints = waypointJobs.map((job) => `${job.lat},${job.lng}`).join('|')

    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}`
  }, [currentPosition, jobs])

  const center = polylinePoints[0] || indiaCenter

  if (loading) {
    return <LoadingSpinner label="Building optimized route map..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="Optimized route map"
        description="View your connected job nodes on a map in the same order RouteWise calculates from the latest available salesperson location."
        actions={
          googleMapsRouteUrl ? (
            <a href={googleMapsRouteUrl} target="_blank" rel="noreferrer">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100">
                <ExternalLink size={16} />
                Open in Google Maps
              </button>
            </a>
          ) : null
        }
      />

      {!optimizedFromLiveLocation && (
        <SectionCard title="Location guidance">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Route order is most accurate when location access is enabled so the optimization starts from your current position.
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Connected job path"
        subtitle="The line starts from your current browser location when available, then connects each job in sequence."
      >
        {!jobs.length ? (
          <EmptyState title="No route to render" description="Once optimized jobs are assigned, the connected route path will appear here." />
        ) : (
          <div className="h-[540px] overflow-hidden rounded-[28px]">
            <MapContainer center={center} zoom={10} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {currentPosition && (
                <CircleMarker center={currentPosition} radius={10} pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.8 }}>
                  <Popup>Your current location</Popup>
                </CircleMarker>
              )}

              <Polyline positions={polylinePoints} pathOptions={{ color: '#22d3ee', weight: 4, opacity: 0.85 }} />

              {jobs.map((job, index) => (
                <Marker key={job.id} position={[job.lat, job.lng]} icon={createOrderIcon(index + 1)}>
                  <Popup>
                    <strong>
                      Stop #{index + 1}: {job.customer}
                    </strong>
                    <br />
                    {job.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Route sequence" subtitle="These stops are connected in the same order shown below.">
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job, index) => (
            <article key={job.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Route size={16} className="text-sky-700" />
                    <h3 className="text-lg font-semibold text-slate-950">{job.customer}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{job.address}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPinned size={13} />
                      {job.lat}, {job.lng}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{job.status}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
