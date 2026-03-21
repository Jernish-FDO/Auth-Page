# Claude Instructions for Auth-Page

## Project Overview
This is a modern React frontend project focused on authentication, built with Vite, TypeScript, and Tailwind CSS. It uses Firebase for auth, React Hook Form + Zod for form state and validation, and React Router for navigation.

## Tech Stack
- **Framework**: React 19 (Functional Components, Hooks)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form, Zod
- **Authentication**: Firebase
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Linting**: ESLint

## Setup & Commands
- **Development Server**: `npm run dev` (starts Vite dev server)
- **Build**: `npm run build` (runs TS compiler and Vite build)
- **Preview Build**: `npm run preview` (serves the built `dist` folder)
- **Lint**: `npm run lint` (runs ESLint)
- **Install Dependencies**: `npm install`

## Code Style & Conventions
- Use functional components with React Hooks.
- Ensure strict type safety with TypeScript. Define proper interfaces/types for props and state.
- Use Tailwind CSS utility classes for styling. Avoid custom CSS files unless strictly necessary.
- For form handling, use `react-hook-form` integrated with `@hookform/resolvers/zod` for validation schemas.
- Use `lucide-react` for any icon requirements.
- Modularize components and keep them in appropriate directories under `src/`.
- Prioritize accessibility and responsive design using Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`).

## Architecture & Integration
- Firebase is used for authentication; follow Firebase v12 modular SDK patterns.
- External API calls should be handled via `axios`.
- Application routing should utilize modern `react-router-dom` v7+ patterns (e.g., `createBrowserRouter`, or standard `Routes` if set up that way).

## AI Assistant Guidelines
- Prefer editing existing files over creating new ones.
- When writing components, ensure they are typed and properly formatted.
- Do not write unrequested features or refactor code outside the scope of the immediate task.
- Ensure any environment variables for Firebase or APIs are documented or loaded properly via `.env.local` (do not commit sensitive tokens).
