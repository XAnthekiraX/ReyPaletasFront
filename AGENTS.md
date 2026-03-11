# AGENTS.md - Rey Paletas Frontend

This file contains guidelines for AI agents working on the frontend repository.

## Project Overview

- **Type**: React SPA (Single Page Application)
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS v4
- **Language**: JavaScript (JSX)
- **Routing**: React Router DOM v7
- **State**: Client-side (cart, session)
- **Deployment**: Vercel

---

## Commands

### Development
```bash
npm run dev        # Start development server
npm run preview    # Preview production build locally
```

### Build & Lint
```bash
npm run build      # Create production build (dist/)
npm run lint       # Run ESLint on entire project
npm run lint -- --fix  # Auto-fix ESLint issues
```

### Single Test
No test framework is currently configured. Do not add tests unless explicitly requested.

---

## Code Style Guidelines

### General Rules
- No comments in code unless explicitly requested by user
- Use functional components only (no class components)
- Prefer const over let; avoid var
- Use strict mode enabled (React StrictMode in main.jsx)

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`, `CartSummary`)
- **Files**: PascalCase for components (e.g., `ProductCard.jsx`), camelCase otherwise
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **React refs**: `{ name }Ref` pattern (e.g., `inputRef`)

### Imports
```javascript
// React core
import { useState, useEffect } from 'react'

// External libraries
import { Link } from 'react-router-dom'

// Local components
import ProductCard from './components/ProductCard'

// Local utilities
import { formatPrice } from './utils/format'
```

Order: React → External → Local (grouped, alphabetized within groups)

### JSX Style
```javascript
// Good
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product)}>Add</button>
    </div>
  )
}

// Avoid unnecessary wrapping divs - use React.Fragment or <>
```

### TailwindCSS v4
- Import in CSS: `@import "tailwindcss";`
- Use utility classes for all styling
- Custom theme values via CSS custom properties or Tailwind config
- Avoid arbitrary values when possible

### TypeScript
- Not currently used
- If needed, add TypeScript support via `npm install typescript @types/react @types/react-dom`

### Error Handling
- Use try/catch for async operations
- Display user-friendly error messages in UI
- Log errors appropriately for debugging

### Component Structure
```javascript
// Preferred pattern
import { useState, useEffect } from 'react'

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // side effects
  }, [])

  function handleAction() {
    // event handlers
  }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

---

## Project Structure

```
/src
  /assets       # Static images, media
  /components   # Reusable UI components
  /features     # Feature-based modules (products, cart, etc.)
  /layouts      # Page layouts (public, admin)
  /pages        # Route pages
  /routes       # Routing configuration
  /services     # API communication
  /store        # Client state (cart, UI)
  /styles       # Global styles
  /utils        # Helper functions

/public         # Static public assets
/docs           # Project documentation
```

---

## Architecture

See `docs/ARCHITECTURE.md` for full system architecture details.

### Key Points
- Public website + Admin panel (via React Router)
- No authentication on public site; Supabase Auth for admin only
- Orders generated as WhatsApp messages (not stored in DB)
- Backend API handles data management; frontend handles display

### Data Flow
- Public: User → Frontend → Backend API → Supabase
- Admin: Admin → Frontend → Supabase Auth → Backend API → Supabase

---

## Dependencies

### Production
- react ^19.2.0
- react-dom ^19.2.0
- react-router-dom ^7.13.1

### Development
- vite ^7.3.1
- @vitejs/plugin-react-swc
- tailwindcss ^4.2.1
- @tailwindcss/vite
- eslint ^9.39.1
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

---

## ESLint Configuration

The project uses ESLint with:
- JavaScript recommended rules
- React Hooks recommended rules
- React Refresh plugin

Custom rule: `no-unused-vars` set to error, ignoring variables starting with uppercase (intentional for React components)

Run `npm run lint` before committing.

---

## Common Tasks

### Adding a new page
1. Create component in `/src/pages/`
2. Add route in `/src/routes/`
3. Add navigation link in relevant layout/header

### Adding a new component
1. Create in `/src/components/` or feature folder
2. Follow component structure guidelines
3. Use TailwindCSS for styling

### API Integration
- Add API calls in `/src/services/`
- Use fetch or axios (axios not installed, use fetch)
- Handle loading and error states

---

## Documentation

- `docs/ARCHITECTURE.md` - System architecture
- `docs/COMPONENTS.md` - Component specifications
- `docs/PAGES.md` - Page documentation
- `docs/ROUTES.md` - Routing details
- `docs/LAYOUT.md` - Layout documentation
- `docs/DATA.md` - Data models
- `docs/FRONTEND.md` - Frontend overview
