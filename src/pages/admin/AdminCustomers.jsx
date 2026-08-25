import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiFetch, SessionExpiredError } from '../../lib/api'
import { money, timeAgo } from '../../lib/format'
import { IconChat } from '../../components/icons'

const SORTS = [
  { id: 'spent', label: 'Más gastaron' },
  { id: 'orders', label: 'Más pedidos' },
  { id: 'recent', label: 'Compra reciente' },
  { id: 'new', label: 'Más nuevos' },
]

export default function AdminCustomers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('spent')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/admin/customers')
      if (res.status === 403) throw new Error('No autorizado')
      if (!res.ok) throw new Error('No se pudieron cargar los clientes')
      setRows(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = q
      ? rows.filter((r) =>
          [r.name, r.email, r.phone, r.district, r.city].filter(Boolean).join(' ').toLowerCase().includes(q),
        )
      : rows.slice()

    switch (sort) {
      case 'orders': list.sort((a, b) => b.orders - a.orders); break
      case 'recent':
        list.sort((a, b) => new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0)); break
      case 'new':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      default: list.sort((a, b) => b.spentCents - a.spentCents)
    }
    return list
  }, [rows, query, sort])

  const buyers = rows.filter((r) => r.orders > 0).length
  const totalSpent = rows.reduce((a, r) => a + r.spentCents, 0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
          Clientes
        </h1>
        <p className="mt-0.5 text-xs text-nk-muted">
          {rows.length} registrados · {buyers} han comprado · {money(totalSpent)} facturado
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nk-muted">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo, teléfono o distrito..."
            className="w-full rounded-2xl border-2 border-nk-arena bg-white py-3 pl-11 pr-4 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ fontFamily: "'DM Mono', monospace" }}
          className="cursor-pointer rounded-2xl border-2 border-nk-arena bg-white px-4 py-3 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none sm:min-w-52"
        >
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {loading && <div className="py-20 text-center text-nk-muted">Cargando clientes...</div>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-nk-muted">
          {rows.length === 0 ? 'Todavía no hay clientes registrados.' : 'Sin resultados para tu búsqueda.'}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => (
            <li key={c.id} className="rounded-2xl border border-nk-arena bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nk-choco">
                    <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm font-bold text-nk-ivory">
                      {(c.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-nk-choco">{c.name}</p>
                    <p className="truncate text-xs text-nk-muted">{c.email}</p>
                    {(c.district || c.city) && (
                      <p className="mt-0.5 text-[11px] text-nk-muted">
                        {[c.district, c.city].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">
                    {money(c.spentCents)}
                  </p>
                  <p className="text-[11px] text-nk-muted">
                    {c.orders} {c.orders === 1 ? 'pedido' : 'pedidos'}
                    {c.orders > 0 && ` · ticket ${money(c.avgTicketCents)}`}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-nk-arena pt-3 text-[11px] text-nk-muted">
                <span>
                  Última compra: <strong className="text-nk-choco">{timeAgo(c.lastOrderAt)}</strong>
                </span>
                {c.phone && (
                  <a
                    href={`https://wa.me/51${c.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-nk-olive hover:underline"
                  >
                    <IconChat className="h-3.5 w-3.5" /> {c.phone}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
