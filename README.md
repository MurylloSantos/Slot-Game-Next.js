# 🎰 Slot Machine Game (Fullstack - Next.js)

This is a fullstack slot machine game built using **Next.js**. The app supports persistent user accounts, session-based gameplay, and server-side credit management with built-in cheating logic.

---

## 🚀 Features

- Anonymous user account creation via cookie (`user-id`)
- Session-based gameplay (`session-id`)
- Credit deduction and reward system
- Cheating logic that increases house wins under specific conditions
- Persistent total credits per user
- Responsive and animated slot machine UI
- In-memory store for users and sessions (ideal for demo or assessment use)

---

## 📦 Tech Stack

- **Frontend**: React (Next.js)
- **Backend**: Server-side API routes (Next.js)
- **State**: In-memory using `Map` (via `globalThis`)
- **Styling**: Tailwind, CSS
- **Session Persistence**: Cookies (`user-id`, `session-id`)

---

## ⚙️ Setup

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
npm start
```

> ✅ Make sure to run in a single server instance since the in-memory store is not shared across processes (not production safe).

---

## 🔐 Cookie Usage

- `user-id`: Created automatically for new visitors and persisted for 1 day
- `session-id`: Created upon starting a new game session, cleared after cash out

---

## 🤖 Cheating Logic

- When credits are **between 40 and 60**, 30% chance to override winning spin
- When credits are **above 60**, 60% chance to override winning spin
- Cheating is applied only when a spin would otherwise be a win

---

## 🧪 Sample API Usage

- `POST /api/start`: Begins a session
- `POST /api/roll`: Deducts credit and returns spin result
- `POST /api/cashout`: Ends session, adds credits to user
- `GET /api/session`: Returns current session and user info

---

## 📝 Notes

- This app uses in-memory storage for sessions and users (`globalThis`) to persist data across API calls in development.
- In production, consider migrating to a database like PostgreSQL, Redis, or Firebase.

---