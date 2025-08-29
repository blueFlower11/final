const I   = [0,1,2,3,4,5,6,7,8];                 // identity
const R90 = [6,3,0,7,4,1,8,5,2];                 // rotate 90° CW
const R180= [8,7,6,5,4,3,2,1,0];                 // rotate 180°
const R270= [2,5,8,1,4,7,0,3,6];                 // rotate 270° CW
const FH  = [2,1,0,5,4,3,8,7,6];                 // flip horizontal (mirror over vertical axis)
const FV  = [6,7,8,3,4,5,0,1,2];                 // flip vertical (mirror over horizontal axis)
const FD  = [0,3,6,1,4,7,2,5,8];                 // flip main diagonal
const FA  = [8,5,2,7,4,1,6,3,0];                 // flip anti-diagonal

const TRANSFORMS = [
  { name: 'IDENT', map: I },
  { name: 'ROT90', map: R90 },
  { name: 'ROT180', map: R180 },
  { name: 'ROT270', map: R270 },
  { name: 'FLIP_H', map: FH },
  { name: 'FLIP_V', map: FV },
  { name: 'FLIP_D', map: FD },
  { name: 'FLIP_A', map: FA },
];

const invertMap = (m) => {
  const inv = new Array(9);
  for (let i = 0; i < 9; i++) inv[m[i]] = i;
  return inv;
};

const TRANSFORMS_WITH_INV = TRANSFORMS.map(t => ({ ...t, inv: invertMap(t.map) }));

function normalizeBoardToString(board) {
  if (typeof board === 'string') {
    if (board.length !== 9) throw new Error('Board string must be length 9');
    return board;
  }
  const flat = Array.isArray(board[0]) ? board.flat() : board;
  if (!Array.isArray(flat) || flat.length !== 9) throw new Error('Board must have 9 cells');
  return flat.join('');
}

function applyTransform(boardStr, map) {
  const arr = boardStr.split('');
  const out = new Array(9);
  for (let i = 0; i < 9; i++) out[i] = arr[map[i]];
  return out.join('');
}

function wrapWithPipes(inner9) {
    if (inner9.length !== 9) throw new Error('wrapWithPipes expects 9-char inner board');
    return `|${inner9}|`;
  }
  
  function unwrapPipes(possiblyWrapped) {
    if (possiblyWrapped.length === 11 && possiblyWrapped.startsWith('|') && possiblyWrapped.endsWith('|')) {
      return possiblyWrapped.slice(1, -1);
    }
    return possiblyWrapped;
  }
  
  module.exports = {
    TRANSFORMS_WITH_INV,
    normalizeBoardToString,
    applyTransform,
    wrapWithPipes,
    unwrapPipes,
  };
