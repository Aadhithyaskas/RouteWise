import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { adminApi, financeApi } from '../../services/api.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const defaultCenter = [20.5937, 78.9629]

export default function MapViewPage() {
  const [salespersons, setSalespersons] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [salesData, customerData] = await Promise.all([adminApi.salespersons(), financeApi.unassignedCustomers()])
        setSalespersons(salesData.filter((item) => item.latitude && item.longitude))
        setCustomers(customerData)
      } finally {
        setLoading(false)
      }
    }
    loadMapData()
  }, [])

  if (loading) {
    return <LoadingSpinner label="Loading map intelligence..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Live map view"
        description="Plot field reps and customer demand hotspots to see territory coverage at a glance."
      />

      <SectionCard title="Coverage map" subtitle="Salesperson markers show current tracked coordinates. Customer markers represent unassigned demand.">
        {!salespersons.length && !customers.length ? (
          <EmptyState title="No coordinates available" description="Once salesperson and customer locations are available, they will appear here." />
        ) : (
          <div className="h-[520px] overflow-hidden rounded-[28px]">
            <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {salespersons.map((salesperson) => (
                <Marker key={`sales-${salesperson.id}`} position={[salesperson.latitude, salesperson.longitude]}>
                  <Popup>
                    <strong>{salesperson.name}</strong>
                    <br />
                    {salesperson.district}
                  </Popup>
                </Marker>
              ))}
              {customers.map((customer) => (
                <Marker key={`customer-${customer.id}`} position={[customer.latitude, customer.longitude]}>
                  <Popup>
                    <strong>{customer.name}</strong>
                    <br />
                    {customer.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
