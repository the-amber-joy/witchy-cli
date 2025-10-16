const { ColorsDB } = require("../database/colors");

// Search for color by name (database version)
async function findColorByName(colors, searchTerm) {
  try {
    return await ColorsDB.findColorByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // If colors array is empty, load from JSON file
    if (!colors || colors.length === 0) {
      colors = require("../data/colors.json");
    }
    return findColorByNameSync(colors, searchTerm);
  }
}

// Search for colors by meanings (database version)
async function findColorsByMeaning(colors, meaningTerm) {
  try {
    return await ColorsDB.findColorsByMeaning(meaningTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // If colors array is empty, load from JSON file
    if (!colors || colors.length === 0) {
      colors = require("../data/colors.json");
    }
    return findColorsByMeaningSync(colors, meaningTerm);
  }
}

// Get color suggestions for partial matches
async function getColorSuggestions(searchTerm) {
  try {
    return await ColorsDB.searchColorsByPartialName(searchTerm);
  } catch (error) {
    console.error("Database error for suggestions:", error.message);
    return [];
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findColorByNameSync(colors, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return colors.find((color) => {
    return color.name.toLowerCase() === normalizedSearch;
  });
}

function findColorsByMeaningSync(colors, meaningTerm) {
  const normalizedTerm = meaningTerm.toLowerCase().trim();

  return colors.filter((color) => {
    return (
      color.meanings && color.meanings.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findColorByName,
  findColorsByMeaning,
  getColorSuggestions,
  findColorByNameSync,
  findColorsByMeaningSync,
};
