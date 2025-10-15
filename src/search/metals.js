const { MetalsDB } = require("../database/metals");

// Search for metal by name (database version)
async function findMetalByName(metals, searchTerm) {
  try {
    return await MetalsDB.findMetalByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findMetalByNameSync(metals, searchTerm);
  }
}

// Search for metals by properties (database version)
async function findMetalsByProperty(metals, propertyTerm) {
  try {
    return await MetalsDB.findMetalsByProperty(propertyTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    return findMetalsByPropertySync(metals, propertyTerm);
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findMetalByNameSync(metals, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return metals.find((metal) => {
    return metal.name.toLowerCase() === normalizedSearch;
  });
}

function findMetalsByPropertySync(metals, propertyTerm) {
  const normalizedTerm = propertyTerm.toLowerCase().trim();

  return metals.filter((metal) => {
    return (
      metal.properties &&
      metal.properties.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findMetalByName,
  findMetalsByProperty,
  findMetalByNameSync,
  findMetalsByPropertySync,
};
