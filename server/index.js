const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const gameRouter = require('./routes/game');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

app.use(cors({
    origin: [
      "http://localhost:5173", // Vite dev
      "https://your-vercel-domain.vercel.app" // replace with Vercel domain
    ],
    credentials: true,
  }));

const sessions = new Map();

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', ({ sessionId, player }) => {
    socket.join(sessionId);
    if (!sessions.has(sessionId)) sessions.set(sessionId, Array(9).fill(null));
    console.log(`player ${player} joined ${sessionId}`);
    io.to(socket.id).emit('board', sessions.get(sessionId));
  });

  socket.on('move', ({ sessionId, player, index }) => {
    const board = sessions.get(sessionId) || Array(9).fill(null);
    if (board[index]) return; 
    board[index] = player;
    sessions.set(sessionId, board);
    io.to(sessionId).emit('board', board);
  });

  socket.on('disconnect', () => {
  });
});

app.use('/api/game', gameRouter);

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

module.exports = { io, sessions };