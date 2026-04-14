import { useState, useEffect } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage } from '../../services/supabase'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'
import { useConfirm } from '../../components/ConfirmDialog'

function HeroImageForm({ onSave, editingImage, onCancel }) {
  const [formData, setFormData] = useState({
    url: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingImage) {
      setFormData({
        url: editingImage.url || '',
      })
      setImagePreview(editingImage.url || '')
      setImageFile(null)
    } else {
      setFormData({ url: '' })
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingImage])

  const handleChange = (e) => {
    setFormData({ ...formData, url: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result || '')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ url: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imagePreview && !formData.url) {
      setError('La imagen es requerida')
      return
    }

    setSaving(true)
    setError('')
    try {
      let imageUrl = imagePreview || formData.url

      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImage(imageFile, 'HeroImages')
        setUploading(false)
        if (!imageUrl) {
          setError('Error al subir la imagen')
          setSaving(false)
          return
        }
      }

      await onSave({ url: imageUrl })

      if (!editingImage) {
        setFormData({ url: '' })
        setImagePreview('')
        setImageFile(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">
        {editingImage ? 'Editar Imagen Hero' : 'Nueva Imagen Hero'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative w-full aspect-video max-w-md rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!!formData.url}
                />
                <div className="text-center text-gray-400">
                  <Icon icon="mdi:image-plus" className="w-12 h-12 mx-auto mb-2" />
                  <span className="text-sm">Click para subir imagen</span>
                </div>
              </label>
            )}
            {uploading && <span className="text-xs text-gray-500">Subiendo imagen...</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">O ingresa una URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {saving || uploading ? '...' : editingImage ? 'Actualizar' : 'Guardar'}
          </button>
          {editingImage && (
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

function HeroImageCard({ image, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="relative aspect-video">
        <img
          src={image.url}
          alt={`Hero ${image.id}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
            title="Editar"
          >
            <Icon icon="mdi:pencil" className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
            title="Eliminar"
          >
            <Icon icon="mdi:trash-can" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <span className="text-sm text-gray-500">ID: {image.id}</span>
      </div>
    </div>
  )
}

export default function HeroImages() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingImage, setEditingImage] = useState(null)
  const [error, setError] = useState('')
  const { confirm, ConfirmDialog } = useConfirm()

  const fetchImages = async () => {
    try {
      const data = await privateApi.getHeroImages()
      const imagesData = data || []
      setImages(imagesData)
    } catch (err) {
      console.error('Error fetching hero images:', err)
      setError('Error al cargar imágenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleSaveImage = async (formData) => {
    if (editingImage) {
      await privateApi.updateHeroImage(editingImage.id, formData)
      sileo.success({ title: 'Imagen actualizada exitosamente' })
    } else {
      await privateApi.createHeroImage(formData)
      sileo.success({ title: 'Imagen creada exitosamente' })
    }
    setEditingImage(null)
    await fetchImages()
  }

  const handleDeleteImage = async (id) => {
    confirm({
      title: '¿Eliminar esta imagen?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await privateApi.deleteHeroImage(id)
          sileo.success({ title: 'Imagen eliminada exitosamente' })
          await fetchImages()
        } catch {
          sileo.error({ title: 'Error al eliminar imagen' })
        }
      },
    })
  }

  const handleCancel = () => {
    setEditingImage(null)
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Imágenes Hero</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <HeroImageForm
            onSave={handleSaveImage}
            editingImage={editingImage}
            onCancel={handleCancel}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Previsualización del orden
            </h3>
            {images.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay imágenes configuradas</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <HeroImageCard
                    key={image.id}
                    image={image}
                    onEdit={() => setEditingImage(image)}
                    onDelete={() => handleDeleteImage(image.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  )
}
