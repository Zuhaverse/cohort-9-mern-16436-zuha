module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
};