# 📝 Witchy CLI v1.0.7 Release Notes

## 🐛 Bug Fix: Moon Phase Search

Fixed an issue where `moon use` commands were returning no results.

### What was broken:
- `moon use banishing` returned no results
- `moon use growth` returned no results  
- `moon use magic` returned no results
- All moon phase searches by meaning/purpose were failing

### What was fixed:
- Moon database search now properly falls back to LIKE search when full-text search returns no results
- All `moon use` commands now work correctly
- Moon phases are properly searchable by their magical meanings and purposes

### Examples that now work:
```bash
./witchy-cli-win.exe moon use banishing    # Returns "Waning Moon"
./witchy-cli-win.exe moon use growth       # Returns "Waxing Moon"  
./witchy-cli-win.exe moon use magic        # Returns all relevant phases
```

## 🔧 Technical Details

The issue was in the moon database search logic where the full-text search (FTS) query would succeed with 0 results instead of failing, preventing the fallback to the simpler LIKE search that actually works with our database structure.

## 📋 Upgrade Instructions

Simply download and replace your existing executable. No other changes needed.

This is a patch release that fixes the moon search functionality introduced in v1.0.6.