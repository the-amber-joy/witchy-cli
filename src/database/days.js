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
   * Find days by intent (full-text search)
   */
  static findDaysByIntent(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT d.id, d.name, d.intent, d.planet, d.colors, d.deities
        FROM days d
        JOIN witchy_fts fts ON d.name = fts.name AND fts.content_type = 'day'
        WHERE witchy_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, name, intent, planet, colors, deities 
            FROM days 
            WHERE LOWER(intent) LIKE ?
            ORDER BY name
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const days = fallbackRows.map((row) => ({
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
            db.close();
          }
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
