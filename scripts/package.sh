#!/bin/bash

echo "Packaging repository..."

mkdir -p dist
tar -czf dist/build.tar.gz .

echo "Done."
