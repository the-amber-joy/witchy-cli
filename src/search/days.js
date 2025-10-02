// Find day by name
function findDayByName(days, dayName) {
    const normalizedDayName = dayName.toLowerCase().trim();
    
    return days.filter(day => {
        return day.name && day.name.toLowerCase().includes(normalizedDayName);
    });
}

// Find days by intent
function findDaysByIntent(days, intentTerm) {
    const normalizedTerm = intentTerm.toLowerCase().trim();
    
    return days.filter(day => {
        return day.intent && day.intent.toLowerCase().includes(normalizedTerm);
    });
}

module.exports = { findDayByName, findDaysByIntent };