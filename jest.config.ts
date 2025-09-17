import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
        '^.+\\.(t|j)s?$': '@swc/jest',
    },
    moduleNameMapper: {
        '^(\.\.?\/.*)\.js$': '$1',
        '^ci-info$': '<rootDir>/jest-mock.js',
        '\\.(json)$': '<rootDir>/jest-json-mock.js'
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
};

export default config;