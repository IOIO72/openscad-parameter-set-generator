#!/bin/bash

# Check if both arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <path_to_scad_file> <path_to_json_file>"
  exit 1
fi

# Paths to the SCAD and JSON files
SCAD_FILE="$1"
JSON_FILE="$2"

# Paths to the directories
OUTPUT_DIR="$(pwd)/output"
STL_DIR="$(pwd)/stl"

# Step 1: Empty the output directory if it exists
if [ -d "$OUTPUT_DIR" ]; then
  rm -rf "$OUTPUT_DIR"/*.scad
fi

# Step 2: Execute createParameterSetFiles.mjs with the arguments
node "$(dirname "$0")/createParameterSetFiles.mjs" "$SCAD_FILE" "$JSON_FILE"

# Step 3: Empty the stl directory if it exists
if [ -d "$STL_DIR" ]; then
  rm -rf "$STL_DIR"/*.stl
fi

# Step 4: Execute renderFiles.mjs
node "$(dirname "$0")/renderFiles.mjs"