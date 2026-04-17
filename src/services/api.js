const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL
  }

  getAccessToken() {
    return localStorage.getItem('rey_paletas_access_token')
  }

  setAccessToken(token) {
    localStorage.setItem('rey_paletas_access_token', token)
  }

  clearToken() {
    localStorage.removeItem('rey_paletas_access_token')
  }

  getHeaders(isPrivate = false) {
    const headers = {
      'Content-Type': 'application/json',
    }
    const token = this.getAccessToken()
    if (isPrivate && token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request(endpoint, options = {}, isPrivate = false) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      ...options,
      headers: this.getHeaders(isPrivate),
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        this.clearToken()
        window.dispatchEvent(new CustomEvent('auth:token-expired'))
        throw new Error('Sesión expirada')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      if (response.status === 204) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // Public endpoints (no auth required)
  async getPublic(endpoint) {
    return this.request(endpoint, { method: 'GET' }, false)
  }

  async postPublic(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }, false)
  }

  // Private endpoints (auth required)
  async getPrivate(endpoint) {
    return this.request(endpoint, { method: 'GET' }, true)
  }

  async postPrivate(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }, true)
  }

  async putPrivate(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }, true)
  }

  async deletePrivate(endpoint) {
    return this.request(endpoint, { method: 'DELETE' }, true)
  }
}

export const api = new ApiClient()

// Auth endpoints (public)
export const authApi = {
  login: (email, password) => api.postPublic('/public/login', { email, password }),
  logout: () => Promise.resolve(),
}

// Auth endpoints (private)
export const privateAuthApi = {
  refreshToken: (refreshToken) => api.postPrivate('/private/auth/refresh-token', { refresh_token: refreshToken }),
}

// Public data endpoints
export const publicApi = {
  getProducts: (categoryId = null, available = true) => {
    let endpoint = '/public/products?'
    const params = []
    if (categoryId) params.push(`category_id=${categoryId}`)
    params.push(`available=${available}`)
    return api.getPublic(endpoint + params.join('&'))
  },

  getCategories: () => api.getPublic('/public/categories'),

  getCities: () => api.getPublic('/public/cities'),

  getFranchises: () => api.getPublic('/public/franchises'),

  getSalesPoints: () => api.getPublic('/public/sales-points'),

  getAnnouncements: (active = true) =>
    api.getPublic(`/public/announcements?active=${active}`),

  getHeroImages: () => api.getPublic('/public/hero-images'),

  sendContact: (data) => api.postPublic('/public/contact', data),
}

// Private data endpoints (admin)
export const privateApi = {
  // Categories
  getCategories: () => api.getPrivate('/private/categories'),
  createCategory: (data) => api.postPrivate('/private/categories', data),
  updateCategory: (id, data) => api.putPrivate(`/private/categories/${id}`, data),
  deleteCategory: (id) => api.deletePrivate(`/private/categories/${id}`),

  // Products
  getProducts: () => api.getPrivate('/private/products'),
  createProduct: (data) => api.postPrivate('/private/products', data),
  updateProduct: (id, data) => api.putPrivate(`/private/products/${id}`, data),
  deleteProduct: (id) => api.deletePrivate(`/private/products/${id}`),

  // Product Variants
  getProductVariants: () => api.getPrivate('/private/product-variants'),
  createProductVariant: (data) => api.postPrivate('/private/product-variants', data),
  updateProductVariant: (id, data) => api.putPrivate(`/private/product-variants/${id}`, data),
  deleteProductVariant: (id) => api.deletePrivate(`/private/product-variants/${id}`),

  // Cities
  getCities: () => api.getPrivate('/private/cities'),
  createCity: (data) => api.postPrivate('/private/cities', data),
  updateCity: (id, data) => api.putPrivate(`/private/cities/${id}`, data),
  deleteCity: (id) => api.deletePrivate(`/private/cities/${id}`),

  // Franchises
  getFranchises: () => api.getPrivate('/private/franchises'),
  createFranchise: (data) => api.postPrivate('/private/franchises', data),
  updateFranchise: (id, data) => api.putPrivate(`/private/franchises/${id}`, data),
  deleteFranchise: (id) => api.deletePrivate(`/private/franchises/${id}`),

  // Franchise Photos
  getFranchisePhotos: (franchiseId) =>
    franchiseId ? api.getPrivate(`/private/franchise-photos?franchise_id=${franchiseId}`) : api.getPrivate('/private/franchise-photos'),
  createFranchisePhoto: (data) => api.postPrivate('/private/franchise-photos', data),
  updateFranchisePhoto: (id, data) => api.putPrivate(`/private/franchise-photos/${id}`, data),
  deleteFranchisePhoto: (id) => api.deletePrivate(`/private/franchise-photos/${id}`),

  // Announcements
  getAnnouncements: () => api.getPrivate('/private/announcements'),
  createAnnouncement: (data) => api.postPrivate('/private/announcements', data),
  updateAnnouncement: (id, data) => api.putPrivate(`/private/announcements/${id}`, data),
  deleteAnnouncement: (_id) => api.deletePrivate(`/private/announcements/${_id}`),

  // Sales Points
  getSalesPoints: () => api.getPrivate('/private/sales-points'),
  createSalesPoint: (data) => api.postPrivate('/private/sales-points', data),
  updateSalesPoint: (id, data) => api.putPrivate(`/private/sales-points/${id}`, data),
  deleteSalesPoint: (id) => api.deletePrivate(`/private/sales-points/${id}`),

  // Hero Images
  getHeroImages: () => api.getPrivate('/private/hero-images'),
  createHeroImage: (data) => api.postPrivate('/private/hero-images', data),
  updateHeroImage: (id, data) => api.putPrivate(`/private/hero-images/${id}`, data),
  deleteHeroImage: (id) => api.deletePrivate(`/private/hero-images/${id}`),
}

export default api