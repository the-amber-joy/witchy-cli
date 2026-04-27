const { DB_PATH } = require("../src/database/config");
const path = require("path");

describe("Database Configuration", () => {
  test("should have a valid DB_PATH", () => {
    expect(DB_PATH).toBeDefined();
    expect(typeof DB_PATH).toBe("string");
    expect(DB_PATH.length).toBeGreaterThan(0);
  });

  test("DB_PATH should be an absolute path", () => {
    expect(path.isAbsolute(DB_PATH)).toBe(true);
  });

  test("DB_PATH should end with .db extension", () => {
    expect(DB_PATH.endsWith(".db")).toBe(true);
  });

  test("DB_PATH should point to src/data directory", () => {
    expect(DB_PATH).toContain("src");
    expect(DB_PATH).toContain("data");
  });
});
