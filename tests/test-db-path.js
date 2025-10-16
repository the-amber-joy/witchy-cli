// Test script to check database path resolution
const { DB_PATH, getUserDataPath, isPkg } = require("./src/database/config");
const fs = require("fs");

console.log("=== Database Path Diagnostic ===");
console.log("Is PKG executable:", isPkg);
console.log("Platform:", process.platform);
console.log("Process exec path:", process.execPath);
console.log("__dirname:", __dirname);
console.log("Home directory:", require("os").homedir());
console.log("APPDATA:", process.env.APPDATA);
console.log("\nData directory:", getUserDataPath());
console.log("Database path:", DB_PATH);
console.log("\nDirectory exists:", fs.existsSync(getUserDataPath()));
console.log("Database exists:", fs.existsSync(DB_PATH));
