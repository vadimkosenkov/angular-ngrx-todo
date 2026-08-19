# angular-ngrx-todo

A todo list app built with Angular 21 (standalone components, Signals), NgRx (store/effects/devtools), and Tailwind CSS 4.

## Features

- Add, remove, and toggle todos, with non-empty validation
- Filter by all / active / completed
- Live counters (total / active / completed)
- State persisted to `localStorage`
- First run seeds 5 todos from `jsonplaceholder.typicode.com`
- Light/dark theme toggle (respects system preference, persisted)
- Responsive, mobile-first layout

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:4200.

## Scripts

- `npm start` — dev server
- `npm run build` — production build
- `npm test` — unit tests (Vitest)
- `npm run lint` — ESLint (angular-eslint)

## Project structure

- `src/app/models/` — `Todo` data model
- `src/app/services/todo.service.ts` — localStorage + seed-API access
- `src/app/store/todo/` — NgRx actions, reducer, selectors, effects
- `src/app/components/` — `todo-list`, `todo-item`, `theme-toggle`
