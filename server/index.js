const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

let games = {};

app.get("/api/game/history", (req, res) => {
  const history = Object.values(games).map((g) => ({
    id: g.id,
    players: g.players,
    winner: g.winner,
  }));
  res.json(history);
});

app.post("/api/game/ai-move", (req, res) => {
  const { board } = req.body;
  const empty = board
    .map((v, i) => (v ? null : i))
    .filter((v) => v !== null);
  const move = empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
  res.json({ move });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    if (!games[gameId]) {
      games[gameId] = { id: gameId, board: Array(9).fill(null), players: [], winner: null };
    }
    if (games[gameId].players.length < 2 && !games[gameId].players.includes(socket.id)) {
      games[gameId].players.push(socket.id);
    }
  });

  socket.on("makeMove", ({ gameId, index, player }) => {
    const game = games[gameId];
    if (!game || game.board[index] || game.winner) return;
    game.board[index] = player;

    const winner = checkWinner(game.board);
    if (winner) {
      game.winner = winner;
    }

    io.to(gameId).emit("moveMade", { index, player, board: game.board, winner: game.winner });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
