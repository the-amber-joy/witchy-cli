const { HerbsDB } = require("../database/herbs");
const { DatabaseMigrator } = require("../database/migrator");

// Search for herb by name or alternative name (database version)
async function findHerbByName(herbs, searchTerm) {
  try {
    // Ensure database exists before searching
    await DatabaseMigrator.ensureDatabaseExists(true);

    // Always verify database is ready and populated before first query
    // This handles both fresh migrations and cases where CLI pre-initialized the DB
    let attempts = 0;
    const maxAttempts = 50; // Max attempts (5 seconds at 100ms each)
    let isReady = false;

    while (attempts < maxAttempts && !isReady) {
      try {
        // Try a quick count check to verify database is accessible
        const allHerbs = await HerbsDB.getAllHerbs();
        if (allHerbs && allHerbs.length >= 450) {
          isReady = true;
        } else if (attempts === 0) {
          // Only show message on first attempt if data isn't ready
          process.stdout.write("🔮 Preparing witchy database...");
        }

        if (!isReady) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      } catch (err) {
        // Database not ready yet (locked or not populated), wait and retry
        if (attempts === 0) {
          process.stdout.write("🔮 Preparing witchy database...");
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // Clear the message if it was shown
    if (attempts > 0) {
      process.stdout.write("\r" + " ".repeat(35) + "\r");
    }

    if (!isReady) {
      console.error(
        "⚠️  Database preparation timed out. Results may be incomplete.",
      );
    }

    return await HerbsDB.findHerbByName(searchTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // Fallback to original array-based search
    return findHerbByNameSync(herbs, searchTerm);
  }
}

// Search for herbs by ritual use (database version)
async function findHerbsByUse(herbs, useTerm) {
  try {
    // Ensure database exists before searching
    await DatabaseMigrator.ensureDatabaseExists(true);

    // Always verify database is ready and populated before first query
    let attempts = 0;
    const maxAttempts = 50; // Max attempts (5 seconds at 100ms each)
    let isReady = false;

    while (attempts < maxAttempts && !isReady) {
      try {
        // Try a quick count check to verify database is accessible
        const allHerbs = await HerbsDB.getAllHerbs();
        if (allHerbs && allHerbs.length >= 450) {
          isReady = true;
        } else if (attempts === 0) {
          process.stdout.write("🔮 Preparing witchy database...");
        }

        if (!isReady) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      } catch (err) {
        if (attempts === 0) {
          process.stdout.write("🔮 Preparing witchy database...");
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // Clear the message if it was shown
    if (attempts > 0) {
      process.stdout.write("\r" + " ".repeat(35) + "\r");
    }

    if (!isReady) {
      console.error(
        "⚠️  Database preparation timed out. Results may be incomplete.",
      );
    }

    return await HerbsDB.findHerbsByUse(useTerm);
  } catch (error) {
    console.error(
      "Database error, falling back to array search:",
      error.message,
    );
    // Fallback to original array-based search
    return findHerbsByUseSync(herbs, useTerm);
  }
}

// Get herb suggestions for partial matches
async function getHerbSuggestions(searchTerm) {
  try {
    // Ensure database exists before searching
    await DatabaseMigrator.ensureDatabaseExists(true);

    // Always verify database is ready and populated
    let attempts = 0;
    const maxAttempts = 50; // Max attempts (5 seconds at 100ms each)
    let isReady = false;

    while (attempts < maxAttempts && !isReady) {
      try {
        const allHerbs = await HerbsDB.getAllHerbs();
        if (allHerbs && allHerbs.length >= 450) {
          isReady = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    return await HerbsDB.searchHerbsByPartialName(searchTerm);
  } catch (error) {
    console.error("Database error for suggestions:", error.message);
    return [];
  }
}

// Synchronous fallback functions (for backwards compatibility)
function findHerbByNameSync(herbs, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return herbs.find((herb) => {
    // Check main name
    if (herb.name.toLowerCase() === normalizedSearch) {
      return true;
    }

    // Check alternative names if they exist
    if (herb.alsoCalled && Array.isArray(herb.alsoCalled)) {
      return herb.alsoCalled.some(
        (altName) => altName.toLowerCase() === normalizedSearch,
      );
    }

    return false;
  });
}

function findHerbsByUseSync(herbs, useTerm) {
  const normalizedTerm = useTerm.toLowerCase().trim();

  return herbs.filter((herb) => {
    return (
      herb.ritualUse && herb.ritualUse.toLowerCase().includes(normalizedTerm)
    );
  });
}

module.exports = {
  findHerbByName,
  findHerbsByUse,
  getHerbSuggestions,
  findHerbByNameSync,
  findHerbsByUseSync,
};
