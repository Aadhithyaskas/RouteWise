import { useEffect, useState } from 'react'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { useAuth } from '../../context/useAuth.js'
import { salesApi } from '../../services/api.js'

export default function NearbyCustomersPage() {
  const { userId } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNearby = async () => {
      try {
        const response = await salesApi.nearbyCustomers(userId)
        setCustomers(response.customers || response || [])
      } finally {
        setLoading(false)
      }
    }
    if (userId) {
      loadNearby()
    }
  }, [userId])

  if (loading) {
    return <LoadingSpinner label="Looking for nearby customers..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="Nearby customers"
        description="Use your live location to surface nearby prospects and minimize travel time."
      />

      <SectionCard title="Customer opportunities">
        {!customers.length ? (
          <EmptyState title="No nearby customers found" description="Once the backend identifies nearby customers, they will appear here." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {customers.map((customer, index) => (
              <article key={customer.id || index} className="rounded-[26px] border border-white/10 bg-slate-950/30 p-5">
                <h3 className="text-lg font-semibold text-white">{customer.name || customer.customer_name || 'Nearby customer'}</h3>
                <p className="mt-2 text-sm text-slate-300">{customer.address || customer.customer_address}</p>
                {customer.distance_km && <p className="mt-4 text-sm text-cyan-200">{customer.distance_km} km away</p>}
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
