const { getDatabase } = require("./setup");

/**
 * Database operations for metals
 */
class MetalsDB {
  /**
   * Get all metals from the database
   */
  static getAllMetals() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, name, properties 
        FROM metals 
        ORDER BY name
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const metals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
            }));
            resolve(metals);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find metal by exact name match
   */
  static findMetalByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.get(
        `
        SELECT id, name, properties 
        FROM metals 
        WHERE LOWER(name) = ?
      `,
        [searchTerm],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const metal = {
              id: row.id,
              name: row.name,
              properties: row.properties,
            };
            resolve(metal);
          } else {
            resolve(null);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find metals by properties (full-text search)
   */
  static findMetalsByProperty(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT m.id, m.name, m.properties
        FROM metals m
        JOIN witchy_fts fts ON m.name = fts.name AND fts.content_type = 'metal'
        WHERE witchy_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, name, properties 
            FROM metals 
            WHERE LOWER(properties) LIKE ?
            ORDER BY name
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const metals = fallbackRows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    properties: row.properties,
                  }));
                  resolve(metals);
                }
                db.close();
              },
            );
          } else {
            const metals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
            }));
            resolve(metals);
            db.close();
          }
        },
      );
    });
  }

  /**
   * Search metals by partial name match (for suggestions)
   */
  static searchMetalsByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, name, properties 
        FROM metals 
        WHERE LOWER(name) LIKE ?
        ORDER BY name
        LIMIT 5
      `,
        [searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const metals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
            }));
            resolve(metals);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { MetalsDB };
