import { ArrowRight, CheckCircle2, Compass, MapPinned, Menu, Route, ShieldCheck, Sparkles, X } from 'lucide-react'
import { createElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const features = [
  {
    icon: Route,
    title: 'Ordered field visits',
    description: 'Salespeople receive the visit sequence returned by RouteWise, with each stop clearly numbered.',
  },
  {
    icon: MapPinned,
    title: 'Location-aware work',
    description: 'Live salesperson coordinates and customer locations appear in the existing map views.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification workflow',
    description: 'Customer requests move through assignment, field completion, photo evidence, and finance review.',
  },
]

const steps = [
  ['01', 'Submit a request', 'Customers provide their details, loan information, and location through the public request form.'],
  ['02', 'Assign field work', 'Admins allocate unassigned customers while existing workload thresholds are respected.'],
  ['03', 'Follow the route', 'Salespeople view the backend-provided job order and complete visits with photo evidence.'],
  ['04', 'Review the application', 'Finance reviews completed visits and makes the final approval or rejection decision.'],
]

export default function LandingPage() {
  const { isAuthenticated, getDefaultRoute } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const workspaceLink = isAuthenticated ? getDefaultRoute() : '/login'

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7fafc] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="RouteWise home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-300"><Route size={20} /></span>
            <span><strong className="block text-lg leading-none tracking-tight">RouteWise</strong><small className="text-xs text-slate-500">Chakra Finance</small></span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-sky-700">Features</a>
            <a href="#how-it-works" className="hover:text-sky-700">How it works</a>
            <a href="#route-optimization" className="hover:text-sky-700">Route optimization</a>
            <Link to="/request" className="hover:text-sky-700">Customer request</Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</Link>
            <Link to={workspaceLink} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Get started</Link>
          </div>
          <button type="button" className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && <nav className="border-t border-slate-200 bg-white px-5 py-4 md:hidden"><div className="mx-auto grid max-w-7xl gap-1 text-sm font-medium text-slate-700"><a onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-slate-50" href="#features">Features</a><a onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-slate-50" href="#how-it-works">How it works</a><Link onClick={closeMenu} className="rounded-lg px-3 py-3 hover:bg-slate-50" to="/request">Customer request</Link><Link onClick={closeMenu} className="rounded-lg bg-slate-950 px-3 py-3 text-white" to={workspaceLink}>Get started</Link></div></nav>}
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_90%_15%,rgba(251,191,36,0.16),transparent_23%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-sm font-semibold text-sky-800 shadow-sm"><Sparkles size={15} /> Route-aware field operations</p>
              <h1 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">Plan smarter.<br /><span className="text-sky-700">Travel better.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">RouteWise helps Chakra Finance organize field jobs across cities, present an optimized visit order, and keep verification and loan review connected.</p>
              <div className="mt-9 flex flex-wrap gap-3"><Link to={workspaceLink} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800">Get started <ArrowRight size={17} /></Link><a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50">Explore features <Compass size={17} /></a></div>
            </div>
            <div className="relative mx-auto w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Route sequence</p><p className="mt-1 text-sm text-slate-500">Your next field visits</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live workflow</span></div>
              <div className="relative mt-5 space-y-4 before:absolute before:left-6 before:top-7 before:h-[calc(100%-3.5rem)] before:border-l-2 before:border-dashed before:border-sky-200">
                {['Assigned visit', 'Optimized next stop', 'Finance review'].map((label, index) => <div key={label} className="relative flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"><span className="z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span><div><p className="font-semibold text-slate-900">{label}</p><p className="mt-0.5 text-sm text-slate-500">Displayed from the RouteWise workflow.</p></div></div>)}
              </div>
              <div className="mt-5 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900"><strong>Clear next actions.</strong> Job sequence, evidence capture, and review status stay easy to follow.</div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Built around the real workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Every visit has a clearer path forward.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({ icon, title, description }) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700">{createElement(icon, { size: 21 })}</span><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></article>)}</div></section>

        <section id="how-it-works" className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">How it works</p><h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">A connected process from request to decision.</h2><div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">{steps.map(([number, title, description]) => <article key={number}><span className="text-sm font-bold text-sky-700">{number}</span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></div></section>

        <section id="route-optimization" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-8 rounded-[32px] bg-slate-950 p-8 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-12"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Route optimization</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A job order your field team can act on.</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">When a salesperson opens their dashboard or route map, RouteWise displays the ordered jobs produced by the current backend optimization workflow. Numbered markers make the intended visit sequence visible at a glance.</p><Link to={workspaceLink} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-50">Open workspace <ArrowRight size={17} /></Link></div><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><CheckCircle2 className="text-sky-300" size={28} /><h3 className="mt-5 text-xl font-semibold">No invented metrics</h3><p className="mt-3 leading-7 text-slate-300">RouteWise surfaces the available job status, priority order, locations, threshold alerts, and review data. Where data is not available, the app shows a clear empty state.</p></div></div></section>
      </main>
      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>RouteWise for Chakra Finance</span><div className="flex gap-5"><Link to="/request" className="hover:text-sky-700">Customer request</Link><Link to="/login" className="hover:text-sky-700">Login</Link></div></div></footer>
    </div>
  )
}
