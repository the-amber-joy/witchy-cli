// Search for crystal by name or alternative name
function findCrystalByName(crystals, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return crystals.find(crystal => {
        // Check main name
        if (crystal.name.toLowerCase() === normalizedSearch) {
            return true;
        }
        
        // Check alternative names if they exist
        if (crystal.alsoCalled && Array.isArray(crystal.alsoCalled)) {
            return crystal.alsoCalled.some(altName => 
                altName.toLowerCase() === normalizedSearch
            );
        }
        
        return false;
    });
}

// Search for crystals by properties
function findCrystalsByProperty(crystals, propertyTerm) {
    const normalizedTerm = propertyTerm.toLowerCase().trim();
    
    return crystals.filter(crystal => {
        return crystal.properties && crystal.properties.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findCrystalByName, findCrystalsByProperty };