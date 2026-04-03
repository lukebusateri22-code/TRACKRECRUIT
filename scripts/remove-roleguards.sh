#!/bin/bash

# Script to remove RoleGuard from all athlete pages

echo "🔧 Removing RoleGuard from athlete pages..."

# List of files to update
files=(
  "app/athletes/profile/page.tsx"
  "app/athletes/rankings/page.tsx"
  "app/athletes/import-meet/page.tsx"
  "app/athletes/recruiting-timeline/page.tsx"
  "app/athletes/feed/page.tsx"
  "app/athletes/update-pr/page.tsx"
  "app/athletes/compare-schools/page.tsx"
  "app/athletes/search-colleges/page.tsx"
  "app/athletes/recruiting/page.tsx"
  "app/athletes/videos/page.tsx"
  "app/athletes/scholarship-calculator/page.tsx"
  "app/athletes/goals/page.tsx"
  "app/athletes/settings/page.tsx"
  "app/athletes/edit/page.tsx"
  "app/athletes/eligible-schools/page.tsx"
  "app/athletes/colleges/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Remove RoleGuard import
    sed -i '' "/import RoleGuard from '@\/components\/RoleGuard'/d" "$file"
    
    # Remove opening RoleGuard tag
    sed -i '' 's/<RoleGuard allowedRole="athlete">//g' "$file"
    
    # Remove closing RoleGuard tag
    sed -i '' 's/<\/RoleGuard>//g' "$file"
    
    echo "✅ Updated $file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "✨ Done! All RoleGuards removed from athlete pages"
