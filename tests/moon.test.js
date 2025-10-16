const {
  findMoonPhaseByName,
  findMoonPhasesByMeaning,
} = require("../src/search/moon");
const { DatabaseMigrator } = require("../src/database/migrator");

describe("Moon Phase Search", () => {
  beforeAll(async () => {
    // Ensure database exists before running tests
    await DatabaseMigrator.ensureDatabaseExists(true, true);
  });

  describe("findMoonPhaseByName", () => {
    test("should find moon phase by exact name", async () => {
      const result = await findMoonPhaseByName([], "full");
      expect(result).toBeDefined();
      expect(result.phase.toLowerCase()).toContain("full");
    });

    test("should find moon phase by case-insensitive name", async () => {
      const result = await findMoonPhaseByName([], "NEW");
      expect(result).toBeDefined();
      expect(result.phase.toLowerCase()).toContain("new");
    });

    test("should find moon phase by partial match", async () => {
      const result = await findMoonPhaseByName([], "waning moon");
      expect(result).toBeDefined();
      expect(result.phase.toLowerCase()).toContain("waning");
    });

    test("should return null for non-existent phase", async () => {
      const result = await findMoonPhaseByName([], "nonexistentphase12345");
      expect(result).toBeNull();
    });

    test("should have required properties", async () => {
      const result = await findMoonPhaseByName([], "full");
      expect(result).toBeDefined();
      expect(result).toHaveProperty("phase");
      expect(result).toHaveProperty("meaning");
      expect(typeof result.phase).toBe("string");
      expect(typeof result.meaning).toBe("string");
    });
  });

  describe("findMoonPhasesByMeaning", () => {
    test("should find moon phases by meaning", async () => {
      const results = await findMoonPhasesByMeaning([], "magic");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("phase");
      expect(results[0]).toHaveProperty("meaning");
    });

    test("should find phases with case-insensitive search", async () => {
      const results = await findMoonPhasesByMeaning([], "BANISHING");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should return empty array for non-matching meaning", async () => {
      const results = await findMoonPhasesByMeaning(
        [],
        "nonexistentmeaning12345xyz",
      );
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
