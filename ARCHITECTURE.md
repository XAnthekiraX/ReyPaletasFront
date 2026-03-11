# System Architecture

## 1. System Vision

This system is a corporate web platform for an artisanal ice cream company.

The platform has two main goals:

1. Present the company in a professional way.
2. Allow administrators to manage business information.

The system includes:

- Public website for customers and partners
- Product catalog
- Franchise information
- Future products section
- Announcements
- Shopping cart that generates WhatsApp orders
- Admin panel for content management

The system is not an e-commerce platform.  
Orders are generated and sent via WhatsApp.

---

# 2. System Surfaces

The platform has two main interfaces.

## Public Website

Accessible to all visitors.

Responsibilities:

- Show company information
- Display products
- Show future products
- Present franchise opportunities
- Display announcements
- Allow users to create an order and send it via WhatsApp

## Admin Panel

Accessible only to authenticated administrators.

Responsibilities:

- Manage products
- Manage future products
- Manage franchises
- Manage announcements

Authentication is handled through Supabase Auth.

---

# 3. High Level Architecture

The system follows a modern web architecture:

User → Frontend → Backend API → Database

Components:

- React frontend application
- Node.js backend API
- Supabase database and authentication
- WhatsApp order generation
- Email service for notifications

---

# 4. Core Components

## Frontend

Technology:

- Vite
- React (JSX)
- TailwindCSS v4

Responsibilities:

- Render the public website
- Render the admin panel
- Manage the shopping cart
- Generate WhatsApp order messages
- Consume backend APIs
- Handle authentication state

---

## Backend API

Technology:

- Node.js
- Express

Responsibilities:

- Provide REST APIs
- Handle data management
- Secure admin operations
- Send email notifications via Resend

The backend does not process payments or orders.

---

## Database

Technology:

- Supabase (PostgreSQL)

Responsibilities:

Store business data:

- products
- future_products
- franchises
- announcements

Supabase also provides:

- authentication
- row level security

---

## Authentication

Handled by Supabase Auth.

Used only for the admin panel.

Responsibilities:

- admin login
- session management
- secure access to admin operations

---

# 5. WhatsApp Ordering System

Orders are generated on the frontend.

Flow:

1. User selects products
2. Products are added to a shopping cart
3. The system generates an order summary
4. The user clicks "Order via WhatsApp"
5. The system opens WhatsApp with the generated message

Example message:

Customer Order

Product 1 x2  
Product 2 x1  
Product 3 x4

This approach avoids the complexity of a full e-commerce system.

---

# 6. Data Flow

Public Content Flow

User  
↓  
Frontend  
↓  
Backend API  
↓  
Supabase Database

Admin Content Management

Admin Login  
↓  
Supabase Auth  
↓  
Frontend Admin Panel  
↓  
Backend API  
↓  
Supabase Database

Order Flow

User  
↓  
Select products  
↓  
Cart generation  
↓  
WhatsApp message generation  
↓  
Open WhatsApp

---

# 7. Infrastructure

Frontend

Deployment platform:
Vercel

Responsibilities:

- Serve React application
- Deliver static assets
- Handle client-side routing

Backend

Deployment platform:
Vercel

Responsibilities:

- Run Express API
- Handle admin operations
- Communicate with Supabase

Database

Platform:
Supabase

Responsibilities:

- PostgreSQL database
- authentication services
- secure data access

Email Service

Platform:
Resend

Used for:

- notifications
- contact emails

---

# 8. Development AI Agents

AI agents are used during development to assist in building and maintaining the system.

Agents are not part of the production system.

Examples:

SEO Agent  
Optimizes pages for search engines.

Frontend Agent  
Helps generate and refactor React components.

Backend Agent  
Helps design APIs and backend logic.

Design Agent  
Assists in UI layout and visual design.

These agents follow predefined prompts and system rules.

---

# 9. System Constraints

The system intentionally avoids complex features.

Not included:

- online payments
- user accounts for customers
- order tracking
- inventory management

Orders are handled externally via WhatsApp.

This keeps the system simple and suitable for a small business.

---

# 10. Architecture Principles

The system follows these principles:

Simplicity  
Avoid unnecessary complexity.

Separation of Concerns  
Frontend, backend and database have clear responsibilities.

Maintainability  
Content must be easily editable through the admin panel.

Scalability  
The architecture allows adding new sections or features without major refactors.
