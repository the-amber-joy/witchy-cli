const {
  findColorByName,
  findColorsByMeaning,
} = require("../src/search/colors");
const { DatabaseMigrator } = require("../src/database/migrator");

describe("Color Search", () => {
  beforeAll(async () => {
    // Ensure database exists before running tests
    await DatabaseMigrator.ensureDatabaseExists(true, true);
  });

  describe("findColorByName", () => {
    test("should find color by exact name", async () => {
      const result = await findColorByName([], "red");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("red");
    });

    test("should find color by case-insensitive name", async () => {
      const result = await findColorByName([], "BLUE");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("blue");
    });

    test("should find color by partial match", async () => {
      const result = await findColorByName([], "green");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("green");
    });

    test("should return null for non-existent color", async () => {
      const result = await findColorByName([], "nonexistentcolor12345");
      expect(result).toBeNull();
    });

    test("should have required properties", async () => {
      const result = await findColorByName([], "purple");
      expect(result).toBeDefined();
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("meanings");
      expect(typeof result.name).toBe("string");
      expect(typeof result.meanings).toBe("string");
    });
  });

  describe("findColorsByMeaning", () => {
    test("should find colors by meaning", async () => {
      const results = await findColorsByMeaning([], "love");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("name");
      expect(results[0]).toHaveProperty("meanings");
    });

    test("should find colors with case-insensitive search", async () => {
      const results = await findColorsByMeaning([], "PROTECTION");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should return empty array for non-matching meaning", async () => {
      const results = await findColorsByMeaning(
        [],
        "nonexistentmeaning12345xyz",
      );
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should find multiple colors for common meaning", async () => {
      const results = await findColorsByMeaning([], "power");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(1);
    });
  });
});
