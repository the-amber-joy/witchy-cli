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

module.exports = { showUsage };