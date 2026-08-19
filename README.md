# 📝 Angular NgRx ToDo (Task Management App)

A lightweight and responsive Single Page Application (SPA) for daily task management. This project demonstrates Angular standalone components, Signals, and centralized state management with NgRx.

---

## ✨ Features

- Add, remove, and toggle todos, with non-empty validation
- Filter by all / active / completed
- Live counters (total / active / completed)
- State persisted to `localStorage`
- First run seeds 5 todos from `jsonplaceholder.typicode.com`
- Light/dark theme toggle (respects system preference, persisted)
- Responsive, mobile-first layout

---

## 🛠️ Tech Stack

### Frontend Core
- **Framework:** Angular 21 (standalone components & Signals for local state)
- **State Management:** NgRx (Store, Effects, Store DevTools)
- **Styling:** Tailwind CSS 4
- **Icons:** ng-icons (Heroicons)
- **Build Tool:** Angular CLI

### Testing
- Karma / Jasmine (unit tests)
- ESLint (angular-eslint)

---

## ⚙️ Quick Start

Follow these steps to explore the app locally.

### 1. Clone the repository
```bash
git clone https://github.com/vadimkosenkov/angular-ngrx-todo.git
cd angular-ngrx-todo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
npm start
```
Open `http://localhost:4200` in your browser to see the app.
