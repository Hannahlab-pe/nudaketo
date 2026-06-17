import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const statusLabels = {
  PAID: 'Pagado', PROCESSING: 'En preparación', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function VendedorPage() {
  const { token, user, isAuthenticated, openLogin } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isSeller = user?.role === 'VENDEDOR'

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/sellers/my-sales`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 403) throw new Error('Esta sección es solo para vendedores.')
      if (!res.ok) throw new Error('No se pudieron cargar tus ventas.')
      setData(await res.json())
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [token])

  useEffect(() => { if (isSeller) { load() } else { setLoading(false) } }, [isSeller, load])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Panel de vendedor</p>
        <button onClick={() => openLogin()} className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors">Ingresar</button>
      </div>
    )
  }
  if (!isSeller) {
    return (
      <div className="min-h-screen bg-nk-ivory flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-2xl font-bold">Acceso restringido</p>
        <p className="text-nk-muted text-sm">Esta sección es solo para vendedores.</p>
        <Link to="/" className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nk-ivory">
      <div className="h-20" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-[4px] mb-2">VENDEDOR · {(user?.name || '').toUpperCase()}</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl font-black text-nk-choco">Mis ventas</h1>
            {user?.sellerCode && <p className="text-nk-muted text-sm mt-1">Tu código: <strong className="text-nk-choco">{user.sellerCode}</strong></p>}
          </div>
          <button onClick={load} className="flex items-center gap-2 border-2 border-nk-arena hover:border-nk-choco text-nk-choco px-4 py-2.5 rounded-full text-sm font-medium transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-3M20 15a8 8 0 01-14 3"/></svg>
            Actualizar
          </button>
        </div>

        {loading && <div className="py-24 text-center text-nk-muted">Cargando...</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500 text-sm">{error}</div>}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-nk-arena bg-white p-5">
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mb-1">VENTAS</p>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">{data.ventas}</p>
              </div>
              <div className="rounded-2xl border border-nk-arena bg-white p-5">
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mb-1">TOTAL VENDIDO</p>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">S/{(data.totalVendidoCents / 100).toFixed(2)}</p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-nk-gold/40 bg-nk-gold/5 p-5">
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-wider mb-1">TU COMISIÓN</p>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-gold">S/{(data.comisionCents / 100).toFixed(2)}</p>
              </div>
            </div>

            {data.orders.length === 0 ? (
              <div className="py-16 text-center text-nk-muted">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-nk-choco/60 mb-1">Aún no tienes ventas</p>
                <p className="text-sm">Comparte tu código <strong>{user.sellerCode}</strong> con tus clientes.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {data.orders.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-nk-arena bg-white p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-nk-arena">
                      <div>
                        <p className="text-nk-choco font-semibold text-sm">{o.customerName || 'Cliente'}</p>
                        <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[11px] mt-0.5">{fmtDate(o.createdAt)} · {statusLabels[o.status] || o.status}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-black text-nk-choco">S/{(o.totalCents / 100).toFixed(2)}</p>
                        <p className="text-nk-gold text-xs font-semibold">+S/{((o.commissionCents || 0) / 100).toFixed(2)} comisión</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {o.items.map((it) => (
                        <li key={it.id} className="flex items-center justify-between text-sm">
                          <span className="text-nk-choco"><span className="font-semibold">{it.qty}×</span> {it.name}</span>
                          <span className="text-nk-muted">S/{(it.price * it.qty).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
