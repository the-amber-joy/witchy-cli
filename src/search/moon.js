function getMoonPhasesData(moonPhases) {
  return moonPhases && moonPhases.length > 0
    ? moonPhases
    : require("../data/moon.json");
}

async function findMoonPhaseByName(moonPhases, searchTerm) {
  return findMoonPhaseByNameSync(getMoonPhasesData(moonPhases), searchTerm);
}

async function findMoonPhasesByMeaning(moonPhases, meaningTerm) {
  return findMoonPhasesByMeaningSync(
    getMoonPhasesData(moonPhases),
    meaningTerm,
  );
}

async function getMoonPhaseSuggestions(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return getMoonPhasesData().filter((phase) =>
    phase.phase.toLowerCase().includes(normalizedSearch),
  );
}

// Synchronous fallback functions (for backwards compatibility)
function findMoonPhaseByNameSync(moonPhases, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const match = moonPhases.find((phase) => {
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

  return match || null;
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
