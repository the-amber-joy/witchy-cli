#!/usr/bin/env python3

import json

def convert_moon_to_json():
    moon_data = []
    
    with open('moon.txt', 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            
            # Split by tab
            if '\t' in line:
                parts = line.split('\t', 1)
                if len(parts) == 2:
                    phase_name = parts[0].strip()
                    meaning = parts[1].strip()
                    
                    moon_data.append({
                        "phase": phase_name,
                        "meaning": meaning
                    })
    
    # Write to JSON file
    with open('moon.json', 'w', encoding='utf-8') as json_file:
        json.dump(moon_data, json_file, indent=2, ensure_ascii=False)
    
    print(f"Converted {len(moon_data)} moon phases to moon.json")

if __name__ == "__main__":
    convert_moon_to_json()