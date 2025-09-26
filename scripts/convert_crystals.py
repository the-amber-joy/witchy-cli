#!/usr/bin/env python3

import json
import re

def parse_crystals_file(filename):
    crystals = []
    
    with open(filename, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Split on tab character
        if '\t' in line:
            parts = line.split('\t', 1)  # Split on first tab only
            crystal_name = parts[0].strip()
            properties = parts[1].strip() if len(parts) > 1 else ""
            
            if crystal_name and properties:
                crystal_entry = {
                    "name": crystal_name,
                    "properties": properties
                }
                crystals.append(crystal_entry)
    
    return crystals

def main():
    print("Converting crystals.txt to JSON...")
    
    try:
        crystals = parse_crystals_file('crystals.txt')
        
        # Write to JSON file
        with open('crystals.json', 'w', encoding='utf-8') as f:
            json.dump(crystals, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully converted {len(crystals)} crystals to crystals.json")
        
        # Show first few entries as examples
        print("\nFirst few entries:")
        for i, crystal in enumerate(crystals[:3]):
            print(f"{i+1}. {crystal['name']}: {crystal['properties']}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()