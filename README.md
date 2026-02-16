# Root League Frontend

Frontend for league and match management with a `core + game modules` architecture.
The current implemented game module is `root`, but routing and API access are now game-aware.

## Architecture Overview

The app is split into two layers:

- `core`: shared shell and domain areas (`Home`, `Players`, `Groups`, navigation, routing, API wrappers)
- `game module`: game-specific league and match behavior, data model details, and styling

Current game registry is defined in `src/games/registry.ts`.

## Features

- Game selection screen (`/`)
- Per-game workspace under `g/:gameKey/...`
- Shared pages:
  - Home dashboard
  - Players
  - Groups
- Game-aware league and match flows
- Match timers, scoring, draft/race flow, and summary (for `root`)

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

## Routing

Main routes in `src/App.tsx`:

- `/` - game selection page
- `/g/:gameKey` - game home
- `/g/:gameKey/players`
- `/g/:gameKey/groups`
- `/g/:gameKey/groups/:groupId`
- `/g/:gameKey/leagues/:leagueId`
- `/g/:gameKey/matches/:matchId`

Helper functions for route generation are in `src/routing/paths.ts`.

## API Configuration

Shared API utilities are in `src/api.ts`.

- Development proxy (default):
  - `/api` -> `http://localhost:8080`
  - configured in `vite.config.ts`
- For other environments, set `VITE_API_BASE_URL`

Example (`.env.local`):

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Game-aware API paths

Use `gameApiGet`, `gameApiPost`, `gameApiDelete` from `src/api.ts`.

Behavior:

- For `root` (default): calls `/api/...` for backward compatibility
- For other games: calls `/api/games/:gameKey/...`

If you want `root` to also use scoped paths, set:

```env
VITE_USE_SCOPED_ROOT_API=1
```

## Scripts

- `npm run dev` - starts Vite in development mode
- `npm run build` - typecheck + production build to `dist/`
- `npm run preview` - local preview of production build
- `npm run lint` - run lint checks

## Project Structure

```text
src/
  games/               # game registry and game definitions
  routing/             # route/path helpers
  pages/               # route-level pages
  features/            # domain features (home, groups, leagues, matches, players)
  components/          # shared UI components and modals
  api.ts               # shared HTTP and game-aware API helpers
  App.tsx              # app shell and game-aware routing
```

## Common Issues

- `Failed to fetch` / missing data:
  - verify backend is running
  - verify `VITE_API_BASE_URL` and proxy config
- Wrong API namespace for new game modules:
  - check if requests use `gameApi*` helpers
  - check backend support for `/api/games/:gameKey/...`
- Frontend does not reflect changes:
  - restart `npm run dev`
  - hard refresh browser

## Production Build

```bash
npm run build
```

Build output is generated in `dist/`.
