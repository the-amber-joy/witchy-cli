const { getDatabase } = require("./setup");

/**
 * Database operations for days
 */
class DaysDB {
  /**
   * Get all days from the database
   */
  static getAllDays() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, name, intent, planet, colors, deities 
        FROM days 
        ORDER BY id
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const days = rows.map((row) => ({
              id: row.id,
              name: row.name,
              intent: row.intent,
              planet: row.planet,
              colors: row.colors,
              deities: row.deities,
            }));
            resolve(days);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find day by exact name match
   */
  static findDayByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.all(
        `
        SELECT id, name, intent, planet, colors, deities 
        FROM days 
        WHERE LOWER(name) LIKE ?
      `,
        [`%${searchTerm}%`],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const days = rows.map((row) => ({
              id: row.id,
              name: row.name,
              intent: row.intent,
              planet: row.planet,
              colors: row.colors,
              deities: row.deities,
            }));
            resolve(days);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find days by intent (using LIKE search)
   */
  static findDaysByIntent(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use LIKE search for reliable results
      db.all(
        `
        SELECT id, name, intent, planet, colors, deities 
        FROM days 
        WHERE LOWER(intent) LIKE ?
        ORDER BY name
      `,
        [`%${searchTerm.toLowerCase()}%`],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const days = rows.map((row) => ({
              id: row.id,
              name: row.name,
              intent: row.intent,
              planet: row.planet,
              colors: row.colors,
              deities: row.deities,
            }));
            resolve(days);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Search days by partial name match (for suggestions)
   */
  static searchDaysByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, name, intent, planet, colors, deities 
        FROM days 
        WHERE LOWER(name) LIKE ?
        ORDER BY name
        LIMIT 5
      `,
        [searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const days = rows.map((row) => ({
              id: row.id,
              name: row.name,
              intent: row.intent,
              planet: row.planet,
              colors: row.colors,
              deities: row.deities,
            }));
            resolve(days);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { DaysDB };
