# Error Handling

## Overview

Guide for error handling in the frontend. Includes API errors, validation, network, and UI errors.

---

## Error Types

### Network Errors

```
- No internet connection
- Request timeout
- Server unavailable
- CORS errors
```

### API Errors

```
- 400: Bad Request (invalid data)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (no permissions)
- 404: Not Found (resource does not exist)
- 500: Internal Server Error
- Other error codes
```

### Validation Errors

```
- Required fields empty
- Invalid format
- Values out of range
- Duplicates
```

### UI Errors

```
- Component not found
- Image not loaded
- Missing resource
```

---

## Error Response Format

### API Error Response

```javascript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'User-friendly message',
    details: {} // optional
  }
}
```

### Frontend Error Object

```javascript
{
  type: 'network' | 'api' | 'validation' | 'ui',
  code: string,
  message: string,
  originalError: Error,
  timestamp: Date
}
```

---

## API Error Handling

### Service Layer

```javascript
async function fetchProducts(category) {
  try {
    const response = await fetch(`/api/products?category=${category}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(response.status, error.message)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new NetworkError('Connection error', error)
  }
}
```

### ApiError Class

```javascript
class ApiError extends Error {
  constructor(status, message, code) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
```

### NetworkError Class

```javascript
class NetworkError extends Error {
  constructor(message, originalError) {
    super(message)
    this.name = 'NetworkError'
    this.originalError = originalError
  }
}
```

---

## Error Boundaries

### Global Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### Usage

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## User Feedback

### Toast Notifications

```javascript
// Error toast
addToast('error', 'Could not load products')

// Success toast
addToast('success', 'Product saved correctly')

// Warning toast
addToast('warning', 'Your session will expire soon')

// Info toast
addToast('info', 'New message available')
```

### Error Messages

| Scenario | Message |
|----------|---------|
| Network offline | "Check your internet connection" |
| Server error | "Something went wrong. Try again later" |
| 401 Unauthorized | "Your session expired. Log in again" |
| 404 Not Found | "We could not find what you were looking for" |
| 400 Bad Request | "Invalid data. Check the form" |
| Validation error | Show specific error per field |

---

## Form Validation

### Validation Rules

```javascript
const rules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Minimum 2 characters' },
    maxLength: { value: 100, message: 'Maximum 100 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
  },
  price: {
    required: 'Price is required',
    min: { value: 0, message: 'Price must be greater than 0' }
  }
}
```

### Validation Display

```jsx
<input
  value={values.name}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.name && errors.name}
/>
{errors.name && <span className="text-error">{errors.name}</span>}
```

---

## Retry Logic

### Automatic Retry

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options)
    } catch (error) {
      if (i === retries - 1) throw error
      await delay(1000 * Math.pow(2, i)) // exponential backoff
    }
  }
}
```

### Manual Retry

```jsx
{error && (
  <div className="error-container">
    <p>Error: {error.message}</p>
    <button onClick={refetch}>Retry</button>
  </div>
)}
```

---

## Loading States

### Skeleton Loading

```jsx
{loading && (
  <div className="skeleton-grid">
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}
```

### Spinner

```jsx
{loading && (
  <div className="flex justify-center py-8">
    <Spinner />
  </div>
)}
```

---

## Empty States

### No Results

```jsx
{!loading && products.length === 0 && (
  <EmptyState
    icon={<SearchIcon />}
    title="No results"
    description="We could not find products in this category"
  />
)}
```

### No Data

```jsx
{!loading && !products && (
  <EmptyState
    icon={<PackageIcon />}
    title="No products"
    description="No products available"
  />
)}
```

---

## Offline Handling

### Detect Offline

```javascript
window.addEventListener('online', handleOnline)
window.addEventListener('offline', handleOffline)

function handleOnline() {
  addToast('success', 'Connection restored')
}

function handleOffline() {
  addToast('warning', 'No internet connection')
}
```

### Offline Indicator

```jsx
{!navigator.onLine && (
  <div className="offline-banner">
    No connection. Some data may be outdated.
  </div>
)}
```

---

## Error Logging

### Console Logging

```javascript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.error('API Error:', error)
}
```

### Error Tracking

```javascript
// Optional: third-party error tracking
// Sentry, LogRocket, etc.

function captureError(error, context) {
  // Send to tracking service
}
```

---

## Accessibility

### Error Announcements

```jsx
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Form Errors

```jsx
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'error-msg' : undefined}
/>
{error && <span id="error-msg" role="alert">{error}</span>}
```
