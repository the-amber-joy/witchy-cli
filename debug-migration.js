const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Test direct database operations
const dbPath = path.join(process.env.APPDATA, 'WitchyCLI', 'test-witchy.db');
console.log('Testing with database:', dbPath);

const db = new sqlite3.Database(dbPath);

// Create colors table
db.run(`CREATE TABLE IF NOT EXISTS colors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  meanings TEXT NOT NULL
)`);

// Load colors data
const colorsData = require('./src/data/colors.json');
console.log('Colors from JSON:', colorsData.length);
colorsData.forEach((c, i) => console.log(`  ${i+1}. ${c.name}`));

// Clear and insert with transaction
db.serialize(() => {
  db.run("BEGIN TRANSACTION");
  db.run("DELETE FROM colors");
  
  const stmt = db.prepare("INSERT INTO colors (name, meanings) VALUES (?, ?)");
  for (const color of colorsData) {
    console.log(`Inserting: ${color.name}`);
    stmt.run(color.name, color.meanings, function(err) {
      if (err) console.error(`Error inserting ${color.name}:`, err.message);
    });
  }
  stmt.finalize();
  
  db.run("COMMIT", (err) => {
    if (err) {
      console.error('Commit failed:', err.message);
    } else {
      console.log('Transaction committed');
      
      // Verify results
      db.get("SELECT COUNT(*) as count FROM colors", (err, row) => {
        console.log('Total colors inserted:', row ? row.count : 'ERROR');
        
        db.get("SELECT name FROM colors ORDER BY rowid LIMIT 1", (err, row) => {
          console.log('First color:', row ? row.name : 'NONE');
          
          db.all("SELECT name FROM colors ORDER BY rowid", (err, rows) => {
            if (rows) {
              console.log('All colors:');
              rows.forEach((r, i) => console.log(`  ${i+1}. ${r.name}`));
            }
            db.close();
          });
        });
      });
    }
  });
});
