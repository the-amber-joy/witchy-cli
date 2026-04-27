function getCrystalsData(crystals) {
  return crystals && crystals.length > 0
    ? crystals
    : require("../data/crystals.json");
}

async function findCrystalByName(crystals, searchTerm) {
  return findCrystalByNameSync(getCrystalsData(crystals), searchTerm);
}

async function findCrystalsByProperty(crystals, propertyTerm) {
  return findCrystalsByPropertySync(getCrystalsData(crystals), propertyTerm);
}

async function getCrystalSuggestions(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return getCrystalsData().filter((crystal) => {
    if (crystal.name.toLowerCase().includes(normalizedSearch)) {
      return true;
    }

    return (
      crystal.alsoCalled &&
      Array.isArray(crystal.alsoCalled) &&
      crystal.alsoCalled.some((altName) =>
        altName.toLowerCase().includes(normalizedSearch),
      )
    );
  });
}

// Synchronous fallback functions (for backwards compatibility)
function findCrystalByNameSync(crystals, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const match = crystals.find((crystal) => {
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

  return match || null;
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
