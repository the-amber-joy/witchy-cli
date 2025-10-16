const fs = require("fs");
const path = require("path");
const { initializeDatabase, getDatabase } = require("./setup");

/**
 * Migrate all data from JSON files to SQLite database
 */
async function migrateAllData() {
  try {
    console.log("🔮 Starting complete data migration...\n");

    // Initialize database first
    await initializeDatabase();

    const db = getDatabase();

    // Read all JSON data files
    // Use require() instead of fs.readFileSync for better pkg compatibility
    const herbsData = require("../data/herbs.json");
    const crystalsData = require("../data/crystals.json");
    const colorsData = require("../data/colors.json");
    const moonData = require("../data/moon.json");
    const metalsData = require("../data/metals.json");
    const daysData = require("../data/days.json");

    console.log(`� Migration Summary:`);
    console.log(`   🌿 ${herbsData.length} herbs`);
    console.log(`   💎 ${crystalsData.length} crystals`);
    console.log(`   🎨 ${colorsData.length} colors`);
    console.log(`   🌙 ${moonData.length} moon phases`);
    console.log(`   🪨 ${metalsData.length} metals`);
    console.log(`   📅 ${daysData.length} days\n`);

    let totalMigrated = 0;

    // Clear existing data and run all inserts in a transaction
    console.log("🧹 Clearing existing data...");
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run("DELETE FROM herbs");
        db.run("DELETE FROM crystals");
        db.run("DELETE FROM colors");
        db.run("DELETE FROM moon_phases");
        db.run("DELETE FROM metals");
        db.run("DELETE FROM days");

        // Prepare insert statements INSIDE the transaction
        const herbsStmt = db.prepare(
          "INSERT INTO herbs (name, ritual_use, also_called) VALUES (?, ?, ?)",
        );
        const crystalsStmt = db.prepare(
          "INSERT INTO crystals (name, properties, also_called) VALUES (?, ?, ?)",
        );
        const colorsStmt = db.prepare(
          "INSERT INTO colors (name, meanings) VALUES (?, ?)",
        );
        const moonStmt = db.prepare(
          "INSERT INTO moon_phases (phase, meaning) VALUES (?, ?)",
        );
        const metalsStmt = db.prepare(
          "INSERT INTO metals (name, properties) VALUES (?, ?)",
        );
        const daysStmt = db.prepare(
          "INSERT INTO days (name, intent, planet, colors, deities) VALUES (?, ?, ?, ?, ?)",
        );

        console.log("🌿 Migrating herbs...");
        for (const herb of herbsData) {
          const alsoCalled = herb.alsoCalled
            ? JSON.stringify(herb.alsoCalled)
            : null;
          herbsStmt.run(herb.name, herb.ritualUse, alsoCalled);
          totalMigrated++;
        }
        herbsStmt.finalize();
        console.log(`   ✅ ${herbsData.length} herbs migrated`);

        console.log("💎 Migrating crystals...");
        for (const crystal of crystalsData) {
          const alsoCalled = crystal.alsoCalled
            ? JSON.stringify(crystal.alsoCalled)
            : null;
          crystalsStmt.run(crystal.name, crystal.properties, alsoCalled);
          totalMigrated++;
        }
        crystalsStmt.finalize();
        console.log(`   ✅ ${crystalsData.length} crystals migrated`);

        console.log("🎨 Migrating colors...");
        for (const color of colorsData) {
          colorsStmt.run(color.name, color.meanings);
          totalMigrated++;
        }
        colorsStmt.finalize();
        console.log(`   ✅ ${colorsData.length} colors migrated`);

        console.log("🌙 Migrating moon phases...");
        for (const phase of moonData) {
          moonStmt.run(phase.phase, phase.meaning);
          totalMigrated++;
        }
        moonStmt.finalize();
        console.log(`   ✅ ${moonData.length} moon phases migrated`);

        console.log("🪨 Migrating metals...");
        for (const metal of metalsData) {
          metalsStmt.run(metal.name, metal.properties);
          totalMigrated++;
        }
        metalsStmt.finalize();
        console.log(`   ✅ ${metalsData.length} metals migrated`);

        console.log("📅 Migrating days...");
        for (const day of daysData) {
          daysStmt.run(
            day.name,
            day.intent,
            day.planet || null,
            day.colors || null,
            day.deities || null,
          );
          totalMigrated++;
        }
        daysStmt.finalize();
        console.log(`   ✅ ${daysData.length} days migrated`);

        db.run("COMMIT", (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
    // Note: FTS table is contentless and will be updated automatically via triggers

    console.log(`🔮 All correspondences are now in the database!`);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error.stack);
    throw error;
  }
}

/**
 * Verify the migration by checking record counts for all tables
 */
function verifyMigration() {
  const db = getDatabase();

  const queries = [
    { name: "herbs", table: "herbs" },
    { name: "crystals", table: "crystals" },
    { name: "colors", table: "colors" },
    { name: "moon phases", table: "moon_phases" },
    { name: "metals", table: "metals" },
    { name: "days", table: "days" },
  ];

  let completed = 0;

  queries.forEach(({ name, table }) => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) {
        console.error(`❌ Error verifying ${name}:`, err.message);
      } else {
        console.log(`✅ Database contains ${row.count} ${name} records`);
      }

      completed++;
      if (completed === queries.length) {
        db.close();
        console.log("\n🎉 Database verification complete!");
      }
    });
  });
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAllData().then(() => {
    setTimeout(() => {
      verifyMigration();
    }, 1000); // Wait a bit for the migration to complete
  });
}

module.exports = {
  migrateAllData,
  verifyMigration,
};
