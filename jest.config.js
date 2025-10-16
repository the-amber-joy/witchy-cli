module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/data/**", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 10000,
};
