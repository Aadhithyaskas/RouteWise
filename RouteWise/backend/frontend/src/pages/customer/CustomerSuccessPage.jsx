import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'

export default function CustomerSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#f8fbff_0%,#eef7ff_42%,#f7f4ea_100%)] px-4 py-10">
      <div className="w-full max-w-xl rounded-[34px] border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-950">Request submitted successfully</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your RouteWise application has been received. Our team will review your request and reach out soon.
        </p>
        <Link to="/request" className="mt-8 inline-block">
          <Button>Submit another request</Button>
        </Link>
      </div>
    </div>
  )
}
