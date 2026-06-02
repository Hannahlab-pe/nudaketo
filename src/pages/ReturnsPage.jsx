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

function StepCard({ number, title, desc }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-nk-arena bg-white">
      <div className="w-9 h-9 rounded-full bg-nk-choco text-nk-ivory flex items-center justify-center shrink-0"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', fontWeight: 'bold' }}>
        {number}
      </div>
      <div>
        <p className="text-nk-choco font-semibold text-sm">{title}</p>
        <p className="text-nk-muted text-sm mt-1">{desc}</p>
      </div>
    </div>
  )
}

export default function ReturnsPage() {
  return (
    <LegalLayout
      title="Política de Devoluciones y Reembolsos"
      subtitle={`Última actualización: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <p className="text-nk-muted text-sm mb-8 p-4 rounded-2xl border border-nk-arena bg-white">
        En <strong className="text-nk-choco">NUDA KETO</strong> queremos que estés completamente satisfecho con tu compra. Esta política describe las condiciones para devoluciones y reembolsos conforme al <strong className="text-nk-choco">Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong>.
      </p>

      <Section title="1. Plazo para Devoluciones">
        <p>Aceptamos devoluciones dentro de los <strong className="text-nk-choco">7 días calendario</strong> siguientes a la recepción del producto, únicamente en los casos descritos en esta política.</p>
        <p>Para productos alimenticios, las devoluciones están sujetas a condiciones especiales por razones de higiene y seguridad alimentaria.</p>
      </Section>

      <Section title="2. Causas Aceptadas para Devolución">
        <p>Procesamos devoluciones y reembolsos en los siguientes casos:</p>
        <ul className="list-none space-y-3 pl-0 mt-3">
          {[
            { title: 'Producto defectuoso o dañado', desc: 'Si el producto llegó con el empaque roto, dañado o en mal estado.' },
            { title: 'Producto vencido', desc: 'Si la fecha de vencimiento ya expiró al momento de la entrega.' },
            { title: 'Producto incorrecto', desc: 'Si recibiste un producto diferente al que ordenaste.' },
            { title: 'Pedido incompleto', desc: 'Si recibiste menos unidades de las que pagaste.' },
          ].map(({ title, desc }) => (
            <li key={title} className="flex items-start gap-3 p-4 rounded-xl border border-nk-arena bg-white">
              <span className="text-nk-gold mt-0.5 shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <div>
                <p className="text-nk-choco font-semibold text-sm">{title}</p>
                <p className="text-nk-muted text-sm">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="3. Casos No Aceptados">
        <p>No se aceptan devoluciones en los siguientes casos:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'El producto ya fue consumido parcialmente',
            'El empaque original fue abierto sin causa justificada',
            'Han transcurrido más de 7 días desde la recepción',
            'El producto fue dañado por manejo inadecuado del cliente',
            'Cambio de opinión o preferencia (productos alimenticios perecibles)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-red-400 mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="4. Proceso de Devolución">
        <div className="flex flex-col gap-3 mt-2">
          <StepCard number="01" title="Contáctanos" desc="Escríbenos por WhatsApp dentro de los 7 días siguientes a la recepción. Indica tu nombre, número de pedido y el motivo de la devolución." />
          <StepCard number="02" title="Envía evidencia" desc="Adjunta fotos del producto y del empaque que evidencien el problema reportado." />
          <StepCard number="03" title="Evaluación" desc="Revisaremos tu caso en un plazo máximo de 3 días hábiles y te comunicaremos la resolución." />
          <StepCard number="04" title="Resolución" desc="Si corresponde, gestionaremos el reembolso o el reenvío del producto sin costo adicional." />
        </div>
      </Section>

      <Section title="5. Reembolsos">
        <p>Los reembolsos aprobados se procesarán de la siguiente manera:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Pagos con tarjeta (Culqi): reembolso a la misma tarjeta en un plazo de 5 a 10 días hábiles, según el banco emisor.',
            'Pagos por transferencia / Yape / Plin: reembolso a la cuenta o número indicado en un plazo de 3 a 5 días hábiles.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>El reembolso incluirá el costo del producto y los costos de envío si el error fue atribuible a NUDA KETO.</p>
      </Section>

      <Section title="6. Garantía de Satisfacción">
        <p>Si por alguna razón no estás satisfecho con la calidad de tu producto, te pedimos que nos lo hagas saber. Valoramos tu experiencia y analizaremos cada caso para brindarte la mejor solución posible.</p>
      </Section>
    </LegalLayout>
  )
}
