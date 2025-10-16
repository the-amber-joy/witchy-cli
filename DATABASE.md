## 💽 Database and Data Storage

### How Data is Stored

Witchy CLI stores its magical correspondence data in two ways:

1. **SQLite Database** (Primary method): The first time you run the application, it creates a SQLite database in your user data directory:

   - Windows: `%APPDATA%\WitchyCLI\witchy.db`
   - macOS: `~/Library/Application Support/WitchyCLI/witchy.db`
   - Linux: `~/.local/share/witchy-cli/witchy.db`

2. **JSON Files** (Fallback): If the database is unavailable for any reason, Witchy CLI falls back to loading data directly from the bundled JSON files.

### NEW: Pre-populated Database

Witchy CLI includes a pre-populated database bundled with the executable. This provides several benefits:

- **Faster startup**: No need to wait for database creation on first run
- **Increased reliability**: All records are guaranteed to be present
- **Better offline experience**: Works perfectly without needing to generate a database

When you run the executable for the first time, it will automatically copy the pre-populated database to your user data directory (if one doesn't already exist).

### Database Generation

For developers or those building from source, the pre-populated database can be regenerated using:

```bash
npm run db:prepopulate
```

This script (`scripts/create-populated-db.js`) creates a fresh database with all correspondence data and verifies that all records are present, including previously problematic entries like "Amber", "New Moon", and "Aluminum".

## 🐛 Troubleshooting

If you encounter any issues:

1. **First Run**: The first time you run the application, it may take a few seconds to set up the database.

2. **Missing Results**: If searches return unexpected results, you can reset the database:

   ```bash
   # If installed via npm (development mode)
   npm run db:reset

   # If using the standalone executable
   # Simply delete the database file in your user data directory and restart
   # The pre-populated database will be copied again automatically
   ```

3. **Moon Search Issues**: If `moon use` commands aren't working, ensure you're using v1.0.7 or later, which fixed database search fallback logic.

4. **File Access Issues**: Ensure the application has write permissions to your user data directory.
