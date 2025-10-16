/**
 * This script verifies that the database contains all expected data
 * by checking for the presence of known records that were previously missing
 * due to the race condition.
 */
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const KNOWN_PROBLEMATIC_RECORDS = [
  { table: "colors", value: "Amber", property: "name" },
  { table: "moon_phases", value: "New Moon", property: "phase" }, // moon_phases uses 'phase' instead of 'name'
  { table: "metals", value: "Aluminum", property: "name" },
];

async function verifyDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    console.log(`Verifying database: ${dbPath}`);

    // Check if database file exists
    const fs = require("fs");
    if (!fs.existsSync(dbPath)) {
      return reject(new Error(`Database file not found: ${dbPath}`));
    }

    console.log("Database file exists");

    // Open the database
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return reject(new Error(`Could not open database: ${err.message}`));
      }
    });

    // Check each record
    const promises = KNOWN_PROBLEMATIC_RECORDS.map((record) => {
      return new Promise((resolveRecord, rejectRecord) => {
        const query = `SELECT * FROM ${record.table} WHERE ${record.property} = ?`;
        db.get(query, [record.value], (err, row) => {
          if (err) {
            console.error(
              `❌ Error checking ${record.table}.${record.property}=${record.value}:`,
              err.message,
            );
            return rejectRecord(err);
          }

          if (row) {
            console.log(
              `✅ Found ${record.table}.${record.property}=${record.value}`,
            );
            return resolveRecord(true);
          } else {
            console.log(
              `❌ MISSING ${record.table}.${record.property}=${record.value}`,
            );
            return resolveRecord(false);
          }
        });
      });
    });

    // Also count total records in each table
    const tablePromises = [
      "colors",
      "crystals",
      "days",
      "herbs",
      "metals",
      "moon_phases",
    ].map((table) => {
      return new Promise((resolveTable, rejectTable) => {
        db.get(`SELECT COUNT(*) as count FROM ${table}`, [], (err, row) => {
          if (err) {
            console.error(
              `❌ Error counting records in ${table}:`,
              err.message,
            );
            return rejectTable(err);
          }
          console.log(`📊 ${table}: ${row.count} records`);
          resolveTable(row.count);
        });
      });
    });

    // Run all checks
    Promise.all([...promises, ...tablePromises])
      .then((results) => {
        const problemRecordResults = results.slice(
          0,
          KNOWN_PROBLEMATIC_RECORDS.length,
        );
        const tableCounts = results.slice(KNOWN_PROBLEMATIC_RECORDS.length);

        // Check if any problematic records are missing
        const allFound = problemRecordResults.every(
          (result) => result === true,
        );

        // Check if any table has zero records
        const allTablesHaveData = tableCounts.every((count) => count > 0);

        if (allFound && allTablesHaveData) {
          console.log(
            "\n✅ VERIFICATION PASSED: All records found and all tables have data",
          );
          db.close();
          resolve(true);
        } else {
          console.log(
            "\n❌ VERIFICATION FAILED: Some records are missing or tables are empty",
          );
          db.close();
          resolve(false);
        }
      })
      .catch((err) => {
        console.error("Verification failed with error:", err);
        db.close();
        reject(err);
      });
  });
}

// If called directly
if (require.main === module) {
  const dbPath = process.argv[2] || path.join(__dirname, "../assets/witchy.db");

  verifyDatabase(dbPath)
    .then((result) => {
      if (result) {
        console.log("Database verification successful!");
        process.exit(0);
      } else {
        console.log("Database verification failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Database verification error:", error.message);
      process.exit(1);
    });
}

module.exports = { verifyDatabase };
