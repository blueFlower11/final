const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { Op } = require('sequelize');
const { Smart, Stupid } = require("./boards");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173"
];

const io = new Server(server, { cors: {} });
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

app.use(express.json());
app.use(cors());
//   origin: allowedOrigins,
//   credentials: true,
// }));

let games = {};

function getBoardModel(type) {
  return type === "stupid" ? Stupid : Smart; // default = Smart
}

app.get("/api/game/history", (req, res) => {
  const history = Object.values(games).map((g) => ({
    id: g.id,
    players: g.players,
    winner: g.winner,
  }));
  res.json(history);
});

// app.post("/api/game/ai-move", (req, res) => {
//   const { board } = req.body;
//   const boardArray = Array.from(board.replace(/\|/g, '').split('').map(v => v === ' ' ? null : v));
//   const empty = boardArray
//     .map((v, i) => (v ? null : i))
//     .filter((v) => v !== null);
//   const move = empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
//   res.json({ move });
// });

app.post("/api/game/ai-move", async (req, res) => {
  try {
    const { board, step, type } = req.body;
    const Boards = getBoardModel(type);

    // normalize board string like Java code did
    const normalized = "|" + board.replace(/\|/g, "") + "|";

    // find matching boards in DB
    const dbBoards = await Boards.findAll({ where: { step } });

    let chosenBoard = null;
    let chosenMove = null;

    for (let b of dbBoards) {
      if (b.board === normalized) {
        // collect "beads"
        const beads = [];
        Object.entries({
          0: b.p00,
          1: b.p01,
          2: b.p02,
          3: b.p10,
          4: b.p11,
          5: b.p12,
          6: b.p20,
          7: b.p21,
          8: b.p22,
        }).forEach(([pos, count]) => {
          for (let i = 0; i < count; i++) beads.push(Number(pos));
        });

        // random weighted choice
        if (beads.length > 0) {
          const move = beads[Math.floor(Math.random() * beads.length)];
          chosenBoard = b;
          chosenMove = move;
          break;
        }
      }
    }

    if (!chosenMove) {
      // fallback = random empty
      const boardArray = Array.from(board.replace(/\|/g, "").split("").map(v => v === " " ? null : v));
      const empty = boardArray.map((v, i) => (v ? null : i)).filter(v => v !== null);
      chosenMove = empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
    }

    res.json({ move: chosenMove, boardId: chosenBoard?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI move failed" });
  }
});

function rowBeadsToArray(row) {
  return [
    row.p00, row.p01, row.p02,
    row.p10, row.p11, row.p12,
    row.p20, row.p21, row.p22,
  ];
}

function weightedPick(weights) {
  const total = weights.reduce((a,b) => a + b, 0);
  if (total <= 0) return -1; // no legal moves (all zero)
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r < acc) return i;
  }
  return weights.length - 1; // fallback
}

function getModel(table) {
  if (!table || table === 'smart') return Smart;
  if (table === 'stupid') return Stupid;
  throw new Error('Unknown table; use "smart" or "stupid"');
}

app.post('/move', async (req, res) => {
  try {
    const { board, step, table } = req.body;
    if (step == null) return res.status(400).json({ error: 'Missing step' });
    const boardStr = normalizeBoardToString(board);
    const Model = getModel(table);

    // Generate all symmetry variants of the incoming board
    const transformedBoards = TRANSFORMS_WITH_INV.map(t => ({
      ...t,
      boardStr: applyTransform(boardStr, t.map),
    }));

    // Try to find a DB row whose `board` matches any of these (and step matches)
    const candidates = await Model.findAll({
      where: {
        step,
        board: {
          [Op.in]: transformedBoards.map(t => t.boardStr),
        },
      },
      limit: 8,
    });

    if (!candidates.length) {
      return res.status(404).json({
        error: 'No matching board found in DB for any symmetry',
        tried: transformedBoards.map(t => t.boardStr),
      });
    }

    // Pick the first match, but record which symmetry matched it
    // (If you’d rather prefer a canonical order, you can sort candidates by id or bead sum)
    const match = (() => {
      for (const t of transformedBoards) {
        const row = candidates.find(r => r.board === t.boardStr);
        if (row) return { row, transform: t };
      }
      return null;
    })();

    if (!match) {
      return res.status(500).json({ error: 'Internal: could not align match to transform' });
    }

    const { row, transform } = match;
    const beads = rowBeadsToArray(row); // beads for the matched orientation

    // Choose a DB position with probability proportional to bead count
    const dbPosition = weightedPick(beads);
    if (dbPosition < 0) {
      return res.status(409).json({
        error: 'No legal moves: all bead counts are zero for this board',
        boardId: row.id,
        transform: transform.name,
      });
    }

    // Map DB position back to the ORIGINAL request orientation
    // transform.inv maps "matched orientation index" -> "original orientation index"
    const moveIndex = transform.inv[dbPosition];

    return res.json({
      moveIndex,              // index 0..8 on the ORIGINAL input board
      boardId: row.id,        // which DB row was used
      dbPosition,             // which index 0..8 was picked in the matched DB orientation
      transform: transform.name,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', detail: String(err.message || err) });
  }
});

app.post("/api/game/ai-update", async (req, res) => {
  try {
    const { moves, winner } = req.body; 
    const Boards = getBoardModel("smart");
    // moves = [{ boardId, pos }]
    
    for (let { boardId, pos } of moves) {
      const board = await Boards.findByPk(boardId);
      if (!board) continue;

      const win = winner === "AI";
      const tie = winner === null;

      // adjust beads like in Java code
      const field = ["p00","p01","p02","p10","p11","p12","p20","p21","p22"][pos];
      if (win) {
        board[field] += 2;
        board.win++;
      } else if (tie) {
        board[field] += 1;
      } else {
        board[field] = Math.max(0, board[field] - 1);
        board.lose++;
      }

      await board.save();
    }

    res.json({ status: "updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update AI" });
  }
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
