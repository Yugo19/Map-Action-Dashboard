const esModules = ['@react-leaflet', 'react-leaflet'].join('|');
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.scss$': 'jest-transform-css',
    },
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy',
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "react-leaflet": "<rootDir>/__mocks__/reactLeafletMock.jsx"
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text'],
  };