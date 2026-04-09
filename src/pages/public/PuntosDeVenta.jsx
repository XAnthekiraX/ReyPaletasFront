/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'

const benefits = [
  {
    title: 'Más clientes felices',
    description: 'Un producto fresco y gourmet que complementa tu oferta.',
    icon: 'mdi:account-group'
  },
  {
    title: 'Ventas rápidas',
    description: 'Alta rotación y margen atractivo en cada paleta.',
    icon: 'mdi:chart-line'
  },
  {
    title: 'Marca reconocida',
    description: 'Respaldo de una empresa líder en helados artesanales en Ecuador.',
    icon: 'mdi:medal'
  }
]

const contactInfo = {
  title: 'Información de contacto',
  items: [
    { label: 'Email', value: 'info@reypaletas.com', icon: 'iconamoon:email' },
    { label: 'Teléfono', value: '+593 99 804 4059', icon: 'tabler:phone' },
    { label: 'Ubicación', value: 'Ambato, Ecuador', icon: 'tdesign:location' }
  ]
}

function VideoSection() {
  const videoId = 'eA6pF9YPavQ'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?playsinline=1`}
          title="Rey Paletas - Expande tu negocio"
          className="w-full aspect-[9/16]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  )
}

function BenefitCard({ benefit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
        <Icon icon={benefit.icon} className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{benefit.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
    </motion.div>
  )
}

function ContactSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 rounded-2xl p-6 text-center"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {contactInfo.title}
          </h3>

          <div className="space-y-3 mb-6">
            {contactInfo.items.map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-gray-600">
                <Icon icon={item.icon} className="w-5 h-5 text-primary" />
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <Link
            to="/contactanos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-quaternary/80 text-white rounded-xl font-medium hover:bg-quaternary transition-colors"
          >
            <Icon icon="tabler:mail" className="w-5 h-5" />
            Contáctanos
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function PuntosDeVenta() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-primary "
          >
            Expande tu negocio con Rey Paletas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-6"
          >
            ¿Te gustaría tener un punto de venta?
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Descubre los beneficios de tener un punto de venta de Rey Paletas y forma parte de una familia en crecimiento dedicada a la calidad y la innovación en cada paleta. ¡Únete a nosotros para difundir alegría, un delicioso bocado a la vez!
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-md mx-auto px-4">
          <VideoSection />
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-primary text-center mb-10"
          >
            ¿Por qué elegir Rey Paletas?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  )
}
