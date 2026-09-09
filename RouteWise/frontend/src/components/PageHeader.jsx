export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 md:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
