# AuthPage Studio

A refined, production-ready authentication flow built with React, Vite, TypeScript, and Firebase. This project focuses on delivering a premium user experience while maintaining robust, modern security standards.

![AuthPage Preview](https://via.placeholder.com/800x400.png?text=AuthPage+Preview)

## 📖 About the Project

AuthPage Studio is designed as a foundational boilerplate for applications requiring high-security, enterprise-grade authentication interfaces. It goes beyond the standard "email and password" forms by integrating multiple robust authentication strategies natively into a luxury, minimalist UI.

### Core "Roots" and Philosophy
- **Security First:** Leveraging Firebase Authentication's modular SDK to ensure tokens, passwords, and sessions are managed securely.
- **Progressive Enhancement:** Users can authenticate via traditional methods or utilize frictionless passwordless magic links.
- **Type Safety:** The entire application is strictly typed using TypeScript, catching potential runtime errors during development.
- **Design Excellence:** Utilizing Tailwind CSS to create a responsive, dark-mode compatible interface that feels premium and thoughtful.

## ✨ Features

- **Google Authentication:** Seamless one-click sign-in with Google.
- **GitHub Authentication:** Developer-friendly authentication via GitHub.
- **Passwordless Magic Links:** Secure, one-time OTP email links for frictionless login.
- **Password Recovery:** Built-in secure password reset flow.
- **Form Validation:** Client-side validation using React Hook Form and Zod.
- **Luxury UI/UX:** Fully responsive, premium interface built with Tailwind CSS.
- **Dark Mode Ready:** Automatically adapts to user system preferences.

## 🔄 Authentication Flow

Below is a high-level sequence diagram illustrating the architecture of our authentication strategies:

```mermaid
sequenceDiagram
    participant User
    participant Frontend (React)
    participant AuthContext
    participant Firebase

    %% Google / GitHub Auth
    User->>Frontend (React): Clicks "Continue with Google/GitHub"
    Frontend (React)->>AuthContext: loginWithGoogle() / loginWithGithub()
    AuthContext->>Firebase: signInWithPopup(provider)
    Firebase-->>AuthContext: Returns User Credentials
    AuthContext-->>Frontend (React): Updates Global User State
    Frontend (React)-->>User: Redirects to /dashboard

    %% Magic Link (OTP)
    User->>Frontend (React): Enters Email & Clicks "Send Magic Link"
    Frontend (React)->>AuthContext: sendMagicLink(email)
    AuthContext->>Firebase: sendSignInLinkToEmail(email)
    Firebase-->>User: Sends Email with Secure OTP Link

    User->>Frontend (React): Clicks Link in Email
    Frontend (React)->>AuthContext: Detects isSignInWithEmailLink() on mount
    AuthContext->>Firebase: signInWithEmailLink(email, window.location.href)
    Firebase-->>AuthContext: Validates & Returns User
    AuthContext-->>Frontend (React): Updates Global User State
    Frontend (React)-->>User: Redirects to /dashboard
```

## 🌳 Directory Tree Structure

The project is structured for scalability and maintainability. Here is the core file tree:

```text
src/
├── App.css                   # Global styles and Tailwind directives
├── App.tsx                   # Main application routing layer
├── index.css                 # Base CSS imports
├── main.tsx                  # React DOM entry point
├── assets/                   # Static assets (images, SVGs)
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/               # Reusable UI components
│   └── ProtectedRoute.tsx    # Higher-order component for route guarding
├── context/                  # React Context providers
│   └── AuthContext.tsx       # Core Firebase authentication logic & global state
├── hooks/                    # Custom React hooks
├── lib/                      # Third-party library initializations
│   └── firebase.ts           # Firebase SDK setup and provider exports
└── pages/                    # Route-level components
    ├── Dashboard.tsx         # Protected user dashboard
    ├── LoginPage.tsx         # Sign-in interface (Email, Google, GitHub, Magic Link)
    └── SignupPage.tsx        # Registration interface
```

- **Frontend:** React 19 (Hooks), TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **State Management & Routing:** React Context API, React Router v7
- **Validation:** React Hook Form + Zod
- **Backend/Auth:** Firebase Authentication (v12 modular SDK)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd Auth-Page
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase
You will need to create a project in the [Firebase Console](https://console.firebase.google.com/) and enable the following Sign-in providers under **Build > Authentication**:
- **Google**
- **GitHub** (Requires setting up an OAuth App in your GitHub Developer Settings)
- **Email/Password** (Required for the Password Reset flow)
- **Email link (passwordless sign-in)** (Required for the Magic Link flow)

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configuration details:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start the development server
```bash
npm run dev
```

Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

- `src/components/` - Reusable UI components
- `src/context/` - React Context providers (e.g., `AuthContext.tsx` handles all Firebase logic)
- `src/lib/` - Utility functions and Firebase initialization
- `src/pages/` - Application routes (`LoginPage`, `SignupPage`, etc.)

## 📜 Commands

- `npm run dev` - Starts the Vite development server
- `npm run build` - Builds the application for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check for code issues

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

© 2026 AuthPage Studio. All rights reserved.