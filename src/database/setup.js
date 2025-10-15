const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '..', 'data', 'witchy.db');

/**
 * Initialize the SQLite database and create the herbs table
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database.');
    });

    // Create herbs table
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

    // Create index for faster name searches (including alternative names)
    const createNameIndex = `
      CREATE INDEX IF NOT EXISTS idx_herbs_name ON herbs(name)
    `;

    // Create full-text search virtual table for ritual use searches
    const createFtsTable = `
      CREATE VIRTUAL TABLE IF NOT EXISTS herbs_fts USING fts5(
        name, 
        ritual_use, 
        also_called,
        content='herbs',
        content_rowid='id'
      )
    `;

    // Create triggers to keep FTS table in sync
    const createInsertTrigger = `
      CREATE TRIGGER IF NOT EXISTS herbs_fts_insert AFTER INSERT ON herbs BEGIN
        INSERT INTO herbs_fts(rowid, name, ritual_use, also_called) 
        VALUES (new.id, new.name, new.ritual_use, new.also_called);
      END
    `;

    const createUpdateTrigger = `
      CREATE TRIGGER IF NOT EXISTS herbs_fts_update AFTER UPDATE ON herbs BEGIN
        UPDATE herbs_fts SET 
          name = new.name, 
          ritual_use = new.ritual_use, 
          also_called = new.also_called 
        WHERE rowid = new.id;
      END
    `;

    const createDeleteTrigger = `
      CREATE TRIGGER IF NOT EXISTS herbs_fts_delete AFTER DELETE ON herbs BEGIN
        DELETE FROM herbs_fts WHERE rowid = old.id;
      END
    `;

    // Execute all creation statements
    db.serialize(() => {
      db.run(createHerbsTable, (err) => {
        if (err) {
          console.error('Error creating herbs table:', err.message);
          reject(err);
          return;
        }
        console.log('Herbs table created or already exists.');
      });

      db.run(createNameIndex, (err) => {
        if (err) {
          console.error('Error creating name index:', err.message);
          reject(err);
          return;
        }
        console.log('Name index created or already exists.');
      });

      db.run(createFtsTable, (err) => {
        if (err) {
          console.error('Error creating FTS table:', err.message);
          reject(err);
          return;
        }
        console.log('Full-text search table created or already exists.');
      });

      db.run(createInsertTrigger);
      db.run(createUpdateTrigger);
      db.run(createDeleteTrigger);

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        console.log('Database initialization complete.');
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
      console.error('Error connecting to database:', err.message);
    }
  });
}

module.exports = {
  initializeDatabase,
  getDatabase,
  DB_PATH
};