#!/bin/bash
# Script to start the friend link checker

# Change to the project directory
cd "$(dirname "$0")"

# Build the project
echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Please fix the errors and try again."
    exit 1
fi

echo "Build successful. Starting the server..."

# Start the server
npm start