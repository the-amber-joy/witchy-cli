const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Create path for the pre-populated database
const dbPath = path.join(__dirname, "..", "assets", "witchy.db");

// Make sure assets directory exists
if (!fs.existsSync(path.join(__dirname, "..", "assets"))) {
  fs.mkdirSync(path.join(__dirname, "..", "assets"), { recursive: true });
}

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Deleted existing database");
}

// Create and populate the database
console.log("Creating pre-populated database at:", dbPath);
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
  // Create all tables
  db.run(`
    CREATE TABLE IF NOT EXISTS herbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ritual_use TEXT NOT NULL,
      also_called TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS crystals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      properties TEXT NOT NULL,
      also_called TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      meanings TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS moon_phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase TEXT NOT NULL,
      meaning TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS metals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      properties TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      intent TEXT NOT NULL,
      planet TEXT,
      colors TEXT,
      deities TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Skip creating the FTS virtual table for now as it's causing issues
  // We're not using full-text search in this version anyway

  // Begin transaction for insertions
  db.run("BEGIN TRANSACTION");

  // Load JSON data
  const herbsData = require("../src/data/herbs.json");
  const crystalsData = require("../src/data/crystals.json");
  const colorsData = require("../src/data/colors.json");
  const moonData = require("../src/data/moon.json");
  const metalsData = require("../src/data/metals.json");
  const daysData = require("../src/data/days.json");

  console.log("JSON data loaded:");
  console.log(`- ${herbsData.length} herbs`);
  console.log(`- ${crystalsData.length} crystals`);
  console.log(`- ${colorsData.length} colors`);
  console.log(`- ${moonData.length} moon phases`);
  console.log(`- ${metalsData.length} metals`);
  console.log(`- ${daysData.length} days`);

  // Insert herbs
  console.log("\nInserting herbs...");
  const herbsStmt = db.prepare(
    "INSERT INTO herbs (name, ritual_use, also_called) VALUES (?, ?, ?)",
  );
  for (const herb of herbsData) {
    const alsoCalled = herb.alsoCalled ? JSON.stringify(herb.alsoCalled) : null;
    herbsStmt.run(herb.name, herb.ritualUse, alsoCalled);
  }
  herbsStmt.finalize();

  // Insert crystals
  console.log("Inserting crystals...");
  const crystalsStmt = db.prepare(
    "INSERT INTO crystals (name, properties, also_called) VALUES (?, ?, ?)",
  );
  for (const crystal of crystalsData) {
    const alsoCalled = crystal.alsoCalled
      ? JSON.stringify(crystal.alsoCalled)
      : null;
    crystalsStmt.run(crystal.name, crystal.properties, alsoCalled);
  }
  crystalsStmt.finalize();

  // Insert colors
  console.log("Inserting colors...");
  const colorsStmt = db.prepare(
    "INSERT INTO colors (name, meanings) VALUES (?, ?)",
  );
  for (const color of colorsData) {
    colorsStmt.run(color.name, color.meanings);
  }
  colorsStmt.finalize();

  // Insert moon phases
  console.log("Inserting moon phases...");
  const moonStmt = db.prepare(
    "INSERT INTO moon_phases (phase, meaning) VALUES (?, ?)",
  );
  for (const phase of moonData) {
    moonStmt.run(phase.phase, phase.meaning);
  }
  moonStmt.finalize();

  // Insert metals
  console.log("Inserting metals...");
  const metalsStmt = db.prepare(
    "INSERT INTO metals (name, properties) VALUES (?, ?)",
  );
  for (const metal of metalsData) {
    metalsStmt.run(metal.name, metal.properties);
  }
  metalsStmt.finalize();

  // Insert days
  console.log("Inserting days...");
  const daysStmt = db.prepare(
    "INSERT INTO days (name, intent, planet, colors, deities) VALUES (?, ?, ?, ?, ?)",
  );
  for (const day of daysData) {
    daysStmt.run(
      day.name,
      day.intent,
      day.planet || null,
      day.colors || null,
      day.deities || null,
    );
  }
  daysStmt.finalize();

  // Commit transaction
  db.run("COMMIT", (err) => {
    if (err) {
      console.error("Error committing transaction:", err.message);
    } else {
      console.log("\nTransaction committed successfully");

      // Verify records
      console.log("\nVerifying record counts:");
      db.get("SELECT COUNT(*) as count FROM herbs", (err, row) => {
        console.log(`- Herbs: ${row.count} records`);
      });

      db.get("SELECT COUNT(*) as count FROM crystals", (err, row) => {
        console.log(`- Crystals: ${row.count} records`);
      });

      db.get("SELECT COUNT(*) as count FROM colors", (err, row) => {
        console.log(`- Colors: ${row.count} records`);
        db.get("SELECT name FROM colors ORDER BY rowid LIMIT 1", (err, row) => {
          console.log(`  First color: ${row ? row.name : "NONE"}`);
        });
      });

      db.get("SELECT COUNT(*) as count FROM moon_phases", (err, row) => {
        console.log(`- Moon phases: ${row.count} records`);
        db.get(
          "SELECT phase FROM moon_phases ORDER BY rowid LIMIT 1",
          (err, row) => {
            console.log(`  First phase: ${row ? row.phase : "NONE"}`);
          },
        );
      });

      db.get("SELECT COUNT(*) as count FROM metals", (err, row) => {
        console.log(`- Metals: ${row.count} records`);
      });

      db.get("SELECT COUNT(*) as count FROM days", (err, row) => {
        console.log(`- Days: ${row.count} records`);

        // Close database after all queries complete
        setTimeout(() => {
          db.close(() => {
            console.log("\nPre-populated database created successfully!");
            console.log("Location:", dbPath);
          });
        }, 500);
      });
    }
  });
});
