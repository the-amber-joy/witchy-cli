#!/usr/bin/env node

// Import the main function and interactive CLI from the modular structure
const { main } = require("./src/index");
const { InteractiveCLI } = require("./src/cli");

// Check if arguments are provided
const args = process.argv.slice(2);

if (args.length === 0) {
  // No arguments provided, start interactive mode
  const cli = new InteractiveCLI();
  cli.start().catch((error) => {
    console.error("Failed to start CLI:", error.message);
    process.exit(1);
  });
} else {
  // Arguments provided, use original CLI behavior
  main();
}
