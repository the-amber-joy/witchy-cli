const { getDatabase } = require("./setup");

/**
 * Database operations for crystals
 */
class CrystalsDB {
  /**
   * Get all crystals from the database
   */
  static getAllCrystals() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, name, properties, also_called 
        FROM crystals 
        ORDER BY name
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const crystals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(crystals);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find crystal by exact name match
   */
  static findCrystalByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.get(
        `
        SELECT id, name, properties, also_called 
        FROM crystals 
        WHERE LOWER(name) = ? 
           OR (also_called IS NOT NULL AND LOWER(also_called) LIKE ?)
      `,
        [searchTerm, `%"${searchTerm}"%`],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const crystal = {
              id: row.id,
              name: row.name,
              properties: row.properties,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            };
            resolve(crystal);
          } else {
            resolve(null);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find crystals by properties (full-text search)
   */
  static findCrystalsByProperty(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT c.id, c.name, c.properties, c.also_called
        FROM crystals c
        JOIN witchy_fts fts ON c.name = fts.name AND fts.content_type = 'crystal'
        WHERE witchy_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, name, properties, also_called 
            FROM crystals 
            WHERE LOWER(properties) LIKE ?
            ORDER BY name
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const crystals = fallbackRows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    properties: row.properties,
                    alsoCalled: row.also_called
                      ? JSON.parse(row.also_called)
                      : [],
                  }));
                  resolve(crystals);
                }
                db.close();
              },
            );
          } else {
            const crystals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(crystals);
            db.close();
          }
        },
      );
    });
  }

  /**
   * Search crystals by partial name match (for suggestions)
   */
  static searchCrystalsByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, name, properties, also_called 
        FROM crystals 
        WHERE LOWER(name) LIKE ? 
           OR (also_called IS NOT NULL AND LOWER(also_called) LIKE ?)
        ORDER BY name
        LIMIT 5
      `,
        [searchPattern, searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const crystals = rows.map((row) => ({
              id: row.id,
              name: row.name,
              properties: row.properties,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(crystals);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { CrystalsDB };
