# Routes

## Overview

This document defines the routing structure of the frontend application.

Routes are divided into three main groups:

- Public routes
- Cart route
- Admin routes

The navigation menu only contains the primary public routes.

---

# 1. Navbar Routes

These routes appear in the main navigation of the website.

/home-page.

---

/sabores

Displays the available ice cream flavors/products.

Users can add items to the shopping cart from this page.

---

/quienes-somos

Company history and information.

---

/puntos-de-venta

Shows locations where the products are sold.

May include map integration.

---

/franquicias

Information for potential franchise partners.

---

/contactanos

Contact information and communication channels.

---

# 2. Cart Route

This route is not visible in the main navigation.

---

/compras

Displays the shopping cart.

Responsibilities:

- list selected products
- modify quantities
- remove products
- generate WhatsApp order message

From this page the user completes the order via WhatsApp.

---

# 3. Admin Routes

Admin routes are protected and require authentication via Supabase.

---

/admin

Admin dashboard.

---

/admin/productos

Manage products.

Operations:

- create product
- edit product
- delete product

---

/admin/avisos

Manage announcements.

Operations:

- create announcement
- edit announcement
- delete announcement

---

/admin/franquicias

Manage franchise information.

Operations:

- create franchise information
- edit franchise information
- delete franchise information

---

/admin/categorias

Manage product categories.

Operations:

- create category
- edit category
- delete category

---

/admin/productos-futuros

Manage products not yet available (exists = false).

Operations:

- create future product
- edit future product
- delete future product
- toggle to make available

---

# 4. Routing Principles

Clear route naming  
Routes must use descriptive names.

Separation of areas  
Public routes and admin routes must be clearly separated.

Protected admin routes  
All admin routes must verify authentication.

Client side routing  
Routing is handled by React Router.
