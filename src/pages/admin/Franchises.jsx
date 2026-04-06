import { useState, useEffect, useRef } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage, deleteImage } from '../../services/supabase'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'

function CityModal({ isOpen, onClose, cities, onSave, onDelete, onUpdate }) {
  const [newCity, setNewCity] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-gray-200">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Gestionar Ciudades</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                        <button onClick={() => onDelete(city.id)} className="text-red-600 text-sm">Eliminar</button>
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

function FranchiseForm({ cities, onSave, editingFranchise, onCancel }) {
  const [formData, setFormData] = useState({
    manager_name: '',
    description: '',
    city_id: '',
    manager_photo: '',
    manager_description: '',
    coordinates: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingFranchise) {
      const coords = editingFranchise.latitude && editingFranchise.longitude
        ? `${editingFranchise.latitude},${editingFranchise.longitude}`
        : ''
      setFormData({
        manager_name: editingFranchise.manager_name || '',
        description: editingFranchise.description || '',
        city_id: editingFranchise.city_id || '',
        manager_photo: editingFranchise.manager_photo || '',
        manager_description: editingFranchise.manager_description || '',
        coordinates: coords,
      })
      setImagePreview(editingFranchise.manager_photo || '')
      setImageFile(null)
    } else {
      setFormData({
        manager_name: '',
        description: '',
        city_id: cities[0]?.id || '',
        manager_photo: '',
        manager_description: '',
        coordinates: '',
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingFranchise, cities])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result || '')
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, manager_photo: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.manager_name.trim()) {
      setError('El nombre del gerente es requerido')
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
      let managerPhotoUrl = formData.manager_photo

      if (imageFile) {
        if (editingFranchise?.manager_photo) {
          await deleteImage('ManagerFranchises', editingFranchise.manager_photo)
        }
        setUploading(true)
        managerPhotoUrl = await uploadImage(imageFile, 'ManagerFranchises')
        setUploading(false)
        if (!managerPhotoUrl) {
          setError('Error al subir la foto')
          setSaving(false)
          return
        }
      }

      const franchiseData = {
        manager_name: formData.manager_name,
        description: formData.description,
        city_id: formData.city_id || null,
        manager_photo: managerPhotoUrl,
        manager_description: formData.manager_description || null,
        latitude,
        longitude,
      }
      await onSave(franchiseData)

      if (!editingFranchise) {
        setFormData({
          manager_name: '',
          description: '',
          city_id: cities[0]?.id || '',
          manager_photo: '',
          manager_description: '',
          coordinates: '',
        })
        setImageFile(null)
        setImagePreview('')
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
          <label className="block text-xs font-medium text-gray-700 mb-1">Gerente *</label>
          <input
            type="text"
            name="manager_name"
            value={formData.manager_name}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border rounded text-sm"
          >
            <option value="">Seleccionar</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Coordenadas</label>
          <input
            type="text"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
            placeholder="lat,lng"
            className="w-full px-2 py-1.5 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Foto del Gerente</label>
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Icon icon="mdi:chevron-down" className="w-6 h-6 text-gray-400 rotate-90" />
              </label>
            )}
            {uploading && <span className="text-xs text-gray-500">Subiendo...</span>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            name="manager_description"
            value={formData.manager_description}
            onChange={handleChange}
            className="w-full px-2 py-1.5 border rounded text-sm"
          />
        </div>

        <div className="md:col-span-3 flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-hover disabled:opacity-50"
          >
            {saving || uploading ? '...' : editingFranchise ? 'Actualizar' : 'Guardar'}
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

  if (!filteredFranchises.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500 text-sm">
        No hay franquicias registradas
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Gerente</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Dirección</th>
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
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Coords</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFranchises.map((franchise) => (
              <tr key={franchise.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{franchise.manager_name}</td>
                <td className="px-3 py-2 text-gray-600">{franchise.description || '-'}</td>
                <td className="px-3 py-2">{getCityName(franchise.city_id)}</td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {franchise.latitude && franchise.longitude
                    ? `${franchise.latitude}, ${franchise.longitude}`
                    : '-'}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Franchises() {
  const [franchises, setFranchises] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingFranchise, setEditingFranchise] = useState(null)
  const [showCityModal, setShowCityModal] = useState(false)
  const [error, setError] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (editingFranchise && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingFranchise])

  const fetchData = async () => {
    try {
      const [franchisesRes, citiesRes] = await Promise.all([
        privateApi.getFranchises(),
        privateApi.getCities(),
      ])
      setFranchises(franchisesRes?.data || franchisesRes || [])
      setCities(citiesRes?.data || citiesRes || [])
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

  const handleSaveFranchise = async (franchiseData) => {
    if (editingFranchise) {
      await privateApi.updateFranchise(editingFranchise.id, franchiseData)
      sileo.success({ title: 'Franquicia actualizada exitosamente' })
    } else {
      await privateApi.createFranchise(franchiseData)
      sileo.success({ title: 'Franquicia creada exitosamente' })
    }
    setEditingFranchise(null)
    await fetchData()
  }

  const handleDeleteFranchise = async (id) => {
    if (!confirm('¿Eliminar esta franquicia?')) return
    try {
      await privateApi.deleteFranchise(id)
      sileo.success({ title: 'Franquicia eliminada exitosamente' })
      await fetchData()
    } catch {
      sileo.error({ title: 'Error al eliminar franquicia' })
    }
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
    if (!confirm('¿Eliminar esta ciudad?')) return
    try {
      await privateApi.deleteCity(id)
      sileo.success({ title: 'Ciudad eliminada exitosamente' })
      await fetchData()
    } catch {
      sileo.error({ title: 'Error al eliminar ciudad' })
    }
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
          cities={cities}
          onSave={handleSaveFranchise}
          editingFranchise={editingFranchise}
          onCancel={() => setEditingFranchise(null)}
        />
      </div>

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
        cities={cities}
        onSave={handleSaveCity}
        onDelete={handleDeleteCity}
        onUpdate={handleUpdateCity}
      />
    </div>
  )
}
