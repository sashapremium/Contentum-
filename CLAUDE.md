# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check + production build
npm run ts        # TypeScript type-check only (no emit)
npm run lint      # ESLint
```

No test framework is configured.

## Architecture

React 19 + TypeScript SPA built with Vite. The Django REST backend runs separately at `http://localhost:8000/api` (see `ContentumBackend/`). The base URL is hardcoded in [src/lib/axios.ts](src/lib/axios.ts).

### Feature-based structure

Code is organized under `src/features/<domain>/` with a consistent internal layout:

```
src/features/<domain>/
  api/          # Raw axios calls — every response is parsed through a Zod schema
  queries/      # TanStack Query hooks (useXxxQuery, useXxxMutation) + queryKeys
  types/        # Zod schemas + inferred TypeScript types
  components/
  pages/
  store/        # Zustand slices (only auth currently)
```

Current feature domains: `auth`, `chat`, `messages`, `photo`, `gallery`, `theatre`, `template`, `forms`, `events`, `briefs`, `user`, `home`.

### State management

- **Server state**: TanStack Query. The global `QueryClient` is in [src/lib/query.ts](src/lib/query.ts) — errors are surfaced globally via `sonner` toasts.
- **Client state**: Zustand. Currently only `useAuthStore` ([src/features/auth/store/auth.store.ts](src/features/auth/store/auth.store.ts)) manages JWT tokens.

### Authentication

JWT access/refresh tokens stored in `localStorage` via `tokenStorage`. `AuthProvider` hydrates the store on mount. The axios instance in [src/lib/axios.ts](src/lib/axios.ts) attaches `Bearer` tokens on every request and automatically queues + retries requests on 401 using a refresh endpoint. On failed refresh, `logout()` is called and the user is redirected to `/login`. `ProtectedRoute` gates all routes under `/`.

### API pattern

Every feature's `api/` file calls the shared `api` axios instance and immediately validates the response with a Zod schema. Types are inferred from those schemas — there are no hand-written API types. Example: `ChatListResponseSchema.parse(response.data)`.

### Dynamic form system

The backend sends step configs describing form fields, modes, and validation rules. `formAdapter.ts` ([src/features/forms/formAdapter.ts](src/features/forms/formAdapter.ts)) converts these into React Hook Form default values and Zod validation schemas at runtime. `FormContainer` renders the appropriate field components. This drives the chat/post creation workflow: each chat step triggers a `PATCH /chats/:id/` with the submitted form data.

### Routing

Defined in [src/app/router/index.tsx](src/app/router/index.tsx). Route path constants live in [src/app/router/routes.ts](src/app/router/routes.ts). The app shell (`HomePage`) wraps all authenticated routes as nested children. Use `BACKEND_URL` from `routes.ts` if you need the raw backend origin (e.g., for media URLs).

### Path aliases

`@/` resolves to `src/`. Use it for all non-relative imports.

### UI components

Radix UI primitives wrapped with Tailwind v4 in `src/components/ui/`. Shared layout components (`PageWrapper`, `PageHeading`, `ConfirmDialog`, etc.) live in `src/components/shared/`.

---

paths:

- "src/api/\*_/_.ts"

---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
