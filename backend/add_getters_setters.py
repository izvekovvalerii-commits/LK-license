#!/usr/bin/env python3
"""
Script to add getters and setters to Java classes that use Lombok @Data annotation.
This is a workaround for Lombok annotation processing issues.
"""

import re
import os
from pathlib import Path

def generate_getter(field_name, field_type):
    """Generate a getter method for a field."""
    # Handle boolean fields (isXxx instead of getXxx for Boolean fields)
    if field_type == "Boolean" and field_name.startswith("is"):
        method_name = field_name
    elif field_type == "boolean" and not field_name.startswith("is"):
        method_name = "is" + field_name[0].upper() + field_name[1:]
    else:
        method_name = "get" + field_name[0].upper() + field_name[1:]
    
    return f"""
    public {field_type} {method_name}() {{
        return {field_name};
    }}"""

def generate_setter(field_name, field_type):
    """Generate a setter method for a field."""
    method_name = "set" + field_name[0].upper() + field_name[1:]
    
    return f"""
    public void {method_name}({field_type} {field_name}) {{
        this.{field_name} = {field_name};
    }}"""

def extract_fields(java_code):
    """Extract field declarations from Java code."""
    fields = []
    # Pattern to match field declarations (private FieldType fieldName;)
    pattern = r'^\s*private\s+([\w<>,\s\?]+?)\s+(\w+)\s*[=;]'
    
    for line in java_code.split('\n'):
        match = re.match(pattern, line.strip())
        if match:
            field_type = match.group(1).strip()
            field_name = match.group(2).strip()
            fields.append((field_name, field_type))
    
    return fields

def process_java_file(file_path):
    """Process a single Java file to add getters and setters."""
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has @Data annotation
    if '@Data' not in content:
        print(f"  Skipping {file_path} - no @Data annotation")
        return False
    
    # Check if getters/setters already exist
    if 'public ' + content.split('class ')[1].split()[0].strip(':') + ' get' in content:
        print(f"  Skipping {file_path} - appears to already have getters")
        return False
    
    # Extract fields
    fields = extract_fields(content)
    if not fields:
        print(f"  No fields found in {file_path}")
        return False
    
    print(f"  Found {len(fields)} fields")
    
    # Generate getters and setters
    getters_setters = []
    for field_name, field_type in fields:
        getters_setters.append(generate_getter(field_name, field_type))
        getters_setters.append(generate_setter(field_name, field_type))
    
    # Find the position to insert (before the last closing brace)
    lines = content.split('\n')
    
    # Find the last non-empty line with just }
    insert_pos = -1
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() == '}':
            insert_pos = i
            break
    
    if insert_pos == -1:
        print(f"  ERROR: Could not find closing brace in {file_path}")
        return False
    
    # Insert getters and setters
    new_lines = lines[:insert_pos] + getters_setters + [''] + lines[insert_pos:]
    new_content = '\n'.join(new_lines)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✓ Added {len(fields)} getters and {len(fields)} setters to {file_path}")
    return True

def main():
    """Main function to process all Java model and DTO files."""
    backend_path = Path(__file__).parent
    
    # Process model files
    model_dir = backend_path / 'src' / 'main' / 'java' / 'com' / 'licensing' / 'portal' / 'model'
    dto_dir = backend_path / 'src' / 'main' / 'java' / 'com' / 'licensing' / 'portal' / 'dto'
    
    processed = 0
    for directory in [model_dir, dto_dir]:
        if not directory.exists():
            continue
        
        for java_file in directory.glob('*.java'):
            if process_java_file(java_file):
                processed += 1
    
    print(f"\nProcessed {processed} files total")

if __name__ == '__main__':
    main()
