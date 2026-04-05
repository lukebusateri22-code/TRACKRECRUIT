#!/bin/bash

# Quick test script to verify scrapers work
# Run this before setting up cron job

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "Testing TrackRecruit Scrapers"
echo "=========================================="

# Test Flask scraper
echo ""
echo "1. Testing Flask scraper..."
if curl -s http://localhost:8080/ | grep -q "TFRRS" 2>/dev/null; then
    echo "✅ Flask scraper is running"
else
    echo "❌ Flask scraper is NOT running"
    echo "   Start it with: cd tfrrs-scraper && python3 app.py &"
    exit 1
fi

# Test athlete scraper (just check file exists and is executable)
echo ""
echo "2. Checking athlete scraper..."
if [ -f "$PROJECT_DIR/scripts/athlete-conference-scraper.py" ]; then
    echo "✅ Athlete scraper found"
else
    echo "❌ Athlete scraper not found"
    exit 1
fi

# Test coach scraper
echo ""
echo "3. Checking coach scraper..."
if [ -f "$PROJECT_DIR/scripts/bulk-scrape-conferences.py" ]; then
    echo "✅ Coach scraper found"
else
    echo "❌ Coach scraper not found"
    exit 1
fi

# Check .env.local exists
echo ""
echo "4. Checking environment..."
if [ -f "$PROJECT_DIR/.env.local" ]; then
    echo "✅ .env.local found"
else
    echo "❌ .env.local not found"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ All checks passed!"
echo ""
echo "Ready to run scrapers. Options:"
echo ""
echo "1. Test run now:"
echo "   ./scripts/weekly-scraper-all.sh"
echo ""
echo "2. Set up cron job (Monday 2 AM):"
echo "   crontab -e"
echo "   Add: 0 2 * * 1 cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1"
echo ""
echo "=========================================="
