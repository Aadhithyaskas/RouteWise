export default function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-slate-200 bg-white/92 p-6 shadow-sm backdrop-blur-xl ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {title && <h2 className="text-xl font-semibold text-slate-950">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
