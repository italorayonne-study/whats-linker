module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/', // Ignora arquivos em node_modules
        'ts-jest'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    roots: ['tests/'],
};
