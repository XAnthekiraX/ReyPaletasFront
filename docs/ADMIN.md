# Admin Panel

## Overview

The admin panel allows administrators to manage the website content. It is only accessible via Supabase Auth authentication.

---

## Authentication

### Login

- **Route**: `/admin/login`
- **Method**: Supabase Auth credentials
- **Protection**: All `/admin/*` routes require an active session

### Session Management

- Verify authentication on

Separation of areas  
Public routes and admin routes must be clearly separated.

Protected admin routes  
All admin routes must verify authentication.

Client side routing  
Routing is handled by React Router.
each admin route

- Redirect to `/admin/login` if no session exists
- Show logout button in the admin layout

---

## Dashboard (/admin)

### Purpose

Main page of the admin panel.

### Structure

- Navigation sidebar
- Summary cards:
  - Total products
  - Total franchises
  - Total active announcements

---

## Products Management (/admin/productos)

### Purpose

Full CRUD for catalog products.

### Features

#### List View

- Table with columns: Image, Name, Price, Category, Status
- "Available" column with toggle
- Actions: Edit, Delete
- "Add Product" button

#### Create/Edit Form

Fields:

```
name: string (required)
price: number (required)
category_id: string (required)
image_url: string (required)
price_varies: boolean (default: false)
exists: boolean (default: true)
description: string (optional)
```

#### Product Variants

If `price_varies = true`, show variants section:

```
variant name: string (required)
variant price: number (required)
```

#### Delete Confirmation

- Confirmation modal before deletion
- Show product name to be deleted

---

## Categories Management (/admin/categorias)

### Purpose

Manage product categories.

### Features

#### List View

- List of existing categories
- Product count per category
- Actions: Edit, Delete

#### Create/Edit Form

```
name: string (required)
```

---

## Announcements Management (/admin/avisos)

### Purpose

Manage announcements and promotions displayed on the home page.

### Features

#### List View

- Cards with: Title, Image, Status (Active/Inactive)
- Toggle to activate/deactivate
- Actions: Edit, Delete
- "New Announcement" button

#### Create/Edit Form

```
title: string (required)
description: string (required)
image_url: string (required)
active: boolean (default: true)
```

---

## Franchises Management (/admin/franquicias)

### Purpose

Manage franchise information by city.

### Features

#### List View

- Grid of cards per city
- Each card: City, Location Name, Thumbnail
- Actions: Edit, Delete
- "New Franchise" button

#### Create/Edit Form

```
city: string (required)
location_name: string (required)
latitude: number (required)
longitude: number (required)
manager_name: string (required)
manager_description: string (required)
manager_photo: string (required)
description: string (required)
gallery: string[] (optional)
```

---

## Products Not Yet Available (/admin/productos-futuros)

### Purpose

Manage products that are not yet available.

### Features

- Same UI as Products Management
- Default `exists = false`
- List only unavailable products

---

## UI Components

### Admin Layout

```
Sidebar (fixed)
  - Logo
  - Navigation
    - Dashboard
    - Products
    - Categories
    - Announcements
    - Franchises
    - Logout
Content Area
```

### Form Components

- Input with label
- Textarea with label
- Toggle switch
- Image upload preview
- Select dropdown
- Number input with controls
- Submit button (primary)
- Cancel button (secondary)
- Delete button (danger)

### Feedback Components

- Success toast
- Error toast
- Loading spinner
- Empty state

---

## API Integration

### Authentication

```
POST /public/login
POST /auth/logout
GET /auth/me
```

### Products

```
GET /products
POST /products
PUT /products/:id
DELETE /products/:id
```

### Categories

```
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

### Announcements

```
GET /announcements
POST /announcements
PUT /announcements/:id
DELETE /announcements/:id
```

### Franchises

```
GET /franchises
POST /franchises
PUT /franchises/:id
DELETE /franchises/:id
```

---

## Validation Rules

### Products

- name: required, 1-100 chars
- price: required, >= 0
- category_id: required
- image_url: required, valid URL

### Categories

- name: required, 1-50 chars, unique

### Announcements

- title: required, 1-100 chars
- description: required, 1-500 chars
- image_url: required, valid URL

### Franchises

- city: required
- location_name: required
- latitude: required, -90 to 90
- longitude: required, -180 to 180
- manager_name: required
- manager_photo: required, valid URL

### Admin Panel Functionality Details

#### Navigation Structure and Pages

The admin panel is protected by **Supabase Auth** and all routes under `/admin/*` verify the active session.

- **Dashboard (`/admin`):** Main screen with summary cards showing total products, franchises, and active announcements.
- **Products Management (`/admin/productos`):**
  - **List View:** Table with image, name, price, category, and availability status.
  - **Actions:** Full CRUD (Create, Edit, Delete) with toggle for immediate availability change.
  - **Variants:** Support for products with variable prices (e.g., beverages) via a variants section in the form.
- **Categories Management (`/admin/categorias`):** Allows managing categories that filter the public catalog, showing product count for each.
- **Announcements Management (`/admin/avisos`):** Home promotions control with activate/deactivate toggle option.
- **Franchises Management (`/admin/franquicias`):** Organization of locations by city in a card grid with preview.

#### UI Components

The panel uses modular components with integrated validation:

- **Forms:** Inputs with labels, text areas, dropdown selects, and image uploads with preview.
- **Feedback:** Toast notifications to confirm success or report API errors, and loading states (spinners).
