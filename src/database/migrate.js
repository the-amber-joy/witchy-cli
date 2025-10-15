const fs = require('fs');
const path = require('path');
const { initializeDatabase, getDatabase } = require('./setup');

/**
 * Migrate herbs data from JSON file to SQLite database
 */
async function migrateHerbsData() {
  try {
    console.log('🌿 Starting herbs data migration...');
    
    // Initialize database first
    await initializeDatabase();
    
    // Read herbs JSON data
    const herbsJsonPath = path.join(__dirname, '..', '..', 'json', 'herbs.json');
    const herbsData = JSON.parse(fs.readFileSync(herbsJsonPath, 'utf8'));
    
    console.log(`📖 Found ${herbsData.length} herbs to migrate`);
    
    const db = getDatabase();
    
    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT INTO herbs (name, ritual_use, also_called) 
      VALUES (?, ?, ?)
    `);
    
    let migratedCount = 0;
    
    // Insert each herb
    for (const herb of herbsData) {
      const alsoCalled = herb.alsoCalled ? JSON.stringify(herb.alsoCalled) : null;
      
      insertStmt.run(herb.name, herb.ritualUse, alsoCalled, function(err) {
        if (err) {
          console.error(`❌ Error inserting herb "${herb.name}":`, err.message);
        } else {
          migratedCount++;
          if (migratedCount % 50 === 0) {
            console.log(`   📈 Migrated ${migratedCount}/${herbsData.length} herbs...`);
          }
        }
      });
    }
    
    // Finalize and close
    insertStmt.finalize((err) => {
      if (err) {
        console.error('❌ Error finalizing insert statement:', err.message);
      } else {
        console.log(`✨ Successfully migrated ${migratedCount} herbs to database!`);
      }
      
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('🔮 Database migration complete!');
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Verify the migration by checking record count
 */
function verifyMigration() {
  const db = getDatabase();
  
  db.get('SELECT COUNT(*) as count FROM herbs', (err, row) => {
    if (err) {
      console.error('❌ Error verifying migration:', err.message);
    } else {
      console.log(`✅ Database contains ${row.count} herb records`);
    }
    
    db.close();
  });
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateHerbsData().then(() => {
    setTimeout(() => {
      verifyMigration();
    }, 1000); // Wait a bit for the migration to complete
  });
}

module.exports = {
  migrateHerbsData,
  verifyMigration
};