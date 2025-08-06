# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server on port 8080
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

This is a React TypeScript application built with Vite, using shadcn/ui components and Supabase for backend services.

### Key Technologies
- **Build Tool**: Vite with React SWC plugin
- **UI Framework**: React 18 with TypeScript
- **Component Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (authentication, database, real-time)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

### Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components (auto-generated)
│   ├── AuthGuard.tsx # Authentication wrapper
│   ├── Dashboard.tsx # Main dashboard
│   └── Navigation.tsx # App navigation
├── pages/            # Page components (routes)
│   ├── Auth.tsx      # Authentication page
│   ├── Shopping.tsx  # Shopping list management
│   ├── Finances.tsx  # Financial tracking
│   ├── Cleaning.tsx  # Cleaning schedule
│   └── Plants.tsx    # Plant care tracking
├── hooks/            # Custom React hooks
│   ├── useAuth.tsx   # Authentication hook
│   └── useProfile.tsx # User profile management
├── integrations/     
│   └── supabase/     # Supabase client and types
└── lib/              # Utility functions
```

### Authentication Flow
The app uses Supabase Auth with an `AuthGuard` component that:
1. Listens for auth state changes
2. Checks for existing sessions on mount
3. Shows loading state during auth checks
4. Redirects to Auth page if not authenticated
5. Renders protected content when authenticated

### Routing
Protected routes managed by React Router:
- `/` - Dashboard
- `/shopping` - Shopping list
- `/finances` - Financial management
- `/cleaning` - Cleaning schedule
- `/plants` - Plant care

### Database
Supabase PostgreSQL with migrations in `supabase/migrations/`. The database schema includes tables for profiles and various app features.

### Development Notes
- Path alias `@/` maps to `src/` directory
- TypeScript configured with relaxed strictness for rapid development
- Lovable tagger plugin active in development for component tracking
- Server configured to listen on all interfaces (::) port 8080

## Operational Principles

- Always use the available tools and MCP servers proactively when planning and executing tasks, as well as to erode any room for error and uncertainty.