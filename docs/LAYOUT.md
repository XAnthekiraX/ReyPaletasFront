# Layout

## Overview

The application uses a global layout shared across all public pages.

The layout provides a consistent structure for navigation, page content, and footer information.

Structure:

Header  
Body  
Footer

---

# Layout Structure

Layout

Header  
Body (Pages Render Here)  
Footer

The body area renders the current route using the router.

---

# Header

The header contains the main navigation of the website.

Responsibilities:

- display company logo
- provide primary navigation
- allow access to main sections of the site

Structure:

Logo  
Navigation Menu

Navigation links:

Home  
Sabores  
About Us  
Sales Points  
Franchises  
Contact

The header should remain consistent across all public pages.

---

# Body

The body is the main content area of the application.

Responsibilities:

- render the current page
- display page specific content
- host dynamic sections

The router controls which page component is rendered here.

Example:

Header  
↓  
Body → Page Content  
↓  
Footer

---

# Footer

The footer provides additional company information and social presence.

Responsibilities:

- display social media links
- display contact information
- provide secondary navigation if necessary

Structure:

Social Media Links

Examples:

Instagram  
Facebook  
WhatsApp

Contact Information

Examples:

Phone  
Email  
Address

---

# Layout Principles

Consistency  
All public pages share the same layout.

Clear Navigation  
Main sections must always be accessible from the header.

Separation of Concerns  
Layout handles structure, pages handle content.

Reusability  
The layout component must be reusable across all routes.
