---
name: react-auth-skill
description: >
  Implement authentication and authorization in React applications. Use this skill whenever
  the user mentions login, logout, signup, protected routes, JWT tokens, OAuth, session
  management, role-based access, token refresh, auth context, or any kind of user
  authentication in React — even if they don't use the word "auth" explicitly. Also trigger
  for questions about secure token storage, AuthContext setup, ProtectedRoute components,
  Firebase Auth, NextAuth, or any social login integration. If the user is building a React
  app and mentions users, sessions, or access control, use this skill.
---

# React Authentication Skill

A comprehensive guide for implementing secure, production-ready authentication in React applications.

---

## Quick Decision Tree

Before writing code, identify which pattern applies:

| Scenario | Pattern to use |
|---|---|
| Custom backend + JWT | [JWT Auth](#1-jwt-authentication) |
| Google / GitHub / social login | [OAuth](#2-oauth--social-login) |
| Firebase project | [Firebase Auth](#firebase-auth) |
| Next.js app | [NextAuth.js](#nextauthjs) |
| Multiple roles (admin, user, etc.) | [RBAC](#4-role-based-access-control-rbac) |
| Token expires too fast | [Silent Refresh](#5-silent-token-refresh) |

---

## Core Primitives (Always Include These)

### AuthContext

Every auth implementation must start with a React Context. This is the single source of truth for auth state.

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate user from storage on mount
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
```

### ProtectedRoute

Wrap any route that requires authentication:

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Preserve the intended destination for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
```

### App Router Setup

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 1. JWT Authentication

Use when your backend issues JWTs on login.

### Login Flow

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) return setError('All fields are required.');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Enter a valid email.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Invalid credentials');
      }

      const { user, token } = await res.json();
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Attaching the Token to API Requests

Create an axios instance (or fetch wrapper) that automatically includes the token:

```js
// src/lib/api.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 2. OAuth / Social Login

### Firebase Auth

Best for Google, GitHub, Apple, and other social providers.

**Install:**
```bash
npm install firebase
```

**Setup:**
```js
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export { onAuthStateChanged };
```

**AuthProvider with Firebase:**
```jsx
// src/context/AuthContext.jsx (Firebase version)
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInWithGoogle, logOut } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase handles persistence automatically
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Login Button:**
```jsx
import { useAuth } from '../context/AuthContext';

export function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}
```

### NextAuth.js

Use when building with Next.js. Handles sessions server-side.

**Install:**
```bash
npm install next-auth
```

**API Route (`pages/api/auth/[...nextauth].js`):**
```js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // Validate against your DB here
        const user = await verifyUser(credentials);
        return user || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // Attach role to JWT
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Expose role in session
      return session;
    },
  },
  pages: { signIn: '/login' },
});
```

**Protecting Next.js pages:**
```jsx
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: { session } };
}
```

---

## 3. Login Form — Best Practices

Always implement these in your Login component:

- **Validation before submission** — check empty fields and email format
- **Loading state** — disable submit button and show indicator
- **Error display** — surface API errors with `role="alert"` for accessibility
- **Post-login redirect** — send user back to where they were trying to go
- **Autocomplete attributes** — `autoComplete="email"` and `autoComplete="current-password"`

See the full LoginPage example in [Section 1](#1-jwt-authentication).

---

## 4. Role-Based Access Control (RBAC)

When you need different access levels (e.g., `user`, `admin`, `moderator`):

### Store roles in the token / user object

```js
// In your backend: include role in JWT payload
const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '15m' });
```

### ProtectedRoute with role check (already shown in Core Primitives)

```jsx
// Usage
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### Conditional UI based on role

```jsx
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      {user?.role === 'admin' && <a href="/admin">Admin Panel</a>}
    </nav>
  );
}
```

---

## 5. Silent Token Refresh

When access tokens expire (e.g., every 15 minutes), use an interceptor to refresh silently.

```js
// src/lib/api.js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

let isRefreshing = false;
let queue = []; // Queue of failed requests to retry

const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  queue = [];
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh is done
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });

        localStorage.setItem('accessToken', data.accessToken);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — log the user out
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 6. Secure Token Storage

| Method | XSS Risk | CSRF Risk | Recommended? |
|---|---|---|---|
| `localStorage` | ⚠️ High | ✅ None | Dev/prototype only |
| `sessionStorage` | ⚠️ High | ✅ None | Avoid in production |
| `httpOnly` cookie | ✅ None | ⚠️ Needs mitigation | ✅ **Production** |
| Memory (React state) | ✅ None | ✅ None | ✅ Secure, lost on refresh |

### Recommended: httpOnly Cookies (set by server)

The server sets the token — your React app never touches it:

```js
// Backend (Express example)
res.cookie('token', jwtToken, {
  httpOnly: true,       // JS cannot read this cookie
  secure: true,         // HTTPS only
  sameSite: 'Strict',  // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

Your React fetch calls just include `credentials: 'include'`:

```js
const res = await fetch('/api/protected', {
  credentials: 'include', // Sends the httpOnly cookie automatically
});
```

### Fallback: In-Memory Storage

For SPAs that can't use httpOnly cookies, store the access token in memory (React state/context) and use a long-lived refresh token in an httpOnly cookie:

```jsx
// In AuthContext
const [accessToken, setAccessToken] = useState(null); // Memory only — cleared on refresh
```

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Auth context not wrapping the Router | Wrap `<AuthProvider>` inside `<BrowserRouter>`, or outside it — never in between where `useNavigate` is called |
| Flash of unauthenticated content | Show a loading spinner while `loading === true` in AuthProvider |
| Token not sent with requests | Use an axios interceptor or always pass `credentials: 'include'` |
| Refresh token loop | Add `_retry` flag to avoid retrying refresh infinitely |
| Role stored only on client | Always verify role server-side on protected API endpoints too |
| No redirect after login | Use `location.state?.from` to redirect back to the intended page |

---

## Environment Variables

```bash
# .env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...

VITE_GOOGLE_CLIENT_ID=...

# Never expose these in the frontend:
# JWT_SECRET, DATABASE_URL, etc. — backend only
```

---

## Dependencies Reference

```bash
# Core (always needed)
npm install react-router-dom

# For JWT + API calls
npm install axios

# For Firebase / Google OAuth
npm install firebase

# For Next.js
npm install next-auth

# For form management (optional but recommended)
npm install react-hook-form zod @hookform/resolvers
```
