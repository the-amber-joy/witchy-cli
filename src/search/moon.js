const { MoonDB } = require("../database/moon");

// Search for moon phase by name (database version)
async function findMoonPhaseByName(moonPhases, searchTerm) {
  try {
    return await MoonDB.findMoonPhaseByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findMoonPhaseByNameSync(moonPhases, searchTerm);
  }
}

// Search for moon phases by meaning (database version)
async function findMoonPhasesByMeaning(moonPhases, meaningTerm) {
  try {
    return await MoonDB.findMoonPhasesByMeaning(meaningTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findMoonPhasesByMeaningSync(moonPhases, meaningTerm);
  }
}

// Get moon phase suggestions for partial matches
async function getMoonPhaseSuggestions(searchTerm) {
  try {
    return await MoonDB.searchMoonPhasesByPartialName(searchTerm);
  } catch (error) {
    console.error("Database error for suggestions:", error.message);
    return [];
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findMoonPhaseByNameSync(moonPhases, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return moonPhases.find((phase) => {
    const phaseName = phase.phase.toLowerCase();

    // Exact match first
    if (phaseName === normalizedSearch) {
      return true;
    }

    // Allow partial matches for common phase names
    if (normalizedSearch === "new" && phaseName.includes("new")) {
      return true;
    }
    if (normalizedSearch === "full" && phaseName.includes("full")) {
      return true;
    }
    if (normalizedSearch === "waxing" && phaseName.includes("waxing")) {
      return true;
    }
    if (normalizedSearch === "waning" && phaseName.includes("waning")) {
      return true;
    }
    if (normalizedSearch === "dark" && phaseName.includes("dark")) {
      return true;
    }

    return false;
  });
}

function findMoonPhasesByMeaningSync(moonPhases, meaningTerm) {
  const normalizedTerm = meaningTerm.toLowerCase().trim();

  return moonPhases.filter((phase) => {
    return (
      phase.meaning && phase.meaning.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findMoonPhaseByName,
  findMoonPhasesByMeaning,
  getMoonPhaseSuggestions,
  findMoonPhaseByNameSync,
  findMoonPhasesByMeaningSync,
};
