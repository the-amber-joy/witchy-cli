// Search for moon phase by name
function findMoonPhaseByName(moonPhases, searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return moonPhases.find(phase => {
        const phaseName = phase.phase.toLowerCase();
        
        // Exact match first
        if (phaseName === normalizedSearch) {
            return true;
        }
        
        // Allow partial matches for common phase names
        if (normalizedSearch === 'new' && phaseName.includes('new')) {
            return true;
        }
        if (normalizedSearch === 'full' && phaseName.includes('full')) {
            return true;
        }
        if (normalizedSearch === 'waxing' && phaseName.includes('waxing')) {
            return true;
        }
        if (normalizedSearch === 'waning' && phaseName.includes('waning')) {
            return true;
        }
        if (normalizedSearch === 'dark' && phaseName.includes('dark')) {
            return true;
        }
        
        return false;
    });
}

// Search for moon phases by meaning
function findMoonPhasesByMeaning(moonPhases, meaningTerm) {
    const normalizedTerm = meaningTerm.toLowerCase().trim();
    
    return moonPhases.filter(phase => {
        return phase.meaning && phase.meaning.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findMoonPhaseByName, findMoonPhasesByMeaning };