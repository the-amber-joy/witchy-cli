/**
 * This script lists the table schema for all tables in the database
 */
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

async function listTableSchemas(dbPath) {
  return new Promise((resolve, reject) => {
    console.log(`Checking database schema: ${dbPath}`);

    // Check if database file exists
    const fs = require("fs");
    if (!fs.existsSync(dbPath)) {
      return reject(new Error(`Database file not found: ${dbPath}`));
    }

    // Open the database
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return reject(new Error(`Could not open database: ${err.message}`));
      }
      console.log("Database opened successfully");
    });

    // Get list of all tables
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table'",
      [],
      (err, tables) => {
        if (err) {
          db.close();
          return reject(new Error(`Could not get table list: ${err.message}`));
        }

        console.log(`Found ${tables.length} tables:`);
        tables.forEach((table) => console.log(`- ${table.name}`));

        // For each table, get its schema
        const schemaPromises = tables.map((table) => {
          return new Promise((resolveTable, rejectTable) => {
            db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
              if (err) {
                return rejectTable(
                  new Error(
                    `Could not get schema for table ${table.name}: ${err.message}`,
                  ),
                );
              }

              console.log(`\n📊 TABLE: ${table.name}`);
              console.log("Columns:");
              columns.forEach((col) => {
                console.log(`  - ${col.name} (${col.type})`);
              });

              resolveTable({
                table: table.name,
                columns: columns.map((col) => col.name),
              });
            });
          });
        });

        Promise.all(schemaPromises)
          .then((schemas) => {
            db.close();
            resolve(schemas);
          })
          .catch((err) => {
            db.close();
            reject(err);
          });
      },
    );
  });
}

// If called directly
if (require.main === module) {
  const dbPath = process.argv[2] || path.join(__dirname, "../assets/witchy.db");

  listTableSchemas(dbPath)
    .then((schemas) => {
      console.log("\nSchema listing complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error listing schemas:", error.message);
      process.exit(1);
    });
}

module.exports = { listTableSchemas };
