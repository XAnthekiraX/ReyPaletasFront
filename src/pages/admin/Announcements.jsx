import { useState, useEffect, useRef, useCallback } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage, deleteImage } from '../../services/supabase'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'
import { useConfirm } from '../../components/ConfirmDialog'

function AnnouncementPreview({ title, description, image_url }) {
  const hasContent = title || description || image_url

  if (!hasContent) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center h-full w-full flex items-center justify-center min-h-[200px]">
        <p className="text-gray-400">La previsualización se mostrará aquí</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-auto h-auto">
      <div className="md:flex h-full">
        {image_url && (
          <div className="w-auto md:w-1/2 h-64 md:h-auto">
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-quaternary mb-3">
            {title || 'Título del aviso'}
          </h3>
          <p className="text-gray-600">
            {description || 'Descripción del aviso...'}
          </p>
        </div>
      </div>
    </div>
  )
}

function AnnouncementForm({ onSave, editingAnnouncement, onCancel, onChange }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    active: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        title: editingAnnouncement.title || '',
        description: editingAnnouncement.description || '',
        image_url: editingAnnouncement.image_url || '',
        active: editingAnnouncement.active ?? true,
      })
      setImagePreview(editingAnnouncement.image_url || '')
      setImageFile(null)
      onChange({
        title: editingAnnouncement.title || '',
        description: editingAnnouncement.description || '',
        image_url: editingAnnouncement.image_url || '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        active: true,
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingAnnouncement, onChange])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    }
    setFormData(newData)
    onChange({
      title: newData.title,
      description: newData.description,
      image_url: newData.image_url,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result || ''
        setImagePreview(result)
        onChange({
          title: formData.title,
          description: formData.description,
          image_url: result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, image_url: '' }))
    onChange({ title: formData.title, description: formData.description, image_url: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('El título es requerido')
      return
    }

    setSaving(true)
    setError('')
    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        if (editingAnnouncement?.image_url) {
          await deleteImage('Announcements', editingAnnouncement.image_url)
        }
        setUploading(true)
        imageUrl = await uploadImage(imageFile, 'Announcements')
        setUploading(false)
        if (!imageUrl) {
          setError('Error al subir la imagen')
          setSaving(false)
          return
        }
      }

      const announcementData = {
        ...formData,
        image_url: imageUrl,
      }
      await onSave(announcementData)

      if (!editingAnnouncement) {
        setFormData({ title: '', description: '', image_url: '', active: true })
        setImagePreview('')
        setImageFile(null)
        onChange({ title: '', description: '', image_url: '' })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (

    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 h-full">
      <h2 className="text-lg font-semibold mb-4">
        {editingAnnouncement ? 'Editar Aviso' : 'Nuevo Aviso'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Aviso</label>
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Icon icon="mdi:chevron-down" className="w-8 h-8 text-gray-400 rotate-90" />
              </label>
            )}
            {uploading && <span className="text-xs text-gray-500">Subiendo imagen...</span>}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm text-gray-700">Activo (visible en el sitio)</span>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {saving || uploading ? '...' : editingAnnouncement ? 'Actualizar' : 'Guardar'}
          </button>
          {editingAnnouncement && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

function AnnouncementTable({ announcements, onEdit, onDelete, filterActive, setFilterActive }) {
  const [openDropdown, setOpenDropdown] = useState(false)

  const filteredAnnouncements = announcements.filter(a => {
    if (filterActive === 'active' && !a.active) return false
    if (filterActive === 'inactive' && a.active) return false
    return true
  })

  const hasFilteredData = filteredAnnouncements.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[250px] max-h-[400px] overflow-y-auto">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Título</th>
            <th className="md:px-4 md:py-3 w-0 md:w-auto  overflow-hidden flex text-left text-sm font-semibold text-gray-600">Descripción</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Imagen</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 relative">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="inline-flex items-center gap-1 hover:text-primary"
              >
                Estado
                <Icon icon="mdi:chevron-down" className="w-4 h-4" />
              </button>
              {openDropdown && (
                <div className="absolute z-10 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <div className="p-2">
                    <button
                      onClick={() => { setFilterActive(''); setOpenDropdown(false) }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${!filterActive ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => { setFilterActive('active'); setOpenDropdown(false) }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${filterActive === 'active' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      Activos
                    </button>
                    <button
                      onClick={() => { setFilterActive('inactive'); setOpenDropdown(false) }}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${filterActive === 'inactive' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      Inactivos
                    </button>
                  </div>
                </div>
              )}
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hasFilteredData ? filteredAnnouncements.map((announcement) => (
            <tr key={announcement.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <span className="font-medium">{announcement.title}</span>
              </td>
              <td className="md:px-4 md:py-3 w-0 md:w-auto  overflow-hidden flex ">
                <p className="text-sm text-gray-600 truncate max-w-xs max-h-25 overflow-y-auto text-wrap">
                  {announcement.description}
                </p>
              </td>
              <td className="px-4 py-3">
                {announcement.image_url ? (
                  <img
                    src={announcement.image_url}
                    alt={announcement.title}
                    className="w-12 h-12 rounded object-contain"
                  />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${announcement.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {announcement.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(announcement)} className="text-blue-600 hover:text-blue-700 p-1 inline-block" title="Editar">
                  <Icon icon="mdi:pencil" className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(announcement.id)} className="text-red-600 hover:text-red-700 p-1 inline-block ml-2" title="Eliminar">
                  <Icon icon="mdi:trash-can" className="w-5 h-5" />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                No hay avisos que coincidan con el filtro
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [error, setError] = useState('')
  const [previewData, setPreviewData] = useState({
    title: '',
    description: '',
    image_url: '',
  })
  const [filterActive, setFilterActive] = useState('')
  const formRef = useRef(null)
  const { confirm, ConfirmDialog } = useConfirm()

  useEffect(() => {
    if (editingAnnouncement && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingAnnouncement])

  const fetchAnnouncements = async () => {
    try {
      const data = await privateApi.getAnnouncements()
      setAnnouncements(data?.data || data || [])
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setError('Error al cargar avisos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleSaveAnnouncement = async (formData) => {
    if (editingAnnouncement) {
      await privateApi.updateAnnouncement(editingAnnouncement.id, formData)
      sileo.success({ title: 'Aviso actualizado exitosamente' })
    } else {
      await privateApi.createAnnouncement(formData)
      sileo.success({ title: 'Aviso creado exitosamente' })
    }
    setEditingAnnouncement(null)
    setPreviewData({ title: '', description: '', image_url: '' })
    await fetchAnnouncements()
  }

  const handleDeleteAnnouncement = async (id) => {
    confirm({
      title: '¿Eliminar este aviso?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await privateApi.deleteAnnouncement(id)
          sileo.success({ title: 'Aviso eliminado exitosamente' })
          await fetchAnnouncements()
        } catch {
          sileo.error({ title: 'Error al eliminar aviso' })
        }
      },
    })
  }

  const handleCancel = () => {
    setEditingAnnouncement(null)
    setPreviewData({ title: '', description: '', image_url: '' })
  }

  const handlePreviewChange = useCallback((data) => {
    setPreviewData(data)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Avisos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col" ref={formRef}>
          <AnnouncementForm
            onSave={handleSaveAnnouncement}
            editingAnnouncement={editingAnnouncement}
            onCancel={handleCancel}
            onChange={handlePreviewChange}
          />
        </div>

        <div className="flex flex-col ">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Previsualización</h3>
            <span className="text-xs text-gray-400">Se actualiza automáticamente</span>
          </div>
          <div className='w-full h-full flex justify-center items-center'>
            <AnnouncementPreview
              title={previewData.title}
              description={previewData.description}
              image_url={previewData.image_url}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Avisos Publicados ({announcements.length})</h2>
        <AnnouncementTable
          announcements={announcements}
          onEdit={(announcement) => {
            setEditingAnnouncement(announcement)
            setPreviewData({
              title: announcement.title,
              description: announcement.description,
              image_url: announcement.image_url,
            })
          }}
          onDelete={handleDeleteAnnouncement}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
        />
      </div>

      <ConfirmDialog />
    </div>
  )
}
