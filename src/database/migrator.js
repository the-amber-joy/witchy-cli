const fs = require("fs");
const path = require("path");
const { initializeDatabase } = require("./setup");
const { migrateAllData } = require("./migrate");
const {
  DB_PATH,
  USER_DB_PATH,
  ensureDataDirectoryExists,
  copyBundledDatabaseIfExists,
} = require("./config");

class DatabaseMigrator {
  static async ensureDatabaseExists(silent = false, quiet = false) {
    try {
      // Ensure the data directory exists first
      if (!ensureDataDirectoryExists()) {
        throw new Error("Failed to create data directory");
      }

      // First try to copy the bundled database if it exists
      // This is the preferred method and avoids migration issues
      if (copyBundledDatabaseIfExists()) {
        if (!silent && !quiet) {
          console.log("✨ Using pre-populated database");
        }
        return true;
      }

      // If no bundled database or copy failed, fall back to regular process
      // Check if database file exists
      if (!fs.existsSync(USER_DB_PATH)) {
        if (quiet) {
          console.log("🔮 Setting up database for first use...");
        } else if (!silent) {
          console.log("🔮 Database not found. Creating new database...");
        }
        await this.runFullMigration(silent || quiet);
        if (quiet) {
          console.log("✨ Database ready!\n");
        }
        return true;
      }

      // Check if database has data
      const hasData = await this.checkDatabaseHasData();
      if (!hasData) {
        if (quiet) {
          console.log("🔮 Setting up database for first use...");
        } else if (!silent) {
          console.log(
            "🔮 Database exists but is empty. Running data migration...",
          );
        }
        await this.runDataMigration(silent || quiet);
        if (quiet) {
          console.log("✨ Database ready!\n");
        }
        return true;
      }

      return false; // No migration needed
    } catch (error) {
      console.error("❌ Database migration check failed:", error.message);
      console.error("   Database path:", DB_PATH);
      console.error("   Error details:", error.code || error);
      throw error;
    }
  }

  static async checkDatabaseHasData() {
    return new Promise((resolve) => {
      try {
        const sqlite3 = require("sqlite3").verbose();
        const db = new sqlite3.Database(DB_PATH);

        // Check if tables exist and have data
        const tables = [
          "herbs",
          "crystals",
          "colors",
          "moon_phases",
          "metals",
          "days",
        ];

        let tablesChecked = 0;
        let hasData = true;

        tables.forEach((table) => {
          db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
            if (err || !row || row.count === 0) {
              hasData = false;
            }

            tablesChecked++;
            if (tablesChecked === tables.length) {
              db.close();
              resolve(hasData);
            }
          });
        });
      } catch (error) {
        resolve(false);
      }
    });
  }

  static async runFullMigration(silent = false) {
    if (!silent) console.log("📦 Setting up database schema...");

    if (silent) {
      // Temporarily silence console output during migration
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      console.log = () => {};
      console.error = () => {};

      try {
        await initializeDatabase();
        await migrateAllData();
      } finally {
        // Restore console output
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }
    } else {
      await initializeDatabase();
      await migrateAllData();
      console.log("✅ Database migration completed successfully!");
    }
  }

  static async runDataMigration(silent = false) {
    if (!silent) console.log("📊 Migrating data from JSON files...");

    if (silent) {
      // Temporarily silence console output during migration
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      console.log = () => {};
      console.error = () => {};

      try {
        await migrateAllData();
      } finally {
        // Restore console output
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }
    } else {
      await migrateAllData();
      console.log("✅ Data migration completed successfully!");
    }
  }

  static async resetDatabase() {
    try {
      if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log("🗑️ Existing database deleted.");
      }

      await this.runFullMigration();
      console.log("🔄 Database reset completed!");
    } catch (error) {
      console.error("❌ Database reset failed:", error.message);
      throw error;
    }
  }

  static async getDbStats() {
    return new Promise((resolve) => {
      try {
        if (!fs.existsSync(DB_PATH)) {
          resolve({ exists: false });
          return;
        }

        const sqlite3 = require("sqlite3").verbose();
        const db = new sqlite3.Database(DB_PATH);

        const stats = { exists: true, tables: {} };
        const tables = [
          "herbs",
          "crystals",
          "colors",
          "moon_phases",
          "metals",
          "days",
        ];

        let tablesChecked = 0;

        tables.forEach((table) => {
          db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
            if (err || !row) {
              stats.tables[table] = 0;
            } else {
              stats.tables[table] = row.count;
            }

            tablesChecked++;
            if (tablesChecked === tables.length) {
              db.close();
              resolve(stats);
            }
          });
        });
      } catch (error) {
        resolve({ exists: false, error: error.message });
      }
    });
  }
}

module.exports = { DatabaseMigrator };
