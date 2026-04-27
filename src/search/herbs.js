function getHerbsData(herbs) {
  return herbs && herbs.length > 0 ? herbs : require("../data/herbs.json");
}

async function findHerbByName(herbs, searchTerm) {
  return findHerbByNameSync(getHerbsData(herbs), searchTerm);
}

async function findHerbsByUse(herbs, useTerm) {
  return findHerbsByUseSync(getHerbsData(herbs), useTerm);
}

async function getHerbSuggestions(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return getHerbsData().filter((herb) => {
    if (herb.name.toLowerCase().includes(normalizedSearch)) {
      return true;
    }

    return (
      herb.alsoCalled &&
      Array.isArray(herb.alsoCalled) &&
      herb.alsoCalled.some((altName) =>
        altName.toLowerCase().includes(normalizedSearch),
      )
    );
  });
}

// Synchronous fallback functions (for backwards compatibility)
function findHerbByNameSync(herbs, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const match = herbs.find((herb) => {
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

  return match || null;
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
