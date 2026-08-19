# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # dev server at http://localhost:4200
npm run build           # production build
npm test                 # unit tests (Karma/Jasmine, ChromeHeadless, single run)
npm run lint              # ESLint (angular-eslint) over src/**/*.ts and *.html
```

To run a single test file, pass a filter to Karma via the Angular CLI, e.g.:

```bash
ng test --include='**/todo.reducer.spec.ts'
```

Note: the README references Vitest, but the project was switched to Karma/Jasmine (see `karma.conf.js`, `tsconfig.spec.json`) — `npm test` is the source of truth.

## Architecture

Angular 21 standalone app (no NgModules) using Signals for local component state and NgRx (`@ngrx/store` + `@ngrx/effects`) for the todo domain, styled with Tailwind CSS 4.

**State flow (single NgRx feature, `todo`):**
- `src/app/store/todo/todo.actions.ts` — actions defined via `createActionGroup`. The caller (not the reducer) generates `id`/`createdAt` for new todos, so the reducer stays a pure function of its inputs.
- `src/app/store/todo/todo.reducer.ts` — `createFeature`/`createReducer`; exports the auto-generated feature selectors (`selectTodos`, `selectFilter`, `selectLoading`, `selectError`) alongside the reducer.
- `src/app/store/todo/todo.selectors.ts` — re-exports the reducer's base selectors and adds memoized derived selectors (`selectFilteredTodos`, `selectTodoCounts`).
- `src/app/store/todo/todo.effects.ts` — two effects:
  - `init$`: on `TodoActions.init()`, hydrates from `localStorage` via `TodoService`, or on first run fetches 5 seed todos from `jsonplaceholder.typicode.com`.
  - `persist$` (non-dispatching): mirrors every mutating action (`addTodo`, `removeTodo`, `toggleTodo`, `clearCompleted`, `loadTodosSuccess`) to `localStorage`, reading post-reducer state via `withLatestFrom(store.select(selectTodos))`.
- `src/app/services/todo.service.ts` — intentionally "dumb": only handles the `localStorage` read/write and the seed HTTP call. All decisions about *when* to fetch or persist live in the effects, not here.
- `App` (`src/app/app.ts`) dispatches `TodoActions.init()` once in `ngOnInit`, which is the sole entry point that kicks off hydration/seeding.

**Wiring:** `src/app/app.config.ts` registers the store, effects, and Redux DevTools (`provideStoreDevtools`, log-only outside dev mode) via the standalone `ApplicationConfig` providers — there's no root module.

**Components** (`src/app/components/`) are standalone and consume the store via `Store.select(...)`/`dispatch(...)`:
- `todo-list` — reads `selectFilteredTodos`/`selectTodoCounts`, dispatches add/remove/toggle/filter/clear actions.
- `todo-item` — presentational row.
- `theme-toggle` — self-contained; dark/light state lives in a component `signal` (not the NgRx store), synced to `localStorage` and `document.documentElement`'s `dark` class via an `effect()`.

**Testing:** fixtures for todos live in `src/app/testing/todo.fixtures.ts`; use them instead of constructing `Todo` objects ad hoc in specs.
