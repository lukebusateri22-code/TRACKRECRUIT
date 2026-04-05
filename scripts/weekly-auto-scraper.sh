#!/bin/bash

# Weekly Auto-Scraper for TrackRecruit
# This script runs the conference scraper for all conferences
# Designed to be run via cron job every week

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "TrackRecruit Weekly Auto-Scraper"
echo "Started: $(date)"
echo "=========================================="

# Check if Flask scraper is running
echo ""
echo "1. Checking Flask scraper status..."
if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "❌ Flask scraper is not running!"
    echo "Starting Flask scraper..."
    cd "$PROJECT_DIR/tfrrs-scraper"
    nohup python3 app.py > /tmp/flask-scraper.log 2>&1 &
    FLASK_PID=$!
    echo "Flask scraper started with PID: $FLASK_PID"
    sleep 5
    
    # Verify it started
    if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo "❌ Failed to start Flask scraper"
        exit 1
    fi
else
    echo "✅ Flask scraper is running"
fi

# Run the athlete conference scraper
echo ""
echo "2. Running athlete conference scraper..."
cd "$PROJECT_DIR"
python3 scripts/athlete-conference-scraper.py

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Scraping completed successfully!"
    echo "Finished: $(date)"
    
    # Optional: Send notification (uncomment to enable)
    # curl -X POST https://your-notification-service.com/notify \
    #   -H "Content-Type: application/json" \
    #   -d '{"message": "TrackRecruit weekly scrape completed successfully"}'
else
    echo ""
    echo "❌ Scraping failed!"
    echo "Check logs for details"
    exit 1
fi

echo "=========================================="
