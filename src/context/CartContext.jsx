import { createContext, useContext, useReducer, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'nk_cart'

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed?.items)) return { items: parsed.items }
    }
  } catch {
    // ignora datos corruptos
  }
  return { items: [] }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.id}-${action.item.sizeId}`
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, key }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, qty: Math.max(1, action.qty) } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)
  const [isOpen, setIsOpen] = useState(false)

  // Persiste el carrito en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }))
    } catch {
      // almacenamiento no disponible
    }
  }, [state.items])

  const addItem = (item) => {
    dispatch({ type: 'ADD', item })
    setIsOpen(true)
  }
  const removeItem = (key) => dispatch({ type: 'REMOVE', key })
  const updateQty = (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const total = state.items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const count = state.items.reduce((acc, i) => acc + i.qty, 0)

  const buildWhatsAppMessage = () => {
    const lines = state.items.map(
      (i) => `• ${i.name} (${i.sizeLabel}) x${i.qty} = S/${(i.price * i.qty).toFixed(2)}`
    )
    lines.push(`\nTotal: S/${total.toFixed(2)}`)
    return encodeURIComponent('Hola! Quiero hacer este pedido NUDA KETO:\n\n' + lines.join('\n'))
  }

  return (
    <CartContext.Provider
      value={{ items: state.items, total, count, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, buildWhatsAppMessage }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
