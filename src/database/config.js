const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Get the appropriate user data directory based on platform
 * @returns {string} Path to user data directory
 */
function getUserDataPath() {
  const platform = process.platform;
  const homedir = os.homedir();

  let dataDir;
  if (platform === "win32") {
    // Windows: %APPDATA%\WitchyCLI
    dataDir = path.join(
      process.env.APPDATA || path.join(homedir, "AppData", "Roaming"),
      "WitchyCLI",
    );
  } else if (platform === "darwin") {
    // macOS: ~/Library/Application Support/WitchyCLI
    dataDir = path.join(homedir, "Library", "Application Support", "WitchyCLI");
  } else {
    // Linux: ~/.local/share/witchy-cli
    dataDir = path.join(homedir, ".local", "share", "witchy-cli");
  }

  return dataDir;
}

/**
 * Ensure the data directory exists
 * @returns {boolean} True if directory exists or was created successfully
 */
function ensureDataDirectoryExists() {
  try {
    const dataDir = getUserDataPath();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error("Failed to create data directory:", error.message);
    return false;
  }
}

// For pkg executables, use user data directory; otherwise use project structure
const isPkg = typeof process.pkg !== "undefined";

/**
 * Get the path to the pre-populated database bundled with the executable
 * @returns {string|null} Path to bundled database or null if not found
 */
function getBundledDbPath() {
  if (isPkg) {
    // In pkg environment, check for bundled database in assets folder
    const bundledPath = path.join(
      path.dirname(process.execPath),
      "assets",
      "witchy.db",
    );
    try {
      if (fs.existsSync(bundledPath)) {
        return bundledPath;
      }
    } catch (error) {
      // Silently fail if we can't access the bundled database
    }
  }
  return null;
}

// Path to user's database location
const USER_DB_PATH = isPkg
  ? path.join(getUserDataPath(), "witchy.db")
  : path.join(__dirname, "../data/witchy.db");

// Actual DB path to use (will be updated at runtime if bundled DB exists)
const DB_PATH = USER_DB_PATH;

/**
 * Copy bundled database to user directory if it exists
 * This avoids the need for database migration
 * @returns {boolean} True if database was copied, false otherwise
 */
function copyBundledDatabaseIfExists() {
  const bundledDbPath = getBundledDbPath();
  if (!bundledDbPath) {
    return false;
  }

  try {
    // Ensure data directory exists
    ensureDataDirectoryExists();

    // Only copy if user DB doesn't exist or is empty/corrupted
    if (!fs.existsSync(USER_DB_PATH) || fs.statSync(USER_DB_PATH).size === 0) {
      // Copy the bundled database to the user's database location
      fs.copyFileSync(bundledDbPath, USER_DB_PATH);
      console.log("✨ Pre-populated database copied to user directory");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Failed to copy bundled database:", error.message);
    return false;
  }
}

module.exports = {
  DB_PATH,
  USER_DB_PATH,
  getUserDataPath,
  ensureDataDirectoryExists,
  getBundledDbPath,
  copyBundledDatabaseIfExists,
  isPkg,
};
