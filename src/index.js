// Import all modules
const { loadData, loadDataSync } = require("./data/loader");
const { showUsage } = require("./ui/display");
const { highlightText } = require("./utils/text");
const { getMoonPhaseEmoji, getColorCode } = require("./utils/colors");
const { suggestUseSearch } = require("./utils/suggestions");

// Import search functions
const { findHerbByName, findHerbsByUse } = require("./search/herbs");
const {
  findCrystalByName,
  findCrystalsByProperty,
} = require("./search/crystals");
const { findColorByName, findColorsByMeaning } = require("./search/colors");
const {
  findMoonPhaseByName,
  findMoonPhasesByMeaning,
} = require("./search/moon");
const { findMetalByName, findMetalsByProperty } = require("./search/metals");
const { findDayByName, findDaysByIntent } = require("./search/days");

// Process a command with given arguments
async function processCommand(args, skipMigration = false) {
  if (args.length < 2) {
    showUsage();
    return;
  }

  const type = args[0].toLowerCase();
  // For direct CLI commands (skipMigration=true), don't load data upfront
  // Search functions will handle database migration themselves
  // For interactive CLI (skipMigration=false), load all data into memory
  let herbs, crystals, colors, moon, metals, days;

  if (!skipMigration) {
    // Interactive mode - load all data
    const loadedData = await loadData(false, false);
    ({ herbs, crystals, colors, moon, metals, days } = loadedData);
  } else {
    // Direct CLI mode - pass empty arrays (search functions query database directly)
    herbs = [];
    crystals = [];
    colors = [];
    moon = [];
    metals = [];
    days = [];
  }

  // Create data object for compatibility with suggestions
  const data = { herbs, crystals, colors, moon, metals, days };

  // Handle herb commands
  if (type === "herb") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // herb use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingHerbs = await findHerbsByUse(herbs, searchTerm);

      if (matchingHerbs.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingHerbs.length
          } herb(s) with ritual uses containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingHerbs.forEach((herb) => {
          console.log(`🌿 ${herb.name}`);
          if (herb.alsoCalled && herb.alsoCalled.length > 0) {
            console.log(`   Also called: ${herb.alsoCalled.join(", ")}`);
          }
          const highlightedUse = highlightText(herb.ritualUse, searchTerm);
          console.log(`   📜 ${highlightedUse}`);
          console.log("");
        });
      } else {
        console.log(
          `❌ No herbs found with ritual uses containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common ritual use terms like:");
        console.log("   • protection");
        console.log("   • love");
        console.log("   • healing");
        console.log("   • prosperity");
        console.log("   • purification");
        console.log("   • banishing");
        console.log("   • divination");
        console.log();
      }
    } else {
      // herb <name>
      const searchTerm = args.slice(1).join(" ");
      const foundHerb = await findHerbByName(herbs, searchTerm);

      if (foundHerb) {
        console.log(`\n🌿 ${foundHerb.name}`);

        if (foundHerb.alsoCalled && foundHerb.alsoCalled.length > 0) {
          console.log(`   Also called: ${foundHerb.alsoCalled.join(", ")}`);
        }
        console.log(`\n📜 Ritual Use:`);
        console.log(`   ${foundHerb.ritualUse}\n`);
      } else {
        console.log(`❌ Herb \"${searchTerm}\" not found.`);
        console.log(
          "\nTip: Try searching with alternative names or check spelling.",
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch("herb", searchTerm, data);
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = herbs
          .filter(
            (herb) =>
              herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (herb.alsoCalled &&
                herb.alsoCalled.some((alt) =>
                  alt.toLowerCase().includes(searchTerm.toLowerCase()),
                )),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((herb) => {
            console.log(`   • ${herb.name}`);
          });
        }
        console.log();
      }
    }

    // Handle crystal commands
  } else if (type === "crystal") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // crystal use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingCrystals = await findCrystalsByProperty(
        crystals,
        searchTerm,
      );

      if (matchingCrystals.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingCrystals.length
          } crystal(s) with properties containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingCrystals.forEach((crystal) => {
          console.log(`💎 ${crystal.name}`);
          if (crystal.alsoCalled && crystal.alsoCalled.length > 0) {
            console.log(`   Also called: ${crystal.alsoCalled.join(", ")}`);
          }
          const highlightedProperties = highlightText(
            crystal.properties,
            searchTerm,
          );
          console.log(`   ✨ ${highlightedProperties}`);
          console.log("");
        });
      } else {
        console.log(
          `❌ No crystals found with properties containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common crystal properties like:");
        console.log("   • healing");
        console.log("   • protection");
        console.log("   • love");
        console.log("   • abundance");
        console.log("   • clarity");
        console.log("   • grounding");
        console.log("   • energy");
        console.log();
      }
    } else {
      // crystal <name>
      const searchTerm = args.slice(1).join(" ");
      const foundCrystal = await findCrystalByName(crystals, searchTerm);

      if (foundCrystal) {
        console.log(`\n💎 ${foundCrystal.name}`);

        if (foundCrystal.alsoCalled && foundCrystal.alsoCalled.length > 0) {
          console.log(`   Also called: ${foundCrystal.alsoCalled.join(", ")}`);
        }
        console.log(`\n✨ Properties:`);
        console.log(`   ${foundCrystal.properties}\n`);
      } else {
        console.log(`❌ Crystal \"${searchTerm}\" not found.`);
        console.log(
          "\nTip: Try searching with alternative names or check spelling.",
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch(
          "crystal",
          searchTerm,
          data,
        );
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = crystals
          .filter(
            (crystal) =>
              crystal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (crystal.alsoCalled &&
                crystal.alsoCalled.some((alt) =>
                  alt.toLowerCase().includes(searchTerm.toLowerCase()),
                )),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((crystal) => {
            console.log(`   • ${crystal.name}`);
          });
        }
        console.log();
      }
    }

    // Handle color commands
  } else if (type === "color") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // color use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingColors = await findColorsByMeaning(colors, searchTerm);

      if (matchingColors.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingColors.length
          } color(s) with meanings containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingColors.forEach((color) => {
          const colorCode = getColorCode(color.name);
          console.log(`${colorCode}🎨 ${color.name}\x1b[0m`);
          const highlightedMeanings = highlightText(color.meanings, searchTerm);
          console.log(`   🌟 ${highlightedMeanings}`);
          console.log("");
        });
      } else {
        console.log(
          `❌ No colors found with meanings containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common color meanings like:");
        console.log("   • love");
        console.log("   • protection");
        console.log("   • healing");
        console.log("   • prosperity");
        console.log("   • spirituality");
        console.log("   • passion");
        console.log("   • peace");
        console.log();
      }
    } else {
      // color <name>
      const searchTerm = args.slice(1).join(" ");
      const foundColor = await findColorByName(colors, searchTerm);

      if (foundColor) {
        const colorCode = getColorCode(foundColor.name);
        console.log(`\n${colorCode}🎨 ${foundColor.name}\x1b[0m`);
        console.log(`\n🌟 Meanings:`);
        console.log(`   ${foundColor.meanings}\n`);
      } else {
        console.log(`❌ Color \"${searchTerm}\" not found.`);
        console.log(
          "\nTip: Try searching with exact color names or check spelling.",
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch(
          "color",
          searchTerm,
          data,
        );
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = colors
          .filter((color) =>
            color.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((color) => {
            console.log(`   • ${color.name}`);
          });
        }
        console.log();
      }
    }

    // Handle moon commands
  } else if (type === "moon") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // moon use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingMoonPhases = await findMoonPhasesByMeaning(
        moon,
        searchTerm,
      );

      if (matchingMoonPhases.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingMoonPhases.length
          } moon phase(s) with meanings containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingMoonPhases.forEach((phase) => {
          const emoji = getMoonPhaseEmoji(phase.phase);
          console.log(`${emoji} ${phase.phase}`);
          const highlightedMeaning = highlightText(phase.meaning, searchTerm);
          console.log(`   🌟 ${highlightedMeaning}`);
          console.log("");
        });
      } else {
        console.log(
          `❌ No moon phases found with meanings containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common magical purposes like:");
        console.log("   • manifestation");
        console.log("   • banishing");
        console.log("   • cleansing");
        console.log("   • divination");
        console.log("   • healing");
        console.log("   • protection");
        console.log("   • growth");
        console.log();
      }
    } else {
      // moon <phase>
      const searchTerm = args.slice(1).join(" ");
      const foundMoonPhase = await findMoonPhaseByName(moon, searchTerm);

      if (foundMoonPhase) {
        const emoji = getMoonPhaseEmoji(foundMoonPhase.phase);
        console.log(`\n${emoji} ${foundMoonPhase.phase}`);
        console.log(`\n🌟 Meaning:`);
        console.log(`   ${foundMoonPhase.meaning}\n`);
      } else {
        console.log(`❌ Moon phase \"${searchTerm}\" not found.`);
        console.log(
          "\nTip: Try searching with exact phase names or check spelling.",
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch("moon", searchTerm, data);
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = moon
          .filter((phase) =>
            phase.phase.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((phase) => {
            console.log(`   • ${phase.phase}`);
          });
        }
        console.log();
      }
    }

    // Handle metal commands
  } else if (type === "metal") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // metal use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingMetals = await findMetalsByProperty(metals, searchTerm);

      if (matchingMetals.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingMetals.length
          } metal(s) with properties containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingMetals.forEach((metal) => {
          console.log(`🪨 ${metal.name}`);
          const highlightedProperties = highlightText(
            metal.properties,
            searchTerm,
          );
          console.log(`   ✨ ${highlightedProperties}`);
          console.log("");
        });
      } else {
        console.log(
          `❌ No metals found with properties containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common metal properties like:");
        console.log("   • protection");
        console.log("   • prosperity");
        console.log("   • healing");
        console.log("   • strength");
        console.log("   • abundance");
        console.log("   • energy");
        console.log("   • wisdom");
        console.log();
      }
    } else {
      // metal <name>
      const searchTerm = args.slice(1).join(" ");
      const foundMetal = await findMetalByName(metals, searchTerm);

      if (foundMetal) {
        console.log(`\n🪨 ${foundMetal.name}`);
        console.log(`\n✨ Properties:`);
        console.log(`   ${foundMetal.properties}\n`);
      } else {
        console.log(`❌ Metal \"${searchTerm}\" not found.`);
        console.log(
          "\nTip: Try searching with exact metal names or check spelling.",
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch(
          "metal",
          searchTerm,
          data,
        );
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = metals
          .filter((metal) =>
            metal.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((metal) => {
            console.log(`   • ${metal.name}`);
          });
        }
        console.log();
      }
    }

    // Handle day commands
  } else if (type === "day") {
    if (args.length >= 3 && args[1].toLowerCase() === "use") {
      // day use <term>
      const searchTerm = args.slice(2).join(" ");
      const matchingDays = await findDaysByIntent(days, searchTerm);

      if (matchingDays.length > 0) {
        console.log(
          `\n🔍 Found ${
            matchingDays.length
          } day(s) with intents containing "${highlightText(
            searchTerm,
            searchTerm,
          )}":\n`,
        );

        matchingDays.forEach((day) => {
          console.log(`📅 ${day.name}`);
          if (day.planet) {
            console.log(`   🪐 Planet: ${day.planet}`);
          }
          const highlightedIntent = highlightText(day.intent, searchTerm);
          console.log(`   🎯 Intent: ${highlightedIntent}`);
          if (day.colors) {
            console.log(`   🎨 Colors: ${day.colors}`);
          }
          if (day.deities) {
            console.log(`   ⚡ Deities: ${day.deities}`);
          }
          console.log("");
        });
      } else {
        console.log(
          `❌ No days found with intents containing \"${searchTerm}\".`,
        );
        console.log("\nTry searching for common magical intents like:");
        console.log("   • healing");
        console.log("   • protection");
        console.log("   • success");
        console.log("   • communication");
        console.log("   • love");
        console.log();
      }
    } else {
      // day <name>
      const searchTerm = args.slice(1).join(" ");
      const foundDays = await findDayByName(days, searchTerm);

      if (foundDays.length > 0) {
        foundDays.forEach((day) => {
          console.log(`\n📅 ${day.name}`);
          if (day.planet) {
            console.log(`\n🪐 Planet: ${day.planet}`);
          }
          console.log(`🎯 Intent: ${day.intent}`);
          if (day.colors) {
            console.log(`🎨 Colors: ${day.colors}`);
          }
          if (day.deities) {
            console.log(`⚡ Deities: ${day.deities}`);
          }
          console.log("");
        });
      } else {
        console.log(`❌ Day \"${searchTerm}\" not found.`);
        console.log(
          '\nTip: Try searching with exact day names like "Monday", "Tuesday", etc.',
        );

        // Check if this might work as a \"use\" search
        const useSearchSuggestions = suggestUseSearch("day", searchTerm, data);
        if (useSearchSuggestions.length > 0) {
          console.log(useSearchSuggestions[0]);
        }

        const suggestions = days
          .filter((day) =>
            day.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 3);

        if (suggestions.length > 0) {
          console.log("\nDid you mean one of these?");
          suggestions.forEach((day) => {
            console.log(`   • ${day.name}`);
          });
        }
        console.log();
      }
    }
  } else {
    console.log(`❌ Unknown type: \"${type}\"`);
    console.log("Available types: herb, crystal, color, moon, metal, day\n");
    showUsage();
  }
}

// Main function (for CLI usage)
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments, show usage
    showUsage();
    process.exit(1);
  }

  // For direct CLI usage, skip migration in loadData since search functions handle it
  await processCommand(args, true);
}

module.exports = { main, processCommand };

// Only run main if this file is executed directly (not imported)
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}
