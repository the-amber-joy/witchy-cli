const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database configuration
// For pkg executables, use the executable directory; otherwise use project structure
const isPkg = typeof process.pkg !== "undefined";
const DB_PATH = isPkg
  ? path.join(path.dirname(process.execPath), "witchy.db")
  : path.join(__dirname, "..", "data", "witchy.db");

/**
 * Initialize the SQLite database and create all tables
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
        reject(err);
        return;
      }
      console.log("Connected to SQLite database.");
    });

    // Create all table schemas
    const createHerbsTable = `
      CREATE TABLE IF NOT EXISTS herbs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ritual_use TEXT NOT NULL,
        also_called TEXT, -- JSON array of alternative names
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createCrystalsTable = `
      CREATE TABLE IF NOT EXISTS crystals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        properties TEXT NOT NULL,
        also_called TEXT, -- JSON array of alternative names (if any)
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createColorsTable = `
      CREATE TABLE IF NOT EXISTS colors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        meanings TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createMoonTable = `
      CREATE TABLE IF NOT EXISTS moon_phases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phase TEXT NOT NULL,
        meaning TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createMetalsTable = `
      CREATE TABLE IF NOT EXISTS metals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        properties TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createDaysTable = `
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
    `;

    // Create indexes for faster searches
    const createHerbsNameIndex = `CREATE INDEX IF NOT EXISTS idx_herbs_name ON herbs(name)`;
    const createCrystalsNameIndex = `CREATE INDEX IF NOT EXISTS idx_crystals_name ON crystals(name)`;
    const createColorsNameIndex = `CREATE INDEX IF NOT EXISTS idx_colors_name ON colors(name)`;
    const createMoonPhaseIndex = `CREATE INDEX IF NOT EXISTS idx_moon_phase ON moon_phases(phase)`;
    const createMetalsNameIndex = `CREATE INDEX IF NOT EXISTS idx_metals_name ON metals(name)`;
    const createDaysNameIndex = `CREATE INDEX IF NOT EXISTS idx_days_name ON days(name)`;

    // Create comprehensive FTS table for all content
    const createFtsTable = `
      CREATE VIRTUAL TABLE IF NOT EXISTS witchy_fts USING fts5(
        content_type,
        name, 
        content,
        also_called,
        content='',
        tokenize=porter
      )
    `;

    // Create triggers to keep FTS table in sync for all tables
    const createHerbsFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS herbs_fts_insert AFTER INSERT ON herbs BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('herb', new.name, new.ritual_use, new.also_called);
      END
    `;

    const createCrystalsFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS crystals_fts_insert AFTER INSERT ON crystals BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('crystal', new.name, new.properties, new.also_called);
      END
    `;

    const createColorsFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS colors_fts_insert AFTER INSERT ON colors BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('color', new.name, new.meanings, NULL);
      END
    `;

    const createMoonFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS moon_fts_insert AFTER INSERT ON moon_phases BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('moon', new.phase, new.meaning, NULL);
      END
    `;

    const createMetalsFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS metals_fts_insert AFTER INSERT ON metals BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('metal', new.name, new.properties, NULL);
      END
    `;

    const createDaysFtsInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS days_fts_insert AFTER INSERT ON days BEGIN
        INSERT INTO witchy_fts(content_type, name, content, also_called) 
        VALUES ('day', new.name, new.intent, NULL);
      END
    `;

    // Execute all creation statements
    db.serialize(() => {
      // Create tables
      db.run(createHerbsTable, (err) => {
        if (err) console.error("Error creating herbs table:", err.message);
        else console.log("Herbs table created or already exists.");
      });

      db.run(createCrystalsTable, (err) => {
        if (err) console.error("Error creating crystals table:", err.message);
        else console.log("Crystals table created or already exists.");
      });

      db.run(createColorsTable, (err) => {
        if (err) console.error("Error creating colors table:", err.message);
        else console.log("Colors table created or already exists.");
      });

      db.run(createMoonTable, (err) => {
        if (err)
          console.error("Error creating moon_phases table:", err.message);
        else console.log("Moon phases table created or already exists.");
      });

      db.run(createMetalsTable, (err) => {
        if (err) console.error("Error creating metals table:", err.message);
        else console.log("Metals table created or already exists.");
      });

      db.run(createDaysTable, (err) => {
        if (err) console.error("Error creating days table:", err.message);
        else console.log("Days table created or already exists.");
      });

      // Create indexes
      db.run(createHerbsNameIndex);
      db.run(createCrystalsNameIndex);
      db.run(createColorsNameIndex);
      db.run(createMoonPhaseIndex);
      db.run(createMetalsNameIndex);
      db.run(createDaysNameIndex);

      // Create FTS table and triggers
      db.run(createFtsTable, (err) => {
        if (err) console.error("Error creating FTS table:", err.message);
        else console.log("Full-text search table created or already exists.");
      });

      db.run(createHerbsFtsInsertTrigger);
      db.run(createCrystalsFtsInsertTrigger);
      db.run(createColorsFtsInsertTrigger);
      db.run(createMoonFtsInsertTrigger);
      db.run(createMetalsFtsInsertTrigger);
      db.run(createDaysFtsInsertTrigger);

      db.close((err) => {
        if (err) {
          console.error("Error closing database:", err.message);
          reject(err);
          return;
        }
        console.log("Database initialization complete.");
        resolve();
      });
    });
  });
}

/**
 * Get a database connection
 */
function getDatabase() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error connecting to database:", err.message);
    }
  });
}

module.exports = {
  initializeDatabase,
  getDatabase,
  DB_PATH,
};
