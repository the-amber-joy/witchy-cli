// Test moon phases database
const { MoonDB } = require("./src/database/moon");

async function test() {
  console.log("Testing moon phases database...\n");

  try {
    console.log("1. Getting all moon phases:");
    const allPhases = await MoonDB.getAllMoonPhases();
    console.log(`   Found ${allPhases.length} phases`);
    allPhases.forEach((p) => console.log(`   - ${p.phase}`));

    console.log("\n2. Searching for 'new':");
    const newMoon = await MoonDB.findMoonPhaseByName("new");
    console.log("   Result:", newMoon ? newMoon.phase : "NOT FOUND");

    console.log("\n3. Searching for 'New Moon':");
    const newMoonExact = await MoonDB.findMoonPhaseByName("New Moon");
    console.log("   Result:", newMoonExact ? newMoonExact.phase : "NOT FOUND");

    console.log("\n4. Searching for 'waxing':");
    const waxing = await MoonDB.findMoonPhaseByName("waxing");
    console.log("   Result:", waxing ? waxing.phase : "NOT FOUND");
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
  }
}

test();
