import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { publicApi } from '../../services/api'
import { Icon } from '@iconify/react'
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
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${selectedCity === city.id
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

function FranchiseMap({ franchises, selectedFranchise, onSelectFranchise }) {
  const defaultCenter = [-0.5, -78.5]
  const mapRef = useRef(null)

  const getCenter = () => {
    if (selectedFranchise?.latitude && selectedFranchise?.longitude) {
      return [selectedFranchise.latitude, selectedFranchise.longitude]
    }
    if (franchises.length === 0) return defaultCenter

    const validCoords = franchises.filter(f => f.latitude && f.longitude)
    if (validCoords.length === 0) return defaultCenter

    const avgLat = validCoords.reduce((sum, f) => sum + f.latitude, 0) / validCoords.length
    const avgLng = validCoords.reduce((sum, f) => sum + f.longitude, 0) / validCoords.length

    return [avgLat, avgLng]
  }

  useEffect(() => {
    if (selectedFranchise && mapRef.current && selectedFranchise.latitude && selectedFranchise.longitude) {
      mapRef.current.setView([selectedFranchise.latitude, selectedFranchise.longitude], 14)
    }
  }, [selectedFranchise])

  const zoom = selectedFranchise ? 14 : (franchises.length === 1 ? 20 : 7)

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
        {franchises.map((franchise, index) => (
          franchise.latitude && franchise.longitude ? (
            <Marker
              key={index}
              position={[franchise.latitude, franchise.longitude]}
              eventHandlers={{
                click: () => onSelectFranchise(franchise)
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
                    <p className="text-primary font-medium text-xs mt-1">{franchise.city}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}

function FranchiseList({ franchises, selectedFranchise, onSelectFranchise }) {
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
      {franchises.map((franchise, index) => (
        <div
          key={index}
          onClick={() => onSelectFranchise(franchise)}
          className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedFranchise === franchise
            ? 'bg-primary text-white shadow-lg'
            : 'bg-white border border-gray-100 hover:shadow-md hover:border-gray-200'
            }`}
        >
          <div className="flex gap-3">
            <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${selectedFranchise === franchise ? 'bg-white/20' : 'bg-gray-100'
              }`}>
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
                    className={`w-6 h-6 ${selectedFranchise === franchise ? 'text-white' : 'text-gray-400'}`}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm truncate ${selectedFranchise === franchise ? 'text-white' : 'text-gray-800'
                }`}>
                {franchise.manager_name}
              </h3>
              {franchise.manager_description && (
                <p className={`text-xs truncate ${selectedFranchise === franchise ? 'text-white/70' : 'text-gray-500'
                  }`}>
                  {franchise.manager_description}
                </p>
              )}
              {franchise.description && (
                <p className={`text-xs truncate ${selectedFranchise === franchise ? 'text-white/80' : 'text-gray-400'
                  }`}>
                  {franchise.description}
                </p>
              )}
              {franchise.city && (
                <div className={`flex items-center gap-1 mt-1 ${selectedFranchise === franchise ? 'text-white/80' : 'text-primary'
                  }`}>
                  <Icon icon="tdesign:location" className="w-3 h-3" />
                  <span className="text-xs">{franchise.city}</span>
                </div>
              )}
            </div>

            {selectedFranchise === franchise && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-white flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Franquicias() {
  const [cities, setCities] = useState([])
  const [franchises, setFranchises] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedFranchise, setSelectedFranchise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingFranchises, setLoadingFranchises] = useState(false)

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
      setLoadingFranchises(true)
      setSelectedFranchise(null)
      try {
        const data = await publicApi.getFranchises(selectedCity)
        setFranchises(data || [])
      } catch (error) {
        console.error('Error fetching franchises:', error)
      } finally {
        setLoadingFranchises(false)
      }
    }
    fetchFranchises()
  }, [selectedCity])

  const handleSelectFranchise = (franchise) => {
    setSelectedFranchise(franchise)
  }

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

        {loadingFranchises ? (
          <div className="grid md:grid-cols-2 gap-6 h-96">
            <div className="bg-gray-200 rounded-2xl animate-pulse" />
            <div className="bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
            <FranchiseList
              franchises={franchises}
              selectedFranchise={selectedFranchise}
              onSelectFranchise={handleSelectFranchise}
            />
            <FranchiseMap
              franchises={franchises}
              selectedFranchise={selectedFranchise}
              onSelectFranchise={handleSelectFranchise}
            />
          </div>
        )}
      </section>
    </div>
  )
}
