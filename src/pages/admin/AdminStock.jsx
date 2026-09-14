import { useState, useEffect, useCallback } from 'react'
import { apiFetch, assetUrl, SessionExpiredError } from '../../lib/api'

const FILTERS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'AGOTADO', label: 'Agotados' },
  { id: 'CON_STOCK', label: 'Con stock' },
]

const GHOST_CATEGORY = 'general'

export default function AdminStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/products/admin/all')
      if (res.status === 403) throw new Error('No autorizado')
      if (!res.ok) throw new Error('No se pudieron cargar los productos')
      setProducts(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const realProducts = products.filter((p) => p.category !== GHOST_CATEGORY)

  const sorted = [...realProducts].sort((a, b) => {
    const av = a.stock ?? Infinity
    const bv = b.stock ?? Infinity
    return av - bv
  })

  const filtered = sorted.filter((p) => {
    if (filter === 'AGOTADO') return p.stock === 0
    if (filter === 'CON_STOCK') return p.stock != null && p.stock > 0
    return true
  })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
          Stock
        </h1>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => {
          const n =
            f.id === 'ALL'
              ? realProducts.length
              : f.id === 'AGOTADO'
                ? realProducts.filter((p) => p.stock === 0).length
                : realProducts.filter((p) => p.stock != null && p.stock > 0).length
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'border-nk-choco bg-nk-choco text-nk-ivory'
                  : 'border-nk-arena bg-white text-nk-muted hover:border-nk-choco hover:text-nk-choco'
              }`}
            >
              {f.label} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      {loading && <div className="py-20 text-center text-nk-muted">Cargando stock...</div>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-nk-muted">Sin resultados.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-nk-arena bg-white p-4 sm:flex-nowrap"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-nk-arena bg-nk-ivory2">
                {p.image && <img src={assetUrl(p.image)} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-nk-choco">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-nk-muted">{p.category}</p>
              </div>

              <div className="shrink-0">
                {p.stock === 0 && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                    AGOTADO
                  </span>
                )}
                {p.stock != null && p.stock > 0 && (
                  <span className="rounded-full border border-nk-olive/40 bg-nk-olive/10 px-3 py-1 text-xs font-bold text-nk-olive">
                    {p.stock} unidades
                  </span>
                )}
                {p.stock == null && (
                  <span className="rounded-full border border-nk-arena px-3 py-1 text-xs font-medium text-nk-muted">
                    Sin control
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
