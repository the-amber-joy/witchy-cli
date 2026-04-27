function getMoonPhaseEmoji(phaseName) {
    const phase = phaseName.toLowerCase();
    
    if (phase.includes('new')) {
        return '🌑';
    } else if (phase.includes('waxing')) {
        return '🌒';
    } else if (phase.includes('full')) {
        return '🌕';
    } else if (phase.includes('waning')) {
        return '🌘';
    } else if (phase.includes('dark')) {
        return '🌚';
    } else {
        return '🌙';
    }
}

module.exports = { getMoonPhaseEmoji };
