# AGENTS.md - Agentic Coding Guidelines

This file provides guidelines for AI agents working in this repository.

## Project Overview

- **Project Name**: Rey Paletas Frontend
- **Tech Stack**: React 19, Vite 7, React Router 7, Tailwind CSS 4
- **Language**: JavaScript (ES2020+), JSX

---

## Commands

### Development & Build
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Run ESLint on all files
npm run lint -- --fix  # Auto-fix linting issues
npx eslint <file-path> --fix  # Lint specific file
```

**Note**: No test framework is configured. Do not add tests without consulting the user first.

---

## Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Maps (required for franchise locations)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Backend API URL (optional)
VITE_API_URL=http://localhost:3000
```

**Important:** Never commit `.env` files to version control. Only `.env.example` should be tracked.

---

## Code Style Guidelines

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/          # Route page components
├── hooks/          # Custom React hooks
├── services/       # API calls and business logic
├── utils/          # Helper functions
├── context/        # React context providers
└── assets/         # Static assets
```

### Import Order
1. React built-ins (`react`, `react-dom`, `react-router-dom`)
2. External libraries (npm packages)
3. Internal modules (relative imports)
4. CSS/style imports

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `ProductCard`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useFetch`)
- **Utilities**: camelCase (`formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **Files**: kebab-case (`api-client.js`), PascalCase for components

### JSX Formatting
- Self-closing tags: `<Component />`
- Use parentheses for multi-line returns

```jsx
function UserCard({ user, onEdit }) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <Button onClick={onEdit}>Edit</Button>
    </div>
  )
}
```

### React Hooks
- Call hooks only at top level
- Name custom hooks with `use` prefix
- Use `useCallback` for functions passed as props

```jsx
function useUserData(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  return { user, loading }
}
```

### Error Handling
- Use try-catch for async operations
- Display user-friendly error messages

```jsx
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw new Error('Unable to load data. Please try again.')
  }
}
```

### CSS/Tailwind
- Use Tailwind utility classes
- Avoid inline styles

```jsx
// Good
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Click</button>

// Avoid
<button style={{ padding: '16px', backgroundColor: 'blue' }}>Click</button>
```

---

## ESLint Configuration

Uses `@eslint/js`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.

Key rules:
- `no-unused-vars`: Errors on unused variables (except those starting with `_`)
- React hooks rules enforced
- React refresh enabled for HMR compatibility

---

## Git Workflow

- **Commit messages**: Clear, descriptive, start with verb ("Add feature", "Fix bug")
- **Branch naming**: `feature/`, `fix/`, `refactor/`, `docs/`

---

## Common Patterns

### Conditional Rendering
```jsx
{isLoading && <Spinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}
```

### List Rendering
```jsx
{items.map(item => (
  <ItemCard key={item.id} item={item} />
))}
```

### Form Handling
```jsx
const [formData, setFormData] = useState({})

function handleChange(e) {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}
```

---

## When to Ask the User

Before making significant changes, consult the user about:
- Adding new dependencies
- Setting up testing frameworks
- Architectural changes
- API modifications
- New feature implementations affecting multiple files
