import { useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserPlus2 } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/useAuth.js'
import { authApi } from '../../services/api.js'

const roles = ['ADMIN', 'SALESPERSON', 'FINANCE']

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, getDefaultRoute, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [bootstrapStatus, setBootstrapStatus] = useState({ loading: true, hasAdmin: true })
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'ADMIN',
  })

  useEffect(() => {
    const loadBootstrapStatus = async () => {
      try {
        const data = await authApi.bootstrapStatus()
        setBootstrapStatus({ loading: false, hasAdmin: Boolean(data.has_admin) })
      } catch {
        setBootstrapStatus({ loading: false, hasAdmin: true })
      }
    }
    loadBootstrapStatus()
  }, [])

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email is required.'
    if (!form.password) nextErrors.password = 'Password is required.'
    if (!form.role) nextErrors.role = 'Please choose a role.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const authState = await login(form)
      navigate(location.state?.from || getDefaultRoute(authState.role), { replace: true })
    } catch (error) {
      const message = error?.response?.data?.detail || error?.response?.data?.error || 'Unable to sign in.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#f8fbff_0%,#eef7ff_42%,#f7f4ea_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_26%)]" />
      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[34px] border border-slate-200 bg-white/85 p-8 shadow-xl backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <ShieldCheck size={16} />
            Chakra Finance operations suite
          </div>
          <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
            Chakra Finance keeps field verification, approvals, and customer intake in sync.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-600 md:text-lg">
            A dedicated internal platform for Chakra Finance with route-aware field verification, decision workflows, and secure operational access.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Admin visibility', 'Track coverage, assignments, and live workforce activity.'],
              ['Sales execution', 'Prioritized jobs, nearby leads, and photo evidence in one workflow.'],
              ['Finance control', 'Review applications and approve or reject with confidence.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-xl md:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-700">Secure Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">Choose your role and continue into the Chakra Finance workspace.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link className="inline-flex items-center gap-2 text-sm font-medium text-sky-700" to="/register">
              <UserPlus2 size={15} />
              Need to create an account?
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-700" to="/forgot-password">
              <LockKeyhole size={15} />
              Forgot password?
            </Link>
            {!bootstrapStatus.loading && !bootstrapStatus.hasAdmin && (
              <Link className="inline-flex items-center gap-2 text-sm font-medium text-amber-700" to="/setup/admin">
                <ShieldCheck size={15} />
                Create first admin
              </Link>
            )}
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Mail size={18} className="text-sky-700" />
                <input
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@chakrafinance.in"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <LockKeyhole size={18} className="text-sky-700" />
                <input
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Role</label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                name="role"
                value={form.role}
                onChange={onChange}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-2 text-sm text-rose-600">{errors.role}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full gap-2 bg-slate-950 text-white hover:bg-slate-800">
              Access workspace
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
