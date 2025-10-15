const fs = require('fs');
const path = require('path');
const { HerbsDB } = require('../database/herbs');

// Load the herbs, crystals, colors, moon phases, metals, and days data
async function loadData() {
    try {
        // Go up two directories from src/data/ to get to project root
        const projectRoot = path.join(__dirname, '..', '..');
        
        // Load herbs from database
        const herbsData = await HerbsDB.getAllHerbs();
        
        // Load other data from JSON files
        const crystalsPath = path.join(projectRoot, 'json', 'crystals.json');
        const colorsPath = path.join(projectRoot, 'json', 'colors.json');
        const moonPath = path.join(projectRoot, 'json', 'moon.json');
        const metalsPath = path.join(projectRoot, 'json', 'metals.json');
        const daysPath = path.join(projectRoot, 'json', 'days.json');
        
        const crystalsData = JSON.parse(fs.readFileSync(crystalsPath, 'utf8'));
        const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        const moonData = JSON.parse(fs.readFileSync(moonPath, 'utf8'));
        const metalsData = JSON.parse(fs.readFileSync(metalsPath, 'utf8'));
        const daysData = JSON.parse(fs.readFileSync(daysPath, 'utf8'));
        
        return { 
            herbs: herbsData, 
            crystals: crystalsData, 
            colors: colorsData, 
            moon: moonData, 
            metals: metalsData, 
            days: daysData 
        };
    } catch (error) {
        console.error('Error loading data:', error.message);
        process.exit(1);
    }
}

// Load data synchronously for backwards compatibility (falls back to JSON)
function loadDataSync() {
    try {
        const projectRoot = path.join(__dirname, '..', '..');
        
        const herbsPath = path.join(projectRoot, 'json', 'herbs.json');
        const crystalsPath = path.join(projectRoot, 'json', 'crystals.json');
        const colorsPath = path.join(projectRoot, 'json', 'colors.json');
        const moonPath = path.join(projectRoot, 'json', 'moon.json');
        const metalsPath = path.join(projectRoot, 'json', 'metals.json');
        const daysPath = path.join(projectRoot, 'json', 'days.json');
        
        const herbsData = JSON.parse(fs.readFileSync(herbsPath, 'utf8'));
        const crystalsData = JSON.parse(fs.readFileSync(crystalsPath, 'utf8'));
        const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
        const moonData = JSON.parse(fs.readFileSync(moonPath, 'utf8'));
        const metalsData = JSON.parse(fs.readFileSync(metalsPath, 'utf8'));
        const daysData = JSON.parse(fs.readFileSync(daysPath, 'utf8'));
        
        return { 
            herbs: herbsData, 
            crystals: crystalsData, 
            colors: colorsData, 
            moon: moonData, 
            metals: metalsData, 
            days: daysData 
        };
    } catch (error) {
        console.error('Error loading data files:', error.message);
        process.exit(1);
    }
}

module.exports = { loadData, loadDataSync };