#!/usr/bin/env python3

import json

def convert_days_to_json():
    days_data = []
    
    with open('../lists/days.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Skip the header line
    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue
            
        # Split by tab
        parts = line.split('\t')
        if len(parts) >= 5:
            day = {
                "name": parts[0].strip(),
                "intent": parts[1].strip(),
                "planet": parts[2].strip(),
                "colors": parts[3].strip(),
                "deities": parts[4].strip()
            }
            days_data.append(day)
    
    # Write to JSON file
    with open('../json/days.json', 'w', encoding='utf-8') as f:
        json.dump(days_data, f, indent=2, ensure_ascii=False)
    
    print(f"Converted {len(days_data)} days to JSON format")
    for day in days_data:
        print(f"  - {day['name']}: {day['planet']}")

if __name__ == "__main__":
    convert_days_to_json()