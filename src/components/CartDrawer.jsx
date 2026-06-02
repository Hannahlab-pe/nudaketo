import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
  )
}

function IconMinus() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" d="M5 12h14"/>
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-none stroke-current stroke-1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
    </svg>
  )
}

export default function CartDrawer() {
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQty, clearCart, buildWhatsAppMessage } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-nk-choco/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-nk-ivory shadow-[−8px_0_40px_rgba(75,53,39,0.15)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-nk-arena">
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-nk-choco">
                  Carrito
                </h2>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-muted text-xs tracking-wider mt-0.5">
                  {count} {count === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-nk-muted">
                  <IconCart />
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-nk-choco/50">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-center">Agrega alguno de nuestros productos para continuar.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-2 border border-nk-choco/30 text-nk-choco px-5 py-2 rounded-full text-sm hover:bg-nk-choco hover:text-nk-ivory transition-colors"
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 items-start p-4 rounded-2xl border border-nk-arena bg-white"
                      >
                        {/* Color block */}
                        <div className="w-14 h-14 rounded-xl bg-nk-arena/40 border border-nk-arena shrink-0 flex items-center justify-center">
                          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-gold font-bold text-lg">
                            {item.name.charAt(0)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-nk-choco text-sm font-semibold leading-snug truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {item.name}
                          </p>
                          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[10px] tracking-wider mt-0.5">
                            {item.sizeLabel} · {item.size}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty controls */}
                            <div className="flex items-center gap-2 border border-nk-arena rounded-full px-2 py-1">
                              <button
                                onClick={() => item.qty === 1 ? removeItem(item.key) : updateQty(item.key, item.qty - 1)}
                                className="w-5 h-5 flex items-center justify-center text-nk-muted hover:text-nk-choco transition-colors"
                              >
                                <IconMinus />
                              </button>
                              <span className="text-nk-choco text-sm font-semibold w-5 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="w-5 h-5 flex items-center justify-center text-nk-muted hover:text-nk-choco transition-colors"
                              >
                                <IconPlus />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco font-bold">
                                S/{(item.price * item.qty).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-nk-muted hover:text-red-400 transition-colors"
                              >
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
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-nk-arena bg-white flex flex-col gap-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-nk-muted text-sm">Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco">
                    S/{total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout via WhatsApp */}
                <a
                  href={`https://wa.me/51999999999?text=${buildWhatsAppMessage()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-nk-choco hover:bg-nk-gold text-nk-ivory font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Confirmar pedido por WhatsApp
                </a>

                <button onClick={clearCart} className="text-nk-muted text-xs text-center hover:text-nk-choco transition-colors">
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
