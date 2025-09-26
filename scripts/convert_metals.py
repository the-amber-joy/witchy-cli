#!/usr/bin/env python3

import json

def convert_metals_to_json():
    metals_data = []
    
    with open('metals.txt', 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            
            # Split by tab
            if '\t' in line:
                parts = line.split('\t', 1)
                if len(parts) == 2:
                    metal_name = parts[0].strip()
                    properties = parts[1].strip()
                    
                    metals_data.append({
                        "name": metal_name,
                        "properties": properties
                    })
    
    # Write to JSON file
    with open('metals.json', 'w', encoding='utf-8') as json_file:
        json.dump(metals_data, json_file, indent=2, ensure_ascii=False)
    
    print(f"Converted {len(metals_data)} metals to metals.json")

if __name__ == "__main__":
    convert_metals_to_json()