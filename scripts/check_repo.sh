#!/bin/bash

echo "Running repository integrity checks..."

# Check for huge files
find . -type f -size +10M && echo "Warning: large files found"

# Ensure no temp files
if find . -name "*.tmp" | grep -q .; then
  echo "Temp files found!"
  exit 1
fi

echo "Repo looks clean"
