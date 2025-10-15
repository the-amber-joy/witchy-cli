const { HerbsDB } = require("../database/herbs");
const { DatabaseMigrator } = require("../database/migrator");

// Search for herb by name or alternative name (database version)
async function findHerbByName(herbs, searchTerm) {
  try {
    // Ensure database exists before searching (lightweight check)
    // Postinstall script handles migration, this is just a safety net
    await DatabaseMigrator.ensureDatabaseExists(false);

    return await HerbsDB.findHerbByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // Fallback to original array-based search
    return findHerbByNameSync(herbs, searchTerm);
  }
}

// Search for herbs by ritual use (database version)
async function findHerbsByUse(herbs, useTerm) {
  try {
    // Ensure database exists before searching (lightweight check)
    await DatabaseMigrator.ensureDatabaseExists(false);

    return await HerbsDB.findHerbsByUse(useTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // Fallback to original array-based search
    return findHerbsByUseSync(herbs, useTerm);
  }
}

// Get herb suggestions for partial matches
async function getHerbSuggestions(searchTerm) {
  try {
    // Ensure database exists before searching (lightweight check)
    await DatabaseMigrator.ensureDatabaseExists(false);

    return await HerbsDB.searchHerbsByPartialName(searchTerm);
  } catch (error) {
    console.error("Database error for suggestions:", error.message);
    return [];
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findHerbByNameSync(herbs, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return herbs.find((herb) => {
    // Check main name
    if (herb.name.toLowerCase() === normalizedSearch) {
      return true;
    }

    // Check alternative names if they exist
    if (herb.alsoCalled && Array.isArray(herb.alsoCalled)) {
      return herb.alsoCalled.some(
        (altName) => altName.toLowerCase() === normalizedSearch,
      );
    }

    return false;
  });
}

function findHerbsByUseSync(herbs, useTerm) {
  const normalizedTerm = useTerm.toLowerCase().trim();

  return herbs.filter((herb) => {
    return (
      herb.ritualUse && herb.ritualUse.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findHerbByName,
  findHerbsByUse,
  getHerbSuggestions,
  findHerbByNameSync,
  findHerbsByUseSync,
};
