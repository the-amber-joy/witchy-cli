#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the herbs, crystals, colors, moon phases, metals, and days data
function loadData() {
    try {
        const herbsPath = path.join(__dirname, 'json', 'herbs.json');
        const crystalsPath = path.join(__dirname, 'json', 'crystals.json');
        const colorsPath = path.join(__dirname, 'json', 'colors.json');
        const moonPath = path.join(__dirname, 'json', 'moon.json');
        const metalsPath = path.join(__dirname, 'json', 'metals.json');
        const daysPath = path.join(__dirname, 'json', 'days.json');
        
        const herbsData = JSON.parse(fs.readFileSync(herbsPath, 'utf8'));
        const crystalsData = JSON.parse(fs.readFileSync(crystalsPath, 'utf8'));
        const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        const moonData = JSON.parse(fs.readFileSync(moonPath, 'utf8'));
        const metalsData = JSON.parse(fs.readFileSync(metalsPath, 'utf8'));
        const daysData = JSON.parse(fs.readFileSync(daysPath, 'utf8'));
        
        return { herbs: herbsData, crystals: crystalsData, colors: colorsData, moon: moonData, metals: metalsData, days: daysData };
    } catch (error) {
        console.error('Error loading data files:', error.message);
        process.exit(1);
    }
}

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

// Display usage instructions
function showUsage() {
    console.log('✨ Witchy Lookup Tool - Your magical reference companion! ✨\n');
    console.log('Usage: witchy <type> [command] <search-term>\n');
    
    console.log('🔮 Available Lookup Types:');
    console.log('  🌿 herbs    - Discover magical plants and their ritual uses');
    console.log('  💎 crystals - Explore gemstones and their mystical properties');
    console.log('  🎨 colors   - Learn about color magic and meanings');
    console.log('  🌙 moon     - Find moon phases perfect for your spellwork');
    console.log('  🪨 metals   - Understand metallic energies and correspondences');
    console.log('  📅 days     - Discover which days are best for specific magical work\n');
    
    console.log('📖 How to Use:');
    console.log('  <type> <name>      - Look up by name');
    console.log('  <type> use <term>  - Search by magical use/property\n');
    
    console.log('✨ Examples:');
    console.log('  witchy herb rosemary');
    console.log('  witchy crystal use protection');
    console.log('  witchy day monday');
    console.log('  witchy moon use banishing');
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        showUsage();
        process.exit(1);
    }
    
    const type = args[0].toLowerCase();
    const data = loadData();
    const { herbs, crystals, colors, moon, metals, days } = data;
    
    // Handle herb commands
    if (type === 'herb') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // herb use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingHerbs = findHerbsByUse(herbs, searchTerm);
            
            if (matchingHerbs.length > 0) {
                console.log(`\n🔍 Found ${matchingHerbs.length} herb(s) with ritual uses containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingHerbs.forEach((herb) => {
                    console.log(`🌿 ${herb.name}`);
                    if (herb.alsoCalled && herb.alsoCalled.length > 0) {
                        console.log(`   Also called: ${herb.alsoCalled.join(', ')}`);
                    }
                    const highlightedUse = highlightText(herb.ritualUse, searchTerm);
                    console.log(`   📜 ${highlightedUse}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No herbs found with ritual uses containing "${searchTerm}".`);
                console.log('\nTry searching for common ritual use terms like:');
                console.log('   • protection');
                console.log('   • love');
                console.log('   • healing');
                console.log('   • prosperity');
                console.log('   • purification');
                console.log('   • banishing');
                console.log('   • divination');
                console.log();
            }
        } else {
            // herb <name>
            const searchTerm = args.slice(1).join(' ');
            const foundHerb = findHerbByName(herbs, searchTerm);
            
            if (foundHerb) {
                const highlightedName = highlightText(foundHerb.name, searchTerm);
                console.log(`\n🌿 ${highlightedName}`);
                
                if (foundHerb.alsoCalled && foundHerb.alsoCalled.length > 0) {
                    const highlightedAlsoNames = foundHerb.alsoCalled.map(name => 
                        highlightText(name, searchTerm)
                    );
                    console.log(`   Also called: ${highlightedAlsoNames.join(', ')}`);
                }
                console.log(`\n📜 Ritual Use:`);
                console.log(`   ${foundHerb.ritualUse}\n`);
            } else {
                console.log(`❌ Herb "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with alternative names or check spelling.');
                
                // Check if this might work as a "use" search
                const useSearchSuggestions = suggestUseSearch('herb', searchTerm, data);
                if (useSearchSuggestions.length > 0) {
                    console.log(useSearchSuggestions[0]);
                }
                
                const suggestions = herbs.filter(herb => 
                    herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (herb.alsoCalled && herb.alsoCalled.some(alt => 
                        alt.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(herb => {
                        console.log(`   • ${herb.name}`);
                    });
                }
                console.log();
            }
        }
    
    // Handle crystal commands
    } else if (type === 'crystal') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // crystal use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingCrystals = findCrystalsByProperty(crystals, searchTerm);
            
            if (matchingCrystals.length > 0) {
                console.log(`\n🔍 Found ${matchingCrystals.length} crystal(s) with properties containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingCrystals.forEach((crystal) => {
                    console.log(`💎 ${crystal.name}`);
                    if (crystal.alsoCalled && crystal.alsoCalled.length > 0) {
                        console.log(`   Also called: ${crystal.alsoCalled.join(', ')}`);
                    }
                    const highlightedProperties = highlightText(crystal.properties, searchTerm);
                    console.log(`   ✨ ${highlightedProperties}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No crystals found with properties containing "${searchTerm}".`);
                console.log('\nTry searching for common crystal properties like:');
                console.log('   • healing');
                console.log('   • protection');
                console.log('   • love');
                console.log('   • abundance');
                console.log('   • clarity');
                console.log('   • grounding');
                console.log('   • meditation');
                console.log();
            }
        } else {
            // crystal <name>
            const searchTerm = args.slice(1).join(' ');
            const foundCrystal = findCrystalByName(crystals, searchTerm);
            
            if (foundCrystal) {
                const highlightedName = highlightText(foundCrystal.name, searchTerm);
                console.log(`\n💎 ${highlightedName}`);
                
                if (foundCrystal.alsoCalled && foundCrystal.alsoCalled.length > 0) {
                    const highlightedAlsoNames = foundCrystal.alsoCalled.map(name => 
                        highlightText(name, searchTerm)
                    );
                    console.log(`   Also called: ${highlightedAlsoNames.join(', ')}`);
                }
                console.log(`\n✨ Properties:`);
                console.log(`   ${foundCrystal.properties}\n`);
            } else {
                console.log(`❌ Crystal "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with alternative names or check spelling.');
                
                // Check if this might work as a "use" search
                const useSearchSuggestions = suggestUseSearch('crystal', searchTerm, data);
                if (useSearchSuggestions.length > 0) {
                    console.log(useSearchSuggestions[0]);
                }
                
                const suggestions = crystals.filter(crystal => 
                    crystal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (crystal.alsoCalled && crystal.alsoCalled.some(alt => 
                        alt.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(crystal => {
                        console.log(`   • ${crystal.name}`);
                    });
                }
                console.log();
            }
        }
    
    // Handle color commands
    } else if (type === 'color') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // color use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingColors = findColorsByMeaning(colors, searchTerm);
            
            if (matchingColors.length > 0) {
                console.log(`\n🔍 Found ${matchingColors.length} color(s) with meanings containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingColors.forEach((color) => {
                    const colorCode = getColorCode(color.name);
                    console.log(`🎨 ${colorCode}${color.name}\x1b[0m`);
                    const highlightedMeaning = highlightText(color.meanings, searchTerm);
                    console.log(`   🔮 ${highlightedMeaning}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No colors found with meanings containing "${searchTerm}".`);
                console.log('\nTry searching for common color meanings like:');
                console.log('   • love');
                console.log('   • protection');
                console.log('   • healing');
                console.log('   • abundance');
                console.log('   • purification');
                console.log('   • passion');
                console.log('   • wisdom');
                console.log();
            }
        } else {
            // color <name>
            const searchTerm = args.slice(1).join(' ');
            const foundColor = findColorByName(colors, searchTerm);
            
            if (foundColor) {
                const colorCode = getColorCode(foundColor.name);
                const highlightedName = highlightText(foundColor.name, searchTerm, false);
                console.log(`\n🎨 ${colorCode}${highlightedName}\x1b[0m`);
                console.log(`\n🔮 Meanings:`);
                console.log(`   ${foundColor.meanings}\n`);
            } else {
                console.log(`❌ Color "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with exact color names or check spelling.');
                
                const suggestions = colors.filter(color => 
                    color.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(color => {
                        const colorCode = getColorCode(color.name);
                        console.log(`   • ${colorCode}${color.name}\x1b[0m`);
                    });
                }
                console.log();
            }
        }
    
    // Handle moon phase commands
    } else if (type === 'moon') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // moon use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingPhases = findMoonPhasesByMeaning(moon, searchTerm);
            
            if (matchingPhases.length > 0) {
                console.log(`\n🔍 Found ${matchingPhases.length} moon phase(s) with meanings containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingPhases.forEach((phase) => {
                    const phaseEmoji = getMoonPhaseEmoji(phase.phase);
                    console.log(`${phaseEmoji} ${phase.phase}`);
                    const highlightedMeaning = highlightText(phase.meaning, searchTerm);
                    console.log(`   ✨ ${highlightedMeaning}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No moon phases found with meanings containing "${searchTerm}".`);
                console.log('\nTry searching for common lunar magic terms like:');
                console.log('   • new beginnings');
                console.log('   • banishing');
                console.log('   • growth');
                console.log('   • manifestation');
                console.log('   • release');
                console.log('   • protection');
                console.log('   • introspection');
                console.log();
            }
        } else {
            // moon <phase>
            const searchTerm = args.slice(1).join(' ');
            const foundPhase = findMoonPhaseByName(moon, searchTerm);
            
            if (foundPhase) {
                const phaseEmoji = getMoonPhaseEmoji(foundPhase.phase);
                const highlightedName = highlightText(foundPhase.phase, searchTerm);
                console.log(`\n${phaseEmoji} ${highlightedName}`);
                console.log(`\n✨ Meaning:`);
                console.log(`   ${foundPhase.meaning}\n`);
            } else {
                console.log(`❌ Moon phase "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with exact phase names or check spelling.');
                
                const suggestions = moon.filter(phase => 
                    phase.phase.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(phase => {
                        const phaseEmoji = getMoonPhaseEmoji(phase.phase);
                        console.log(`   ${phaseEmoji} ${phase.phase}`);
                    });
                }
                console.log();
            }
        }
    
    // Handle metal commands
    } else if (type === 'metal') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // metal use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingMetals = findMetalsByProperty(metals, searchTerm);
            
            if (matchingMetals.length > 0) {
                console.log(`\n🔍 Found ${matchingMetals.length} metal(s) with properties containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingMetals.forEach((metal) => {
                    console.log(`🪨 ${metal.name}`);
                    const highlightedProperties = highlightText(metal.properties, searchTerm);
                    console.log(`   ✨ ${highlightedProperties}`);
                    console.log('');
                });
            } else {
                console.log(`❌ No metals found with properties containing "${searchTerm}".`);
                console.log('\nTry searching for common metal properties like:');
                console.log('   • protection');
                console.log('   • prosperity');
                console.log('   • healing');
                console.log('   • strength');
                console.log('   • abundance');
                console.log('   • energy');
                console.log('   • wisdom');
                console.log();
            }
        } else {
            // metal <name>
            const searchTerm = args.slice(1).join(' ');
            const foundMetal = findMetalByName(metals, searchTerm);
            
            if (foundMetal) {
                const highlightedName = highlightText(foundMetal.name, searchTerm);
                console.log(`\n🪨 ${highlightedName}`);
                console.log(`\n✨ Properties:`);
                console.log(`   ${foundMetal.properties}\n`);
            } else {
                console.log(`❌ Metal "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with exact metal names or check spelling.');
                
                const suggestions = metals.filter(metal => 
                    metal.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(metal => {
                        console.log(`   • ${metal.name}`);
                    });
                }
                console.log();
            }
        }
    
    // Handle day commands
    } else if (type === 'day') {
        if (args.length >= 3 && args[1].toLowerCase() === 'use') {
            // day use <term>
            const searchTerm = args.slice(2).join(' ');
            const matchingDays = findDaysByIntent(days, searchTerm);
            
            if (matchingDays.length > 0) {
                console.log(`\n🔍 Found ${matchingDays.length} day(s) with intents containing "\x1b[43m\x1b[30m\x1b[1m${searchTerm}\x1b[0m":\n`);
                
                matchingDays.forEach((day) => {
                    console.log(`📅 ${day.name}`);
                    if (day.planet) {
                        console.log(`   🪐 Planet: ${day.planet}`);
                    }
                    const highlightedIntent = highlightText(day.intent, searchTerm);
                    console.log(`   🎯 Intent: ${highlightedIntent}`);
                    if (day.colors) {
                        console.log(`   🎨 Colors: ${day.colors}`);
                    }
                    if (day.deities) {
                        console.log(`   ⚡ Deities: ${day.deities}`);
                    }
                    console.log('');
                });
            } else {
                console.log(`❌ No days found with intents containing "${searchTerm}".`);
                console.log('\nTry searching for common magical intents like:');
                console.log('   • healing');
                console.log('   • protection');
                console.log('   • success');
                console.log('   • communication');
                console.log('   • love');
                console.log();
            }
        } else {
            // day <name>
            const searchTerm = args.slice(1).join(' ');
            const foundDays = findDayByName(days, searchTerm);
            
            if (foundDays.length > 0) {
                foundDays.forEach((day) => {
                    const highlightedName = highlightText(day.name, searchTerm);
                    console.log(`\n📅 ${highlightedName}`);
                    if (day.planet) {
                        console.log(`\n🪐 Planet: ${day.planet}`);
                    }
                    console.log(`🎯 Intent: ${day.intent}`);
                    if (day.colors) {
                        console.log(`🎨 Colors: ${day.colors}`);
                    }
                    if (day.deities) {
                        console.log(`⚡ Deities: ${day.deities}`);
                    }
                    console.log('');
                });
            } else {
                console.log(`❌ Day "${searchTerm}" not found.`);
                console.log('\nTip: Try searching with exact day names like "Monday", "Tuesday", etc.');
                
                const suggestions = days.filter(day => 
                    day.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 3);
                
                if (suggestions.length > 0) {
                    console.log('\nDid you mean one of these?');
                    suggestions.forEach(day => {
                        console.log(`   • ${day.name}`);
                    });
                }
                console.log();
            }
        }
    
    } else {
        console.log(`❌ Unknown type: "${type}"`);
        console.log('Available types: herb, crystal, color, moon, metal, day\n');
        showUsage();
    }
}

// Run the program
main();