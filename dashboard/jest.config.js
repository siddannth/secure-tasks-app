module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|html|js)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  coverageDirectory: '../../coverage/dashboard',
};
