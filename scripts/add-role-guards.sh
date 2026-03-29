#!/bin/bash

# Script to add RoleGuard import to all athlete and coach pages
# This is a helper script - review changes before committing

echo "Adding RoleGuard to athlete pages..."

# List of athlete page files
ATHLETE_PAGES=(
  "app/athletes/edit/page.tsx"
  "app/athletes/profile/page.tsx"
  "app/athletes/meets/page.tsx"
  "app/athletes/rankings/page.tsx"
  "app/athletes/videos/page.tsx"
  "app/athletes/recruiting-timeline/page.tsx"
  "app/athletes/scholarship-calculator/page.tsx"
  "app/athletes/eligible-schools/page.tsx"
  "app/athletes/compare-schools/page.tsx"
  "app/athletes/network/page.tsx"
  "app/athletes/feed/page.tsx"
  "app/athletes/goals/page.tsx"
  "app/athletes/import-meet/page.tsx"
)

echo "Athlete pages to protect: ${#ATHLETE_PAGES[@]}"

# List of coach page files
COACH_PAGES=(
  "app/coaches/dashboard/page.tsx"
  "app/coaches/page.tsx"
  "app/coaches/preferences/page.tsx"
  "app/coaches/search/page.tsx"
)

echo "Coach pages to protect: ${#COACH_PAGES[@]}"

echo ""
echo "Manual steps required:"
echo "1. Add import: import RoleGuard from '@/components/RoleGuard'"
echo "2. Wrap return statement with: <RoleGuard allowedRole=\"athlete\"> or \"coach\""
echo "3. Close with: </RoleGuard>"
echo ""
echo "Total pages to protect: $((${#ATHLETE_PAGES[@]} + ${#COACH_PAGES[@]}))"
