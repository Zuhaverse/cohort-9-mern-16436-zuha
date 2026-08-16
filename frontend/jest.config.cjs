module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  };

module.exports = {
    testEnvironment: "jsdom",
  
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
  
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
  };