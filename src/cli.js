const readline = require("readline");
const { processCommand } = require("./index");
const { DatabaseMigrator } = require("./database/migrator");

class InteractiveCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "🪄 witchy > ",
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Handle Ctrl+C gracefully
    this.rl.on("SIGINT", () => {
      console.clear();
      console.log("🧙✨ Blessed be! Exiting Witchy CLI...");
      process.exit(0);
    });

    // Handle line input
    this.rl.on("line", (input) => {
      this.handleCommand(input.trim());
    });

    // Handle close event
    this.rl.on("close", () => {
      console.clear();
      console.log("🧙✨ Blessed be! Goodbye!");
      process.exit(0);
    });
  }

  async handleCommand(input) {
    if (!input) {
      this.rl.prompt();
      return;
    }

    // Handle built-in commands
    if (input === "help" || input === "?") {
      this.showHelp();
      this.rl.prompt();
      return;
    }

    if (input === "exit" || input === "quit") {
      console.clear();
      console.log("🧙✨ Blessed be! Goodbye!");
      process.exit(0);
    }

    if (input === "clear") {
      console.clear();
      this.rl.prompt();
      return;
    }

    // Parse the command
    const args = input.split(" ").filter((arg) => arg.trim());

    if (args.length < 2) {
      console.log("❌ Please provide at least a type and search term.");
      console.log("   Example: herb rosemary");
      console.log('   Type "help" for more information.\n');
      this.rl.prompt();
      return;
    }

    try {
      // Process the command using the existing logic (skip migration since CLI handles it)
      await processCommand(args, true);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (process.env.DEBUG) {
        console.log(error.stack);
      }
      console.log();
    }

    this.rl.prompt();
  }

  showWelcome() {
    console.log("✨🧙 Welcome to Witchy CLI! 🔮✨\n");
    this.showHelp(false);
  }

  showHelp(showTitle = true) {
    if (showTitle) {
      console.log("\n🧙 Witchy CLI Help 🔮\n");
    }
    console.log("🌟 Available Lookup Types:");
    console.log(
      "  🌿 herbs    - Discover magical plants and their ritual uses",
    );
    console.log(
      "  💎 crystals - Explore gemstones and their mystical properties",
    );
    console.log("  🎨 colors   - Learn about color magic and meanings");
    console.log("  🌙 moon     - Find moon phases perfect for your spellwork");
    console.log(
      "  🪨 metals   - Understand metallic energies and correspondences",
    );
    console.log(
      "  📅 days     - Discover which days are best for specific magical work\n",
    );

    console.log("📖 Command Formats:");
    console.log("  <type> <name>      - Look up by name");
    console.log("  <type> use <term>  - Search by magical use/property\n");

    console.log("✨ Examples:");
    console.log("  herb rosemary");
    console.log("  crystal use protection");
    console.log("  day monday");
    console.log("  moon use banishing");
    console.log("  color red");
    console.log("  metal use prosperity\n");

    console.log("⚡ Quick Commands:");
    console.log("  help  - Show this help");
    console.log("  clear - Clear the screen");
    console.log("  exit  - Exit the program\n");
  }

  async start() {
    try {
      // Ensure database exists (quiet mode for clean startup)
      await DatabaseMigrator.ensureDatabaseExists(false, true);
      
      // Show welcome after database is ready
      console.clear();
      this.showWelcome();
      this.rl.prompt();
    } catch (error) {
      // Show error but continue - allow CLI to work with JSON fallback if needed
      console.clear();
      console.log("⚠️  Database initialization warning:", error.message);
      console.log("Continuing with available functionality...\n");
      this.showWelcome();
      this.rl.prompt();
    }
  }
}

module.exports = { InteractiveCLI };
