/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@securetasks/auth(.*)$': '<rootDir>/../../libs/auth/src$1',
    '^@securetasks/data(.*)$': '<rootDir>/../../libs/data/src$1',
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
