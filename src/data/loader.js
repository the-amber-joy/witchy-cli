const fs = require("fs");
const path = require("path");
const { HerbsDB } = require("../database/herbs");
const { CrystalsDB } = require("../database/crystals");
const { ColorsDB } = require("../database/colors");
const { MoonDB } = require("../database/moon");
const { MetalsDB } = require("../database/metals");
const { DaysDB } = require("../database/days");
const { DatabaseMigrator } = require("../database/migrator");

// Load all data from database (with auto-migration)
async function loadData() {
  try {
    // Ensure database exists and is populated
    const migrationRan = await DatabaseMigrator.ensureDatabaseExists();
    if (migrationRan) {
      console.log("🔮 Database ready for use!\n");
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
    const projectRoot = path.join(__dirname, "..", "..");

    const herbsPath = path.join(projectRoot, "json", "herbs.json");
    const crystalsPath = path.join(projectRoot, "json", "crystals.json");
    const colorsPath = path.join(projectRoot, "json", "colors.json");
    const moonPath = path.join(projectRoot, "json", "moon.json");
    const metalsPath = path.join(projectRoot, "json", "metals.json");
    const daysPath = path.join(projectRoot, "json", "days.json");

    const herbsData = JSON.parse(fs.readFileSync(herbsPath, "utf8"));
    const crystalsData = JSON.parse(fs.readFileSync(crystalsPath, "utf8"));
    const colorsData = JSON.parse(fs.readFileSync(colorsPath, "utf8"));
    const moonData = JSON.parse(fs.readFileSync(moonPath, "utf8"));
    const metalsData = JSON.parse(fs.readFileSync(metalsPath, "utf8"));
    const daysData = JSON.parse(fs.readFileSync(daysPath, "utf8"));

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
