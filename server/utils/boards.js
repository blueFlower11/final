const transforms = {
    identity:    (r,c) => [ r,   c   ],
    rot90:       (r,c) => [ c, 2 - r ],
    rot180:      (r,c) => [ 2 - r, 2 - c ],
    rot270:      (r,c) => [ 2 - c, r   ],
    reflectV:    (r,c) => [ r, 2 - c ],
    reflectH:    (r,c) => [ 2 - r, c ],
    reflectDiag: (r,c) => [ c,   r   ],
    reflectADiag:(r,c) => [ 2 - c, 2 - r ]
  };
  
  function apply(flatBoard, fn) {
    const out = Array(9);
    for (let i = 0; i < 9; i++) {
      const r = Math.floor(i/3), c = i % 3;
      const [nr, nc] = fn(r,c);
      out[nr*3 + nc] = flatBoard[i];
    }
    return out.join('');
  }
  
  function equivalents(flatBoard) {
    const set = new Set();
    for (const fn of Object.values(transforms)) set.add(apply(flatBoard, fn));
    return Array.from(set);
  }
  
  function wrap(flatten) { return `|${flatten}|`; }
  
  function transformBoards(pipeBoard) {
    // expect pipe style: |.........|
    const core = pipeBoard.startsWith('|') ? pipeBoard.slice(1, -1) : pipeBoard;
    return equivalents(core).map(wrap);
  }
  
  function buildIndexMappings() {
    const maps = {};
    for (const [name, fn] of Object.entries(transforms)) {
      const m = [];
      for (let i = 0; i < 9; i++) {
        const r = Math.floor(i/3), c = i%3;
        const [nr, nc] = fn(r,c);
        m[i] = nr*3 + nc;
      }
      maps[name] = m;
    }
    return maps;
  }
  
  function mapDbIndexToOriginal(originalPipe, dbPipe, chosenDbIdx) {
    const orig9 = originalPipe.startsWith('|') ? originalPipe.slice(1,-1) : originalPipe;
    const db9   = dbPipe.startsWith('|') ? dbPipe.slice(1,-1) : dbPipe;
    let transformName = null;
    for (const [name, fn] of Object.entries(transforms)) {
      if (apply(orig9, fn) === db9) { transformName = name; break; }
    }
    if (!transformName) throw new Error('No matching transform');
    const mappings = buildIndexMappings();
    const orig2var = mappings[transformName];
    const var2orig = Array(9);
    orig2var.forEach((toIdx, fromIdx) => { var2orig[toIdx] = fromIdx; });
    return var2orig[chosenDbIdx];
  }
  
  function parsePipeBoard(raw) { return raw.startsWith('|') ? raw.slice(1,-1) : raw; }
  function wrapPipeBoard(flat) { return `|${flat}|`; }
  
  module.exports = {
    transformBoards,
    mapDbIndexToOriginal,
    parsePipeBoard,
    wrapPipeBoard
  };