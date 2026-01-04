# Djentlemen Guitars — Frontend

## Overview

Djentlemen Guitars is a small booking platform for guitar lessons. This repository contains the frontend single-page application built with React and Vite. It provides user and teacher authentication, lesson booking for students, and a teacher dashboard for managing lessons.

Key features

- User authentication (regular users and teachers)
- Role-aware navigation and protected routes
- Book lessons flow for students
- Teacher dashboard showing booked lessons
- Reset password for users and teachers

## Tech stack

- React (hooks)
- Vite
- Tailwind CSS (utility classes visible in components)
- Fetch API for server communication

## Project structure (important files)

- `src/` — React source files
  - `App.jsx` — main router and app shell
  - `AuthContext.jsx` — authentication context, token management, `login` and `teacherLogin`
  - `components/Header.jsx` — top navigation (role-aware Home link and conditional Book link)
  - `components/ProtectedRoute.jsx` — protects routes for authenticated users
  - `components/ProtectedTeacherRoute.jsx` — protects teacher-only routes
  - `pages/` — page components (HomePage, TeacherHome, LoginPage, TeacherLogin, RegisterPage, TeacherRegister, ResetPassword, TeacherResetPassword, BookLesson, etc.)

## Authentication and roles

- The `AuthContext` stores `token`, `refreshToken`, and `userInfo` in state and `localStorage`.
- `login` (standard user) and `teacherLogin` (teacher) set `userInfo.is_teacher` to `false` or `true` respectively.
- The `Header` component uses `userInfo.is_teacher` (or `userInfo.role === 'teacher'`) to:
  - send teachers to `/teacher` when clicking Home
  - hide the `Book` link for teachers

## API conventions

- Standard user endpoints (examples used by the frontend):
  - POST `/api/login` — login user
  - POST `/api/users` — register user
  - PUT `/api/users` — update user (used for reset password)
  - GET `/api/lessons` — fetch lessons for a user (used in `HomePage`)
  - POST `/api/lessons` — create a booking (used in `BookLesson`)
- Teacher endpoints (examples used by the frontend):
  - POST `/api/teacher_login` — login teacher
  - POST `/api/teachers` — register teacher
  - PUT `/api/teachers` — update teacher (used for teacher reset password)
  - GET `/api/teacher_lessons` — fetch lessons grouped by student for the teacher dashboard

Note: The frontend attempts to use `authFetch` (from `AuthContext`) when available to attach bearer tokens.

## Setup and run (development)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app at the address Vite prints (usually `http://localhost:5173`).

Environment: the frontend expects a backend API under the same origin (proxy or same host). Ensure the API routes above are available, or adjust fetch URLs accordingly.

Configure environment variables

- Add the following line to your `.env.local` (replace host as needed):

```bash
VITE_API_URL=http://localhost:8080
```

- The Vite dev server uses this value to proxy `/api` requests to your backend in development. Client-side code can also access this value via `import.meta.env.VITE_API_URL` if you need to call the backend directly.

## Routes (frontend)

- `/` — user home (protected)
- `/login` — user login
- `/teacher-login` — teacher login
- `/register` — user register
- `/teacher-register` — teacher register
- `/book` — lesson booking (protected; hidden for teachers in the header)
- `/teacher` — teacher dashboard (protected teacher only)
- `/reset-password` — user reset password (protected)
- `/teacher/reset-password` — teacher reset password (protected teacher only)

## Adding teachers or users

- Use the registration pages (`/register` and `/teacher-register`) to create accounts. The teacher registration page posts to `/api/teachers` with JSON:

```json
{
  "email": "teacher@example.com",
  "password": "secret",
  "first_name": "First",
  "last_name": "Last",
  "age": 30
}
```

After a successful teacher registration the frontend navigates to `/teacher-login`.

## Development notes

- `AuthContext` provides `authFetch` which refreshes tokens on 401 responses using the stored `refreshToken`.
- `userInfo` is stored in `localStorage` as `userInfo` — it is expected to contain at minimum an `email` and can contain `is_teacher`.
- The `Header` computes `isTeacher` using `userInfo.is_teacher`, `userInfo.isTeacher`, or `userInfo.role === 'teacher'` for flexibility with different backend payloads.

## Tests and verification

- Manual verification steps:
  1.  Register a user at `/register`, sign in at `/login`, and confirm Home points to `/` and Book is visible.
  2.  Register a teacher at `/teacher-register`, sign in at `/teacher-login`, and confirm Home points to `/teacher` and Book is hidden.
  3.  Test password reset for both user and teacher pages.

## Contributing

- Open an issue or PR with clear description and minimal repro steps.
- Keep changes focused and add component-level tests where applicable.

## Contact

If you need help wiring the backend or running the app locally, provide your backend API details and I can help configure proxying or adapt fetch URLs.

---

If you'd like, I can also:

- Add links in the `Header` for `/teacher-register`.
- Add a quick proxy config for Vite to route `/api` to a backend host.
- Run the dev server and verify flows locally.
