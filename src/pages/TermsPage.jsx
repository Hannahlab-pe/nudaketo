import LegalLayout from './LegalLayout'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-nk-choco mb-4 pb-2 border-b border-nk-arena">
        {title}
      </h2>
      <div className="text-nk-muted leading-relaxed space-y-3 text-sm lg:text-base">
        {children}
      </div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      subtitle={`Última actualización: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <p className="text-nk-muted text-sm mb-8 p-4 rounded-2xl border border-nk-arena bg-white">
        Al realizar una compra en <strong className="text-nk-choco">NUDA KETO</strong>, usted acepta los presentes Términos y Condiciones. Le recomendamos leerlos detenidamente antes de finalizar su pedido.
      </p>

      <Section title="1. Información del Vendedor">
        <p><strong className="text-nk-choco">Razón social:</strong> NUDA KETO</p>
        <p><strong className="text-nk-choco">Actividad:</strong> Venta de snacks saludables, galletones keto y barras energéticas.</p>
        <p><strong className="text-nk-choco">País de operación:</strong> Perú</p>
        <p><strong className="text-nk-choco">Contacto:</strong> A través de WhatsApp y los medios disponibles en el sitio web.</p>
      </Section>

      <Section title="2. Descripción de Productos">
        <p>NUDA KETO comercializa snacks saludables elaborados con ingredientes naturales, sin azúcar añadida y libres de gluten. Cada producto incluye información nutricional, ingredientes y presentación claramente detallados en la página del producto.</p>
        <p>Las imágenes de los productos son referenciales. El color, textura y presentación final pueden variar ligeramente por tratarse de productos artesanales.</p>
        <p>NUDA KETO se reserva el derecho de modificar la formulación, presentación o disponibilidad de sus productos sin previo aviso, garantizando siempre la calidad y seguridad alimentaria.</p>
      </Section>

      <Section title="3. Proceso de Compra">
        <p>Las compras pueden realizarse a través de:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'El carrito de compras del sitio web (con pasarela de pago Culqi)',
            'Directamente por WhatsApp, coordinando el pedido con un asesor',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>El pedido se considerará confirmado una vez recibido el pago correspondiente. NUDA KETO enviará una confirmación al cliente por el medio de contacto proporcionado.</p>
      </Section>

      <Section title="4. Precios y Pagos">
        <p>Todos los precios están expresados en <strong className="text-nk-choco">Soles Peruanos (S/)</strong> e incluyen los impuestos de ley aplicables.</p>
        <p>Aceptamos los siguientes medios de pago:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Tarjetas de crédito y débito (Visa, Mastercard) a través de Culqi',
            'Transferencias bancarias (coordinadas por WhatsApp)',
            'Yape / Plin',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>NUDA KETO no almacena datos de tarjetas de crédito. El procesamiento de pagos con tarjeta es gestionado de forma segura por <strong className="text-nk-choco">Culqi</strong>, empresa certificada PCI DSS.</p>
      </Section>

      <Section title="5. Envíos y Entregas">
        <p>NUDA KETO realiza envíos a <strong className="text-nk-choco">Lima Metropolitana y a todo el Perú</strong>.</p>
        <p>Los tiempos de entrega estimados son:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Lima Metropolitana: 1 a 3 días hábiles',
            'Provincias: 3 a 7 días hábiles según la ubicación',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>Los costos de envío se calculan según la ubicación del cliente y se informan antes de confirmar el pedido. NUDA KETO no se hace responsable por demoras atribuibles a terceros (courier, eventos de fuerza mayor).</p>
      </Section>

      <Section title="6. Propiedad Intelectual">
        <p>Todos los contenidos del sitio web, incluyendo textos, imágenes, logotipos, diseños y la marca <strong className="text-nk-choco">NUDA KETO</strong>, son propiedad exclusiva de NUDA KETO y están protegidos por las leyes de propiedad intelectual vigentes en el Perú.</p>
        <p>Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita previa.</p>
      </Section>

      <Section title="7. Limitación de Responsabilidad">
        <p>NUDA KETO no se responsabiliza por el uso inadecuado de sus productos ni por reacciones adversas derivadas de alergias no declaradas por el consumidor. Se recomienda revisar la lista de ingredientes antes de consumir.</p>
        <p>Nuestros productos no son medicamentos ni sustituyen tratamientos médicos. Consulte a su médico si tiene condiciones de salud específicas.</p>
      </Section>

      <Section title="8. Ley Aplicable">
        <p>Los presentes términos se rigen por las leyes de la República del Perú. Cualquier controversia será sometida a la jurisdicción de los tribunales competentes de Lima, o al Centro de Conciliación y Arbitraje del INDECOPI, según corresponda.</p>
      </Section>
    </LegalLayout>
  )
}
