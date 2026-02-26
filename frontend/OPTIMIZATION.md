# Frontend Optimization Guide

## ✅ Optimizations Implemented

### 1. **Build Configuration**
- **File:** `vite.config.js`
- Code splitting for vendor libraries (React, Router)
- Minification enabled with Terser
- Source maps disabled in production
- Lazy loading support for routes

### 2. **Environment Configuration**
- **Files:** `.env.example`, `.env.local`, `src/config/env.js`
- Type-safe environment variables with fallbacks
- Support for mock server toggle
- Configurable API base URL and timeouts
- Development vs Production settings

### 3. **Enhanced API Client**
- **File:** `src/api/client.js`
- Request/response interceptor system
- Automatic token injection via interceptors
- Request caching for GET operations
- Timeout handling with AbortController
- Support for both mock and real API backends
- Better error handling and logging
- Backward compatible with existing endpoints

### 4. **Custom Hooks**
- **File:** `src/utils/useApi.js`
- `useApi()` - Simplified API calls with loading/error states
- `useAuthApiInterceptor()` - Automatic auth header setup
- Eliminates repetitive state management code

### 5. **Error Boundary**
- **File:** `src/components/ErrorBoundary.jsx`
- Catches React errors to prevent full app crashes
- Displays error details in development mode
- User-friendly error UI in production
- Recovery options for users

### 6. **Code Quality**
- **Files:** `.eslintrc.json`, `.prettierrc.json`
- ESLint with React-specific rules
- Prettier for consistent code formatting
- React Hooks best practices enforced
- Unused variable warnings

### 7. **Bug Fixes**
- Fixed navigation in Activities page (using `Link` instead of anchor tags)
- Improved AuthProvider with token interceptor setup
- Added proper error handling in App.jsx

### 8. **Developer Experience**
- **File:** `package.json`
- New npm scripts:
  - `npm run lint` - Check for code issues
  - `npm run lint:fix` - Auto-fix linting issues
  - `npm run format` - Format all code with Prettier
  - `npm run type-check` - Type checking support

## 🚀 Usage

### Setup

```bash
# Install dependencies
npm install

# Create local env file (already created)
cp .env.example .env.local

# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### API Client Usage

#### Old Way (Still Works)
```javascript
import { postDonation } from '../api/endpoints'
const result = await postDonation({ name, email, amount, _token: token })
```

#### New Way (Recommended)
```javascript
import { apiClient } from '../api/client'

// Manually add token
const result = await apiClient.post('/api/donations', { name, email, amount }, {
  headers: { Authorization: `Bearer ${token}` }
})

// Or use interceptor (automatic in App.jsx)
const result = await apiClient.post('/api/donations', { name, email, amount })
```

#### With Custom Hook
```javascript
import { useApi } from '../utils/useApi'
import { postDonation } from '../api/endpoints'

function MyComponent() {
  const { data, loading, error, call } = useApi()
  
  async function handleDonate() {
    try {
      const result = await call(postDonation, payload)
      console.log('Success:', result)
    } catch (err) {
      console.error('Failed:', err)
    }
  }
  
  return (
    <div>
      <button onClick={handleDonate} disabled={loading}>
        {loading ? 'Processing...' : 'Donate'}
      </button>
    </div>
  )
}
```

### Environment Variables

**Development:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MOCK_SERVER=true
VITE_LOG_LEVEL=debug
```

**Production:**
```env
VITE_API_BASE_URL=https://api.humanitarac.com
VITE_ENABLE_MOCK_SERVER=false
VITE_LOG_LEVEL=info
```

## 📊 Performance Improvements

1. **Code Splitting** - Vendor code bundled separately
2. **Minification** - Smaller bundle size with Terser
3. **Caching** - API responses cached automatically
4. **Error Handling** - Prevents full app crashes
5. **Lazy Loading Ready** - Support for React.lazy() and route splitting

## 🔒 Security

- JWT tokens can be automatically injected via interceptors
- No sensitive data logged in production
- CORS-safe API requests
- Error details hidden from users in production

## 📝 Code Quality Commands

```bash
# Check for linting issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Combine both
npm run lint:fix && npm run format
```

## 🐛 Debugging

- ErrorBoundary shows detailed error stack in development
- API client logs cache hits and errors in development
- Environment variable visibility in `src/config/env.js`

## 🔄 Migration Path

If you want to transition from mock server to real API:

1. Update `.env.local`:
   ```env
   VITE_ENABLE_MOCK_SERVER=false
   VITE_API_BASE_URL=http://localhost:5000
   ```

2. The API client automatically switches to real HTTP requests
3. No component code changes needed!

## 📚 File Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js          ← Enhanced API client
│   │   ├── endpoints.js       ← API endpoints
│   │   └── mockServer.js      ← Mock server
│   ├── components/
│   │   ├── ErrorBoundary.jsx  ← NEW: Error handling
│   │   └── ...other components
│   ├── config/
│   │   └── env.js             ← NEW: Environment config
│   ├── utils/
│   │   ├── AuthProvider.jsx
│   │   ├── useApi.js          ← NEW: Custom hook
│   │   └── validators.js
│   └── App.jsx                ← Updated with ErrorBoundary
├── .env.example               ← NEW: Env template
├── .env.local                 ← NEW: Dev environment
├── .eslintrc.json             ← NEW: Linting config
├── .prettierrc.json           ← NEW: Format config
├── vite.config.js             ← NEW: Build config
└── package.json               ← Updated scripts
```

## 🎯 Next Steps

1. Run `npm install` to update dependencies
2. Run `npm run dev` to start development server
3. Run `npm run lint:fix && npm run format` to clean up code
4. Update .env.local for your development environment
5. Test with `npm run build` before deploying

---

**Last Updated:** February 24, 2026
