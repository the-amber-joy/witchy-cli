// Test migration step by step
const { DatabaseMigrator } = require("./src/database/migrator");

async function test() {
  console.log("=== Testing Database Migration ===\n");
  
  // Delete old database
  const fs = require("fs");
  const { DB_PATH } = require("./src/database/config");
  
  console.log("Database path:", DB_PATH);
  
  if (fs.existsSync(DB_PATH)) {
    console.log("Deleting old database...");
    fs.unlinkSync(DB_PATH);
  }
  
  console.log("\n=== Running Migration ===\n");
  
  try {
    await DatabaseMigrator.ensureDatabaseExists(false, false);
    
    console.log("\n=== Verifying Migration ===\n");
    
    // Check each table
    const sqlite3 = require("sqlite3").verbose();
    const db = new sqlite3.Database(DB_PATH);
    
    const tables = [
      { name: "herbs", expected: require("./src/data/herbs.json").length },
      { name: "crystals", expected: require("./src/data/crystals.json").length },
      { name: "colors", expected: require("./src/data/colors.json").length },
      { name: "moon_phases", expected: require("./src/data/moon.json").length },
      { name: "metals", expected: require("./src/data/metals.json").length },
      { name: "days", expected: require("./src/data/days.json").length }
    ];
    
    for (const table of tables) {
      db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
        if (err) {
          console.log(`❌ ${table.name}: ERROR - ${err.message}`);
        } else {
          const status = row.count === table.expected ? "✅" : "⚠️";
          console.log(`${status} ${table.name}: ${row.count} / ${table.expected} expected`);
          
          if (row.count !== table.expected) {
            // Show what's actually in the table
            db.all(`SELECT * FROM ${table.name}`, (err2, rows) => {
              if (!err2) {
                console.log(`   Records in ${table.name}:`);
                rows.forEach((r, i) => {
                  const name = r.name || r.phase || r.id;
                  console.log(`   ${i+1}. ${name}`);
                });
              }
            });
          }
        }
      });
    }
    
    setTimeout(() => db.close(), 2000);
    
  } catch (error) {
    console.error("Migration failed:", error.message);
    console.error(error.stack);
  }
}

test();
