import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'

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

export default function CartDrawer() {
  const { items, total, count, isOpen, setIsOpen, removeItem, updateQty, clearCart } = useCart()
  const navigate = useNavigate()

  const goToCheckout = () => {
    setIsOpen(false)
    navigate('/checkout')
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
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full border border-nk-arena flex items-center justify-center text-nk-muted hover:text-nk-choco hover:border-nk-choco transition-colors"
              >
                <IconClose />
              </button>
            </div>

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

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-nk-arena bg-white flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-nk-muted text-sm">Subtotal</span>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-black text-nk-choco">
                    S/{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-nk-muted text-[11px] text-center">El envío se calcula en el siguiente paso</p>

                <button
                  onClick={goToCheckout}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
