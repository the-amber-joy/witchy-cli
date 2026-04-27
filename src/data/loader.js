async function loadData() {
  return loadDataSync();
}

// Load data synchronously from JSON files
function loadDataSync() {
  try {
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
