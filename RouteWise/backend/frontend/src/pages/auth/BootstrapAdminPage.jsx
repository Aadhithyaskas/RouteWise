import { ArrowLeft, Building2, LockKeyhole, Mail, ShieldPlus, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import { authApi } from '../../services/api.js'
import { useAuth } from '../../context/useAuth.js'

export default function BootstrapAdminPage() {
  const navigate = useNavigate()
  const { isAuthenticated, getDefaultRoute } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [hasAdmin, setHasAdmin] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company_name: 'Chakra Finance Company',
    email: '',
    password: '',
  })

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await authApi.bootstrapStatus()
        setHasAdmin(Boolean(data.has_admin))
      } catch {
        setHasAdmin(false)
      } finally {
        setChecking(false)
      }
    }
    loadStatus()
  }, [])

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  if (!checking && hasAdmin) {
    return <Navigate to="/login" replace />
  }

  const setField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await authApi.bootstrapAdmin(form)
      toast.success('First Chakra Finance admin created successfully.')
      navigate('/login')
    } catch (error) {
      const data = error?.response?.data
      toast.error(data?.password?.[0] || data?.error || 'Unable to create the first admin.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <div className="min-h-screen bg-slate-50" />
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#f8fbff_0%,#eef7ff_42%,#f7f4ea_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-slate-200 bg-white/85 p-8 shadow-xl backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <ShieldPlus size={16} />
            First-time setup
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Create the first Chakra Finance administrator.</h1>
          <p className="mt-4 text-base text-slate-600">
            This one-time setup initializes the platform so future finance officers and sales teams can be managed securely.
          </p>
          <Link className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-sky-700" to="/login">
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </section>

        <form className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-xl md:p-10" onSubmit={handleSubmit}>
          <p className="text-sm uppercase tracking-[0.25em] text-sky-700">Bootstrap Admin</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Initialize Chakra Finance</h2>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-700">Full name</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <UserRound size={18} className="text-sky-700" />
                <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="name" value={form.name} onChange={setField} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Company name</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Building2 size={18} className="text-sky-700" />
                <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="company_name" value={form.company_name} onChange={setField} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Mail size={18} className="text-sky-700" />
                <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="email" type="email" value={form.email} onChange={setField} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <LockKeyhole size={18} className="text-sky-700" />
                <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="password" type="password" value={form.password} onChange={setField} />
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full bg-slate-950 text-white hover:bg-slate-800">
              Create first admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
