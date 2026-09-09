import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { financeApi } from '../../services/api.js'

export default function FinanceCustomerDetailPage() {
  const { customerId } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [decisionLoading, setDecisionLoading] = useState('')

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setCustomer(await financeApi.customerDetail(customerId))
      } finally {
        setLoading(false)
      }
    }
    loadCustomer()
  }, [customerId])

  const submitDecision = async (decision) => {
    if (customer?.status !== 'PENDING') return

    setDecisionLoading(decision)
    try {
      const response = await financeApi.decision(customerId, decision)
      toast.success(`Customer ${decision.toLowerCase()} successfully.`)
      setCustomer((current) => ({
        ...current,
        status: response?.status || decision,
      }))
    } catch (error) {
      // The backend sends email after saving. If email delivery fails, confirm whether the decision still persisted.
      try {
        const refreshedCustomer = await financeApi.customerDetail(customerId)
        if (refreshedCustomer?.status === decision) {
          setCustomer(refreshedCustomer)
          toast.success(`Customer ${decision.toLowerCase()} successfully. The notification email could not be confirmed.`)
          return
        }
      } catch {
        // Preserve the original API error when a status confirmation is unavailable.
      }
      toast.error(error?.response?.data?.error || 'Unable to update decision.')
    } finally {
      setDecisionLoading('')
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading customer application..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title={customer?.name || 'Customer detail'}
        description="Review the full Chakra Finance case file, including field photo evidence, before final approval or rejection."
      />

      <SectionCard
        className="border-slate-200 bg-[#fcfcfd] shadow-sm"
        title="Decision controls"
        subtitle={customer?.status === 'PENDING' ? 'Choose one final decision after reviewing the case evidence.' : 'This case already has a final decision.'}
        action={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="light"
              className="gap-2"
              loading={decisionLoading === 'APPROVED'}
              disabled={customer?.status !== 'PENDING'}
              onClick={() => submitDecision('APPROVED')}
            >
              <CheckCircle2 size={16} />
              Approve
            </Button>
            <Button
              variant="danger"
              className="gap-2"
              loading={decisionLoading === 'REJECTED'}
              disabled={customer?.status !== 'PENDING'}
              onClick={() => submitDecision('REJECTED')}
            >
              <XCircle size={16} />
              Reject
            </Button>
          </div>
        }
      >
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-600">Application status</span>
          <StatusBadge status={customer?.status} />
        </div>

        {customer?.visit_photo && (
          <div className="mb-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}${customer.visit_photo}`}
              alt={`${customer.name} visit`}
              className="h-72 w-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ['Email', customer?.email],
            ['Phone', customer?.phone],
            ['District', customer?.district],
            ['Address', customer?.address],
            ['Loan type', customer?.loan_type],
            ['Loan amount', customer?.loan_amount],
            ['Annual income', customer?.annual_income],
            ['Bank name', customer?.bank_name],
            ['IFSC', customer?.ifsc_code],
            ['Account number', customer?.account_number],
            ['Visit photo', customer?.visit_photo ? 'Uploaded' : 'Not uploaded'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{value || 'Not provided'}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
