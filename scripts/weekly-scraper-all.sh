#!/bin/bash

# Weekly Scraper - Runs ALL scrapers for TrackRecruit
# Designed to run every Monday at 2 AM via cron
# Scrapes both athlete and coach conference data

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "TrackRecruit Weekly Scraper - ALL DATA"
echo "Started: $(date)"
echo "=========================================="

# Check if Flask scraper is running
echo ""
echo "1. Checking Flask scraper status..."
if ! curl -s http://localhost:8080/ | grep -q "TFRRS" 2>/dev/null; then
    echo "❌ Flask scraper is not running!"
    echo "Starting Flask scraper..."
    cd "$PROJECT_DIR/tfrrs-scraper"
    nohup python3 app.py > /tmp/flask-scraper.log 2>&1 &
    FLASK_PID=$!
    echo "Flask scraper started with PID: $FLASK_PID"
    sleep 5
    
    # Verify it started
    if ! curl -s http://localhost:8080/ | grep -q "TFRRS" 2>/dev/null; then
        echo "❌ Failed to start Flask scraper"
        exit 1
    fi
else
    echo "✅ Flask scraper is running"
fi

# Run athlete conference scraper
echo ""
echo "2. Running ATHLETE conference scraper..."
echo "   This scrapes top 8 per event for athlete rankings"
cd "$PROJECT_DIR"
python3 scripts/athlete-conference-scraper.py

if [ $? -ne 0 ]; then
    echo "❌ Athlete scraper failed!"
    exit 1
fi

echo "✅ Athlete scraper completed"

# Run coach conference scraper (bulk scraper)
echo ""
echo "3. Running COACH conference scraper..."
echo "   This scrapes full conference data for coach analytics"
cd "$PROJECT_DIR"
python3 scripts/bulk-scrape-conferences.py

if [ $? -ne 0 ]; then
    echo "❌ Coach scraper failed!"
    exit 1
fi

echo "✅ Coach scraper completed"

# Summary
echo ""
echo "=========================================="
echo "✅ ALL SCRAPERS COMPLETED SUCCESSFULLY!"
echo "Finished: $(date)"
echo ""
echo "Summary:"
echo "  - Athlete conference data updated (top 8 per event)"
echo "  - Coach conference data updated (full analytics)"
echo "=========================================="

# Optional: Send notification (uncomment to enable)
# curl -X POST https://your-notification-service.com/notify \
#   -H "Content-Type: application/json" \
#   -d '{"message": "TrackRecruit weekly scrape completed successfully"}'
