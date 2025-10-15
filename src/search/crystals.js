const { CrystalsDB } = require("../database/crystals");

// Search for crystal by name or alternative name (database version)
async function findCrystalByName(crystals, searchTerm) {
  try {
    return await CrystalsDB.findCrystalByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findCrystalByNameSync(crystals, searchTerm);
  }
}

// Search for crystals by properties (database version)
async function findCrystalsByProperty(crystals, propertyTerm) {
  try {
    return await CrystalsDB.findCrystalsByProperty(propertyTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findCrystalsByPropertySync(crystals, propertyTerm);
  }
}

// Get crystal suggestions for partial matches
async function getCrystalSuggestions(searchTerm) {
  try {
    return await CrystalsDB.searchCrystalsByPartialName(searchTerm);
  } catch (error) {
    console.error("Database error for suggestions:", error.message);
    return [];
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findCrystalByNameSync(crystals, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return crystals.find((crystal) => {
    // Check main name
    if (crystal.name.toLowerCase() === normalizedSearch) {
      return true;
    }

    // Check alternative names if they exist
    if (crystal.alsoCalled && Array.isArray(crystal.alsoCalled)) {
      return crystal.alsoCalled.some(
        (altName) => altName.toLowerCase() === normalizedSearch,
      );
    }

    return false;
  });
}

function findCrystalsByPropertySync(crystals, propertyTerm) {
  const normalizedTerm = propertyTerm.toLowerCase().trim();

  return crystals.filter((crystal) => {
    return (
      crystal.properties &&
      crystal.properties.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findCrystalByName,
  findCrystalsByProperty,
  getCrystalSuggestions,
  findCrystalByNameSync,
  findCrystalsByPropertySync,
};
