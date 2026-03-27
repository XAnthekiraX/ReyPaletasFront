/* eslint-disable no-unused-vars */
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'

const timelineEvents = [
  {
    year: '2009',
    title: 'Del corazón de Ambato al paladar de todo un país',
    description: 'Todo comenzó con una idea sencilla pero poderosa: llevar la experiencia del helado artesanal a otro nivel. Con esfuerzo, pasión y una dosis generosa de innovación, nació Rey Paletas. Primero, en una pequeña planta en Ambato, donde empezamos con recetas tradicionales.',
    icon: 'mdi:seed'
  },
  {
    year: '2017',
    title: 'Primer local concepto',
    description: 'Inauguramos nuestro primer local concepto, marcando un hito en nuestra trayectoria y permitiendo que los clientes vivieran la experiencia Rey Paletas de manera directa.',
    icon: 'mdi:store'
  },
  {
    year: '2018',
    title: 'Primera franquicia',
    description: 'Expandimos nuestro modelo de negocio con la primera franquicia en Riobamba, llevando nuestros sabores a nuevas ciudades.',
    icon: 'mdi:storefront'
  },
  {
    year: '2020',
    title: 'Reinvención',
    description: 'Con la llegada de la pandemia, enfrentamos uno de nuestros mayores desafíos. Fue entonces cuando decidimos reinventarnos: migramos de un modelo basado en locales físicos a una estrategia ágil de puntos de venta distribuidos.',
    icon: 'mdi:refresh'
  },
  {
    year: 'HOY',
    title: 'Más de 250 puntos de venta',
    description: 'Hoy, con más de 250 puntos de venta en todo el país y una comunidad que no para de crecer, seguimos fieles a nuestro propósito: crear momentos extraordinarios a través de un helado auténtico, divertido y delicioso.',
    icon: 'mdi:map-marker-multiple'
  }
]

const allianceIcons = [
  { name: 'Cafeterías', icon: 'mdi:coffee' },
  { name: 'Restaurantes', icon: 'mdi:silverware-fork-knife' },
  { name: 'Minimestore', icon: 'mdi:store' },
  { name: 'Cevicherías', icon: 'mdi:fish' },
  { name: 'Estaciones de servicio', icon: 'mdi:gas-station' }
]

function TimelineItem({ event, index, isLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center w-full mb-8 md:mb-12 ${isLeft ? 'justify-start' : 'justify-end'} md:justify-center`}
    >
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} pl-16 md:pl-0`}>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon icon={event.icon} className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold text-primary">{event.year}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
        </div>
      </div>

      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10" />

      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20" style={{ top: '2rem' }} />
    </motion.div>
  )
}

function Timeline() {
  return (
    <div className="relative py-8 md:py-12">
      {timelineEvents.map((event, index) => (
        <TimelineItem
          key={event.year}
          event={event}
          index={index}
          isLeft={index % 2 === 0}
        />
      ))}
    </div>
  )
}

function AlliancesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-primary/5"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-4">
          Alianzas estratégicas
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Gracias a alianzas estratégicas con marcas locales, nuestros productos están presentes justo donde los ecuatorianos disfrutan sus mejores momentos.
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {allianceIcons.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                <Icon icon={item.icon} className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default function QuiienesSomos() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-primary mb-4"
          >
            Nuestra Historia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Del corazón de Ambato al paladar de todo un país
          </motion.p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <Timeline />
      </section>

      <AlliancesSection />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white"
          >
            <Icon icon="mdi:ice-cream" className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Nuestro propósito
            </h2>
            <p className="text-lg opacity-90">
              Crear momentos extraordinarios a través de un helado auténtico, divertido y delicioso.
            </p>
            <p className="mt-4 text-lg opacity-90">
              Desde una sobremesa en una cafetería artesanal hasta una parada rápida en una gasolinera, Rey Paletas está cerca para convertir lo cotidiano en algo extraordinario.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
