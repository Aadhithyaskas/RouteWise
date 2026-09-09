import { ArrowLeft, ArrowRight, Building2, IdCard, LockKeyhole, Mail, Phone, ShieldPlus, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/useAuth.js'
import { authApi } from '../../services/api.js'

const roles = ['ADMIN', 'SALESPERSON', 'FINANCE']

const initialForm = {
  role: 'ADMIN',
  name: '',
  email: '',
  password: '',
  company_name: '',
  phone: '',
  district: '',
  address: '',
  age: '',
  aadhar_number: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated, getDefaultRoute } = useAuth()
  const [loading, setLoading] = useState(false)
  const [bootstrapStatus, setBootstrapStatus] = useState({ loading: true, hasAdmin: true })
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await authApi.bootstrapStatus()
        setBootstrapStatus({ loading: false, hasAdmin: Boolean(data.has_admin) })
        if (data.has_admin) {
          setForm((current) => ({ ...current, role: current.role === 'ADMIN' ? 'SALESPERSON' : current.role }))
        }
      } catch {
        setBootstrapStatus({ loading: false, hasAdmin: true })
      }
    }
    loadStatus()
  }, [])

  const availableRoles = useMemo(() => (bootstrapStatus.hasAdmin ? roles.filter((role) => role !== 'ADMIN') : roles), [bootstrapStatus.hasAdmin])

  const roleFields = useMemo(() => {
    if (form.role === 'ADMIN') return ['company_name']
    if (form.role === 'SALESPERSON') return ['phone', 'district', 'address', 'age', 'aadhar_number']
    return []
  }, [form.role])

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />
  }

  const setField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    if (!form.password.trim()) nextErrors.password = 'Password is required.'
    if (form.role === 'ADMIN' && !form.company_name.trim()) nextErrors.company_name = 'Company name is required.'

    if (form.role === 'SALESPERSON') {
      ;['phone', 'district', 'address', 'age', 'aadhar_number'].forEach((field) => {
        if (!String(form[field]).trim()) {
          nextErrors[field] = 'This field is required.'
        }
      })
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await authApi.register({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      })
      toast.success('Registration completed. You can log in now.')
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to register user.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-6 md:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_22%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="order-2 rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur-xl md:p-8 lg:order-1 lg:rounded-[34px] lg:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <ShieldPlus size={16} />
            Team onboarding
          </div>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-slate-950 md:text-5xl lg:mt-8 lg:text-6xl">Create Chakra Finance access for your internal teams.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base md:leading-7 lg:mt-5 lg:text-lg">
            Register finance officers and field sales staff through a dedicated Chakra Finance onboarding flow. The first admin is handled separately during bootstrap.
          </p>
          <Link className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-sky-700" to="/login">
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </section>

        <section className="order-1 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl md:p-8 lg:order-2 lg:rounded-[34px] lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-700">Registration</p>
            <Link to="/" className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-sky-700">Home</Link>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Create a role account</h2>

          <form className="mt-6 space-y-5 md:mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Role</label>
              <select className={`${inputClass} border-slate-200 bg-white text-slate-900`} name="role" value={form.role} onChange={setField}>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-700">Name</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                  <UserRound size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="name" value={form.name} onChange={setField} />
                </div>
                {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-700">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                  <Mail size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="email" type="email" value={form.email} onChange={setField} />
                </div>
                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                <LockKeyhole size={18} className="text-sky-700" />
                <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="password" type="password" value={form.password} onChange={setField} />
              </div>
              {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
            </div>

            {roleFields.includes('company_name') && (
              <div>
                <label className="mb-2 block text-sm text-slate-700">Company name</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                  <Building2 size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="company_name" value={form.company_name} onChange={setField} />
                </div>
                {errors.company_name && <p className="mt-2 text-sm text-rose-600">{errors.company_name}</p>}
              </div>
            )}

            {form.role === 'SALESPERSON' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Phone</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                    <Phone size={18} className="text-sky-700" />
                    <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="phone" value={form.phone} onChange={setField} />
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-rose-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-700">District</label>
                  <input className={`${inputClass} border-slate-200 bg-white text-slate-900`} name="district" value={form.district} onChange={setField} />
                  {errors.district && <p className="mt-2 text-sm text-rose-600">{errors.district}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-700">Age</label>
                  <input className={`${inputClass} border-slate-200 bg-white text-slate-900`} name="age" type="number" value={form.age} onChange={setField} />
                  {errors.age && <p className="mt-2 text-sm text-rose-600">{errors.age}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-700">Aadhar number</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100">
                    <IdCard size={18} className="text-sky-700" />
                    <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="aadhar_number" value={form.aadhar_number} onChange={setField} />
                  </div>
                  {errors.aadhar_number && <p className="mt-2 text-sm text-rose-600">{errors.aadhar_number}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-slate-700">Address</label>
                  <textarea className={`${inputClass} min-h-28 border-slate-200 bg-white text-slate-900`} name="address" value={form.address} onChange={setField} />
                  {errors.address && <p className="mt-2 text-sm text-rose-600">{errors.address}</p>}
                </div>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full gap-2 bg-slate-950 text-white hover:bg-slate-800">
              Create account
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
