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

  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return dataDir;
}

// For pkg executables, use user data directory; otherwise use project structure
const isPkg = typeof process.pkg !== "undefined";
const DB_PATH = isPkg
  ? path.join(getUserDataPath(), "witchy.db")
  : path.join(__dirname, "../data/witchy.db");

module.exports = {
  DB_PATH,
  getUserDataPath,
  isPkg,
};
