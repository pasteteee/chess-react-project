export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMap: {
        '\\.(css|scss)$': 'identity-obj-proxy'
    },
    testMatch: [
        '<rootDir>/src/tests/**/*.test.js',
        '<rootDir>/src/**/*.test.js'
    ],
    collectCoverageFrom: [
        'src/utils/**/*.js',
        '!src/**/*.test.js'
    ]
};