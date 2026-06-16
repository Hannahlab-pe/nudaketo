import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CULQI_KEY = import.meta.env.VITE_CULQI_PUBLIC_KEY || ''
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Espera a que el script de Culqi (v3) esté disponible en window.Culqi
function waitForCulqi(timeout = 6000) {
  return new Promise((resolve, reject) => {
    if (window.Culqi) return resolve(window.Culqi)
    const start = Date.now()
    const interval = setInterval(() => {
      if (window.Culqi) {
        clearInterval(interval)
        resolve(window.Culqi)
      } else if (Date.now() - start > timeout) {
        clearInterval(interval)
        reject(new Error('Culqi no cargó'))
      }
    }, 100)
  })
}

const IconTrash = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)
const IconEmptyCart = () => (
  <svg viewBox="0 0 24 24" className="w-14 h-14 fill-none stroke-current stroke-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
)
const IconCard = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <path d="M1 10h22"/>
  </svg>
)
export default function CartDrawer() {
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQty, clearCart } = useCart()
  const { isAuthenticated, token, openLogin } = useAuth()
  const [paying, setPaying] = useState(false)
  const [paymentOk, setPaymentOk] = useState(false)
  const [payError, setPayError] = useState('')

  // Ref para acceder a items/total/token dentro del callback global de Culqi
  const stateRef = useRef({})
  stateRef.current = { items, total, token }
  // Evita abrir el checkout dos veces por doble-click
  const openingRef = useRef(false)
  // Evita procesar el mismo cobro dos veces
  const chargingRef = useRef(false)

  // Envía el token de Culqi al backend para crear el cargo + la orden
  const processCharge = useCallback(async (tokenId, email) => {
    if (chargingRef.current) return // ya hay un cobro en curso
    chargingRef.current = true
    setPaying(true)
    setPayError('')
    const tid = toast.loading('Procesando tu pago...')
    const { items: cartItems, token: authToken } = stateRef.current
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          culqiToken: tokenId,
          email,
          items: cartItems.map(i => ({
            productId: i.id,
            sizeId: i.sizeId,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Error al procesar el pago')
      }
      clearCart()
      setPaymentOk(true)
      toast.success('¡Pago realizado con éxito!', { id: tid })
    } catch (err) {
      const msg = err.message || 'Error al procesar el pago. Intenta nuevamente.'
      setPayError(msg)
      toast.error(msg, { id: tid })
    } finally {
      setPaying(false)
      chargingRef.current = false
      openingRef.current = false
    }
  }, [clearCart])

  // Callback global que Culqi (v3) invoca al generar el token o ante error
  useEffect(() => {
    window.culqi = () => {
      const C = window.Culqi
      if (!C) return
      if (C.token) {
        const tokenId = C.token.id
        const email = C.token.email
        C.close()
        processCharge(tokenId, email)
      } else if (C.order) {
        C.close()
      } else if (C.error) {
        toast.error(C.error.user_message || 'No se pudo procesar el pago.')
      }
    }
    return () => { window.culqi = undefined }
  }, [processCharge])

  // Abre el checkout de Culqi v3
  const openCulqi = useCallback(async () => {
    if (!CULQI_KEY) {
      toast.error('El pago aún no está configurado. Contáctanos para completar tu pedido.')
      return
    }
    setPayError('')
    let Culqi
    try {
      Culqi = await waitForCulqi()
    } catch {
      toast.error('El sistema de pago no cargó. Revisa tu conexión y recarga la página.')
      return
    }

    const { total: cartTotal, items: cartItems } = stateRef.current
    const qty = cartItems.reduce((acc, i) => acc + i.qty, 0)

    Culqi.publicKey = CULQI_KEY
    Culqi.settings({
      title: 'NUDA KETO',
      currency: 'PEN',
      description: `Pedido NUDA KETO (${qty} producto${qty > 1 ? 's' : ''})`,
      amount: Math.round(cartTotal * 100), // céntimos
    })
    Culqi.open()
  }, [])

  const handleCulqiPay = () => {
    if (items.length === 0 || paying) return
    // Bloqueo anti doble-click (se libera a los 2.5s o al cerrar/pagar)
    if (openingRef.current) return
    openingRef.current = true
    setTimeout(() => { openingRef.current = false }, 2500)

    if (!isAuthenticated) {
      toast.info('Inicia sesión para completar tu compra')
      openLogin(() => openCulqi())
      return
    }
    openCulqi()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-nk-choco/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-nk-ivory shadow-[-8px_0_40px_rgba(75,53,39,0.15)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-nk-arena">
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">Carrito</h2>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mt-0.5">
                  {count} {count === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                </p>
              </div>
              <button
                onClick={() => { setIsOpen(false); setPaymentOk(false) }}
                className="w-9 h-9 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* Pantalla de pago exitoso */}
            {paymentOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-nk-olive/15 border-2 border-nk-olive flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-nk-olive stroke-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco">
                  ¡Pago recibido!
                </h3>
                <p className="text-nk-muted text-sm leading-relaxed">
                  Tu pedido fue procesado correctamente. Te contactaremos pronto para coordinar la entrega.
                </p>
                <button
                  onClick={() => { setPaymentOk(false); setIsOpen(false) }}
                  className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-nk-muted">
                      <IconEmptyCart />
                      <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-nk-choco/50">
                        Tu carrito está vacío
                      </p>
                      <p className="text-sm text-center">Agrega alguno de nuestros productos.</p>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="mt-2 border border-nk-choco/30 text-nk-choco px-5 py-2 rounded-full text-sm hover:bg-nk-choco hover:text-nk-ivory transition-colors"
                      >
                        Ver productos
                      </button>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.li
                            key={item.key}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex gap-3 items-start p-4 rounded-2xl border border-nk-arena bg-white"
                          >
                            <div className="w-12 h-12 rounded-xl bg-nk-arena/40 border border-nk-arena shrink-0 flex items-center justify-center">
                              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-gold font-bold text-lg">
                                {item.name.charAt(0)}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-nk-choco text-sm font-semibold leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {item.name}
                              </p>
                              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-wider mt-0.5">
                                {item.sizeLabel} · {item.size}
                              </p>

                              <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 border border-nk-arena rounded-full px-2 py-1">
                                  <button
                                    onClick={() => item.qty === 1 ? removeItem(item.key) : updateQty(item.key, item.qty - 1)}
                                    className="w-5 h-5 flex items-center justify-center text-nk-muted hover:text-nk-choco"
                                  >
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M5 12h14"/></svg>
                                  </button>
                                  <span className="text-nk-choco text-sm font-semibold w-5 text-center">{item.qty}</span>
                                  <button
                                    onClick={() => updateQty(item.key, item.qty + 1)}
                                    className="w-5 h-5 flex items-center justify-center text-nk-muted hover:text-nk-choco"
                                  >
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold text-sm">
                                    S/{(item.price * item.qty).toFixed(2)}
                                  </span>
                                  <button onClick={() => removeItem(item.key)} className="text-nk-muted hover:text-red-400 transition-colors">
                                    <IconTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {/* Footer con botones de pago */}
                {items.length > 0 && (
                  <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-nk-arena bg-white flex flex-col gap-3">
                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-nk-muted text-sm">Total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco">
                        S/{total.toFixed(2)}
                      </span>
                    </div>

                    {/* Error de pago */}
                    {payError && (
                      <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        {payError}
                      </p>
                    )}

                    {/* Separador visual */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-nk-arena" />
                      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider">MÉTODOS DE PAGO</span>
                      <div className="flex-1 h-px bg-nk-arena" />
                    </div>

                    {/* Botón principal: Culqi (tarjeta) */}
                    <button
                      onClick={handleCulqiPay}
                      disabled={paying}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {paying ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Abriendo pago...
                        </>
                      ) : (
                        <>
                          <IconCard />
                          Pagar S/{total.toFixed(2)}
                        </>
                      )}
                    </button>

                    <button onClick={clearCart} className="text-nk-muted text-xs text-center hover:text-nk-choco transition-colors">
                      Vaciar carrito
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
