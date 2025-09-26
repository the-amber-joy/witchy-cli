#!/usr/bin/env python3

import json

def convert_colors_to_json():
    colors = []
    
    with open('colors.txt', 'r', encoding='utf-8') as file:
        for line_num, line in enumerate(file, 1):
            line = line.strip()
            if not line:
                continue
                
            # Split by tab
            if '\t' in line:
                parts = line.split('\t', 1)
                if len(parts) == 2:
                    color_name = parts[0].strip()
                    meanings = parts[1].strip()
                    
                    if color_name and meanings:
                        colors.append({
                            "name": color_name,
                            "meanings": meanings
                        })
                    else:
                        print(f"Warning: Empty color name or meanings on line {line_num}: {line}")
                else:
                    print(f"Warning: Could not split line {line_num}: {line}")
            else:
                print(f"Warning: No tab separator found on line {line_num}: {line}")
    
    # Write to JSON file
    with open('colors.json', 'w', encoding='utf-8') as file:
        json.dump(colors, file, indent=2, ensure_ascii=False)
    
    print(f"Successfully converted {len(colors)} colors to colors.json")

if __name__ == "__main__":
    convert_colors_to_json()