// Search for metal by name
function findMetalByName(metals, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return metals.find(metal => {
        return metal.name.toLowerCase() === normalizedSearch;
    });
}

// Search for metals by properties
function findMetalsByProperty(metals, propertyTerm) {
    const normalizedTerm = propertyTerm.toLowerCase().trim();
    
    return metals.filter(metal => {
        return metal.properties && metal.properties.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findMetalByName, findMetalsByProperty };