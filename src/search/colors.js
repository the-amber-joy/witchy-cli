function getColorsData(colors) {
  return colors && colors.length > 0 ? colors : require("../data/colors.json");
}

async function findColorByName(colors, searchTerm) {
  return findColorByNameSync(getColorsData(colors), searchTerm);
}

async function findColorsByMeaning(colors, meaningTerm) {
  return findColorsByMeaningSync(getColorsData(colors), meaningTerm);
}

async function getColorSuggestions(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return getColorsData().filter((color) =>
    color.name.toLowerCase().includes(normalizedSearch),
  );
}

// Synchronous fallback functions (for backwards compatibility)
function findColorByNameSync(colors, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const match = colors.find((color) => {
    return color.name.toLowerCase() === normalizedSearch;
  });

  return match || null;
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
