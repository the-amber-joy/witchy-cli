function getMetalsData(metals) {
  return metals && metals.length > 0 ? metals : require("../data/metals.json");
}

async function findMetalByName(metals, searchTerm) {
  return findMetalByNameSync(getMetalsData(metals), searchTerm);
}

async function findMetalsByProperty(metals, propertyTerm) {
  return findMetalsByPropertySync(getMetalsData(metals), propertyTerm);
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
