# Frontend

## Overview

The frontend is responsible for rendering the public website and the admin panel.

It provides the user interface, handles client-side interactions, and communicates with the backend API.

The frontend also manages the shopping cart and generates the WhatsApp order message.

---

# Technology Stack

Vite  
React (JSX)  
TailwindCSS v4

Additional libraries may include:

React Router → routing  
@iconify/react → UI icons  
leaflet + react-leaflet → map display for franchise locations  
motion → animations

---

## Colors

The website uses a 4-color palette for consistent UI design.

primary
Main brand color used for headers, buttons, and highlights.

secondary
Secondary color used for accents and complementary elements.

tertiary
Used for backgrounds, cards, and secondary sections.

quaternary
Used for text, icons, or subtle highlights.

Example:
In the CSS

@Theme{

--color-primary: #46bca0;

--color-secondary: #f7c948;

--color-tertiary: #f25c54;

--color-quaternary: #131317;

}

### Use with tailwind

- bg-primary
- border-secondary
- text-tertiary

# Application Areas

The frontend is divided into two main areas.

## Public Website

Accessible to all users.

Responsibilities:

- display company information
- show product catalog
- show products not yet available (via `exists = false`)
- display franchise information
- show announcements
- allow users to create a cart
- generate WhatsApp orders

Authentication is handled using JWT tokens with refresh token flow.

Admin routes must be protected.

---

# Application Structure

/src

components  
Reusable UI components.

features  
Feature modules such as products, franchises, announcements, and cart.

pages  
Top level pages of the application.

layouts  
Shared page layouts for public and admin sections.

routes  
Route definitions and navigation structure.

services  
API communication with the backend.

store  
Client-side state management.

utils  
Utility functions.

styles  
Global styles and Tailwind configuration.

---

# State Management

Frontend state is responsible for:

cart state  
UI state  
authentication state

Cart state must persist during the user session.

The cart does not need server persistence.

---

# Backend Communication

All backend communication happens through the service layer.

Pattern:

Frontend Component  
↓  
Service Layer  
↓  
Backend API

Services should handle:

API requests  
error handling  
data transformation

---

# Cart System

The cart exists only on the client.

Responsibilities:

- add products
- remove products
- update quantity
- generate order summary

Cart data may be stored in:

React state  
localStorage (optional)

---

# WhatsApp Order Generation

Orders are generated on the frontend.

Flow:

User selects products  
↓  
Products added to cart  
↓  
User clicks "Order via WhatsApp"  
↓  
System generates message  
↓  
WhatsApp opens with pre-filled message

Example message format:

Customer Order

Product A x2  
Product B x1  
Product C x3

The system then redirects to the WhatsApp link.

---

# Admin Access Control

Admin routes must verify authentication state.

Flow:

User login  
↓  
Backend JWT tokens (access_token + refresh_token)  
↓  
Protected admin routes (auto-refresh on expiry)

Unauthorized users must be redirected to `/admin/login`.

### Token Management

- Store tokens in localStorage
- Include in headers: `Authorization: Bearer <access_token>`
- Auto-refresh when token expires (before expires_in time)
- Clear tokens on logout

---

# Design Principles

Component Reusability  
Components should be reusable and modular.

Feature Isolation  
Features should be grouped by domain.

Separation of Concerns  
UI components should not contain business logic.

Service Abstraction  
All backend communication should go through services.

## Public Endpoints (Accessible without authentication)

### 1. Get Products by Category

**Endpoint:**

GET /public/products

**Query Parameters:**  
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | yes | Name of the category to filter products |
| available | boolean | no | Filter by availability: `true` = available products, `false` = future products. Default: `true` |

**Response:**

- Products in the specified category
- Includes variants if `price_varies = true`
- Omits all IDs
- Fields: `name`, `price`, `image_url`, `variants`

**Example:**

GET /public/products?category=Chocolates&available=true

---

## Private Endpoints (Admin Panel, requires authentication)

All private endpoints require header: `Authorization: Bearer <access_token>`

### Authentication

**POST /public/login**
```json
Body: { "email": "admin@example.com", "password": "securepassword" }
Response: { "access_token": "...", "refresh_token": "...", "expires_in": 3600, "user": { "email": "..." } }
```

**POST /private/auth/refresh-token**
```json
Headers: Authorization: Bearer <access_token>
Body: { "refresh_token": "..." }
Response: { "status": "success", "data": { "access_token": "...", "refresh_token": "...", "expires_in": 3600 } }
```

**GET /auth/me**
```json
Headers: Authorization: Bearer <access_token>
Response: { "email": "admin@email.com" }
```

### Categories

Endpoints:

- GET /categories
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id

### Products

Endpoints:

- GET /products
- POST /products
- PUT /products/:id
- DELETE /products/:id

### Product Variants

Endpoints:

- GET /product-variants?product_id=:id
- POST /product-variants
- PUT /product-variants/:id
- DELETE /product-variants/:id

### Announcements

Endpoints:

- GET /announcements
- POST /announcements
- PUT /announcements/:id
- DELETE /announcements/:id

### Franchises

Endpoints:

- GET /franchises
- POST /franchises
- PUT /franchises/:id
- DELETE /franchises/:id

#### Notes for Frontend:

Use public endpoints for main website (no login required).

Use private endpoints for admin panel (authentication token required).

Query parameters and response structure are described in BUSINESS_LOGIC.md.

### React Leaflet Integration Guide

#### Tech Stack

- **Libraries:** `leaflet` + `react-leaflet` for rendering interactive maps.
- **Infrastructure Requirement:** None required - uses OpenStreetMap tiles (free).

#### Franchise Implementation

The integration focuses on the `/franquicias` page using the `FranchiseMap` component.

- **Data Flow:** The map receives coordinates from the Supabase database (fields `latitude` and `longitude`).
- **Validation Rules:** To ensure marker accuracy, coordinates must comply with:
  - Latitude: between -90 and 90.
  - Longitude: between -180 to 180.
- **Interaction:** The map dynamically updates based on the city selected in `CityTabs`, showing specific markers for each franchise location.
