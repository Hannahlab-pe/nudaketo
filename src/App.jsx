import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import AdminPage from './pages/AdminPage'
import MisComprasPage from './pages/MisComprasPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ReturnsPage from './pages/ReturnsPage'
import ComplaintsPage from './pages/ComplaintsPage'
import './index.css'

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<StorePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mis-compras" element={<MisComprasPage />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/terminos-y-condiciones" element={<TermsPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPage />} />
        <Route path="/politica-de-devoluciones" element={<ReturnsPage />} />
        <Route path="/libro-de-reclamaciones" element={<ComplaintsPage />} />
      </Routes>
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
          <AnimatePresence>
            {loading && <LoadingScreen key="loader" onDone={handleDone} />}
          </AnimatePresence>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
