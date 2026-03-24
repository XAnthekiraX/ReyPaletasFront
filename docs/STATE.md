# State Management

## Overview

Guide for state management in the frontend. State is divided into: cart, ui, and auth.

---

## Cart State

### Structure

```javascript
{
  items: [
    {
      id: string,
      name: string,
      price: number,
      quantity: number,
      image_url: string,
      variant?: {
        name: string,
        price: number
      }
    }
  ],
  updatedAt: timestamp
}
```

### Operations

```javascript
// Add item
function addToCart(product, quantity = 1, variant = null)

// Remove item
function removeFromCart(productId)

// Update quantity
function updateQuantity(productId, quantity)

// Clear cart
function clearCart()

// Get totals
function getCartTotal()
function getCartCount()
```

### Persistence

- Store in `localStorage` with key: `rey_paletas_cart`
- Load on app initialization
- Sync on each change
- Clear after successful order

---

## UI State

### Structure

```javascript
{
  sidebarOpen: boolean,
  activeCategory: string,
  isLoading: boolean,
  toasts: [
    {
      id: string,
      type: 'success' | 'error' | 'warning' | 'info',
      message: string,
      duration: number
    }
  ],
  modals: {
    [modalName]: boolean
  }
}
```

### Sidebar (Mobile)

```
Key: sidebarOpen
Default: false
Toggle: open/close mobile menu
```

### Active Category

```
Key: activeCategory
Default: First category from backend
Used in: Sabores page to filter by category
```

### Loading State

```
Key: isLoading
Default: false
Usage: Global loading indicator
```

### Toast Notifications

```javascript
// Add toast
addToast(type, message, duration = 3000)

// Remove toast
removeToast(id)

// Types
- success: successful operation
- error: operation error
- warning: warning
- info: information
```

### Modal Management

```javascript
// Open modal
openModal(modalName)

// Close modal
closeModal(modalName)

// Check if open
isModalOpen(modalName)

// Common modals
- delete-confirm
- image-preview
- product-detail
```

---

## Auth State

### Structure

```javascript
{
  user: {
    id: string,
    email: string,
    role: 'admin' | null
  } | null,
  session: {
    access_token: string,
    refresh_token: string,
    expires_at: number
  } | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

### Operations

```javascript
// Login
async function login(email, password)

// Logout
async function logout()

// Check auth status
async function checkAuth()

// Get current user
function getCurrentUser()
```

### Persistence

- Session managed by Supabase Auth
- Persistence configured in Supabase client
- Verify session on app load
- Redirect if session expired

---

## Data Fetching State

### Structure

```javascript
// Per endpoint
{
  data: T[] | null,
  isLoading: boolean,
  error: Error | null,
  refetch: () => void
}
```

### Pattern

```javascript
// Custom hook for data fetching
function useProducts(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts(category)
      .then(setProducts)
      .catch(setError)
      .finally(setLoading)
  }, [category])

  return { products, loading, error }
}
```

---

## Form State

### Structure

```javascript
{
  values: { [fieldName]: any },
  errors: { [fieldName]: string },
  touched: { [fieldName]: boolean },
  isSubmitting: boolean,
  isValid: boolean
}
```

### Validation

- Validate on blur (when losing focus)
- Validate on submit
- Show errors only if touched
- Clear errors on value change

---

## State Updates

### Immutability

```javascript
// Good
setProducts(prev => [...prev, newProduct])

// Bad
products.push(newProduct)
setProducts(products)

// Good - remove
setProducts(prev => prev.filter(p => p.id !== id))

// Good - update
setProducts(prev => prev.map(p => 
  p.id === id ? { ...p, ...updates} : p
))
```

### Batched Updates

```javascript
// React 18 batches automatically
// Multiple state updates in a single re-render
setName('new')
setAge(25)
setEmail('test@test.com')
```
