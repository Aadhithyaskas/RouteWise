import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Button from '../../components/Button.jsx'
import DataTable from '../../components/DataTable.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { adminApi } from '../../services/api.js'

export default function SalespersonManagementPage() {
  const [salespersons, setSalespersons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSalespersons = async () => {
      try {
        setSalespersons(await adminApi.salespersons())
      } finally {
        setLoading(false)
      }
    }
    loadSalespersons()
  }, [])

  if (loading) {
    return <LoadingSpinner label="Loading sales team..." />
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'district', label: 'Location' },
    {
      key: 'thresholds',
      label: 'Thresholds',
      render: (row) => `${row.min_job_threshold}-${row.max_job_threshold} jobs / ${row.min_time_threshold}-${row.max_time_threshold} min`,
    },
    { key: 'active_jobs', label: 'Active Jobs' },
    { key: 'email', label: 'Email' },
    {
      key: 'settings',
      label: 'Threshold Settings',
      render: (row) => (
        <Link to={`/admin/salespersons/${row.id}/thresholds`}>
          <Button variant="secondary" className="gap-2">
            <SlidersHorizontal size={16} />
            Configure
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Salesperson management"
        description="Review field coverage, thresholds, and active load across the RouteWise sales force."
      />
      <SectionCard title="Active sales team" subtitle="These users are currently available in the system.">
        <DataTable columns={columns} data={salespersons} emptyMessage="No salespersons are available." />
      </SectionCard>
    </div>
  )
}
