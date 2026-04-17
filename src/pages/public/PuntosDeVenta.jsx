/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { publicApi } from '../../services/api'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const leafletStyles = `
  .leaflet-container {
    z-index: 0 !important;
  }
  .leaflet-control-zoom {
    z-index: 10 !important;
  }
  .leaflet-popup {
    z-index: 10 !important;
  }
`

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

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

function CityNav({ cities, selectedCity, onSelectCity }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative mb-4 w-full md:w-auto">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors md:hidden"
        >
          <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 justify-start"
      >
        <button
          onClick={() => onSelectCity(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${selectedCity === null
            ? 'bg-primary text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Todas
        </button>

        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city.id)}
            className={`shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${selectedCity === city.id
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {
        canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors md:hidden"
          >
            <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-700" />
          </button>
        )
      }
    </div >
  )
}

function SalesPointMap({ salesPoints, selectedPointId, onSelectPoint }) {
  const defaultCenter = [-0.5, -78.5]
  const mapRef = useRef(null)

  function MapUpdater({ center, zoom }) {
    const map = useMap()

    useEffect(() => {
      if (center) {
        map.setView(center, zoom, { animate: true })
      }
    }, [center, zoom, map])

    return null
  }

  const getCenter = () => {
    if (selectedPointId && salesPoints.length === 1) {
      const selected = salesPoints.find(f => f.id === selectedPointId)
      if (selected?.latitude && selected?.longitude) {
        return [selected.latitude, selected.longitude]
      }
    }

    if (salesPoints.length === 0) return defaultCenter

    const validCoords = salesPoints.filter(f => f.latitude && f.longitude)
    if (validCoords.length === 0) return defaultCenter

    const avgLat = validCoords.reduce((sum, f) => sum + f.latitude, 0) / validCoords.length
    const avgLng = validCoords.reduce((sum, f) => sum + f.longitude, 0) / validCoords.length

    return [avgLat, avgLng]
  }

  const zoom = salesPoints.length === 1 ? 20 : salesPoints.length > 1 ? 7 : 8

  return (
    <div className="h-[29rem] w-full rounded-2xl overflow-hidden shadow-lg border-gray-200">
      <MapContainer
        ref={mapRef}
        center={getCenter()}
        zoom={zoom}
        scrollWheelZoom={true}
        className='w-full h-full'
        zIndex={1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={getCenter()} zoom={zoom} />
        {salesPoints.map((point) => {
          if (!point.latitude || !point.longitude) return null

          return (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              eventHandlers={{
                click: () => onSelectPoint(point.id)
              }}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  {point.photo_url && (
                    <img
                      src={point.photo_url}
                      alt={point.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                  )}
                  {point.name && (
                    <p className="font-semibold text-[#492360] text-xs mb-1">{point.name}</p>
                  )}
                  {point.streets && (
                    <p className="text-gray-600 text-xs">{point.streets}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

function SalesPointList({ salesPoints, selectedPointId, onSelectPoint }) {
  if (salesPoints.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center rounded-2xl bg-white/80 min-h-[200px] absolute z-20">
        <div className="text-center">
          <Icon icon="mdi:store-off" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No hay puntos de venta disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto h-full md:max-h-none pr-2 absolute z-20 top-2 right-2">
      {salesPoints.map((point) => {
        const isSelected = point.id === selectedPointId
        return (
          <div
            key={point.id}
            onClick={() => onSelectPoint(point.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white border border-gray-100 hover:shadow-md hover:border-gray-200'
              }`}
          >
            <div className="flex gap-3">
              {point.photo_url && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={point.photo_url}
                    alt={point.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {point.name && (
                  <p className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-800'
                    }`}>
                    {point.name}
                  </p>
                )}
                {point.streets && (
                  <p
                    className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-gray-600'
                      }`}
                  >
                    {point.streets}
                  </p>
                )}
                {point.city && (
                  <div
                    className={`flex items-center gap-1 mt-1 ${isSelected ? 'text-white/80' : 'text-primary'
                      }`}
                  >
                    <Icon icon="tdesign:location" className="w-3 h-3" />
                    <span className="text-xs">{point.city.name}</span>
                  </div>
                )}
              </div>

              {isSelected && (
                <Icon icon="mdi:check-circle" className="w-5 h-5 text-white flex-shrink-0" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TabToggle({ activeTab, onChangeTab }) {
  return (
    <div className=" pt-3 rounded-full sticky top-1">
      <div className="inline-flex bg-gray-100 border-gray-200 border  shadow-sm rounded-full p-1 gap-2">
        <button
          onClick={onChangeTab}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${activeTab === true
            ? 'bg-white text-primary shadow-md'
            : 'text-gray-600 shadow-inner border-gray-200   hover:text-gray-900'
            }`}
        >
          Información
        </button>
        <button
          onClick={onChangeTab}
          className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${activeTab === false
            ? 'bg-white text-primary shadow-md'
            : 'text-gray-600 shadow-inner border-gray-200  hover:text-gray-800'
            }`}
        >
          Ubicaciones
        </button>
      </div>
    </div>
  )
}

function InfoContent() {
  return (
    <>
      <section className="px-5 py-4 ">
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

      <section className="py-3">
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
    </>
  )
}

function LocationsContent({ groupedData }) {
  const cities = groupedData.map(d => d.city).filter(Boolean)
  const allSalesPoints = groupedData.flatMap(d => d.sales_points || [])
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedPointId, setSelectedPointId] = useState(allSalesPoints.length > 0 ? allSalesPoints[0].id : null)

  const filteredSalesPoints = selectedCity
    ? allSalesPoints.filter(p => p.city_id === selectedCity)
    : allSalesPoints

  const handleSelectCity = (cityId) => {
    setSelectedCity(cityId)
  }

  const handleSelectPoint = (pointId) => {
    setSelectedPointId(pointId)
  }

  if (allSalesPoints.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <section className="py-12 bg-linear-to-b from-primary/5 to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8" />
              <div className="grid md:grid-cols-2 gap-6 h-96">
                <div className="bg-gray-200 rounded-2xl" />
                <div className="bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen  w-full ">
      <style>{leafletStyles}</style>
      <section className="py-5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">
            Puntos de Venta
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Encuentra el punto de venta más cercano a ti
          </p>
        </div>
      </section>

      <section className="w-full mx-auto px-4 pb-6 flex flex-col justify-center items-center">
        <CityNav
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
        />

        <div className="flex flex-col w-full md:w-1/2 justify-center items-center relative gap-4 h-auto">
          <SalesPointList
            salesPoints={filteredSalesPoints}
            selectedPointId={selectedPointId}
            onSelectPoint={handleSelectPoint}
          />
          <SalesPointMap
            salesPoints={filteredSalesPoints}
            selectedPointId={selectedPointId}
            onSelectPoint={handleSelectPoint}
          />
        </div>
      </section>
    </div>
  )
}

export default function PuntosDeVenta() {
  const [activeTab, setActiveTab] = useState(true)
  const [groupedData, setGroupedData] = useState([])
  const [loading, setLoading] = useState(true)

  const toggleTab = () => {
    setActiveTab(!activeTab)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await publicApi.getSalesPoints()
        setGroupedData(data || [])
      } catch (error) {
        console.error('Error fetching sales points:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 to-white flex justify-center items-center flex-col">
      <TabToggle activeTab={activeTab} onChangeTab={toggleTab} />
      {activeTab === true ? (
        <InfoContent />
      ) : loading ? (
        <div className="min-h-screen bg-white">
          <section className="py-12 bg-linear-to-b from-primary/5 to-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8" />
                <div className="grid md:grid-cols-2 gap-6 h-96">
                  <div className="bg-gray-200 rounded-2xl" />
                  <div className="bg-gray-200 rounded-2xl" />
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <LocationsContent groupedData={groupedData} />
      )}
    </div>
  )
}