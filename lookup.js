#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the herbs data
function loadHerbsData() {
    try {
        const herbsPath = path.join(__dirname, 'herbs.json');
        const data = fs.readFileSync(herbsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading herbs.json:', error.message);
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

// Highlight search terms in text
function highlightText(text, searchTerm) {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '\x1b[43m\x1b[30m\x1b[1m$1\x1b[0m'); // Yellow background with black bold text
}

// Escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Display usage instructions
function showUsage() {
    console.log('Usage: node herb-lookup.js <command> <search-term>');
    console.log('\nCommands:');
    console.log('  herb <name>    - Look up an herb by name or alternative name');
    console.log('  use <term>     - Find herbs that contain a specific term in their ritual use');
    console.log('\nExamples:');
    console.log('  node herb-lookup.js herb "acacia"');
    console.log('  node herb-lookup.js herb "wolfsbane"');
    console.log('  node herb-lookup.js use "protection"');
    console.log('  node herb-lookup.js use "love"');
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        showUsage();
        process.exit(1);
    }
    
    const command = args[0].toLowerCase();
    const searchTerm = args.slice(1).join(' ');
    const herbs = loadHerbsData();
    
    if (command === 'herb') {
        const foundHerb = findHerbByName(herbs, searchTerm);
        
        if (foundHerb) {
            // Highlight the search term in the herb name
            const highlightedName = highlightText(foundHerb.name, searchTerm);
            console.log(`\n🌿 ${highlightedName}`);
            
            if (foundHerb.alsoCalled && foundHerb.alsoCalled.length > 0) {
                // Highlight search term in alternative names too
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
            
            // Suggest similar herbs
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
        
    } else if (command === 'use') {
        const matchingHerbs = findHerbsByUse(herbs, searchTerm);
        
        if (matchingHerbs.length > 0) {
            console.log(`\n🔍 Found ${matchingHerbs.length} herb(s) with ritual uses containing "\x1b[33m\x1b[1m${searchTerm}\x1b[0m":\n`);
            
            matchingHerbs.forEach((herb) => {
                console.log(`🌿 ${herb.name}`);
                if (herb.alsoCalled && herb.alsoCalled.length > 0) {
                    console.log(`   Also called: ${herb.alsoCalled.join(', ')}`);
                }
                // Highlight the search term in the ritual use description
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
        console.log(`❌ Unknown command: "${command}"`);
        console.log('Available commands: herb, use\n');
        showUsage();
    }
}

// Run the program
main();