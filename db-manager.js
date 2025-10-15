#!/usr/bin/env node

const { DatabaseMigrator } = require("./src/database/migrator");

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "status":
    case "stats":
      const stats = await DatabaseMigrator.getDbStats();
      console.log("🔮 Database Status:");
      if (stats.exists) {
        console.log("✅ Database exists");
        console.log("\n📊 Record counts:");
        Object.entries(stats.tables).forEach(([table, count]) => {
          console.log(`   ${table}: ${count} records`);
        });

        const total = Object.values(stats.tables).reduce(
          (sum, count) => sum + count,
          0,
        );
        console.log(`\n📈 Total records: ${total}`);
      } else {
        console.log("❌ Database does not exist");
        if (stats.error) {
          console.log(`   Error: ${stats.error}`);
        }
      }
      break;

    case "reset":
      console.log("🔄 Resetting database...");
      await DatabaseMigrator.resetDatabase();
      break;

    case "migrate":
      console.log("📊 Running migration...");
      const migrationRan = await DatabaseMigrator.ensureDatabaseExists();
      if (!migrationRan) {
        console.log("✅ Database is already up to date");
      }
      break;

    case "help":
    default:
      console.log("🔮 Witchy Database Manager\n");
      console.log("Available commands:");
      console.log("  status   - Show database status and record counts");
      console.log("  migrate  - Ensure database exists and is populated");
      console.log("  reset    - Delete and recreate database");
      console.log("  help     - Show this help message");
      console.log("\nExamples:");
      console.log("  node db-manager.js status");
      console.log("  npm run db:stats");
      console.log("  npm run db:reset");
      break;
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
