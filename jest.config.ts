/** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from 'jest'

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(spec|test).ts'],
    transformIgnorePatterns: ["ts-jest"]
}

export default config;