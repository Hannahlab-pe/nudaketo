import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
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
function Field({ label, value, onChange, placeholder, type = 'text', optional = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-nk-choco text-[11px] font-semibold flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace" }}>
        {label}
        {optional && <span className="text-nk-muted font-normal">(opcional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-nk-arena focus:border-nk-gold focus:outline-none bg-white text-nk-choco text-sm placeholder:text-nk-arena/80 transition-colors"
      />
    </div>
  )
}

function ShippingStep({ fulfillment, setFulfillment, zone, setZone, form, setField }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Tipo de entrega */}
      <div>
        <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-2.5">¿CÓMO LO RECIBES?</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setFulfillment('DELIVERY')}
            className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
              fulfillment === 'DELIVERY' ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white hover:border-nk-gold/50'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-nk-choco stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l1-5h13l1 5M3 9h17M3 9v9a1 1 0 001 1h1m13-10v9a1 1 0 01-1 1h-1m-11 0a2 2 0 104 0m-4 0h4m7 0a2 2 0 104 0m-4 0h4"/></svg>
            <span className="text-nk-choco text-xs font-semibold">Envío a domicilio</span>
          </button>
          <button
            onClick={() => setFulfillment('PICKUP')}
            className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all ${
              fulfillment === 'PICKUP' ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white hover:border-nk-gold/50'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-nk-choco stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6"/></svg>
            <span className="text-nk-choco text-xs font-semibold">Recojo en tienda</span>
          </button>
        </div>
      </div>

      {fulfillment === 'PICKUP' ? (
        <div className="rounded-xl border border-nk-arena bg-white p-4 text-sm text-nk-muted leading-relaxed">
          <p className="text-nk-choco font-semibold mb-1">Recojo en tienda — Gratis</p>
          Te contactaremos por correo para coordinar el día y hora de recojo. 🏪
        </div>
      ) : (
        <>
          {/* Zona */}
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-[3px] mb-2.5">ZONA DE ENVÍO</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setZone('lima')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${zone === 'lima' ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white'}`}
              >
                <span className="text-nk-choco text-sm font-medium">Lima</span>
                <span className="text-nk-gold text-xs font-bold">S/10</span>
              </button>
              <button
                onClick={() => setZone('provincia')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${zone === 'provincia' ? 'border-nk-gold bg-nk-gold/5' : 'border-nk-arena bg-white'}`}
              >
                <span className="text-nk-choco text-sm font-medium">Provincia</span>
                <span className="text-nk-gold text-xs font-bold">S/20</span>
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="flex flex-col gap-3">
            <Field label="NOMBRE COMPLETO" value={form.customerName} onChange={setField('customerName')} placeholder="Tu nombre" />
            <Field label="TELÉFONO" type="tel" value={form.phone} onChange={setField('phone')} placeholder="999 999 999" />
            <Field label="DIRECCIÓN" value={form.address} onChange={setField('address')} placeholder="Av. / Calle y número" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="DISTRITO" value={form.district} onChange={setField('district')} placeholder="Distrito" />
              <Field label="CIUDAD" value={form.city} onChange={setField('city')} placeholder="Ciudad" />
            </div>
            <Field label="REFERENCIA" value={form.reference} onChange={setField('reference')} placeholder="Cerca de..." optional />
            <Field label="LINK DE GOOGLE MAPS" value={form.mapsLink} onChange={setField('mapsLink')} placeholder="Pega el link de tu ubicación" optional />
            <p className="text-nk-muted text-[10px] leading-relaxed">
              💡 Tip: abre Google Maps, marca tu ubicación, toca "Compartir" y pega el link acá para una entrega más precisa.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default function CartDrawer() {
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQty, clearCart } = useCart()
  const { isAuthenticated, token, user, openLogin } = useAuth()
  const [paying, setPaying] = useState(false)
  const [paymentOk, setPaymentOk] = useState(false)
  const [payError, setPayError] = useState('')

  // Checkout: 'cart' (productos) -> 'shipping' (entrega) -> Culqi
  const [step, setStep] = useState('cart')
  const [fulfillment, setFulfillment] = useState('DELIVERY') // 'PICKUP' | 'DELIVERY'
  const [zone, setZone] = useState('lima') // 'lima' | 'provincia'
  const [form, setForm] = useState({
    customerName: '', phone: '', address: '', district: '', city: '', reference: '', mapsLink: '',
  })
  const [formError, setFormError] = useState('')

  // Costo de envío (debe coincidir con el backend: pickup 0, Lima 10, provincia 20)
  const shippingCost = fulfillment === 'PICKUP' ? 0 : zone === 'provincia' ? 20 : 10
  const grandTotal = total + shippingCost

  // Prefill nombre con el del usuario
  useEffect(() => {
    if (user?.name && !form.customerName) {
      setForm((f) => ({ ...f, customerName: user.name }))
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Ref para acceder al estado dentro del callback global de Culqi
  const stateRef = useRef({})
  stateRef.current = { items, total, token, fulfillment, zone, form, grandTotal }
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
    const { items: cartItems, token: authToken, fulfillment: ff, zone: z, form: f } = stateRef.current
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
          fulfillment: ff,
          ...(ff === 'DELIVERY' ? {
            zone: z,
            customerName: f.customerName,
            phone: f.phone,
            address: f.address,
            district: f.district,
            city: f.city,
            reference: f.reference,
            mapsLink: f.mapsLink,
          } : {}),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Error al procesar el pago')
      }
      clearCart()
      setStep('cart')
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

    const { items: cartItems, grandTotal: gt } = stateRef.current
    const qty = cartItems.reduce((acc, i) => acc + i.qty, 0)

    Culqi.publicKey = CULQI_KEY
    Culqi.settings({
      title: 'NUDA KETO',
      currency: 'PEN',
      description: `Pedido NUDA KETO (${qty} producto${qty > 1 ? 's' : ''})`,
      amount: Math.round(gt * 100), // céntimos (productos + envío)
    })
    Culqi.open()
  }, [])

  // Valida el formulario de envío antes de continuar
  const validateShipping = () => {
    if (fulfillment === 'PICKUP') return true
    if (!form.customerName.trim()) { setFormError('Ingresa tu nombre'); return false }
    if (!form.phone.trim()) { setFormError('Ingresa tu teléfono'); return false }
    if (!form.address.trim()) { setFormError('Ingresa tu dirección'); return false }
    if (!form.district.trim()) { setFormError('Ingresa tu distrito'); return false }
    setFormError('')
    return true
  }

  const handleCulqiPay = () => {
    if (items.length === 0 || paying) return
    if (!validateShipping()) return
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

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

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
              <div className="flex items-center gap-2">
                {step === 'shipping' && !paymentOk && (
                  <button
                    onClick={() => { setStep('cart'); setFormError('') }}
                    className="w-8 h-8 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors mr-1"
                    aria-label="Volver"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
                  </button>
                )}
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">
                    {step === 'shipping' ? 'Datos de entrega' : 'Carrito'}
                  </h2>
                  <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-[10px] tracking-wider mt-0.5">
                    {step === 'shipping' ? 'PASO 2 DE 2' : `${count} ${count === 1 ? 'PRODUCTO' : 'PRODUCTOS'}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setIsOpen(false); setPaymentOk(false); setStep('cart') }}
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
                  ¡Gracias por tu compra!
                </h3>
                <p className="text-nk-muted text-sm leading-relaxed">
                  Tu pago fue confirmado y tu pedido ya está en camino. 🎉<br />
                  Te enviaremos los detalles a tu correo y te contactaremos para coordinar la entrega.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  {isAuthenticated && (
                    <Link
                      to="/mis-compras"
                      onClick={() => { setPaymentOk(false); setIsOpen(false) }}
                      className="bg-nk-choco text-nk-ivory px-6 py-3 rounded-full text-sm font-semibold hover:bg-nk-gold transition-colors"
                    >
                      Ver mis compras
                    </Link>
                  )}
                  <button
                    onClick={() => { setPaymentOk(false); setIsOpen(false) }}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                      isAuthenticated
                        ? 'border-2 border-nk-arena text-nk-choco hover:border-nk-choco'
                        : 'bg-nk-choco text-nk-ivory hover:bg-nk-gold'
                    }`}
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Items / Formulario de envío */}
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
                  {step === 'shipping' ? (
                    <ShippingStep
                      fulfillment={fulfillment} setFulfillment={setFulfillment}
                      zone={zone} setZone={setZone}
                      form={form} setField={setField}
                    />
                  ) : items.length === 0 ? (
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

                {/* Footer */}
                {items.length > 0 && step === 'cart' && (
                  <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-nk-arena bg-white flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-nk-muted text-sm">Subtotal</span>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco">
                        S/{total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-nk-muted text-[11px] text-center">El envío se calcula en el siguiente paso</p>

                    <button
                      onClick={() => setStep('shipping')}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300"
                    >
                      Continuar
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                    </button>

                    <button onClick={clearCart} className="text-nk-muted text-xs text-center hover:text-nk-choco transition-colors">
                      Vaciar carrito
                    </button>
                  </div>
                )}

                {/* Footer paso envío: desglose + pagar */}
                {items.length > 0 && step === 'shipping' && (
                  <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-nk-arena bg-white flex flex-col gap-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-nk-muted">Productos</span>
                      <span className="text-nk-choco font-semibold">S/{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-nk-muted">Envío {fulfillment === 'PICKUP' ? '(recojo en tienda)' : zone === 'provincia' ? '(provincia)' : '(Lima)'}</span>
                      <span className="text-nk-choco font-semibold">{shippingCost === 0 ? 'Gratis' : `S/${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-nk-arena">
                      <span className="text-nk-choco text-sm font-semibold">Total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco">
                        S/{grandTotal.toFixed(2)}
                      </span>
                    </div>

                    {(formError || payError) && (
                      <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        {formError || payError}
                      </p>
                    )}

                    <button
                      onClick={handleCulqiPay}
                      disabled={paying}
                      className="mt-1 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
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
                          Pagar S/{grandTotal.toFixed(2)}
                        </>
                      )}
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
