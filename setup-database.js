#!/usr/bin/env node

/**
 * Setup script for migrating herbs data to SQLite database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔮 Setting up SQLite database for Witchy Lookup...\n');

try {
  // Install sqlite3 dependency
  console.log('📦 Installing SQLite dependency...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  // Run the migration
  console.log('\n🌿 Migrating herbs data to database...');
  const migratePath = path.join(__dirname, 'src', 'database', 'migrate.js');
  execSync(`node "${migratePath}"`, { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n✨ Database setup complete!');
  console.log('🔮 You can now use the witchy lookup tool with database-powered herb searches.');
  console.log('\nTry running:');
  console.log('  node lookup.js herb rosemary');
  console.log('  node lookup.js herb use protection');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}