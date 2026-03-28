import { useState, useEffect } from 'react'
import { privateApi } from '../../services/api'
import { sileo } from 'sileo'

function AnnouncementPreview({ title, description, image_url }) {
  const hasContent = title || description || image_url

  if (!hasContent) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center h-full flex items-center justify-center min-h-[200px]">
        <p className="text-gray-400">La previsualización se mostrará aquí</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
      <div className="md:flex h-full">
        {image_url && (
          <div className="md:w-1/2 h-64 md:h-auto">
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

  useEffect(() => {
    if (editingAnnouncement) {
      setFormData({
        title: editingAnnouncement.title || '',
        description: editingAnnouncement.description || '',
        image_url: editingAnnouncement.image_url || '',
        active: editingAnnouncement.active ?? true,
      })
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
    }
  }, [editingAnnouncement])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('El título es requerido')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave(formData)
      if (!editingAnnouncement) {
        setFormData({
          title: '',
          description: '',
          image_url: '',
          active: true,
        })
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
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? '...' : editingAnnouncement ? 'Actualizar' : 'Guardar'}
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

function AnnouncementTable({ announcements, onEdit, onDelete }) {
  if (!announcements.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        No hay avisos publicados
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Título</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Descripción</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Imagen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium">{announcement.title}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {announcement.description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {announcement.image_url ? (
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    announcement.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {announcement.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(announcement)}
                    className="text-blue-600 hover:text-blue-700 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(announcement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
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
    if (!confirm('¿Estás seguro de eliminar este aviso?')) return
    try {
      await privateApi.deleteAnnouncement(id)
      sileo.success({ title: 'Aviso eliminado exitosamente' })
      await fetchAnnouncements()
    } catch {
      sileo.error({ title: 'Error al eliminar aviso' })
    }
  }

  const handleCancel = () => {
    setEditingAnnouncement(null)
    setPreviewData({ title: '', description: '', image_url: '' })
  }

  const handlePreviewChange = (data) => {
    setPreviewData(data)
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Avisos</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col">
          <AnnouncementForm
            onSave={handleSaveAnnouncement}
            editingAnnouncement={editingAnnouncement}
            onCancel={handleCancel}
            onChange={handlePreviewChange}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Previsualización</h3>
            <span className="text-xs text-gray-400">Se actualiza automáticamente</span>
          </div>
          <AnnouncementPreview
            title={previewData.title}
            description={previewData.description}
            image_url={previewData.image_url}
          />
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
        />
      </div>
    </div>
  )
}
