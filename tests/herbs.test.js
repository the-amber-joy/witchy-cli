const { findHerbByName, findHerbsByUse } = require("../src/search/herbs");
const { DatabaseMigrator } = require("../src/database/migrator");

describe("Herb Search", () => {
  beforeAll(async () => {
    // Ensure database exists before running tests
    await DatabaseMigrator.ensureDatabaseExists(true, true);
  });

  describe("findHerbByName", () => {
    test("should find herb by exact name", async () => {
      const result = await findHerbByName([], "rosemary");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("rosemary");
    });

    test("should find herb by case-insensitive name", async () => {
      const result = await findHerbByName([], "SAGE");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("sage");
    });

    test("should find herb by partial name match", async () => {
      const result = await findHerbByName([], "rose");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("rose");
    });

    test("should return null for non-existent herb", async () => {
      const result = await findHerbByName([], "nonexistentherb12345");
      expect(result).toBeNull();
    });

    test("should have required properties", async () => {
      const result = await findHerbByName([], "lavender");
      expect(result).toBeDefined();
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("ritualUse");
      expect(typeof result.name).toBe("string");
      expect(typeof result.ritualUse).toBe("string");
    });
  });

  describe("findHerbsByUse", () => {
    test("should find herbs by use term", async () => {
      const results = await findHerbsByUse([], "love");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("name");
      expect(results[0]).toHaveProperty("ritualUse");
    });

    test("should find herbs with case-insensitive search", async () => {
      const results = await findHerbsByUse([], "PROTECTION");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should return empty array for non-matching term", async () => {
      const results = await findHerbsByUse([], "nonexistentuse12345xyz");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should find multiple herbs for common use", async () => {
      const results = await findHerbsByUse([], "healing");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(1);
    });
  });
});
