
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  verbose: true,
  
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],

  testPathIgnorePatterns: ['/node_modules/', '/tests/'],

  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },

  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types'
  }
};

export default config;
