// jest.config.js
module.exports = {
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text-summary'],
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
};