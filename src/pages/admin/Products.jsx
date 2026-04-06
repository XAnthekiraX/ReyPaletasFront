import { useState, useEffect, useRef } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage, deleteImage } from '../../services/supabase'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'

function CategoryModal({ isOpen, onClose, categories, onSave, onDelete, onUpdate }) {
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!newCategory.trim()) return
    setSaving(true)
    setError('')
    try {
      await onSave({ name: newCategory })
      setNewCategory('')
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
          <h2 className="text-lg font-semibold text-gray-800">Gestionar Categorías</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Categoría</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ej: Postres, Bebidas, etc."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={saving || !newCategory.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 font-medium"
            >
              {saving ? '...' : 'Agregar'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="p-4 overflow-y-auto max-h-64 bg-gray-50">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay categorías. Agrega una nueva arriba.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  {editingId === cat.id ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                      />
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={saving}
                        className="text-green-600 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{cat.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id)
                            setEditingName(cat.name)
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(cat.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Eliminar
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

function VariantList({ variants, onAdd, onRemove, onUpdate }) {
  const [newVariant, setNewVariant] = useState({ name: '', price: '' })

  const handleAdd = () => {
    if (!newVariant.name.trim() || !newVariant.price) return
    onAdd({ name: newVariant.name, price: parseFloat(newVariant.price) })
    setNewVariant({ name: '', price: '' })
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <label className="block text-sm font-medium text-gray-700 mb-2">Variantes del producto</label>

      <div className="space-y-2 mb-3">
        {variants?.map((variant, index) => (
          <div key={variant.id || index} className="flex items-center gap-2">
            <input
              type="text"
              value={variant.name}
              onChange={(e) => onUpdate(index, { name: e.target.value })}
              className="flex-1 px-2 py-1 border rounded text-sm"
              placeholder="Nombre"
            />
            <input
              type="number"
              value={variant.price}
              onChange={(e) => onUpdate(index, { price: parseFloat(e.target.value) })}
              step="0.01"
              min="0"
              className="w-20 px-2 py-1 border rounded text-sm"
              placeholder="Precio"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newVariant.name}
          onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nueva variante..."
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
        <input
          type="number"
          value={newVariant.price}
          onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
          step="0.01"
          min="0"
          placeholder="Precio"
          className="w-20 px-2 py-1 border rounded text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newVariant.name.trim() || !newVariant.price}
          className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-hover disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  )
}

function ProductForm({ categories, onSave, editingProduct, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    exists: false,
    category_id: '',
    price_varies: false,
    image_url: '',
  })
  const [variants, setVariants] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        price: editingProduct.price || '',
        exists: editingProduct.exists ?? false,
        category_id: editingProduct.category_id || '',
        price_varies: editingProduct.price_varies ?? false,
        image_url: editingProduct.image_url || '',
      })
      setVariants(editingProduct.variants || [])
      setImagePreview(editingProduct.image_url || '')
      setImageFile(null)
    } else {
      setFormData({
        name: '',
        price: '',
        exists: false,
        category_id: categories[0]?.id || '',
        price_varies: false,
        image_url: '',
      })
      setVariants([])
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingProduct, categories])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleVariantAdd = (variant) => {
    setVariants(prev => [...prev, variant])
  }

  const handleVariantRemove = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleVariantUpdate = (index, data) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, ...data } : v))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('El nombre es requerido')
      return
    }

    if (!formData.price_varies && !formData.price) {
      setError('El precio es requerido')
      return
    }

    setSaving(true)
    setError('')
    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        if (editingProduct?.image_url) {
          await deleteImage('Products', editingProduct.image_url)
        }
        setUploading(true)
        imageUrl = await uploadImage(imageFile, 'Products')
        setUploading(false)
        if (!imageUrl) {
          setError('Error al subir la imagen')
          setSaving(false)
          return
        }
      }

      const productData = {
        ...formData,
        image_url: imageUrl,
        price: formData.price ? parseFloat(formData.price) : null,
        price_varies: formData.price_varies || variants.length > 0,
        variants: formData.price_varies ? variants : [],
      }
      await onSave(productData, variants)

      if (!editingProduct) {
        setFormData({
          name: '',
          price: '',
          exists: false,
          category_id: categories[0]?.id || '',
          price_varies: false,
          image_url: '',
        })
        setVariants([])
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={formData.price_varies}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
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
                <div className="text-center text-gray-400">
                  <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Subir</span>
                </div>
              </label>
            )}
            {uploading && <span className="text-xs text-gray-500">Subiendo imagen...</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="exists"
              checked={formData.exists}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm text-gray-700">Añadido al menú</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="price_varies"
              checked={formData.price_varies}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm text-gray-700">Precio variable (usar variantes)</span>
          </label>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {saving || uploading ? '...' : editingProduct ? 'Actualizar' : 'Guardar'}
          </button>
          {editingProduct && (
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

      {formData.price_varies && (
        <VariantList
          variants={variants}
          onAdd={handleVariantAdd}
          onRemove={handleVariantRemove}
          onUpdate={handleVariantUpdate}
        />
      )}
    </form>
  )
}

function ProductTable({ products, categories, onEdit, onDelete, filterCategory, setFilterCategory, filterExists, setFilterExists }) {
  const [expandedProducts, setExpandedProducts] = useState({})
  const [openDropdown, setOpenDropdown] = useState(null)

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name || 'Sin categoría'
  }

  const filteredProducts = products.filter(product => {
    if (filterCategory && product.category_id !== filterCategory) return false
    if (filterExists === 'added' && !product.exists) return false
    if (filterExists === 'pending' && product.exists) return false
    return true
  })

  const toggleVariants = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 max-w-[200px]">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Precio</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 relative">
                <button
                  onClick={() => toggleDropdown('category')}
                  className="inline-flex items-center gap-1 hover:text-primary"
                >
                  Categoría
                  <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                </button>
                {openDropdown === 'category' && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <div className="p-2">
                      <button
                        onClick={() => { setFilterCategory(''); setOpenDropdown(null) }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${!filterCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                      >
                        Todas
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setFilterCategory(cat.id); setOpenDropdown(null) }}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${filterCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 relative">
                <button
                  onClick={() => toggleDropdown('status')}
                  className="inline-flex items-center gap-1 hover:text-primary"
                >
                  Estado
                  <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                </button>
                {openDropdown === 'status' && (
                  <div className="absolute z-10 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                    <div className="p-2">
                      <button
                        onClick={() => { setFilterExists(''); setOpenDropdown(null) }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${!filterExists ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => { setFilterExists('added'); setOpenDropdown(null) }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${filterExists === 'added' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                      >
                        Añadidos
                      </button>
                      <button
                        onClick={() => { setFilterExists('pending'); setOpenDropdown(null) }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${filterExists === 'pending' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                      >
                        Por añadir
                      </button>
                    </div>
                  </div>
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Precio Variable</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Variantes</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No hay productos
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <>
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <span className="font-medium truncate max-w-[150px]" title={product.name}>
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.price ? `$${product.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3">{getCategoryName(product.category_id)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.exists
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {product.exists ? 'Añadido' : 'Por añadir'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.price_varies ? 'Sí' : 'No'}
                    </td>
                    <td className="px-4 py-3">
                      {product.variants?.length > 0 ? (
                        <button
                          onClick={() => toggleVariants(product.id)}
                          className="text-primary hover:text-primary-hover text-sm underline"
                        >
                          {expandedProducts[product.id] ? 'Ocultar' : `Ver (${product.variants.length})`}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-700 p-1 inline-block"
                        title="Editar"
                      >
                        <Icon icon="mdi:pencil" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700 p-1 inline-block ml-2"
                        title="Eliminar"
                      >
                        <Icon icon="mdi:trash-can" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  {expandedProducts[product.id] && product.variants?.length > 0 && (
                    <tr key={`${product.id}-variants`}>
                      <td colSpan="7" className="px-4 py-3 bg-gray-50">
                        <div className="ml-8">
                          <p className="text-sm font-medium text-gray-600 mb-2">Variantes:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white border rounded text-sm">
                                {variant.name}: ${variant.price?.toFixed(2)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterExists, setFilterExists] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (editingProduct && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingProduct])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        privateApi.getProducts(),
        privateApi.getCategories(),
      ])
      setProducts(productsRes?.data || productsRes || [])
      setCategories(categoriesRes?.data || categoriesRes || [])
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

  const handleSaveProduct = async (productData, variants) => {
    if (editingProduct) {
      await privateApi.updateProduct(editingProduct.id, productData)

      if (editingProduct.variants) {
        const originalIds = editingProduct.variants.map(v => v.id).filter(Boolean)
        const newIds = variants.map(v => v.id).filter(Boolean)
        const toDelete = originalIds.filter(id => !newIds.includes(id))

        for (const id of toDelete) {
          await privateApi.deleteProductVariant(id)
        }
      }

      if (productData.price_varies && variants) {
        for (const variant of variants) {
          if (variant.id) {
            await privateApi.updateProductVariant(variant.id, variant)
          } else {
            await privateApi.createProductVariant({ ...variant, product_id: editingProduct.id })
          }
        }
      }
      sileo.success({ title: 'Producto actualizado exitosamente' })
    } else {
      const response = await privateApi.createProduct(productData)

      if (productData.price_varies && variants?.length > 0) {
        for (const variant of variants) {
          await privateApi.createProductVariant({ ...variant, product_id: response.id })
        }
      }
      sileo.success({ title: 'Producto creado exitosamente' })
    }
    setEditingProduct(null)
    await fetchData()
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await privateApi.deleteProduct(id)
      sileo.success({ title: 'Producto eliminado exitosamente' })
      await fetchData()
    } catch {
      sileo.error({ title: 'Error al eliminar producto' })
    }
  }

  const handleSaveCategory = async (data) => {
    await privateApi.createCategory(data)
    sileo.success({ title: 'Categoría creada exitosamente' })
    await fetchData()
  }

  const handleUpdateCategory = async (id, data) => {
    await privateApi.updateCategory(id, data)
    sileo.success({ title: 'Categoría actualizada exitosamente' })
    await fetchData()
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
    try {
      await privateApi.deleteCategory(id)
      sileo.success({ title: 'Categoría eliminada exitosamente' })
      await fetchData()
    } catch {
      sileo.error({ title: 'Error al eliminar categoría' })
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70"
        >
          Add/Edit Categorías
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div ref={formRef}>
        <ProductForm
          categories={categories}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </div>

      <ProductTable
        products={products}
        categories={categories}
        onEdit={setEditingProduct}
        onDelete={handleDeleteProduct}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterExists={filterExists}
        setFilterExists={setFilterExists}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        onUpdate={handleUpdateCategory}
      />
    </div>
  )
}
