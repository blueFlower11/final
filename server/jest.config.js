/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleFileExtensions: ['js','json'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['boards.js','index.js','db.js'],
  coveragePathIgnorePatterns: ['/node_modules/','/__mocks__/'],
  verbose: true,
  // Run in band since index starts a server on a fixed port
  runInBand: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Increase timeout for socket tests
  testTimeout: 20000,
};