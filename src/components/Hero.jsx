import { motion } from 'motion/react'

const fadeUp = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

const trustItems = ['Sin azúcar añadida', 'Gluten free', 'Alta proteína']

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-nk-ivory">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-nk-gold/10 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-[350px] h-48 sm:h-[350px] rounded-full bg-nk-olive/8 blur-[60px] sm:blur-[100px]" />
        <div className="absolute top-1/4 right-1/3 w-40 sm:w-[300px] h-40 sm:h-[300px] rounded-full bg-nk-arena/50 blur-[50px] sm:blur-[80px]" />
      </div>

      {/* Asteriscos decorativos — solo desktop */}
      <motion.div
        initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute top-28 right-24 text-nk-gold/18 text-[120px] select-none pointer-events-none"
        style={{ fontFamily: 'serif' }}
      >
        ✦
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="hidden lg:block absolute bottom-32 left-10 text-nk-olive/18 text-5xl select-none pointer-events-none"
        style={{ fontFamily: 'serif' }}
      >
        ✦
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-28 pb-16 lg:py-32 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-5 lg:gap-8">

          <motion.div {...fadeUp(0.1)}>
            <span
              className="inline-flex items-center gap-2 border border-nk-gold/50 text-nk-gold text-[10px] sm:text-xs tracking-[2px] sm:tracking-[3px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-nk-gold/5"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-nk-gold animate-pulse shrink-0" />
              SNACKS KETO PREMIUM
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block text-[clamp(40px,9vw,96px)] font-black text-nk-choco">Comer</span>
            <span className="block text-[clamp(40px,9vw,96px)] font-black italic text-nk-gold">sano</span>
            <span className="block text-[clamp(40px,9vw,96px)] font-black text-nk-choco">es elegir</span>
            <span className="block text-[clamp(40px,9vw,96px)] font-black italic text-nk-olive">mejor.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.35)} className="text-nk-muted text-base lg:text-lg max-w-md leading-relaxed">
            Snacks elaborados con ingredientes reales, sin azúcar añadida y libres de gluten.
            El placer de comer rico <span className="text-nk-choco font-medium">sin culpa</span>.
          </motion.p>

          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row flex-wrap gap-3">
            <a
              href="https://wa.me/51999999999?text=Hola!%20Quiero%20hacer%20un%20pedido%20de%20NUDA%20KETO"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 bg-nk-choco hover:bg-nk-gold text-nk-ivory px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(75,53,39,0.3)]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hacer mi pedido
            </a>
            <a
              href="#productos"
              className="flex items-center justify-center gap-2 border-2 border-nk-choco/25 text-nk-choco hover:border-nk-gold hover:text-nk-gold px-6 py-3.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300"
            >
              Ver productos
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-4 pt-1">
            {trustItems.map((label) => (
              <span key={label} className="flex items-center gap-2 text-nk-muted text-xs sm:text-sm">
                <span className="w-1 h-1 rounded-full bg-nk-gold shrink-0" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Mockup packaging — visible solo en sm+ */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:flex relative justify-center items-center"
        >
          <div className="absolute inset-0 rounded-3xl bg-nk-gold/5 blur-3xl" />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full max-w-xs lg:max-w-sm"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(75,53,39,0.18)] border border-nk-arena">
              {/* Parte superior */}
              <div className="bg-gradient-to-b from-[#FEFCF8] to-[#F5EFE3] px-6 lg:px-8 pt-8 lg:pt-10 pb-5 lg:pb-6 flex flex-col items-center gap-3 lg:gap-4">
                <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full border-2 border-nk-gold flex flex-col items-center justify-center bg-white shadow-sm">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-nk-choco text-base lg:text-lg leading-none">NUDA</span>
                  <div className="w-8 lg:w-10 h-px bg-nk-gold my-1" />
                  <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-nk-gold text-[7px] lg:text-[8px] tracking-[3px]">KETO</span>
                </div>

                <div className="flex gap-2 lg:gap-3">
                  {['SIN\nAZÚCAR', 'GLUTEN\nFREE'].map((t) => (
                    <div key={t} className="w-9 lg:w-10 h-9 lg:h-10 rounded-full border border-nk-choco flex items-center justify-center">
                      <span className="text-[6px] lg:text-[7px] text-nk-choco text-center leading-tight font-bold whitespace-pre-line" style={{ fontFamily: "'DM Mono', monospace" }}>{t}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-lg lg:text-xl font-bold leading-tight">Galletón</h3>
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-choco text-lg lg:text-xl font-bold leading-tight">Chips Almendras</h3>
                  <p className="text-nk-muted text-[10px] lg:text-xs mt-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>Vainilla real · Textura chewy</p>
                  <p className="text-nk-muted text-[10px] lg:text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>Proteínas: 6 g por galletón</p>
                </div>

                <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-full bg-nk-arena/60 border-2 border-nk-arena flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nk-arena to-nk-gold/40" />
                </div>

                <p className="text-nk-muted text-[9px] lg:text-[10px]" style={{ fontFamily: "'DM Mono', monospace" }}>Contenido neto: 135 g</p>
              </div>

              <div className="bg-gradient-to-r from-[#B89448] via-nk-gold to-[#CEB070] py-3 lg:py-4 px-5 lg:px-6 flex justify-between items-center">
                <span className="text-nk-ivory text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>PACK x3</span>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-nk-ivory text-lg lg:text-xl font-black">S/25.00</span>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: -8 }}
              transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-3 -right-3 bg-nk-choco text-nk-ivory text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-lg"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              MÁS VENDIDO
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-nk-gold/60"
      >
        <span className="text-[9px] tracking-[3px]" style={{ fontFamily: "'DM Mono', monospace" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-6 bg-gradient-to-b from-nk-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
