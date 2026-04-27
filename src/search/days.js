function getDaysData(days) {
  return days && days.length > 0 ? days : require("../data/days.json");
}

async function findDayByName(days, dayName) {
  return findDayByNameSync(getDaysData(days), dayName);
}

async function findDaysByIntent(days, intentTerm) {
  return findDaysByIntentSync(getDaysData(days), intentTerm);
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
