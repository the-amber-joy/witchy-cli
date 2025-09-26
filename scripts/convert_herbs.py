#!/usr/bin/env python3
"""
Script to convert herbs.txt to JSON format
"""

import json
import re

def parse_herbs_file(filename):
    """Parse the herbs.txt file and convert to structured JSON data"""
    herbs = []
    
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Split content into individual herb entries
    # Each herb starts with a name line followed by description and optional "Also Called:" line
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
            
        # This should be an herb name
        herb_name = line
        i += 1
        
        # Collect description lines until we hit the next herb or "Also Called:"
        description_lines = []
        also_called = []
        
        while i < len(lines):
            current_line = lines[i].strip()
            
            # Check if this is an "Also Called:" line
            if current_line.startswith("Also Called:"):
                also_called_text = current_line.replace("Also Called:", "").strip()
                # Split by commas and clean up
                also_called = [name.strip() for name in also_called_text.split(',') if name.strip()]
                i += 1
                break
            
            # Check if this looks like the start of a new herb (not starting with lowercase or common continuation words)
            elif (current_line and 
                  not current_line[0].islower() and 
                  not current_line.startswith(('Use', 'Place', 'Carry', 'Burn', 'Add', 'Mix', 'Put', 'Wear', 'Keep', 'Sacred', 'Sprinkle', 'Great', 'Excellent', 'Note:', 'Magical', 'Also', 'Used', 'Promotes', 'Attracts', 'Helps', 'Associated', 'A ', 'An ', 'The ', 'Said', 'Believed', 'Thought', 'Considered', 'Warning:', 'Fill', 'Hang', 'Grow', 'Dried', 'Fresh', 'Steep', 'Soak', 'Immerse', 'Write', 'Bury', 'Throw', 'Scatter', 'Ring', 'Crush', 'Rub', 'Wash', 'Bathe', 'Slice')) and
                  len(current_line.split()) <= 4):  # Herb names are usually short
                # This looks like a new herb name, so we're done with current herb
                break
            
            # Otherwise, this is part of the description
            if current_line:
                description_lines.append(current_line)
            
            i += 1
        
        # Join description lines and create herb entry
        if description_lines:
            herb_entry = {
                "name": herb_name,
                "ritualUse": ' '.join(description_lines),
                "alsoCalled": also_called
            }
            herbs.append(herb_entry)
    
    return herbs

def main():
    """Main function to convert herbs.txt to herbs.json"""
    try:
        herbs_data = parse_herbs_file('herbs.txt')
        
        # Write to JSON file
        with open('herbs.json', 'w', encoding='utf-8') as json_file:
            json.dump(herbs_data, json_file, indent=2, ensure_ascii=False)
        
        print(f"Successfully converted {len(herbs_data)} herbs to herbs.json")
        
        # Print first few entries for verification
        print("\nFirst few entries:")
        for i, herb in enumerate(herbs_data[:3]):
            print(f"{i+1}. {herb['name']}: {herb['ritualUse'][:100]}...")
            if herb['alsoCalled']:
                print(f"   Also called: {', '.join(herb['alsoCalled'])}")
                
    except FileNotFoundError:
        print("Error: herbs.txt file not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()