import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { apiFetch, SessionExpiredError, assetUrl } from '../../lib/api'
import { money } from '../../lib/format'
import ProductEditor from './ProductEditor'

const CATS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'tortas', label: 'Tortas' },
  { id: 'cuchareables', label: 'Cuchareables' },
  { id: 'galletones', label: 'Galletones' },
  { id: 'barras', label: 'Barras' },
  { id: 'bites', label: 'Keto Bites' },
]

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('ALL')
  const [editing, setEditing] = useState(null) // producto | 'new' | null

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

  const toggleActive = async (p) => {
    const next = !p.active
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: next } : x)))
    try {
      const res = await apiFetch(`/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) throw new Error()
      toast.success(next ? 'Producto visible en la tienda' : 'Producto oculto de la tienda')
    } catch (err) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x)))
      if (!(err instanceof SessionExpiredError)) toast.error('No se pudo cambiar la visibilidad')
    }
  }

  const deleteProduct = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    setProducts((prev) => prev.filter((x) => x.id !== p.id))
    try {
      const res = await apiFetch(`/products/${p.id}/permanent`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Producto eliminado')
    } catch (err) {
      setProducts((prev) => [...prev, p])
      if (!(err instanceof SessionExpiredError)) toast.error('No se pudo eliminar el producto')
    }
  }

  const onSaved = (saved) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]
    })
    setEditing(null)
  }

  const filtered = useMemo(() => {
    let list = cat === 'ALL' ? products : products.filter((p) => p.category === cat)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((p) => `${p.name} ${p.slug} ${p.category}`.toLowerCase().includes(q))
    return list
  }, [products, cat, query])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
            Productos
          </h1>
          <p className="mt-0.5 text-xs text-nk-muted">
            {products.length} en total · {products.filter((p) => p.active).length} visibles en la tienda
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="rounded-full bg-nk-choco px-5 py-2.5 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="rounded-2xl border-2 border-nk-gold/30 bg-nk-gold/5 p-4 text-xs leading-relaxed text-nk-choco">
        Lo que edites acá se aplica <strong>al instante</strong> en la tienda y en el cobro: ya no hace
        falta publicar una versión nueva de la web para cambiar un precio.
      </div>

      {/* Buscador + categorías */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nk-muted">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full rounded-2xl border-2 border-nk-arena bg-white py-3 pl-11 pr-4 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => {
            const n = c.id === 'ALL' ? products.length : products.filter((p) => p.category === c.id).length
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  cat === c.id
                    ? 'border-nk-choco bg-nk-choco text-nk-ivory'
                    : 'border-nk-arena bg-white text-nk-muted hover:border-nk-choco hover:text-nk-choco'
                }`}
              >
                {c.label} <span className="opacity-60">{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      {loading && <div className="py-20 text-center text-nk-muted">Cargando productos...</div>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-nk-muted">Sin resultados.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="flex flex-col gap-3">
          {filtered.map((p) => {
            const prices = p.sizes.map((s) => s.price)
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            return (
              <li
                key={p.id}
                className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4 transition-colors sm:flex-nowrap ${
                  p.active ? 'border-nk-arena' : 'border-nk-arena/50 opacity-60'
                }`}
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-nk-arena bg-nk-ivory2">
                  {p.image && <img src={assetUrl(p.image)} alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-nk-choco">{p.name}</p>
                    {p.badge && (
                      <span
                        style={{ fontFamily: "'DM Mono', monospace" }}
                        className="rounded-full bg-nk-choco px-2 py-0.5 text-[9px] font-black text-nk-ivory"
                      >
                        {p.badge}
                      </span>
                    )}
                    {p.refrigerated && (
                      <span className="rounded-full border border-nk-olive/40 bg-nk-olive/10 px-2 py-0.5 text-[9px] font-bold text-nk-olive">
                        SOLO LIMA
                      </span>
                    )}
                    {!p.active && (
                      <span className="rounded-full border border-nk-arena px-2 py-0.5 text-[9px] font-bold text-nk-muted">
                        OCULTO
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-nk-muted">
                    {p.category} · {p.sizes.length} {p.sizes.length === 1 ? 'presentación' : 'presentaciones'}
                    {p.stock != null && ` · stock ${p.stock}`}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-lg font-black text-nk-choco"
                  >
                    {min === max ? money(min * 100) : `${money(min * 100)} – ${money(max * 100)}`}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toggleActive(p)}
                    className="rounded-xl border-2 border-nk-arena px-3 py-2 text-xs font-semibold text-nk-muted transition-colors hover:border-nk-choco hover:text-nk-choco"
                  >
                    {p.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => setEditing(p)}
                    className="rounded-xl bg-nk-choco px-4 py-2 text-xs font-semibold text-nk-ivory transition-colors hover:bg-nk-gold"
                  >
                    Editar
                  </button>
                  {p.odooId && (
                    <button
                      onClick={() => deleteProduct(p)}
                      title="Eliminar (producto borrado en Odoo)"
                      className="rounded-xl border-2 border-red-200 p-2 text-red-400 transition-colors hover:border-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <ProductEditor
        open={editing !== null}
        product={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={onSaved}
      />
    </div>
  )
}
