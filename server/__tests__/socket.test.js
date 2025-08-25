jest.mock('../db');

const ioClient = require('socket.io-client');
const request = require('supertest');

const base = 'http://127.0.0.1:' + (process.env.PORT || 3001);
let client1, client2;

beforeAll(() => {
  // Ensure server is running (index.js auto-starts)
  require('../index.js');
});

afterAll(() => {
  try { client1?.close(); client2?.close(); } catch {}
});

test('socket game: join, make moves, detect winner', (done) => {
  const gameId = 'testgame1';

  client1 = ioClient(base, { transports: ['websocket'], forceNew: true });
  client2 = ioClient(base, { transports: ['websocket'], forceNew: true });

  let movesSeen = 0;
  function maybeDone() {
    if (movesSeen >= 5) { // enough to form a win
      try { client1.close(); client2.close(); } catch {}
      done();
    }
  }

  Promise.all([
    new Promise(res => client1.on('connect', res)),
    new Promise(res => client2.on('connect', res)),
  ]).then(() => {
    client1.emit('joinGame', gameId);
    client2.emit('joinGame', gameId);

    client1.on('moveMade', ({ winner, board }) => {
      movesSeen++;
      if (winner) {
        expect(winner).toBe('X');
        expect(board[0]).toBe('X');
        maybeDone();
      }
    });

    client2.on('moveMade', ({ winner, board }) => {
      movesSeen++;
      if (winner) {
        expect(winner).toBe('X');
        maybeDone();
      }
    });

    // Sequence: X wins across top row: 0,1,2
    client1.emit('makeMove', { gameId, index: 0, player: 'X' });
    setTimeout(() => client2.emit('makeMove', { gameId, index: 3, player: 'O' }), 50);
    setTimeout(() => client1.emit('makeMove', { gameId, index: 1, player: 'X' }), 100);
    setTimeout(() => client2.emit('makeMove', { gameId, index: 4, player: 'O' }), 150);
    setTimeout(() => client1.emit('makeMove', { gameId, index: 2, player: 'X' }), 200);
  });
});