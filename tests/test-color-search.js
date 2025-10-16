const colors = require('./src/data/colors.json');
console.log('Colors from JSON: ', colors.length);

const searchTerm = 'amber';
console.log(`Searching for "${searchTerm}"...`);

const found = colors.find(c => 
  c.name.toLowerCase() === searchTerm.toLowerCase() ||
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);

console.log('Search result:', found ? `✅ Found: ${found.name}` : '❌ Not found');
