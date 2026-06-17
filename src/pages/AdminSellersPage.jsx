import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const empty = { name: '', email: '', password: '', code: '', discountPct: 5, commissionPct: 10 }

export default function AdminSellersPage() {
  const { token, isAuthenticated, isAdmin, openLogin } = useAuth()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(empty)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/sellers`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 403) throw new Error('No autorizado')
      if (!res.ok) throw new Error('No se pudieron cargar los vendedores')
      setSellers(await res.json())
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [token])

  useEffect(() => { if (isAdmin) { load() } else { setLoading(false) } }, [isAdmin, load])

  const setField = (k) => (e) => {
    const v = k === 'code' ? e.target.value.toUpperCase() : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const create = async () => {
    if (!form.name || !form.email || !form.password || !form.code) {
      toast.error('Completa nombre, correo, contraseña y código'); return
    }
    setCreating(true)
    try {
      const res = await fetch(`${API}/sellers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      setForm(empty); setShowForm(false); load()
    } catch (err) {
      toast.error(err.message)
    } finally { setCreating(false) }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Vendedores</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold">Ingresar</button>
      </div>
    )
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Acceso restringido</p>
        <Link to="/" className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold">Volver al inicio</Link>
      </div>
    )
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm'

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
        <Link to="/admin" className="flex items-center gap-1.5 text-nk-muted hover:text-nk-choco text-sm mb-6 transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
          Pedidos
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px] mb-2">NUDA KETO · ADMIN</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl font-black text-nk-choco">Vendedores</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-nk-choco text-nk-ivory px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">
            + Nuevo vendedor
          </button>
        </div>

        {/* Modal crear vendedor (Headless UI) */}
        <Dialog open={showForm} onClose={() => !creating && setShowForm(false)} className="relative z-[80]">
          <DialogBackdrop transition className="fixed inset-0 bg-nk-choco/50 backdrop-blur-sm duration-300 ease-out data-closed:opacity-0" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel transition className="w-full max-w-lg bg-nk-ivory rounded-3xl shadow-[0_24px_64px_rgba(75,53,39,0.25)] overflow-hidden duration-300 ease-out data-closed:opacity-0 data-closed:scale-95">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-nk-arena">
                <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">
                  Nuevo vendedor
                </DialogTitle>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="px-6 py-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Nombre" value={form.name} onChange={setField('name')} />
                  <input className={inputCls} placeholder="Correo" type="email" value={form.email} onChange={setField('email')} />
                  <input className={inputCls} placeholder="Contraseña (mín. 6)" value={form.password} onChange={setField('password')} />
                  <input className={`${inputCls} uppercase`} placeholder="Código (ej: JUAN10)" value={form.code} onChange={setField('code')} />
                  <label className="flex flex-col gap-1">
                    <span className="text-nk-muted text-[11px]">% Descuento al cliente</span>
                    <input className={inputCls} type="number" min="0" max="100" value={form.discountPct} onChange={setField('discountPct')} />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-nk-muted text-[11px]">% Comisión del vendedor</span>
                    <input className={inputCls} type="number" min="0" max="100" value={form.commissionPct} onChange={setField('commissionPct')} />
                  </label>
                </div>
                <button onClick={create} disabled={creating} className="mt-5 w-full py-3 rounded-xl bg-nk-choco text-nk-ivory font-semibold text-sm hover:bg-nk-gold transition-colors disabled:opacity-60">
                  {creating ? 'Creando...' : 'Crear vendedor'}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {loading && <div className="py-20 text-center text-nk-muted">Cargando...</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500 text-sm">{error}</div>}

        {!loading && !error && sellers.length === 0 && (
          <div className="py-16 text-center text-nk-muted">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-nk-choco/60 mb-1">Aún no hay vendedores</p>
            <p className="text-sm">Crea el primero con "+ Nuevo vendedor".</p>
          </div>
        )}

        {!loading && !error && sellers.length > 0 && (
          <div className="flex flex-col gap-4">
            {sellers.map((s) => (
              <div key={s.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-nk-arena">
                  <div>
                    <p className="text-nk-choco font-semibold">{s.name} <span className="text-nk-muted font-normal text-sm">· {s.email}</span></p>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-xs mt-1">
                      Código <strong>{s.sellerCode}</strong> · {s.discountPct}% dto · {s.commissionPct}% comisión
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[9px] tracking-wider">VENTAS</p>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">{s.ventas}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[9px] tracking-wider">VENDIDO</p>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-choco">S/{(s.totalVendidoCents / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[9px] tracking-wider">COMISIÓN</p>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-black text-nk-gold">S/{(s.comisionCents / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
