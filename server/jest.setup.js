// Ensure deterministic Math.random for tests that rely on weightedPick
beforeAll(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.001);
});

afterAll(() => {
  jest.spyOn(global.Math, 'random').mockRestore?.();
});