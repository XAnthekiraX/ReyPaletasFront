import { useState, useEffect, useRef } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage, deleteImage } from '../../services/supabase'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'
import { useConfirm } from '../../components/ConfirmDialog'

function CityModal({ isOpen, onClose, cities, onSave, onDelete, onUpdate }) {
  const [newCity, setNewCity] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!newCity.trim()) return
    setSaving(true)
    setError('')
    try {
      await onSave({ name: newCity })
      setNewCity('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return
    setSaving(true)
    setError('')
    try {
      await onUpdate(id, { name: editingName })
      setEditingId(null)
      setEditingName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await onDelete(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-200">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Gestionar Ciudades</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
            X
          </button>
        </div>

        <div className="p-4 border-b bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Ciudad</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Ej: Quito, Guayaquil"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={saving || !newCity.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? '...' : 'Agregar'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="p-4 overflow-y-auto max-h-64 bg-gray-50">
          {cities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay ciudades</p>
          ) : (
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  {editingId === city.id ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(city.id)}
                      />
                      <button onClick={() => handleUpdate(city.id)} className="text-green-600">✓</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500">✕</button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{city.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(city.id); setEditingName(city.name) }} className="text-blue-600 text-sm">Editar</button>
                        <button onClick={() => handleDelete(city.id)} disabled={deleting === city.id} className="text-red-600 text-sm disabled:opacity-50">
                          {deleting === city.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function FranchiseForm({ cities, onSave, editingFranchise, onCancel, photos, pendingPhotos, onAddPendingPhotos, onRemovePendingPhoto, onDeletePhoto }) {
  const [formData, setFormData] = useState({
    city_id: '',
    coordinates: '',
    streets: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [coordsError, setCoordsError] = useState('')

  useEffect(() => {
    if (editingFranchise) {
      const coords = editingFranchise.latitude && editingFranchise.longitude
        ? `${editingFranchise.latitude},${editingFranchise.longitude}`
        : ''
      setFormData({
        city_id: editingFranchise.city_id || '',
        coordinates: coords,
        streets: editingFranchise.streets || '',
      })
    } else {
      setFormData({
        city_id: cities[0]?.id || '',
        coordinates: '',
        streets: '',
      })
    }
  }, [editingFranchise, cities])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'coordinates' && value.trim()) {
      const parts = value.split(',').map(s => s.trim())
      if (parts.length === 2) {
        const lat = parseFloat(parts[0])
        const lng = parseFloat(parts[1])
        if (isNaN(lat) || isNaN(lng)) {
          setCoordsError('Coordenadas inválidas: debe ser latitud,longitud')
        } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          setCoordsError('Coordenadas fuera de rango (lat: -90 a 90, lng: -180 a 180)')
        } else {
          setCoordsError('')
        }
      } else {
        setCoordsError('Formato inválido: use latitud,longitud')
      }
    } else if (name === 'coordinates') {
      setCoordsError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.city_id) {
      setError('La ciudad es requerida')
      return
    }

    let latitude = null
    let longitude = null

    if (formData.coordinates.trim()) {
      const parts = formData.coordinates.split(',').map(s => s.trim())
      if (parts.length === 2) {
        const lat = parseFloat(parts[0])
        const lng = parseFloat(parts[1])
        if (!isNaN(lat) && !isNaN(lng)) {
          latitude = lat
          longitude = lng
        } else {
          setError('Coordenadas inválidas. Formato: latitud,longitud')
          return
        }
      } else {
        setError('Coordenadas inválidas. Formato: latitud,longitud')
        return
      }
    }

    setSaving(true)
    setError('')
    try {
      const franchiseData = {
        city_id: formData.city_id,
        latitude,
        longitude,
        streets: formData.streets || null,
      }
      await onSave(franchiseData)

      if (!editingFranchise) {
        setFormData({
          city_id: cities[0]?.id || '',
          coordinates: '',
          streets: '',
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">
        {editingFranchise ? 'Editar Franquicia' : 'Nueva Franquicia'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad *</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border rounded text-sm"
            required
          >
            <option value="">Seleccionar</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            type="text"
            name="streets"
            value={formData.streets}
            onChange={handleChange}
            placeholder="Ej: Ubicada en la Zona Escalón"
            className="w-full px-2 py-1.5 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            Coordenadas
            <span title="Ingresa latitud y longitud separados por coma (ej: -0.1807,-78.4678). Puedes obtenerlas desde Google Maps." className="cursor-help text-gray-400">
              <Icon icon="mdi:information" className="w-4 h-4" />
            </span>
          </label>
          <input
            type="text"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
            placeholder="lat,lng (ej: -0.180653,-78.467834)"
            className={`w-full px-2 py-1.5 border rounded text-sm ${coordsError ? 'border-red-500' : ''}`}
          />
          <p className="text-xs text-gray-500 mt-1">Formato: latitud,longitud (ej: -0.1807,-78.4678)</p>
          {coordsError && <p className="text-xs text-red-500 mt-1">{coordsError}</p>}
        </div>

        <div className="md:col-span-3 flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? '...' : editingFranchise ? 'Actualizar' : 'Guardar'}
          </button>
          {editingFranchise && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>

        {editingFranchise && (
          <div className="md:col-span-3 mt-4">
            <FranchisePhotosManager
              photos={photos}
              pendingPhotos={pendingPhotos}
              onAddPendingPhotos={onAddPendingPhotos}
              onRemovePendingPhoto={onRemovePendingPhoto}
              onDeletePhoto={onDeletePhoto}
            />
          </div>
        )}
      </div>
    </form>
  )
}

function FranchiseTable({ franchises, cities, onEdit, onDelete, filterCity, setFilterCity }) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const getCityName = (cityId) => {
    const city = cities.find(c => c.id === cityId)
    return city?.name || '-'
  }

  const filteredFranchises = franchises.filter(f => {
    if (filterCity && f.city_id !== filterCity) return false
    return true
  })

  const hasFilteredData = filteredFranchises.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4 min-h-[250px] max-h-[400px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-gray-600">Ubicación</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600 relative">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="inline-flex items-center gap-1 hover:text-primary"
              >
                Ciudad
                <Icon icon="mdi:chevron-down" className="w-4 h-4" />
              </button>
              {openDropdown && (
                <div className="absolute z-10 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <div className="p-2">
                    <button
                      onClick={() => { setFilterCity(''); setOpenDropdown(false) }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${!filterCity ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      Todas
                    </button>
                    {cities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => { setFilterCity(city.id); setOpenDropdown(false) }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${filterCity === city.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600 hidden md:table-cell">Coords</th>
            <th className="px-3 py-2 text-left font-semibold text-gray-600 hidden md:table-cell">Fotos</th>
            <th className="px-3 py-2 text-right font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hasFilteredData ? filteredFranchises.map((franchise) => (
            <tr key={franchise.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">{franchise.streets || '-'}</td>
              <td className="px-3 py-2">{getCityName(franchise.city_id)}</td>
              <td className="px-3 py-2 text-xs text-gray-500 hidden md:table-cell">
                {franchise.latitude && franchise.longitude ? `${franchise.latitude}, ${franchise.longitude}` : '-'}
              </td>
              <td className="px-3 py-2 hidden md:table-cell">
                {franchise.photos?.length > 0 && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {franchise.photos.length}
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => onEdit(franchise)} className="text-blue-600 hover:text-blue-700 p-1 inline-block" title="Editar">
                  <Icon icon="mdi:pencil" className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(franchise.id)} className="text-red-600 hover:text-red-700 p-1 inline-block ml-2" title="Eliminar">
                  <Icon icon="mdi:trash-can" className="w-5 h-5" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" className="px-3 py-6 text-center text-gray-500">
                No hay franquicias que coincidan con el filtro
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function FranchisePhotosManager({ photos, pendingPhotos, onAddPendingPhotos, onRemovePendingPhoto, onDeletePhoto }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-800">Fotos de la Franquicia</h4>
        <button
          type="button"
          onClick={onAddPendingPhotos}
          className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover"
        >
          Seleccionar Fotos
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent">
              <img src={photo.url} alt="Foto franquicia" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onDeletePhoto(photo.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar"
            >
              <Icon icon="mdi:trash-can" className="w-4 h-4" />
            </button>
          </div>
        ))}

        {pendingPhotos.map((photo, index) => (
          <div key={`pending-${index}`} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-quaternary">
              <img src={photo.preview} alt="Foto pendiente" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onRemovePendingPhoto(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 transition-opacity"
              title="Eliminar"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && pendingPhotos.length === 0 && (
        <p className="text-gray-500 text-center text-sm">No hay fotos. Agrega la primera!</p>
      )}
    </div>
  )
}

export default function Franchises() {
  const [franchises, setFranchises] = useState([])
  const [cities, setCities] = useState([])
  const [allCities, setAllCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingFranchise, setEditingFranchise] = useState(null)
  const [showCityModal, setShowCityModal] = useState(false)
  const [error, setError] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [photos, setPhotos] = useState([])
  const [pendingPhotos, setPendingPhotos] = useState([])
  const formRef = useRef(null)
  const { confirm, ConfirmDialog } = useConfirm()

  useEffect(() => {
    if (editingFranchise && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingFranchise])

  const fetchData = async () => {
    try {
      const [groupedData, allCitiesData] = await Promise.all([
        privateApi.getFranchises(),
        privateApi.getCities()
      ])
      
      const citiesWithFranchises = groupedData.map(d => d.city)
      const allFranchises = groupedData.flatMap(d => d.franchises)

      const franchisesWithPhotos = allFranchises.map(f => ({
        ...f,
        photos: f.photos || []
      }))

      setFranchises(franchisesWithPhotos)
      setCities(citiesWithFranchises)
      setAllCities(allCitiesData?.data || allCitiesData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (editingFranchise) {
      const franchise = franchises.find(f => f.id === editingFranchise.id)
      setPhotos(franchise?.photos || [])
    } else {
      setPhotos([])
    }
  }, [editingFranchise, franchises])

  const handleAddPendingPhotos = () => {
    document.getElementById('franchise-pending-photos-input').click()
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPendingPhotos(prev => [...prev, ...previews])
    e.target.value = ''
  }

  const handleRemovePendingPhoto = (index) => {
    URL.revokeObjectURL(pendingPhotos[index].preview)
    setPendingPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeletePhoto = async (photoId) => {
    confirm({
      title: '¿Eliminar esta foto?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          const photo = photos.find(p => p.id === photoId)
          if (photo?.url) {
            await deleteImage('Franchises', photo.url)
          }

          await privateApi.deleteFranchisePhoto(photoId)
          sileo.success({ title: 'Foto eliminada exitosamente' })
          await fetchData()
          setPhotos(prev => prev.filter(p => p.id !== photoId))
        } catch (err) {
          console.error('Error deleting photo:', err)
          sileo.error({ title: 'Error al eliminar foto' })
        }
      },
    })
  }

  const handleCancel = () => {
    pendingPhotos.forEach(p => URL.revokeObjectURL(p.preview))
    setPendingPhotos([])
    setPhotos([])
    setEditingFranchise(null)
  }

  const handleSaveFranchise = async (franchiseData) => {
    try {
      let franchiseId = editingFranchise?.id

      if (editingFranchise) {
        await privateApi.updateFranchise(editingFranchise.id, franchiseData)
        sileo.success({ title: 'Franquicia actualizada exitosamente' })
      } else {
        const response = await privateApi.createFranchise(franchiseData)
        franchiseId = response.id
        sileo.success({ title: 'Franquicia creada exitosamente' })
      }

      if (pendingPhotos.length > 0) {
        for (const photo of pendingPhotos) {
          const url = await uploadImage(photo.file, 'Franchises')
          if (url) {
            await privateApi.createFranchisePhoto({
              franchise_id: franchiseId,
              url,
            })
          }
        }
        sileo.success({ title: `${pendingPhotos.length} fotos agregadas` })
      }

      pendingPhotos.forEach(p => URL.revokeObjectURL(p.preview))
      setPendingPhotos([])
      setPhotos([])
      setEditingFranchise(null)
      await fetchData()
    } catch (err) {
      console.error('Error saving franchise:', err)
      sileo.error({ title: 'Error al guardar franquicia' })
    }
  }

  const handleDeleteFranchise = async (id) => {
    confirm({
      title: '¿Eliminar esta franquicia?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await privateApi.deleteFranchise(id)
          sileo.success({ title: 'Franquicia eliminada exitosamente' })
          await fetchData()
        } catch {
          sileo.error({ title: 'Error al eliminar franquicia' })
        }
      },
    })
  }

  const handleSaveCity = async (data) => {
    await privateApi.createCity(data)
    sileo.success({ title: 'Ciudad creada exitosamente' })
    await fetchData()
  }

  const handleUpdateCity = async (id, data) => {
    await privateApi.updateCity(id, data)
    sileo.success({ title: 'Ciudad actualizada exitosamente' })
    await fetchData()
  }

  const handleDeleteCity = async (id) => {
    confirm({
      title: '¿Eliminar esta ciudad?',
      message: 'Se eliminarán todas las franquicias de esta ciudad',
      onConfirm: async () => {
        try {
          await privateApi.deleteCity(id)
          sileo.success({ title: 'Ciudad eliminada exitosamente' })
          await fetchData()
        } catch {
          sileo.error({ title: 'Error al eliminar ciudad' })
        }
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Franquicias</h1>
        <button
          onClick={() => setShowCityModal(true)}
          className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/70"
        >
          Ciudades
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div ref={formRef}>
        <FranchiseForm
          cities={allCities}
          onSave={handleSaveFranchise}
          editingFranchise={editingFranchise}
          onCancel={handleCancel}
          photos={photos}
          pendingPhotos={pendingPhotos}
          onAddPendingPhotos={handleAddPendingPhotos}
          onRemovePendingPhoto={handleRemovePendingPhoto}
          onDeletePhoto={handleDeletePhoto}
        />
      </div>

      <input
        id="franchise-pending-photos-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <FranchiseTable
        franchises={franchises}
        cities={cities}
        onEdit={setEditingFranchise}
        onDelete={handleDeleteFranchise}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
      />

      <CityModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        cities={allCities}
        onSave={handleSaveCity}
        onDelete={handleDeleteCity}
        onUpdate={handleUpdateCity}
      />

      <ConfirmDialog />
    </div>
  )
}
