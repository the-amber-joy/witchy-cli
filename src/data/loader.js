const fs = require("fs");
const path = require("path");
const { HerbsDB } = require("../database/herbs");
const { CrystalsDB } = require("../database/crystals");
const { ColorsDB } = require("../database/colors");
const { MoonDB } = require("../database/moon");
const { MetalsDB } = require("../database/metals");
const { DaysDB } = require("../database/days");
const { DatabaseMigrator } = require("../database/migrator");

// Load all data from database (with optional auto-migration)
async function loadData(runMigration = true, silentMigration = false) {
  try {
    // Ensure database exists and is populated (only if requested)
    if (runMigration) {
      await DatabaseMigrator.ensureDatabaseExists(silentMigration);
    }

    // Load all data types from database in parallel for better performance
    const [
      herbsData,
      crystalsData,
      colorsData,
      moonData,
      metalsData,
      daysData,
    ] = await Promise.all([
      HerbsDB.getAllHerbs(),
      CrystalsDB.getAllCrystals(),
      ColorsDB.getAllColors(),
      MoonDB.getAllMoonPhases(),
      MetalsDB.getAllMetals(),
      DaysDB.getAllDays(),
    ]);

    return {
      herbs: herbsData,
      crystals: crystalsData,
      colors: colorsData,
      moon: moonData,
      metals: metalsData,
      days: daysData,
    };
  } catch (error) {
    console.error(
      "Error loading data from database, falling back to JSON files:",
      error.message,
    );
    // Fallback to JSON files if database fails
    return loadDataSync();
  }
}

// Load data synchronously for backwards compatibility (falls back to JSON)
function loadDataSync() {
  try {
    // Use require() for better pkg compatibility (works with bundled JSON files)
    const herbsData = require("./herbs.json");
    const crystalsData = require("./crystals.json");
    const colorsData = require("./colors.json");
    const moonData = require("./moon.json");
    const metalsData = require("./metals.json");
    const daysData = require("./days.json");

    return {
      herbs: herbsData,
      crystals: crystalsData,
      colors: colorsData,
      moon: moonData,
      metals: metalsData,
      days: daysData,
    };
  } catch (error) {
    console.error("Error loading data files:", error.message);
    process.exit(1);
  }
}

module.exports = { loadData, loadDataSync };
