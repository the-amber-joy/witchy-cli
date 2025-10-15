const fs = require("fs");
const path = require("path");
const { setupDatabase } = require("./setup");
const { migrateAllData } = require("./migrate");

const DB_PATH = path.join(__dirname, "../data/witchy.db");

class DatabaseMigrator {
  static async ensureDatabaseExists() {
    try {
      // Check if database file exists
      if (!fs.existsSync(DB_PATH)) {
        console.log("🔮 Database not found. Creating new database...");
        await this.runFullMigration();
        return true;
      }

      // Check if database has data
      const hasData = await this.checkDatabaseHasData();
      if (!hasData) {
        console.log(
          "🔮 Database exists but is empty. Running data migration...",
        );
        await this.runDataMigration();
        return true;
      }

      return false; // No migration needed
    } catch (error) {
      console.error("❌ Database migration check failed:", error.message);
      throw error;
    }
  }

  static async checkDatabaseHasData() {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);

      // Check if tables exist and have data
      const tables = [
        "herbs",
        "crystals",
        "colors",
        "moon_phases",
        "metals",
        "days",
      ];

      for (const table of tables) {
        try {
          const count = db
            .prepare(`SELECT COUNT(*) as count FROM ${table}`)
            .get();
          if (count.count === 0) {
            db.close();
            return false;
          }
        } catch (error) {
          // Table doesn't exist
          db.close();
          return false;
        }
      }

      db.close();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async runFullMigration() {
    console.log("📦 Setting up database schema...");
    await setupDatabase();

    console.log("📊 Migrating data from JSON files...");
    await migrateAllData();

    console.log("✅ Database migration completed successfully!");
  }

  static async runDataMigration() {
    console.log("📊 Migrating data from JSON files...");
    await migrateAllData();

    console.log("✅ Data migration completed successfully!");
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
    try {
      if (!fs.existsSync(DB_PATH)) {
        return { exists: false };
      }

      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);

      const stats = { exists: true, tables: {} };
      const tables = [
        "herbs",
        "crystals",
        "colors",
        "moon_phases",
        "metals",
        "days",
      ];

      for (const table of tables) {
        try {
          const count = db
            .prepare(`SELECT COUNT(*) as count FROM ${table}`)
            .get();
          stats.tables[table] = count.count;
        } catch (error) {
          stats.tables[table] = 0;
        }
      }

      db.close();
      return stats;
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }
}

module.exports = { DatabaseMigrator };
