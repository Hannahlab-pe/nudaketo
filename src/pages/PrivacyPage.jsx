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

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle={`Última actualización: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <p className="text-nk-muted text-sm mb-8 p-4 rounded-2xl border border-nk-arena bg-white">
        En <strong className="text-nk-choco">NUDA KETO</strong> valoramos y respetamos su privacidad. Esta política describe cómo recopilamos, usamos y protegemos sus datos personales de conformidad con la <strong className="text-nk-choco">Ley N° 29733 — Ley de Protección de Datos Personales</strong> del Perú y su Reglamento D.S. 003-2013-JUS.
      </p>

      <Section title="1. Responsable del Tratamiento">
        <p><strong className="text-nk-choco">NUDA KETO</strong> es el responsable del banco de datos personales de clientes, con domicilio en Lima, Perú.</p>
        <p>Para consultas sobre privacidad, puede contactarnos a través de WhatsApp o los canales indicados en este sitio web.</p>
      </Section>

      <Section title="2. Datos que Recopilamos">
        <p>Recopilamos los siguientes datos personales cuando usted realiza una compra o nos contacta:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Nombre y apellidos',
            'Número de teléfono (WhatsApp)',
            'Dirección de entrega',
            'Correo electrónico (cuando se proporciona)',
            'Datos de pago (procesados directamente por Culqi, no almacenados por NUDA KETO)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="3. Finalidad del Tratamiento">
        <p>Sus datos personales son utilizados exclusivamente para:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Procesar y gestionar su pedido',
            'Coordinar la entrega del producto',
            'Confirmar y verificar pagos',
            'Atender consultas, reclamos o solicitudes',
            'Enviar comunicaciones relacionadas con su compra',
            'Cumplir con obligaciones legales y regulatorias',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>No utilizamos sus datos para fines publicitarios de terceros ni los cedemos a empresas ajenas a la operación de su pedido.</p>
      </Section>

      <Section title="4. Compartición de Datos">
        <p>NUDA KETO podrá compartir sus datos únicamente con:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Culqi S.A.C. — para el procesamiento seguro de pagos con tarjeta',
            'Empresas de courier o transporte — para la gestión del envío',
            'Autoridades competentes — cuando sea requerido por ley',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5. Seguridad de los Datos">
        <p>Adoptamos medidas técnicas y organizativas razonables para proteger sus datos personales contra acceso no autorizado, pérdida o alteración.</p>
        <p>Los pagos con tarjeta son procesados bajo el estándar de seguridad <strong className="text-nk-choco">PCI DSS</strong> a través de Culqi. NUDA KETO no almacena números de tarjeta ni datos sensibles de pago.</p>
      </Section>

      <Section title="6. Conservación de Datos">
        <p>Sus datos serán conservados durante el tiempo necesario para cumplir con las finalidades descritas y durante el plazo legal exigido por las normas tributarias y de protección al consumidor vigentes en el Perú (mínimo 5 años para registros de transacciones).</p>
      </Section>

      <Section title="7. Sus Derechos (ARCO)">
        <p>Conforme a la Ley N° 29733, usted tiene derecho a:</p>
        <ul className="list-none space-y-2 pl-0">
          {[
            'Acceso — conocer qué datos suyos tenemos',
            'Rectificación — corregir datos inexactos o incompletos',
            'Cancelación — solicitar la eliminación de sus datos',
            'Oposición — oponerse al tratamiento de sus datos',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-nk-gold mt-1 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p>Para ejercer estos derechos, contáctenos por WhatsApp indicando "Solicitud ARCO" y el derecho que desea ejercer. Atenderemos su solicitud en un plazo máximo de 20 días hábiles.</p>
      </Section>

      <Section title="8. Cookies y Tecnologías de Seguimiento">
        <p>Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento. No utilizamos cookies publicitarias ni de rastreo de terceros.</p>
      </Section>

      <Section title="9. Modificaciones">
        <p>NUDA KETO se reserva el derecho de actualizar esta Política de Privacidad. Los cambios serán publicados en esta página con la fecha de actualización correspondiente. Le recomendamos revisarla periódicamente.</p>
      </Section>
    </LegalLayout>
  )
}
