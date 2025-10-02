// Search for herb by name or alternative name
function findHerbByName(herbs, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return herbs.find(herb => {
        // Check main name
        if (herb.name.toLowerCase() === normalizedSearch) {
            return true;
        }
        
        // Check alternative names if they exist
        if (herb.alsoCalled && Array.isArray(herb.alsoCalled)) {
            return herb.alsoCalled.some(altName => 
                altName.toLowerCase() === normalizedSearch
            );
        }
        
        return false;
    });
}

// Search for herbs by ritual use
function findHerbsByUse(herbs, useTerm) {
    const normalizedTerm = useTerm.toLowerCase().trim();
    
    return herbs.filter(herb => {
        return herb.ritualUse && herb.ritualUse.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findHerbByName, findHerbsByUse };