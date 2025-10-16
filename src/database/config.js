const fs = require("fs");
const path = require("path");
const os = require("os");

// For pkg executables, use bundled database; otherwise use development database
const isPkg = typeof process.pkg !== "undefined";

/**
 * Get the path to the bundled database file
 */
function getBundledDbPath() {
  if (!isPkg) {
    // In development, use the regular database
    return path.join(__dirname, "..", "data", "witchy.db");
  }

  // In pkg executable, database is bundled in the virtual filesystem
  // Try different possible paths for the bundled database
  const possiblePaths = [
    path.join(__dirname, "..", "assets", "witchy.db"),
    "/snapshot/witchyLookup/src/assets/witchy.db",
    "/snapshot/witchyLookup/assets/witchy.db",
    path.join(process.cwd(), "src", "assets", "witchy.db"),
    path.join(process.cwd(), "assets", "witchy.db"),
  ];

  for (const dbPath of possiblePaths) {
    if (fs.existsSync(dbPath)) {
      return dbPath;
    }
  }

  return null;
}

/**
 * Get a temporary database path for pkg executables
 */
function getTempDbPath() {
  const tempDir = os.tmpdir();
  const sessionId = process.pid;
  return path.join(tempDir, `witchy-${sessionId}.db`);
}

/**
 * Copy bundled database to temporary location for pkg executables
 */
function copyBundledToTemp() {
  const bundledPath = getBundledDbPath();
  const tempPath = getTempDbPath();

  if (bundledPath && fs.existsSync(bundledPath)) {
    try {
      fs.copyFileSync(bundledPath, tempPath);
      return tempPath;
    } catch (error) {
      console.error("Failed to copy bundled database to temp:", error.message);
      return null;
    }
  }
  return null;
}

/**
 * Get the appropriate database path
 * For pkg executables: Copy bundled database to temp directory for SQLite access
 * For development: Use development database
 * @returns {string} Path to database to use
 */
function getDbPath() {
  if (!isPkg) {
    return getBundledDbPath();
  }

  // For pkg executables, copy to temp and use that
  const tempPath = getTempDbPath();
  if (!fs.existsSync(tempPath)) {
    const copied = copyBundledToTemp();
    if (!copied) {
      throw new Error("Failed to create temporary database");
    }
  }
  return tempPath;
}

// The database path to use
const DB_PATH = getDbPath();

// Clean up temporary database on exit for pkg executables
if (isPkg) {
  const tempPath = getTempDbPath();

  process.on("exit", () => {
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  process.on("SIGINT", () => {
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
    process.exit(0);
  });
}

module.exports = {
  DB_PATH,
  isPkg,
  getBundledDbPath,
  getTempDbPath,
  copyBundledToTemp,
};
