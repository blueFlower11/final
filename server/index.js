const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { Op } = require('sequelize');
const { Smart, Stupid } = require("./db");

const {
  TRANSFORMS_WITH_INV,
  normalizeBoardToString,
  applyTransform,
  wrapWithPipes,
  unwrapPipes,
} = require('./boards');

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

function rowBeadsToArray(row) {
  return [
    row.p00, row.p01, row.p02,
    row.p10, row.p11, row.p12,
    row.p20, row.p21, row.p22,
  ];
}

function weightedPick(weights) {
  const total = weights.reduce((a,b) => a + b, 0);
  if (total <= 0) return -1; 
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r < acc) return i;
  }
}

function getModel(table) {
  if (!table || table === 'smart') return Smart;
  if (table === 'stupid') return Stupid;
  throw new Error('Unknown table; use "smart" or "stupid"');
}

function countFilled(inner9) {
  let n = 0;
  for (const c of inner9) if (c === 'X' || c === 'O') n++;
  return n;
}

app.post('/move', async (req, res) => {
  try {
    const { board, step, table } = req.body;
    const Model = getModel(table);

    const inner = normalizeBoardToString(unwrapPipes(board));

    const transformedInner = TRANSFORMS_WITH_INV.map(t => ({
      ...t,
      boardStr: applyTransform(inner, t.map),
    }));

    const wrappedBoards = transformedInner.map(t => wrapWithPipes(t.boardStr));

    const filled = countFilled(inner);
    const stepsToTry = Array.from(new Set([
      step,
      filled,
      filled + 1,
      Math.max(filled - 1, 0),
    ].filter(s => Number.isInteger(s) && s >= 0)));

    let candidates = [];
    let usedStep = null;
    for (const st of stepsToTry) {
      const found = await Model.findAll({
        where: {
          step: st,
          board: { [Op.in]: wrappedBoards },
        },
        limit: 8,
      });
      if (found.length) {
        candidates = found;
        usedStep = st;
        break;
      }
    }

    if (!candidates.length) {
      const stepAgnostic = await Model.findAll({
        where: { board: { [Op.in]: wrappedBoards } },
        attributes: ['id', 'board', 'step'],
        limit: 8,
      });
      return res.status(404).json({
        error: 'No matching board found in DB for any symmetry',
        tried: wrappedBoards,
        hint: stepAgnostic.length
          ? 'Board exists in DB but with a different step.'
          : 'Encoding mismatch: DB uses pipes and spaces as blanks.',
        foundExamples: stepAgnostic,
      });
    }

    let match = null;
    for (const t of transformedInner) {
      const wrapped = wrapWithPipes(t.boardStr);
      const row = candidates.find(r => r.board === wrapped);
      if (row) { match = { row, transform: t, wrappedBoard: wrapped }; break; }
    }
    if (!match) {
      return res.status(500).json({ error: 'Internal: matched rows but failed to align transform' });
    }

    const { row, transform } = match;

    const legalMask = transform.boardStr.split('').map(c => (c === ' ' ? 1 : 0));

    const beads = rowBeadsToArray(row).map((w, i) => (legalMask[i] ? w : 0));

    const dbPosition = weightedPick(beads);
    if (dbPosition < 0) {
      return res.status(409).json({
        error: 'No legal moves: all bead counts are zero',
        boardId: row.id,
        transform: transform.name,
      });
    }

    const moveIndex = transform.map[dbPosition];

    return res.json({
      moveIndex,               // 0..8 index on original request board
      boardId: row.id,         // DB row id
      dbPosition,              // index chosen in matched orientation
      transform: transform.name,
      usedStep,                // which step value matched
      matchedBoard: wrapWithPipes(transform.boardStr), // what DB board matched
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', detail: String(err.message || err) });
  }
});

app.post('/save', async (req, res) => {
  try {
    const { list, result, table = 'smart' } = req.body || {};

    const tbl = String(table).toLowerCase();
    if (tbl !== 'smart') {
      return res.json({ ok: true, skipped: true, reason: 'table_not_smart', table });
    }

    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ error: 'Body must include list: [{ boardId, position }]' });
    }
    const norm = String(result || '').toLowerCase();
    const isWin  = norm === 'win';
    const isDraw = norm === 'draw' || norm === 'duce' || norm === 'tie';
    const isLose = norm === 'lose' || norm === 'loss';
    if (!isWin && !isDraw && !isLose) {
      return res.status(400).json({ error: 'result must be one of: win | draw | duce | tie | lose' });
    }

    const Model = typeof getModel === 'function'
      ? getModel('smart')
      : Smart;

    const POS_COLS = ['p00','p01','p02','p10','p11','p12','p20','p21','p22'];

    const t = await Model.sequelize.transaction();
    try {
      const updates = [];

      for (const item of list) {
        const boardId  = Number(item?.boardId);
        const position = Number(item?.position);

        if (!Number.isInteger(boardId) || !Number.isInteger(position) || position < 0 || position > 8) {
          throw new Error('Each list item needs valid { boardId:number, position:0..8 }');
        }

        const col = POS_COLS[position];

        const row = await Model.findByPk(boardId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!row) {
          updates.push({ boardId, position, skipped: true, reason: 'not_found' });
          continue;
        }

        const before = Number(row[col] ?? 1);

        let delta = 0;
        if (isWin) delta = 2;
        else if (isDraw) delta = 1;
        else if (isLose) delta = before > 1 ? -1 : 0;

        const after = Math.max(1, before + delta);
        row[col] = after;
        await row.save({ transaction: t });

        updates.push({ boardId, position, from: before, to: after });
      }

      await t.commit();
      return res.json({ ok: true, updates });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: String(err.message || err) });
  }
});

app.get('/ping', async(req, res) => {
  let db = { ok: null, error: null };
  try {
    await sequelize.authenticate();
    db.ok = true;
  } catch (e) {
    db.ok = false;
    db.error = e?.message || 'unknown error';
  }

  res.status(200).json({
    status: 'ok',
    service: 'server',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    db,
  });
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
