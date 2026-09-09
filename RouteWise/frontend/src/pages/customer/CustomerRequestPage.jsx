import { Building2, MapPinned, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import { customerApi } from '../../services/api.js'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  district: '',
  latitude: '',
  longitude: '',
  loan_type: 'PERSONAL',
  loan_amount: '',
  annual_income: '',
  bank_name: '',
  ifsc_code: '',
  account_number: '',
}

export default function CustomerRequestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        toast.success('Location captured successfully.')
      },
      () => {
        toast.error('Unable to fetch location')
      },
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    if (!form.latitude || !form.longitude) {
      toast.error('Please enter your location or use current location.')
      setSubmitting(false)
      return
    }

    try {
      await customerApi.submitRequest({
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        loan_amount: Number(form.loan_amount),
        annual_income: Number(form.annual_income),
      })

      toast.success('Request submitted successfully.')
      navigate('/request/success')
    } catch (error) {
      const data = error?.response?.data
      const message =
        data?.email?.[0] ||
        data?.phone?.[0] ||
        data?.latitude?.[0] ||
        data?.longitude?.[0] ||
        data?.loan_amount?.[0] ||
        data?.annual_income?.[0] ||
        data?.error ||
        'Unable to submit your request right now.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    ['name', 'Full name'],
    ['email', 'Email'],
    ['phone', 'Phone number'],
    ['address', 'Address'],
    ['district', 'District'],
    ['latitude', 'Latitude'],
    ['longitude', 'Longitude'],
    ['loan_amount', 'Loan amount'],
    ['annual_income', 'Annual income'],
    ['bank_name', 'Bank name'],
    ['ifsc_code', 'IFSC code'],
    ['account_number', 'Account number'],
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#f8fbff_0%,#eef7ff_42%,#f7f4ea_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <section className="flex flex-col justify-center rounded-[34px] border border-slate-200 bg-white/85 p-10 shadow-xl backdrop-blur-xl">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <ShieldCheck size={16} />
            Public customer request portal
          </div>

          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-amber-700">Chakra Finance</p>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-950">
            Apply for Chakra Finance with fast field verification.
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            Submit your loan request once. Chakra Finance automatically coordinates salesperson visits,
            route-aware verification, and finance approval from one workflow.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sky-700">
                <MapPinned size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">Location-first</p>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Share your location for faster field verification and smarter route planning.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sky-700">
                <Building2 size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">Chakra workflow</p>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Your application moves from intake to field visit to finance approval without repeated follow-up.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-6 text-center">
            <p className="text-lg font-medium text-slate-900">Share your location for faster approval</p>

            <button
              type="button"
              onClick={getLocation}
              className="mt-4 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Use My Current Location
            </button>

            {form.latitude && <p className="mt-3 text-sm text-emerald-700">Location captured successfully</p>}
          </div>
        </section>

        <form className="rounded-[34px] border border-slate-200 bg-white p-10 shadow-xl" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map(([name, label]) => (
              <div key={name} className={name === 'address' ? 'md:col-span-2' : ''}>
                <label className="mb-2 block text-sm text-slate-700">{label}</label>

                {name === 'address' ? (
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    name={name}
                    type={['latitude', 'longitude', 'loan_amount', 'annual_income'].includes(name) ? 'number' : 'text'}
                    step={['latitude', 'longitude'].includes(name) ? 'any' : undefined}
                    value={form[name]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-700">Loan type</label>

              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                name="loan_type"
                value={form.loan_type}
                onChange={handleChange}
              >
                {['PERSONAL', 'HOME', 'VEHICLE', 'BUSINESS'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="mt-8 w-full bg-slate-950 text-white hover:bg-slate-800" loading={submitting}>
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}
