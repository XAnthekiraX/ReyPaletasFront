const API_URL = import.meta.env.VITE_API_URL || ''

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API fetch error (${endpoint}):`, error)
    throw error
  }
}

export const api = {
  get: (endpoint) => fetchAPI(endpoint),
  
  post: (endpoint, data) => fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => fetchAPI(endpoint, {
    method: 'DELETE',
  }),
}

export const publicAPI = {
  getProducts: (category, available = true) => 
    api.get(`/public/products?category=${encodeURIComponent(category)}&available=${available}`),
  
  getAnnouncements: () => 
    api.get('/public/announcements'),
  
  getFranchises: () => 
    api.get('/public/franchises'),
  
  login: (email, password) => 
    api.post('/public/login', { email, password }),
}

export const privateAPI = {
  getProducts: () => api.get('/products'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),

  getFranchises: () => api.get('/franchises'),
  createFranchise: (data) => api.post('/franchises', data),
  updateFranchise: (id, data) => api.put(`/franchises/${id}`, data),
  deleteFranchise: (id) => api.delete(`/franchises/${id}`),
}
