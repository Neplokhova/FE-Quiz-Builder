# Frontend Quiz Builder

Structure:

- `pages/` — Next.js routes (`_app`, `create`, `quizzes`, etc.)
- `components/` — UI and quiz building blocks
- `services/` — API client, types, and config

Global styles live at `pages/globals.css` (imported from `pages/_app.tsx`).

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

3. Start dev server:

```bash
npm run dev
```

## Pages

- `/create`: create quiz with dynamic question editor
- `/quizzes`: list quizzes, view and delete
- `/quizzes/[id]`: read-only quiz details
