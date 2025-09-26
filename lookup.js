#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the herbs, crystals, and colors data
function loadData() {
    try {
        const herbsPath = path.join(__dirname, 'herbs.json');
        const crystalsPath = path.join(__dirname, 'crystals.json');
        const colorsPath = path.join(__dirname, 'colors.json');
        
        const herbsData = JSON.parse(fs.readFileSync(herbsPath, 'utf8'));
        const crystalsData = JSON.parse(fs.readFileSync(crystalsPath, 'utf8'));
        const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        
        return { herbs: herbsData, crystals: crystalsData, colors: colorsData };
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
        'grey': '\x1b[90m\x1b[1m',            // bright black (gray)
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
    console.log('Usage: node lookup.js <type> [command] <search-term>');
    console.log('\nCommands:');
    console.log('  herb <name>        - Look up an herb by name or alternative name');
    console.log('  herb use <term>    - Find herbs that contain a specific term in their ritual use');
    console.log('  crystal <name>     - Look up a crystal by name or alternative name');
    console.log('  crystal use <term> - Find crystals that contain a specific term in their properties');
    console.log('  color <name>       - Look up a color by name');
    console.log('  color use <term>   - Find colors that contain a specific term in their meaning');
    console.log('\nExamples:');
    console.log('  node lookup.js herb acacia');
    console.log('  node lookup.js herb use protection');
    console.log('  node lookup.js crystal amethyst');
    console.log('  node lookup.js crystal use healing');
    console.log('  node lookup.js color red');
    console.log('  node lookup.js color use love');
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
    const { herbs, crystals, colors } = data;
    
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
    
    } else {
        console.log(`❌ Unknown type: "${type}"`);
        console.log('Available types: herb, crystal, color\n');
        showUsage();
    }
}

// Run the program
main();