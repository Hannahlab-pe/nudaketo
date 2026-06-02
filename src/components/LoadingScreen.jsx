import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState(0) // 0=logo, 1=text, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => onDone(), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-nk-choco flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Blobs de fondo */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-nk-gold/8 blur-[100px]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
              className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-nk-olive/5 blur-[80px]"
            />
          </div>

          {/* Centro: logo + nombre */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Círculo del logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 rounded-full border-2 border-nk-gold flex items-center justify-center relative"
            >
              {/* Anillo giratorio */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-nk-gold/40 border-r-nk-gold/40"
              />
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                <ellipse cx="12" cy="12" rx="4" ry="6" stroke="#C2A45E" strokeWidth="1.5"/>
                <path d="M12 6 C12 6 8 10 8 14" stroke="#C2A45E" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* Nombre de marca */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.15em' }}
                    className="text-nk-ivory text-4xl font-black"
                  >
                    NUDA
                  </span>
                  <span
                    style={{ fontFamily: "'DM Mono', monospace", letterSpacing: '0.5em' }}
                    className="text-nk-gold text-sm"
                  >
                    KETO
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-nk-ivory/35 text-sm italic"
                >
                  "Comer sano no implica comer feo."
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Barra de progreso */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-nk-ivory/8">
            <motion.div
              className="h-full bg-nk-gold"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Versión */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ fontFamily: "'DM Mono', monospace" }}
            className="absolute bottom-6 right-6 text-nk-ivory/15 text-[10px] tracking-[3px]"
          >
            LIMA · PERÚ
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
