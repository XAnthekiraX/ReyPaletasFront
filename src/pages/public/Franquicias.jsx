import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { publicApi } from '../../services/api'
import { Icon } from '@iconify/react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
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

function FranchiseMap({ franchises, selectedFranchiseId, onSelectFranchise }) {
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
    if (selectedFranchiseId && franchises.length === 1) {
      const selected = franchises.find(f => f.id === selectedFranchiseId)
      if (selected?.latitude && selected?.longitude) {
        return [selected.latitude, selected.longitude]
      }
    }

    if (franchises.length === 0) return defaultCenter

    const validCoords = franchises.filter(f => f.latitude && f.longitude)
    if (validCoords.length === 0) return defaultCenter

    const avgLat = validCoords.reduce((sum, f) => sum + f.latitude, 0) / validCoords.length
    const avgLng = validCoords.reduce((sum, f) => sum + f.longitude, 0) / validCoords.length

    return [avgLat, avgLng]
  }

  const zoom = franchises.length === 1 ? 20 : franchises.length > 1 ? 7 : 8

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
        {franchises.map((franchise) => {
          if (!franchise.latitude || !franchise.longitude) return null

          return (
            <Marker
              key={franchise.id}
              position={[franchise.latitude, franchise.longitude]}
              eventHandlers={{
                click: () => onSelectFranchise(franchise.id)
              }}
            >
              <Popup>
                <div className="text-sm min-w-[140px]">
                  {franchise.city && (
                    <p className="font-semibold text-[#492360] text-xs mb-1">{franchise.city}</p>
                  )}
                  {franchise.streets && (
                    <p className="text-gray-600 text-xs">{franchise.streets}</p>
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

function FranchiseList({ franchises, selectedFranchiseId, onSelectFranchise }) {
  if (franchises.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center rounded-2xl bg-white/80 min-h-[200px] absolute z-20">
        <div className="text-center">
          <Icon icon="mdi:store-off" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No hay franquicias disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto  h-full md:max-h-none pr-2 absolute z-20 top-2 right-2">
      {franchises.map((franchise) => {
        const isSelected = franchise.id === selectedFranchiseId
        return (
          <div
            key={franchise.id}
            onClick={() => onSelectFranchise(franchise.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white border border-gray-100 hover:shadow-md hover:border-gray-200'
              }`}
          >
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                {franchise.streets && (
                  <p
                    className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-gray-600'
                      }`}
                  >
                    {franchise.streets}
                  </p>
                )}
                {franchise.city && (
                  <div
                    className={`flex items-center gap-1 mt-1 ${isSelected ? 'text-white/80' : 'text-primary'
                      }`}
                  >
                    <Icon icon="tdesign:location" className="w-3 h-3" />
                    <span className="text-xs">{franchise.city}</span>
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

function DesktopCarousel({ photos, franchiseName, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const totalPhotos = photos.length
  const visibleCount = 5
  const shouldAutoPlay = totalPhotos > visibleCount

  const visiblePhotos = []
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % totalPhotos
    visiblePhotos.push({ ...photos[index], displayIndex: index })
  }

  useEffect(() => {
    if (shouldAutoPlay) {
      const interval = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % totalPhotos)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [shouldAutoPlay, totalPhotos])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % totalPhotos)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos)
  }

  if (!photos || photos.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex gap-2 items-center">
        <button onClick={prevSlide} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex gap-2 flex-1 justify-center overflow-hidden">
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`w-40 h-40 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0`}
                onClick={() => onImageClick(photo.displayIndex)}
              >
                <img
                  src={photo.url}
                  alt={`${franchiseName} - foto`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button onClick={nextSlide} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {shouldAutoPlay && (
        <div className="flex justify-center gap-2 mt-3">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300 w-3'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PhotoCarousel({ photos, franchiseName, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isCarousel = isMobile ? photos.length > 1 : photos.length > 3

  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [photos.length])

  if (!photos || photos.length === 0) return null

  if (!isCarousel) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => onImageClick(photos.indexOf(photo))}
          >
            <img
              src={photo.url}
              alt={`${franchiseName} - foto`}
              loading="lazy"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => onImageClick(currentIndex)}
          >
            <img
              src={photos[currentIndex].url}
              alt={`${franchiseName} - foto ${currentIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-3">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <DesktopCarousel photos={photos} franchiseName={franchiseName} onImageClick={onImageClick} />
  )
}

export default function Franquicias() {
  const [cities, setCities] = useState([])
  const [franchises, setFranchises] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await publicApi.getFranchises()
        const citiesData = data.map(d => d.city)
        const franchisesData = data.flatMap(d => d.franchises)
        setCities(citiesData || [])
        setFranchises(franchisesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredFranchises = selectedCity
    ? franchises.filter(f => f.city_id === selectedCity)
    : franchises

  useEffect(() => {
    if (filteredFranchises.length > 0) {
      setSelectedFranchiseId(filteredFranchises[0].id)
    } else {
      setSelectedFranchiseId(null)
    }
  }, [selectedCity, filteredFranchises])

  const handleSelectFranchise = (franchiseId) => {
    setSelectedFranchiseId(franchiseId)
  }

  const selectedFranchise = filteredFranchises.find(f => f.id === selectedFranchiseId)

  const openModal = (index) => {
    setModalImageIndex(index)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const nextImage = () => {
    if (selectedFranchise?.photos) {
      setModalImageIndex((prev) => (prev + 1) % selectedFranchise.photos.length)
    }
  }

  const prevImage = () => {
    if (selectedFranchise?.photos) {
      setModalImageIndex((prev) => (prev - 1 + selectedFranchise.photos.length) % selectedFranchise.photos.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return
      if (e.key === 'ArrowRight') {
        setModalImageIndex(prev => selectedFranchise ? (prev + 1) % selectedFranchise.photos.length : prev)
      }
      if (e.key === 'ArrowLeft') {
        setModalImageIndex(prev => selectedFranchise ? (prev - 1 + selectedFranchise.photos.length) % selectedFranchise.photos.length : prev)
      }
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, selectedFranchise])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 gap-6 h-96">
              <div className="bg-gray-200 rounded-2xl" />
              <div className="bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{leafletStyles}</style>
      <section className=" py-5 bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">
            Nuestras Franquicias
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Encuentra la franquicia más cercana a ti
          </p>
        </div>
      </section>

      <section className="w-full mx-auto px-4 pb-6 flex flex-col justify-center items-center">
        <CityNav
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />

        <div className="flex flex-col w-full md:w-1/2 justify-center items-center relative gap-4 h-auto">
          <FranchiseList
            franchises={filteredFranchises}
            selectedFranchiseId={selectedFranchiseId}
            onSelectFranchise={handleSelectFranchise}
          />
          <FranchiseMap
            franchises={filteredFranchises}
            selectedFranchiseId={selectedFranchiseId}
            onSelectFranchise={handleSelectFranchise}
          />
        </div>

        {selectedCity && selectedFranchise && selectedFranchise.photos && (
          <div className="mt-4">
            {
              selectedFranchise.photos.length < 1 ? (
                <></>
              ) : (<h3 className="text-lg font-semibold text-gray-800 mb-2">
                Fotos
              </h3>)
            }
            <PhotoCarousel
              photos={selectedFranchise.photos}
              franchiseName={selectedFranchise.city || 'Franquicia'}
              onImageClick={openModal}
            />
          </div>
        )}

        <AnimatePresence>
          {modalOpen && selectedFranchise?.photos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <button
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                onClick={closeModal}
              >
                <Icon icon="mdi:close" className="w-8 h-8" />
              </button>

              {selectedFranchise.photos.length > 1 && (
                <>
                  <button
                    className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                  >
                    <Icon icon="mdi:chevron-left" className="w-10 h-10" />
                  </button>
                  <button
                    className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                  >
                    <Icon icon="mdi:chevron-right" className="w-10 h-10" />
                  </button>
                </>
              )}

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedFranchise.photos[modalImageIndex].url}
                  alt={`${selectedFranchise.manager_name} - foto ${modalImageIndex + 1}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                {selectedFranchise.photos.length > 1 && (
                  <p className="text-center text-white mt-4 text-sm">
                    {modalImageIndex + 1} / {selectedFranchise.photos.length}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
