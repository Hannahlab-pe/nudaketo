import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import './index.css'

// Todo lo que no necesita un visitante que solo viene a mirar la tienda se
// descarga aparte: el checkout y el perfil arrastran Leaflet (~150 kB) y el
// panel arrastra el admin entero.
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const PerfilPage = lazy(() => import('./pages/PerfilPage'))
const MisComprasPage = lazy(() => import('./pages/MisComprasPage'))
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'))
const AdminOrderDetailPage = lazy(() => import('./pages/AdminOrderDetailPage'))
const VendedorPage = lazy(() => import('./pages/VendedorPage'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminSellers = lazy(() => import('./pages/admin/AdminSellers'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))
const ComplaintsPage = lazy(() => import('./pages/ComplaintsPage'))

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nk-ivory px-6 text-center">
      <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] tracking-[4px] text-nk-gold">
        ERROR 404
      </p>
      <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-black text-nk-choco">
        Esta página no existe
      </h1>
      <p className="max-w-sm text-sm text-nk-muted">
        El enlace que seguiste no lleva a ningún lado. Puede que el producto ya no esté disponible.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <a href="/tienda" className="rounded-full bg-nk-choco px-6 py-3 text-sm font-semibold text-nk-ivory transition-colors hover:bg-nk-gold">
          Ir a la tienda
        </a>
        <a href="/" className="rounded-full border-2 border-nk-arena px-6 py-3 text-sm font-semibold text-nk-choco transition-colors hover:border-nk-choco">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nk-ivory">
      <div className="flex flex-col items-center gap-3 text-nk-muted">
        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm">Cargando...</span>
      </div>
    </div>
  )
}

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0); ScrollTrigger.refresh() }, [pathname])
  return null
}

function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }),
    })
    return () => st.kill()
  }, [])
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-[3px] bg-linear-to-r from-nk-gold via-nk-gold2 to-nk-gold z-[55] origin-left"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}

function Layout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    // Sincroniza Lenis con el ticker de GSAP para que ScrollTrigger sea fluido
    lenis.on('scroll', ScrollTrigger.update)
    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="overflow-x-hidden">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <CartDrawer />
      <AuthModal />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<StorePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="clientes" element={<AdminCustomers />} />
          <Route path="vendedores" element={<AdminSellers />} />
        </Route>
        <Route path="/admin/pedido/:id" element={<AdminOrderDetailPage />} />
        <Route path="/vendedor" element={<VendedorPage />} />
        <Route path="/mis-compras" element={<MisComprasPage />} />
        <Route path="/mis-compras/:id" element={<OrderDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/terminos-y-condiciones" element={<TermsPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPage />} />
        <Route path="/politica-de-devoluciones" element={<ReturnsPage />} />
        <Route path="/libro-de-reclamaciones" element={<ComplaintsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const handleDone = useCallback(() => setLoading(false), [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                fontFamily: "'DM Mono', monospace",
                borderRadius: '14px',
              },
            }}
          />
          <ProductsProvider>
            <AnimatePresence>
              {loading && <LoadingScreen key="loader" onDone={handleDone} />}
            </AnimatePresence>
            <Layout />
          </ProductsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
