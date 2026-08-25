import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { apiFetch } from '../lib/api'
import { products as fallbackProducts, categories } from '../data/products'

const ProductsContext = createContext(null)

/**
 * Catálogo de la tienda.
 *
 * Se pide a la API para que un cambio de precio en el panel se vea al
 * instante. Si la API no responde se usa el catálogo empaquetado como red de
 * seguridad: es preferible mostrar la tienda con datos de la última versión
 * publicada que dejar la página en blanco. El cobro nunca depende de esto —
 * el servidor recalcula el total con sus propios precios.
 */
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [stale, setStale] = useState(false)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    try {
      const res = await apiFetch('/products', { auth: false })
      if (!res.ok) throw new Error('respuesta no válida')
      const data = await res.json()
      if (!mounted.current) return
      if (Array.isArray(data) && data.length) {
        setProducts(data)
        setStale(false)
      } else {
        setStale(true)
      }
    } catch {
      if (mounted.current) setStale(true)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => { mounted.current = false }
  }, [load])

  return (
    <ProductsContext.Provider value={{ products, categories, loading, stale, reload: load }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}

/** Precio más bajo entre las presentaciones de un producto. */
export function minPrice(product) {
  return Math.min(...product.sizes.map((s) => s.price))
}

/** true si alguno de los items del carrito necesita cadena de frío. */
export function hasRefrigerated(items, products) {
  return items.some((i) => products.find((p) => p.id === i.id)?.refrigerated)
}
