import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { publicApi } from '../../services/api'
import { Icon } from '@iconify/react'
import { AnimatePresence } from 'motion/react'
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
    <div className="relative mb-4">
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
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
            selectedCity === null
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
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              selectedCity === city.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors md:hidden"
        >
          <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  )
}

function FranchiseMap({ franchises, selectedFranchiseId, onSelectFranchise }) {
  const defaultCenter = [-0.5, -78.5]
  const mapRef = useRef(null)

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

  const zoom = franchises.length === 1 ? 14 : 7

  return (
    <div className="h-[300px] md:h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={getCenter()}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zIndex={1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
                <div className="text-sm min-w-[150px]">
                  <div className="flex items-center gap-2 mb-1">
                    {franchise.manager_photo && (
                      <img
                        src={franchise.manager_photo}
                        alt={franchise.manager_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <p className="font-bold text-base">{franchise.manager_name}</p>
                  </div>
                  {franchise.manager_description && (
                    <p className="text-gray-600 text-xs">{franchise.manager_description}</p>
                  )}
                  {franchise.description && (
                    <p className="text-gray-500 text-xs mt-1">{franchise.description}</p>
                  )}
                  {franchise.city && (
                    <p className="text-[#492360] font-medium text-xs mt-1">{franchise.city}</p>
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
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <Icon icon="mdi:store-off" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No hay franquicias disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px] md:max-h-none pr-2">
      {franchises.map((franchise) => {
        const isSelected = franchise.id === selectedFranchiseId
        return (
          <div
            key={franchise.id}
            onClick={() => onSelectFranchise(franchise.id)}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white border border-gray-100 hover:shadow-md hover:border-gray-200'
            }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                  isSelected ? 'bg-white/20' : 'bg-gray-100'
                }`}
              >
                {franchise.manager_photo ? (
                  <img
                    src={franchise.manager_photo}
                    alt={franchise.manager_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="mdi:account"
                      className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm truncate ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {franchise.manager_name}
                </h3>
                {franchise.manager_description && (
                  <p
                    className={`text-xs truncate ${
                      isSelected ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {franchise.manager_description}
                  </p>
                )}
                {franchise.description && (
                  <p
                    className={`text-xs truncate ${
                      isSelected ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    {franchise.description}
                  </p>
                )}
                {franchise.city && (
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      isSelected ? 'text-white/80' : 'text-primary'
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

function PhotoCarousel({ photos, franchiseName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isCarousel = isMobile ? photos.length > 1 : photos.length > 4

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
          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={photo.url}
              alt={`${franchiseName} - foto`}
              className="w-full h-full object-cover"
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
            className="aspect-video rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={photos[currentIndex].url}
              alt={`${franchiseName} - foto ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-3">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[...photos, ...photos, ...photos].map((photo, index) => (
          <div
            key={`${photo.id}-${index}`}
            className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={photo.url}
              alt={`${franchiseName} - foto`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Franquicias() {
  const [cities, setCities] = useState([])
  const [franchises, setFranchises] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesData = await publicApi.getCities()
        setCities(citiesData || [])
      } catch (error) {
        console.error('Error fetching cities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const data = await publicApi.getFranchises(selectedCity)
        const franchisesData = data || []
        setFranchises(franchisesData)

        if (selectedCity && franchisesData.length > 0) {
          setSelectedFranchiseId(franchisesData[0].id)
        } else if (!selectedCity) {
          setSelectedFranchiseId(null)
        }
      } catch (error) {
        console.error('Error fetching franchises:', error)
      }
    }
    fetchFranchises()
  }, [selectedCity])

  const handleSelectFranchise = (franchiseId) => {
    setSelectedFranchiseId(franchiseId)
  }

  const selectedFranchise = franchises.find(f => f.id === selectedFranchiseId)

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
      <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2">
            Nuestras Franquicias
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Encuentra la franquicia más cercana a ti
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-6">
        <CityNav
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />

        <div className="grid md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
          <FranchiseList
            franchises={franchises}
            selectedFranchiseId={selectedFranchiseId}
            onSelectFranchise={handleSelectFranchise}
          />
          <FranchiseMap
            franchises={franchises}
            selectedFranchiseId={selectedFranchiseId}
            onSelectFranchise={handleSelectFranchise}
          />
        </div>

        {selectedCity && selectedFranchise && selectedFranchise.photos && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fotos de {selectedFranchise.manager_name}
            </h3>
            <PhotoCarousel
              photos={selectedFranchise.photos}
              franchiseName={selectedFranchise.manager_name}
            />
          </div>
        )}
      </section>
    </div>
  )
}
