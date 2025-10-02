// Get appropriate emoji for moon phase
function getMoonPhaseEmoji(phaseName) {
    const phase = phaseName.toLowerCase();
    
    if (phase.includes('new')) {
        return '🌑'; // New moon - dark circle
    } else if (phase.includes('waxing')) {
        return '🌒'; // Waxing crescent
    } else if (phase.includes('full')) {
        return '🌕'; // Full moon - bright circle
    } else if (phase.includes('waning')) {
        return '🌘'; // Waning crescent
    } else if (phase.includes('dark')) {
        return '🌚'; // Dark moon face
    } else {
        return '🌙'; // Generic crescent moon as fallback
    }
}

// Get ANSI color code for a color name
function getColorCode(colorName) {
    const colorMap = {
        'amber': '\x1b[38;5;214m\x1b[1m',      // amber (256-color)
        'black': '\x1b[90m\x1b[1m',           // bright black (gray, since pure black wouldn't show)
        'blue': '\x1b[34m\x1b[1m',            // bright blue
        'brown': '\x1b[38;5;130m\x1b[1m',     // brown (256-color)
        'copper': '\x1b[38;5;166m\x1b[1m',    // copper (256-color)
        'gold': '\x1b[38;5;220m\x1b[1m',      // gold (256-color)
        'green': '\x1b[32m\x1b[1m',           // bright green
        'gray': '\x1b[90m\x1b[1m',            // bright black (gray)
        'indigo': '\x1b[38;5;54m\x1b[1m',     // indigo (256-color)
        'lavender': '\x1b[38;5;183m\x1b[1m',  // lavender (256-color)
        'light blue': '\x1b[94m\x1b[1m',      // bright cyan/light blue
        'orange': '\x1b[38;5;208m\x1b[1m',    // bright orange (256-color)
        'peach': '\x1b[38;5;216m\x1b[1m',     // peach (256-color)
        'pink': '\x1b[38;5;206m\x1b[1m',      // pink (256-color)
        'purple': '\x1b[35m\x1b[1m',          // bright magenta
        'red': '\x1b[31m\x1b[1m',             // bright red
        'silver': '\x1b[37m\x1b[1m',          // bright white
        'turquoise': '\x1b[38;5;80m\x1b[1m',  // turquoise (256-color)
        'violet': '\x1b[38;5;129m\x1b[1m',    // violet (256-color)
        'white': '\x1b[97m\x1b[1m',           // bright white
        'yellow': '\x1b[33m\x1b[1m'           // bright yellow
    };
    
    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || '\x1b[1m'; // default to just bold if color not found
}

module.exports = { getMoonPhaseEmoji, getColorCode };