#!/bin/bash

# TFRRS Conference Analytics Startup Script

echo "🏃‍♂️ Starting TFRRS Conference Analytics..."

# Kill any existing process on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Check if python3 is available, otherwise use python
if command -v python3 &> /dev/null; then
    echo "Using python3..."
    python3 app.py
elif command -v python &> /dev/null; then
    echo "Using python..."
    python app.py
else
    echo "❌ Error: Neither python3 nor python found. Please install Python."
    exit 1
fi

echo "📊 Application stopped."
