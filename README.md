# Library Management Frontend

React + TypeScript + Vite frontend for a Library Management API.

## Features

- Typed Book, Member and BorrowRecord models
- Typed fetch API client
- Book list with title search and genre filter
- Issue Book form
- Member History with overdue badge
- Reusable generic DataTable<T>
- Protected routes with React Router
- Login page with localStorage token
- Loading, error and success states
- Responsive CSS

## Backend expectation

By default the frontend calls:

- GET /api/books
- GET /api/members
- GET /api/borrow/member/:memberId
- POST /api/borrow

Change the base URL in `.env` if your backend uses another port.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Login

This frontend uses a simple client-side token gate for the assignment. On the login page, enter any non-empty token. It is stored in localStorage as `authToken`.

If your backend has a real login endpoint, replace the login handler with a POST request and store the returned token.

## State management

This project uses React local state (`useState`, `useEffect`) because the screens only need small, page-level state. A global library such as Redux would add unnecessary complexity for this assignment.

## Folder structure

```text
src/
  api/
    client.ts
  components/
    DataTable.tsx
    Layout.tsx
    ProtectedRoute.tsx
    Toast.tsx
  pages/
    Login.tsx
    Books.tsx
    IssueBook.tsx
    MemberHistory.tsx
  types/
    models.ts
  App.tsx
  main.tsx
  styles.css
```

## Backend response flexibility

The API client accepts common REST response shapes such as:
- an array directly
- `{ data: [...] }`
- `{ books: [...] }`
- `{ members: [...] }`
- `{ records: [...] }`
- `{ borrowRecords: [...] }`

Adjust `src/api/client.ts` if your exact backend uses different field names.
