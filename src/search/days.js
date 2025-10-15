const { DaysDB } = require("../database/days");

// Find day by name (database version)
async function findDayByName(days, dayName) {
  try {
    return await DaysDB.findDayByName(dayName);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findDayByNameSync(days, dayName);
  }
}

// Find days by intent (database version)
async function findDaysByIntent(days, intentTerm) {
  try {
    return await DaysDB.findDaysByIntent(intentTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findDaysByIntentSync(days, intentTerm);
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findDayByNameSync(days, dayName) {
  const normalizedDayName = dayName.toLowerCase().trim();

  return days.filter((day) => {
    return day.name && day.name.toLowerCase().includes(normalizedDayName);
  });
}

function findDaysByIntentSync(days, intentTerm) {
  const normalizedTerm = intentTerm.toLowerCase().trim();

  return days.filter((day) => {
    return day.intent && day.intent.toLowerCase().includes(normalizedTerm);
  });
}

module.exports = {
  findDayByName,
  findDaysByIntent,
  findDayByNameSync,
  findDaysByIntentSync,
};
