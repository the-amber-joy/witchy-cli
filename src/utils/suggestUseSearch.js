// Import search functions for suggestions
const { findHerbsByUse } = require('../search/herbs');
const { findCrystalsByProperty } = require('../search/crystals');
const { findColorsByMeaning } = require('../search/colors');
const { findMoonPhasesByMeaning } = require('../search/moon');
const { findMetalsByProperty } = require('../search/metals');
const { findDaysByIntent } = require('../search/days');

// Check if search term might work better as a "use" search
function suggestUseSearch(type, searchTerm, data) {
    const suggestions = [];
    
    switch(type) {
        case 'herb':
            const herbMatches = findHerbsByUse(data.herbs, searchTerm);
            if (herbMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy herb use ${searchTerm}`);
            }
            break;
        case 'crystal':
            const crystalMatches = findCrystalsByProperty(data.crystals, searchTerm);
            if (crystalMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy crystal use ${searchTerm}`);
            }
            break;
        case 'color':
            const colorMatches = findColorsByMeaning(data.colors, searchTerm);
            if (colorMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy color use ${searchTerm}`);
            }
            break;
        case 'moon':
            const moonMatches = findMoonPhasesByMeaning(data.moon, searchTerm);
            if (moonMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy moon use ${searchTerm}`);
            }
            break;
        case 'metal':
            const metalMatches = findMetalsByProperty(data.metals, searchTerm);
            if (metalMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy metal use ${searchTerm}`);
            }
            break;
        case 'day':
            const dayMatches = findDaysByIntent(data.days, searchTerm);
            if (dayMatches.length > 0) {
                suggestions.push(`💡 Did you mean: witchy day use ${searchTerm}`);
            }
            break;
    }
    
    return suggestions;
}

module.exports = { suggestUseSearch };