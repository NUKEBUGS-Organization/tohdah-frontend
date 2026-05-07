# Tohdah Frontend

React client for the Tohdah peer-to-peer delivery marketplace.

## Stack

- **React 19** with **TypeScript**
- **Vite** for dev and production builds
- **Mantine 9** (UI, notifications, forms)
- **React Router** for routing

## Setup

```bash
npm install
```

Copy environment defaults and adjust API URL:

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to your backend origin (e.g. `http://localhost:3000`).

```bash
npm run dev
```

## Environment variables

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `VITE_API_BASE_URL`   | Base URL of the NestJS API (no trailing slash required) |

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start Vite dev server          |
| `npm run build`| Typecheck + production build   |
| `npm run preview` | Serve the built `dist` folder |

## Auth flow (summary)

1. **Register / login** stores access + refresh tokens (`api/client.ts`).
2. **`AuthProvider`** loads `/auth/me` after login and on refresh; normalizes `role`, `accountStatus`, loyalty fields.
3. **Protected routes** require authentication; onboarding redirects until `onboardingCompleted` and `accountType` are set.
4. **Token refresh** runs on `401` from the API client when a refresh token exists.
5. **Admin** routes expect a user with `role` `admin` or `superadmin` and a valid admin session.

## API and testing docs

- Backend contract and integration notes: [`../tohdah-backend/API_INTEGRATION.md`](../tohdah-backend/API_INTEGRATION.md)
- Manual end-to-end journeys: [`E2E_TESTING_GUIDE.md`](./E2E_TESTING_GUIDE.md)
