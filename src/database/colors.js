const { getDatabase } = require("./setup");

/**
 * Database operations for colors
 */
class ColorsDB {
  /**
   * Get all colors from the database
   */
  static getAllColors() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, name, meanings 
        FROM colors 
        ORDER BY name
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const colors = rows.map((row) => ({
              id: row.id,
              name: row.name,
              meanings: row.meanings,
            }));
            resolve(colors);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find color by exact name match
   */
  static findColorByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.get(
        `
        SELECT id, name, meanings 
        FROM colors 
        WHERE LOWER(name) = ?
      `,
        [searchTerm],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const color = {
              id: row.id,
              name: row.name,
              meanings: row.meanings,
            };
            resolve(color);
          } else {
            resolve(null);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find colors by meanings (full-text search)
   */
  static findColorsByMeaning(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT c.id, c.name, c.meanings
        FROM colors c
        JOIN witchy_fts fts ON c.name = fts.name AND fts.content_type = 'color'
        WHERE witchy_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, name, meanings 
            FROM colors 
            WHERE LOWER(meanings) LIKE ?
            ORDER BY name
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const colors = fallbackRows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    meanings: row.meanings,
                  }));
                  resolve(colors);
                }
                db.close();
              },
            );
          } else {
            const colors = rows.map((row) => ({
              id: row.id,
              name: row.name,
              meanings: row.meanings,
            }));
            resolve(colors);
            db.close();
          }
        },
      );
    });
  }

  /**
   * Search colors by partial name match (for suggestions)
   */
  static searchColorsByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, name, meanings 
        FROM colors 
        WHERE LOWER(name) LIKE ?
        ORDER BY name
        LIMIT 5
      `,
        [searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const colors = rows.map((row) => ({
              id: row.id,
              name: row.name,
              meanings: row.meanings,
            }));
            resolve(colors);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { ColorsDB };
