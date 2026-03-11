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
react-google-maps → location display
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
- show future products
- display franchise information
- show announcements
- allow users to create a cart
- generate WhatsApp orders

---

## Admin Panel

Accessible only to authenticated administrators.

Responsibilities:

- manage products
- manage future products
- manage franchises
- manage announcements

Authentication is handled using Supabase Auth.

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
Supabase Auth session  
↓  
Protected admin routes

Unauthorized users must be redirected.

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
