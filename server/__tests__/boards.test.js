const {
  TRANSFORMS_WITH_INV,
  normalizeBoardToString,
  applyTransform,
  wrapWithPipes,
  unwrapPipes,
} = require('../boards');

describe('boards utilities', () => {
  test('normalizeBoardToString with string', () => {
    expect(normalizeBoardToString('XO XO XO ')).toHaveLength(9);
  });
  test('normalizeBoardToString with nested arrays', () => {
    const arr = [['X','O',' '],['X','O',' '],['X','O',' ']];
    expect(normalizeBoardToString(arr)).toBe('XO XO XO ');
  });
  test('wrap/unwrap pipes', () => {
    const inner = 'X        ';
    const wrapped = wrapWithPipes(inner);
    expect(wrapped).toBe('|X        |');
    expect(unwrapPipes(wrapped)).toBe(inner);
    expect(unwrapPipes(inner)).toBe(inner);
  });
  test('applyTransform length stable', () => {
    const b = 'X  O   X ';
    for (const t of TRANSFORMS_WITH_INV) {
      const out = applyTransform(b, t.map);
      expect(out).toHaveLength(9);
    }
  });
  test('rotation 180 twice equals identity', () => {
    const { map: R180 } = TRANSFORMS_WITH_INV.find(t => t.name === 'ROT180');
    const id = TRANSFORMS_WITH_INV.find(t => t.name === 'IDENT').map;
    const b = 'X  O   X ';
    const once = applyTransform(b, R180);
    const twice = applyTransform(once, R180);
    expect(twice).toBe(applyTransform(b, id));
  });
});