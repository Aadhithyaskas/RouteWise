export default function DataTable({ columns, data, emptyMessage = 'No records found.', variant = 'light' }) {
  const styles =
    variant === 'light'
      ? {
          empty: 'rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600',
          wrapper: 'overflow-hidden rounded-[24px] border border-slate-200 bg-white',
          table: 'min-w-full divide-y divide-slate-200 text-left',
          thead: 'bg-slate-50',
          th: 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500',
          tbody: 'divide-y divide-slate-100 bg-white',
          row: 'transition hover:bg-sky-50/60',
          td: 'px-4 py-4 text-sm text-slate-800',
        }
      : {
          empty: 'rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-300',
          wrapper: 'overflow-hidden rounded-[24px] border border-white/10',
          table: 'min-w-full divide-y divide-white/10 text-left',
          thead: 'bg-white/5',
          th: 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300',
          tbody: 'divide-y divide-white/6 bg-slate-950/20',
          row: 'transition hover:bg-white/4',
          td: 'px-4 py-4 text-sm text-slate-100',
        }

  if (!data.length) {
    return <p className={styles.empty}>{emptyMessage}</p>
  }

  return (
    <div className={styles.wrapper}>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={styles.th}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.map((row, index) => (
              <tr key={row.id ?? index} className={styles.row}>
                {columns.map((column) => (
                  <td key={column.key} className={styles.td}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
