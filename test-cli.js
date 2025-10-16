const { InteractiveCLI } = require("./src/cli");

console.log("Starting CLI test...");
const cli = new InteractiveCLI();

cli.start()
  .then(() => {
    console.log("CLI started successfully");
  })
  .catch((error) => {
    console.error("Failed to start CLI:", error);
    console.error(error.stack);
    process.exit(1);
  });
