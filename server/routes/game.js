const express = require('express');
const router = express.Router();
const db = require('../db');
const { transformBoards, mapDbIndexToOriginal, parsePipeBoard, wrapPipeBoard } = require('../utils/board');

function weightedRandomIndex(weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return Math.floor(Math.random() * weights.length);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i;
  }
  return weights.length - 1;
}

function playMove(originalPipe, idx) {
  const flat = parsePipeBoard(originalPipe).split('');
  const symbol = nextSymbol(originalPipe);
  if (idx < 0 || idx > 8) throw new Error('Index out of range');
  if (flat[idx] !== ' ') throw new Error('Tile already occupied');
  flat[idx] = symbol;
  return wrapPipeBoard(flat.join(''));
}

function nextSymbol(rawPipe) {
  const flat = parsePipeBoard(rawPipe);
  let xCount = 0, oCount = 0;
  for (const c of flat) {
    if (c === 'X') xCount++; else if (c === 'O') oCount++;
  }
  if (oCount > xCount) throw new Error('Invalid board: more O’s than X’s');
  if (xCount - oCount > 1) throw new Error('Invalid board: X is ahead too much');
  return xCount === oCount ? 'X' : 'O';
}

router.post('/ai-move', async (req, res) => {
  try {
    const { sessionId, gameVersion, board } = req.body;
    const transformations = transformBoards(board);
    const stateQuery = `SELECT * FROM ${gameVersion} WHERE board = ANY($1)`;
    const { rows } = await db.query(stateQuery, [transformations]);
    const rowByState = Object.fromEntries(rows.map(r => [r.board, r]));
    const results = {};
    transformations.forEach(state => { results[state] = rowByState[state] || null; });
    const found = Object.entries(results).find(([_, row]) => row);
    if (!found) {
      const flat = parsePipeBoard(board).split('');
      const empties = flat.map((v,i) => v === ' ' ? i : -1).filter(i => i >= 0);
      const idx = empties[Math.floor(Math.random() * empties.length)];
      return res.json({ board: playMove(board, idx), inDB: null });
    }
    const [matchBoard, matchDB] = found;
    const posKeys = Object.keys(matchDB).filter(k => /^p[0-2][0-2]$/.test(k)).sort();
    const beadCounts = posKeys.map(k => matchDB[k]);
    const chosenDbIdx = weightedRandomIndex(beadCounts);
    const beadInDb = posKeys[chosenDbIdx];
    const beadNum = parseInt(beadInDb.slice(1).split('').map(Number).reduce((a,b,i)=> a*3 + b,0));
    const beadOrig = mapDbIndexToOriginal(board, matchBoard, beadNum);
    const nextBoard = playMove(board, beadOrig);
    res.json({ board: nextBoard, inDB: [matchBoard, beadInDb] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/game-result', (req, res) => {
  console.log('game-result', req.body);
  res.json({ ok: true });
});

module.exports = router;