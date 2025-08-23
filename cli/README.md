# Tic-Tac-Toe Frontend (Next.js + Tailwind + Socket.IO)

A Vercel-ready frontend that talks to your existing backend. It supports:
- Home page with CTA
- Game hub (friend / bot-static / bot-learning)
- Bot games: random first player, blocked clicks during bot turn, fun robot narration while waiting
- Friend games: QR codes to connect two phones; spectator/board view on a big screen

## Quickstart

1. **Clone & install**
   ```bash
   pnpm i   # or npm i / yarn
   ```

2. **Configure environment**
   Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_API_BASE` — your backend base URL
   - `NEXT_PUBLIC_SOCKET_URL` — your Socket.IO server URL
   - Optionally change `NEXT_PUBLIC_ENDPOINT_STATIC` and `NEXT_PUBLIC_ENDPOINT_LEARNING` to match your API paths

3. **Dev**
   ```bash
   pnpm dev
   ```

4. **Deploy to Vercel**
   - Import this repo in Vercel
   - Set the same env vars in Vercel Project Settings → Environment Variables
   - Deploy

## Expected Backend Contract (easy to adapt)
- **POST {API_BASE}/{ENDPOINT_STATIC or ENDPOINT_LEARNING}**
  ```json
  {
    "board": ["X", null, ... 9 cells total],
    "player": "X" | "O"
  }
  ```
  **Response:**
  ```json
  {
    "index": 4,                 // chosen move index 0..8
    "board": ["X","O",...],     // optional, updated board
    "winner": "X"|"O"|null,     // optional
    "draw": true|false          // optional
  }
  ```
  If your backend uses different keys, adjust `lib/api.ts`.

- **Socket.IO** (friend mode)
  - Client emits: `join`, payload `{ room: string, role: "X"|"O"|"spectator" }`
  - Client emits: `move`, payload `{ room: string, index: number, symbol: "X"|"O" }`
  - Server broadcasts: `state`, payload `{ board: ("X"|"O"|null)[], turn: "X"|"O", winner?: string|null, draw?: boolean }`

  If your server uses different event names, tweak `lib/socket.ts` and `app/game/friend/page.tsx`.

## Notes
- Fully responsive with Tailwind
- Nice defaults; easy to restyle
- No server-side rendering needed for game logic
