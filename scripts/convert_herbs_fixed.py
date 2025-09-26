#!/usr/bin/env python3
import json
import re

def parse_herbs_file(filename):
    herbs = []
    current_herb = None
    
    with open(filename, 'r', encoding='utf-8') as file:
        lines = [line.rstrip('\n\r') for line in file.readlines()]
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Check if this line contains a tab character (name\tritual_use format)
        if '\t' in line and not line.startswith('Also Called:'):
            parts = line.split('\t', 1)
            if len(parts) == 2:
                herb_name = parts[0].strip()
                ritual_use = parts[1].strip()
                
                herb_entry = {
                    "name": herb_name,
                    "ritualUse": ritual_use
                }
                
                # Check if the next line has "Also Called:"
                if i + 1 < len(lines) and lines[i + 1].strip().startswith('Also Called:'):
                    also_called_line = lines[i + 1].strip()
                    also_called_text = also_called_line.replace('Also Called:', '').strip()
                    if also_called_text:
                        herb_entry["alsoCalled"] = [name.strip() for name in also_called_text.split(',') if name.strip()]
                    i += 1  # Skip the "Also Called" line
                
                herbs.append(herb_entry)
                i += 1
                continue
        
        # Check if this line starts with "Also Called:" (orphaned)
        if line.startswith('Also Called:'):
            i += 1
            continue
        
        # This must be a herb name on its own line
        herb_name = line
        ritual_use_parts = []
        i += 1
        
        # Collect ritual use description lines until we hit another herb name or "Also Called:"
        while i < len(lines):
            next_line = lines[i].strip()
            
            if not next_line:
                i += 1
                continue
                
            if next_line.startswith('Also Called:'):
                # This is the "Also Called" line for the current herb
                break
            
            # Check if this might be the start of a new herb (no tab, not "Also Called:", and looks like a title)
            # A new herb line typically doesn't contain common ritual words and is relatively short
            ritual_words = ['magic', 'protection', 'love', 'luck', 'healing', 'carry', 'burn', 'use', 'wear', 'place', 'attract', 'ritual', 'spell', 'incense']
            if (not '\t' in next_line and 
                len(next_line) < 50 and 
                not any(word in next_line.lower() for word in ritual_words) and
                not next_line[0].islower()):
                # This looks like a new herb name
                break
            
            ritual_use_parts.append(next_line)
            i += 1
        
        # Create the herb entry
        if ritual_use_parts:
            ritual_use = ' '.join(ritual_use_parts)
            herb_entry = {
                "name": herb_name,
                "ritualUse": ritual_use
            }
            
            # Check if we stopped at an "Also Called:" line
            if i < len(lines) and lines[i].strip().startswith('Also Called:'):
                also_called_line = lines[i].strip()
                also_called_text = also_called_line.replace('Also Called:', '').strip()
                if also_called_text:
                    herb_entry["alsoCalled"] = [name.strip() for name in also_called_text.split(',') if name.strip()]
                i += 1  # Skip the "Also Called" line
            
            herbs.append(herb_entry)
        else:
            # No ritual use found, skip this entry
            pass
    
    return herbs

def main():
    herbs = parse_herbs_file('herbs.txt')
    
    with open('herbs.json', 'w', encoding='utf-8') as f:
        json.dump(herbs, f, indent=2, ensure_ascii=False)
    
    print(f"Converted {len(herbs)} herbs to JSON format")
    
    # Print first few entries for verification
    print("\nFirst 3 entries:")
    for i, herb in enumerate(herbs[:3]):
        print(f"{i+1}. {herb['name']}")
        print(f"   Ritual Use: {herb['ritualUse'][:100]}...")
        if 'alsoCalled' in herb:
            print(f"   Also Called: {herb['alsoCalled']}")
        print()

if __name__ == "__main__":
    main()