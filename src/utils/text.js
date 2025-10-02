// Highlight search terms in text
function highlightText(text, searchTerm, useBackgroundHighlight = true) {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    if (useBackgroundHighlight) {
        return text.replace(regex, '\x1b[43m\x1b[30m\x1b[1m$1\x1b[0m'); // Yellow background with black bold text
    } else {
        return text.replace(regex, '\x1b[1m\x1b[4m$1\x1b[0m'); // Bold and underlined text only
    }
}

// Escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { highlightText, escapeRegex };