const {
  findCrystalByName,
  findCrystalsByProperty,
} = require("../src/search/crystals");
const { DatabaseMigrator } = require("../src/database/migrator");

describe("Crystal Search", () => {
  beforeAll(async () => {
    // Ensure database exists before running tests
    await DatabaseMigrator.ensureDatabaseExists(true, true);
  });

  describe("findCrystalByName", () => {
    test("should find crystal by exact name", async () => {
      const result = await findCrystalByName([], "amethyst");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toBe("amethyst");
    });

    test("should find crystal by case-insensitive name", async () => {
      const result = await findCrystalByName([], "QUARTZ");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toContain("quartz");
    });

    test("should find crystal by partial name match", async () => {
      const result = await findCrystalByName([], "rose quartz");
      expect(result).toBeDefined();
      expect(result.name.toLowerCase()).toContain("rose");
    });

    test("should return null for non-existent crystal", async () => {
      const result = await findCrystalByName([], "nonexistentcrystal12345");
      expect(result).toBeNull();
    });

    test("should have required properties", async () => {
      const result = await findCrystalByName([], "jade");
      expect(result).toBeDefined();
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("properties");
      expect(typeof result.name).toBe("string");
      expect(typeof result.properties).toBe("string");
    });
  });

  describe("findCrystalsByProperty", () => {
    test("should find crystals by property", async () => {
      const results = await findCrystalsByProperty([], "protection");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty("name");
      expect(results[0]).toHaveProperty("properties");
    });

    test("should find crystals with case-insensitive search", async () => {
      const results = await findCrystalsByProperty([], "HEALING");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should return empty array for non-matching property", async () => {
      const results = await findCrystalsByProperty(
        [],
        "nonexistentproperty12345xyz",
      );
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should find multiple crystals for common property", async () => {
      const results = await findCrystalsByProperty([], "love");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(1);
    });
  });
});
