# Root League Frontend

Frontend application for managing Root league matches.
The app is built with React + TypeScript and communicates with a backend via REST API.

## Features

- Home page with:
  - active matches list
  - players overview
  - league standings preview
- Player management
- Group and group members management
- League management within groups
- Match creation (ranked/casual, timer, race draft options, landmarks)
- Match view:
  - per-player timer
  - score updates and match state handling
  - race draft flow
  - post-match summary

## Tech Stack

- `React 19`
- `TypeScript`
- `Vite`
- `React Router`
- `ESLint`

## Requirements

- `Node.js 20+` (LTS recommended)
- `npm 10+`
- Running backend API

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:5173
```

## API Configuration

The frontend uses shared HTTP helpers in `src/api.ts`.

- In development, Vite proxy is configured by default:
  - `/api` -> `http://localhost:8080`
  - configuration is in `vite.config.ts`
- For other environments, set `VITE_API_BASE_URL`

Example (`.env.local`):

```env
VITE_API_BASE_URL=http://localhost:8080
```

Notes:

- If `VITE_API_BASE_URL` is not set, the frontend uses relative paths (for example `/api/groups`).
- In production, set a full backend base URL.

## Scripts

- `npm run dev` - starts Vite in development mode
- `npm run build` - typecheck + production build to `dist/`
- `npm run preview` - local preview of production build
- `npm run lint` - run lint checks

## Routing

Main routes in `src/App.tsx`:

- `/` - Home
- `/players` - Players
- `/groups` - Groups
- `/groups/:groupId` - Group details
- `/leagues/:leagueId` - League
- `/matches/:matchId` - Match

## Project Structure

```text
src/
  components/          # shared UI components and modals
  features/            # domain modules (home, groups, leagues, matches, players)
  pages/               # route-level page components
  data/                # static data (for example cards)
  constants/           # app constants
  api.ts               # shared HTTP layer
  App.tsx              # routing + top navigation
```

## Common Issues

- `Failed to fetch` / missing data:
  - check if backend is running
  - verify `VITE_API_BASE_URL` or Vite proxy in `vite.config.ts`
- CORS errors:
  - configure CORS on backend or use Vite proxy in development
- Frontend does not reflect changes:
  - restart `npm run dev`
  - hard refresh browser

## Production Build

```bash
npm run build
```

Build output is generated in `dist/`.
