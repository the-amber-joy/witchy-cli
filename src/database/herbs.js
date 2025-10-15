const { getDatabase } = require("./setup");

/**
 * Database operations for herbs
 */
class HerbsDB {
  /**
   * Get all herbs from the database
   */
  static getAllHerbs() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, name, ritual_use, also_called 
        FROM herbs 
        ORDER BY name
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Parse also_called JSON back to array
            const herbs = rows.map((row) => ({
              id: row.id,
              name: row.name,
              ritualUse: row.ritual_use,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(herbs);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find herb by exact name match (including alternative names)
   */
  static findHerbByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.get(
        `
        SELECT id, name, ritual_use, also_called 
        FROM herbs 
        WHERE LOWER(name) = ? 
           OR (also_called IS NOT NULL AND LOWER(also_called) LIKE ?)
      `,
        [searchTerm, `%"${searchTerm}"%`],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const herb = {
              id: row.id,
              name: row.name,
              ritualUse: row.ritual_use,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            };
            resolve(herb);
          } else {
            resolve(null);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find herbs by ritual use (full-text search)
   */
  static findHerbsByUse(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT h.id, h.name, h.ritual_use, h.also_called
        FROM herbs h
        JOIN herbs_fts fts ON h.id = fts.rowid
        WHERE herbs_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, name, ritual_use, also_called 
            FROM herbs 
            WHERE LOWER(ritual_use) LIKE ?
            ORDER BY name
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const herbs = fallbackRows.map((row) => ({
                    id: row.id,
                    name: row.name,
                    ritualUse: row.ritual_use,
                    alsoCalled: row.also_called
                      ? JSON.parse(row.also_called)
                      : [],
                  }));
                  resolve(herbs);
                }
                db.close();
              },
            );
          } else {
            const herbs = rows.map((row) => ({
              id: row.id,
              name: row.name,
              ritualUse: row.ritual_use,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(herbs);
            db.close();
          }
        },
      );
    });
  }

  /**
   * Search herbs by partial name match (for suggestions)
   */
  static searchHerbsByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, name, ritual_use, also_called 
        FROM herbs 
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
            const herbs = rows.map((row) => ({
              id: row.id,
              name: row.name,
              ritualUse: row.ritual_use,
              alsoCalled: row.also_called ? JSON.parse(row.also_called) : [],
            }));
            resolve(herbs);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { HerbsDB };
