/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { motion } from 'motion/react'

const initialPartners = [
  { id: 1, url: 'https://placehold.co/160x80/492360/white?text=Partner+1', type: 'rectangular', empresaMatriz: "", name: null },
  { id: 2, url: 'https://placehold.co/80x80/492360/white?text=Logo', type: 'square', empresaMatriz: "Empresa Matriz", name: 'Subsidiaria' },
]

function generateTestPartners(count) {
  const partners = []
  let idCounter = 1

  while (partners.length < count) {
    for (const p of initialPartners) {
      if (partners.length >= count) break
      partners.push({
        ...p,
        id: idCounter++,
        url: p.type === 'rectangular'
          ? `https://placehold.co/160x80/${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}/white?text=Partner+${idCounter}`
          : `https://placehold.co/80x80/${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}/white?text=Logo`,
      })
    }
  }

  for (let i = partners.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [partners[i], partners[j]] = [partners[j], partners[i]]
  }

  return partners
}

function LogoItem({ partner }) {
  const isSquare = partner.type === 'square'
  const sizeClasses = isSquare
    ? 'w-20 h-20 flex-shrink-0'
    : 'w-40 h-20 flex-shrink-0'

  return (
    <div className={`flex justify-center items-center rounded-xl overflow-hidden  `}>
      <div className="w-auto h-full overflow-hidden flex justify-center items-center">
        <img
          src={partner.url}
          alt={partner.name || 'Partner logo'}
          className={`${sizeClasses} object-cover rounded-xl`}
        />
        {
          partner.name && (
            <div className="flex w-full h-full flex-col items-center justify-center text-center text-nowrap px-3 text-xs">
              <strong className="text-lg">
                {partner.name} {partner.id}
              </strong>
              <span className='text-gray-500 '>
                from {partner.empresaMatriz}
              </span>
            </div>
          )
        }

      </div>
    </div>
  )
}

function CarouselRow({ partners, rowIndex }) {
  const duplicatedPartners = [...partners, ...partners, ...partners]
  const isOddRow = (rowIndex + 1) % 2 !== 0
  const delay = isOddRow ? '0.5s' : '0s'
  const duration = 50 + rowIndex * 5
  console.log(partners);

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-30"
        animate={{ x: [0, -50 + '%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
            delay: parseFloat(delay),
          },
        }}
        style={{
          width: 'fit-content',
        }}
      >
        {duplicatedPartners.map((partner, idx) => (
          <LogoItem key={`${partner.id}-${idx}`} partner={partner} />
        ))}
      </motion.div>
    </div>
  )
}

export default function PartnerCarousel() {
  const [partners] = useState(() => generateTestPartners(11))

  const totalPerRow = 10
  const numRows = Math.ceil(partners.length / totalPerRow)
  const imagesPerRow = Math.ceil(partners.length / numRows)

  const rows = []
  for (let i = 0; i < numRows; i++) {
    const start = i * imagesPerRow
    const end = start + imagesPerRow
    rows.push(partners.slice(start, end))
  }

  if (partners.length === 0) return null

  return (
    <section className="py-12 bg-white w-full ">
      <div className="flex flex-col  px-4 w-full">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className=" font-bold text-primary text-3xl text-center mb-8"
        >
          Empresas que confían en nosotros
        </motion.h3>

        <div className="overflow-hidden">
          {rows.map((rowPartners, rowIndex) => (
            <CarouselRow
              key={rowIndex}
              partners={rowPartners}
              rowIndex={rowIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}