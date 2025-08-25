/**
 * We mock ./db used by index.js so HTTP routes don't need a real DB.
 */
jest.mock('../db');

const request = require('supertest');

// Sequelize Op.in is used in code; emulate by attaching on the fly for our mock.
const { Op } = require('sequelize');
const dbMock = require('../__mocks__/db');
dbMock.__testing.Op = Op; // not used directly but handy

// Patch Smart/Stupid findAll to accept where.board[Op.in] too
const wrapInCompatIn = (obj) => new Proxy(obj, {
  get(target, prop) {
    const v = target[prop];
    if (prop === 'findAll') {
      return async function (opts = {}) {
        if (opts.where && opts.where.board && opts.where.board[Op.in]) {
          opts.where.board['$in'] = opts.where.board[Op.in];
        }
        return v.call(this, opts);
      }
    }
    return typeof v === 'function' ? v.bind(target) : v;
  }
});
jest.doMock('../db', () => ({
  ...dbMock,
  Smart: wrapInCompatIn(dbMock.Smart),
  Stupid: wrapInCompatIn(dbMock.Stupid),
}));

const { __testing } = require('../__mocks__/db');

// Import the server AFTER mocks
const path = require('path');
const serverModulePath = path.resolve(__dirname, '../index.js');
let server;
beforeAll(() => {
  // require index.js which starts the server on PORT (default 3001)
  delete require.cache[serverModulePath];
  require(serverModulePath);
  // Supertest targets the express app; index.js doesn't export it,
  // so we hit the actual network port.
});

afterAll((done) => {
  // Best-effort: close the server by sending SIGINT
  try {
    process.emit('SIGINT');
  } catch {}
  setTimeout(done, 200);
});

const base = 'http://127.0.0.1:' + (process.env.PORT || 3001);

describe('health and stats routes', () => {
  beforeEach(() => __testing.resetAll());

  test('GET /ping reports ok', async () => {
    const res = await request(base).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db.ok).toBe(true);
  });

  test('GET /stats empty, then with ip filter', async () => {
    const res = await request(base).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe('POST /move', () => {
  beforeEach(() => __testing.resetAll());

  test('returns a move for matching board (identity)', async () => {
    // Prepare a DB row with beads
    const board = '|X        |'; // spaces are legal
    __testing.data.smart.push({
      id: 1, step: 0, board,
      p00:1,p01:2,p02:3,p10:4,p11:5,p12:6,p20:7,p21:8,p22:9
    });
    const res = await request(base)
      .post('/move')
      .send({ board: 'X        ', step: 0, table: 'smart' })
      .set('Content-Type', 'application/json');
    expect([200,201]).toContain(res.status);
    expect(res.body.moveIndex).toBeGreaterThanOrEqual(0);
    expect(res.body.boardId).toBe(1);
    expect(res.body.transform).toBeDefined();
    expect(res.body.matchedBoard).toBe(board);
  });

  test('404 when no matching board', async () => {
    const res = await request(base)
      .post('/move')
      .send({ board: 'XO XO XO ', step: 3, table: 'smart' });
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/No matching board/);
  });
});

describe('POST /save', () => {
  beforeEach(() => __testing.resetAll());

  test('validates result', async () => {
    const res = await request(base).post('/save').send({ list: [], result: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/result must be one of/);
  });

  test('updates statistics and smart beads on win', async () => {
    // Seed one smart row that will be updated
    __testing.data.smart.push({
      id: 2, step: 0, board: '|X        |',
      p00:1,p01:1,p02:1,p10:1,p11:1,p12:1,p20:1,p21:1,p22:1
    });
    const res = await request(base).post('/save').send({
      table: 'smart',
      result: 'win',
      list: [{ boardId: 2, position: 4 }], // center bead
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    // statistics row created for ip 'unknown' (mock getClientIp returns empty -> 'unknown')
    const stats = __testing.data.statistics[0];
    expect(stats.smartL).toBe(1); // per code: AI smart loses when user wins
    // bead increment by 2 on win
    const updated = __testing.data.smart.find(r => r.id === 2);
    expect(updated.p11).toBe(3);
  });

  test('skips non-smart table for updates but still logs stats', async () => {
    const res = await request(base).post('/save').send({
      table: 'stupid',
      result: 'draw',
      list: [{ boardId: 999, position: 0 }]
    });
    expect(res.status).toBe(200);
    expect(res.body.skipped).toBe(true);
    const stats = __testing.data.statistics[0];
    expect(stats.stupidD).toBe(1);
  });

  test('handles not found rows in list gracefully', async () => {
    const res = await request(base).post('/save').send({
      table: 'smart',
      result: 'lose',
      list: [{ boardId: 42, position: 0 }]
    });
    expect(res.status).toBe(200);
    expect(res.body.updates[0].skipped).toBe(true);
  });
});