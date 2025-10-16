const { getDatabase } = require("./setup");

/**
 * Database operations for moon phases
 */
class MoonDB {
  /**
   * Get all moon phases from the database
   */
  static getAllMoonPhases() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(
        `
        SELECT id, phase, meaning 
        FROM moon_phases 
        ORDER BY id
      `,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const moonPhases = rows.map((row) => ({
              id: row.id,
              phase: row.phase,
              meaning: row.meaning,
            }));
            resolve(moonPhases);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find moon phase by phase name (exact or partial match)
   */
  static findMoonPhaseByName(searchName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchTerm = searchName.toLowerCase();

      db.get(
        `
        SELECT id, phase, meaning 
        FROM moon_phases 
        WHERE LOWER(phase) = ? OR LOWER(phase) LIKE ?
        LIMIT 1
      `,
        [searchTerm, `%${searchTerm}%`],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const moonPhase = {
              id: row.id,
              phase: row.phase,
              meaning: row.meaning,
            };
            resolve(moonPhase);
          } else {
            resolve(null);
          }
          db.close();
        },
      );
    });
  }

  /**
   * Find moon phases by meaning (full-text search)
   */
  static findMoonPhasesByMeaning(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Use FTS for better search results
      db.all(
        `
        SELECT m.id, m.phase, m.meaning
        FROM moon_phases m
        JOIN witchy_fts fts ON m.phase = fts.name AND fts.content_type = 'moon'
        WHERE witchy_fts MATCH ?
        ORDER BY rank
      `,
        [searchTerm],
        (err, rows) => {
          if (err) {
            // Fallback to LIKE search if FTS fails
            db.all(
              `
            SELECT id, phase, meaning 
            FROM moon_phases 
            WHERE LOWER(meaning) LIKE ?
            ORDER BY phase
          `,
              [`%${searchTerm.toLowerCase()}%`],
              (fallbackErr, fallbackRows) => {
                if (fallbackErr) {
                  reject(fallbackErr);
                } else {
                  const moonPhases = fallbackRows.map((row) => ({
                    id: row.id,
                    phase: row.phase,
                    meaning: row.meaning,
                  }));
                  resolve(moonPhases);
                }
                db.close();
              },
            );
          } else {
            const moonPhases = rows.map((row) => ({
              id: row.id,
              phase: row.phase,
              meaning: row.meaning,
            }));
            resolve(moonPhases);
            db.close();
          }
        },
      );
    });
  }

  /**
   * Search moon phases by partial phase name match (for suggestions)
   */
  static searchMoonPhasesByPartialName(searchTerm) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const searchPattern = `%${searchTerm.toLowerCase()}%`;

      db.all(
        `
        SELECT id, phase, meaning 
        FROM moon_phases 
        WHERE LOWER(phase) LIKE ?
        ORDER BY phase
        LIMIT 5
      `,
        [searchPattern],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const moonPhases = rows.map((row) => ({
              id: row.id,
              phase: row.phase,
              meaning: row.meaning,
            }));
            resolve(moonPhases);
          }
          db.close();
        },
      );
    });
  }
}

module.exports = { MoonDB };
