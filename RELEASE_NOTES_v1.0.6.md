# 📝 Witchy CLI v1.0.6 Release Notes

## 🔥 Major Enhancement: Pre-populated Database

We've completely reworked how Witchy CLI manages its database to ensure maximum reliability and performance:

- **Bundled Database**: Every executable now includes a pre-populated SQLite database with all correspondences
- **Zero Setup**: No more waiting for database creation on first run
- **Solved Missing Records**: Fixed the issue where the first record of each table could be missing
- **Reliability**: Guarantees all records are present, even problematic ones like "Amber", "New Moon", and "Aluminum"

## 🧹 Repository Cleanup

- **Installer Removed**: Removed all installer-related files for simpler, more consistent distribution
- **Cleaner Codebase**: Streamlined internal database handling code

## 💾 Technical Details

- **JSON Fallback**: Added fallback to JSON data if database access fails for any reason
- **Database Location**: Still stored in user data directory for persistent data
  - Windows: `%APPDATA%\WitchyCLI\witchy.db`
  - macOS: `~/Library/Application Support/WitchyCLI/witchy.db`
  - Linux: `~/.local/share/witchy-cli/witchy.db`
- **Documentation**: Added comprehensive documentation about database usage in DATABASE.md

## 📋 Installation and Upgrade

Simply download and run the new executable from the [Releases](https://github.com/the-amber-joy/witchy-cli/releases/tag/v1.0.6) page.

No special steps are needed when upgrading from a previous version!
