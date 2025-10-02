// Search for color by name
function findColorByName(colors, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return colors.find(color => {
        return color.name.toLowerCase() === normalizedSearch;
    });
}

// Search for colors by meaning
function findColorsByMeaning(colors, meaningTerm) {
    const normalizedTerm = meaningTerm.toLowerCase().trim();
    
    return colors.filter(color => {
        return color.meanings && color.meanings.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findColorByName, findColorsByMeaning };