import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { toast } from 'sonner'
import { apiFetch, SessionExpiredError } from '../../lib/api'
import { money } from '../../lib/format'

const empty = { name: '', email: '', password: '', code: '', discountPct: 5, commissionPct: 10 }

const inputCls =
  'w-full rounded-xl border-2 border-nk-arena bg-white px-3.5 py-2.5 text-sm text-nk-choco transition-colors focus:border-nk-gold focus:outline-none'

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(empty)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/sellers')
      if (res.status === 403) throw new Error('No autorizado')
      if (!res.ok) throw new Error('No se pudieron cargar los vendedores')
      setSellers(await res.json())
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const setField = (k) => (e) => {
    const v = k === 'code' ? e.target.value.toUpperCase() : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const create = async () => {
    if (!form.name || !form.email || !form.password || !form.code) {
      toast.error('Completa nombre, correo, contraseña y código')
      return
    }
    setCreating(true)
    try {
      const res = await apiFetch('/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discountPct: Number(form.discountPct),
          commissionPct: Number(form.commissionPct),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'No se pudo crear el vendedor')
      }
      toast.success('Vendedor creado')
      setForm(empty)
      setShowForm(false)
      load()
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  const totalComision = sellers.reduce((a, s) => a + (s.comisionCents || 0), 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco sm:text-3xl">
            Vendedores
          </h1>
          <p className="mt-0.5 text-xs text-nk-muted">
            {sellers.length} activos · {money(totalComision)} en comisiones
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full bg-nk-choco px-5 py-2.5 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold"
        >
          + Nuevo vendedor
        </button>
      </div>

      <Dialog open={showForm} onClose={() => !creating && setShowForm(false)} className="relative z-[80]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-nk-choco/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-nk-ivory shadow-[0_24px_64px_rgba(75,53,39,0.25)] duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="flex items-center justify-between border-b border-nk-arena px-6 pb-4 pt-6">
              <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">
                Nuevo vendedor
              </DialogTitle>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-nk-arena text-nk-muted transition-colors hover:border-nk-choco hover:text-nk-choco"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inputCls} placeholder="Nombre" value={form.name} onChange={setField('name')} />
                <input className={inputCls} placeholder="Correo" type="email" value={form.email} onChange={setField('email')} />
                <input className={inputCls} placeholder="Contraseña (mín. 6)" value={form.password} onChange={setField('password')} />
                <input className={`${inputCls} uppercase`} placeholder="Código (ej: JUAN10)" value={form.code} onChange={setField('code')} />
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-nk-muted">% Descuento al cliente</span>
                  <input className={inputCls} type="number" min="0" max="100" value={form.discountPct} onChange={setField('discountPct')} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-nk-muted">% Comisión del vendedor</span>
                  <input className={inputCls} type="number" min="0" max="100" value={form.commissionPct} onChange={setField('commissionPct')} />
                </label>
              </div>
              <button
                onClick={create}
                disabled={creating}
                className="mt-5 w-full rounded-xl bg-nk-choco py-3 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold disabled:opacity-60"
              >
                {creating ? 'Creando...' : 'Crear vendedor'}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {loading && <div className="py-20 text-center text-nk-muted">Cargando...</div>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && sellers.length === 0 && (
        <div className="py-16 text-center text-nk-muted">
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="mb-1 text-xl text-nk-choco/60">
            Aún no hay vendedores
          </p>
          <p className="text-sm">Crea el primero con "+ Nuevo vendedor".</p>
        </div>
      )}

      {!loading && !error && sellers.length > 0 && (
        <div className="flex flex-col gap-4">
          {sellers.map((s) => (
            <div key={s.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-nk-arena pb-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-nk-choco">
                    {s.name} <span className="text-sm font-normal text-nk-muted">· {s.email}</span>
                  </p>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="mt-1 text-xs text-nk-gold">
                    Código <strong>{s.sellerCode}</strong> · {s.discountPct}% dto · {s.commissionPct}% comisión
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-[9px] tracking-wider text-nk-muted">VENTAS</p>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">{s.ventas}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-[9px] tracking-wider text-nk-muted">VENDIDO</p>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">{money(s.totalVendidoCents)}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-[9px] tracking-wider text-nk-gold">COMISIÓN</p>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-gold">{money(s.comisionCents)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
