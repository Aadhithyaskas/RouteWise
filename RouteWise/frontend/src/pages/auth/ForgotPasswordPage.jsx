import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import { authApi } from '../../services/api.js'

const roles = ['ADMIN', 'SALESPERSON', 'FINANCE']

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    role: 'ADMIN',
    email: '',
    otp: '',
    password: '',
  })

  const setField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const requestOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await authApi.requestPasswordOtp({ role: form.role, email: form.email })
      toast.success('OTP sent to your email.')
      setStep(2)
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await authApi.verifyPasswordOtp({ role: form.role, email: form.email, otp: form.otp })
      toast.success('OTP verified.')
      setStep(3)
    } catch (error) {
      toast.error(error?.response?.data?.error || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await authApi.resetPassword(form)
      toast.success('Password reset successfully.')
      navigate('/login')
    } catch (error) {
      const data = error?.response?.data
      toast.error(data?.password?.[0] || data?.error || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none'

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#f8fbff_0%,#eef7ff_42%,#f7f4ea_100%)] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-slate-200 bg-white/85 p-8 shadow-xl backdrop-blur-xl md:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <ShieldCheck size={16} />
            Chakra Finance secure recovery
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Recover access with email OTP verification.</h1>
          <p className="mt-4 text-base text-slate-600">
            Request a one-time password, verify it, and reset your Chakra Finance account password without involving engineering support.
          </p>
          <Link className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-sky-700" to="/login">
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </section>

        <section className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-xl md:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-700">Forgot Password</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            {step === 1 && 'Request OTP'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Set new password'}
          </h2>

          {step === 1 && (
            <form className="mt-8 space-y-5" onSubmit={requestOtp}>
              <div>
                <label className="mb-2 block text-sm text-slate-700">Role</label>
                <select className={inputClass} name="role" value={form.role} onChange={setField}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-700">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <Mail size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="email" type="email" value={form.email} onChange={setField} />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full gap-2 bg-slate-950 text-white hover:bg-slate-800">
                Send OTP
              </Button>
            </form>
          )}

          {step === 2 && (
            <form className="mt-8 space-y-5" onSubmit={verifyOtp}>
              <div>
                <label className="mb-2 block text-sm text-slate-700">OTP code</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <KeyRound size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="otp" value={form.otp} onChange={setField} maxLength={6} />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full gap-2 bg-slate-950 text-white hover:bg-slate-800">
                Verify OTP
              </Button>
            </form>
          )}

          {step === 3 && (
            <form className="mt-8 space-y-5" onSubmit={resetPassword}>
              <div>
                <label className="mb-2 block text-sm text-slate-700">New password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <KeyRound size={18} className="text-sky-700" />
                  <input className="w-full bg-transparent text-sm text-slate-900 outline-none" name="password" type="password" value={form.password} onChange={setField} />
                </div>
              </div>
              <Button type="submit" loading={loading} className="w-full gap-2 bg-slate-950 text-white hover:bg-slate-800">
                Reset password
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
