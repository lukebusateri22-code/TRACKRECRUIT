# TFFRS Analytics Dashboard Setup

## What I Built

Created a **complete TFFRS analytics dashboard** with team drill-down capabilities:

### Pages Created:
1. **Main Analytics Page** (`/tffrs-analytics`)
   - Separate Men's and Women's team rankings
   - Overall conference statistics
   - Click any team to see details

2. **Team Detail Page** (`/tffrs-analytics/team/[gender]/[team]`)
   - Team overview with total points and rank
   - Event category breakdown (Sprints, Distance, Hurdles, etc.)
   - Top 5 performances in each category
   - Click any category to see all results

3. **Category Detail Page** (`/tffrs-analytics/team/[gender]/[team]/category/[category]`)
   - Complete list of all performances in that category
   - Ranking, athlete, performance, and points for each
   - Summary statistics (best finish, scoring performances, etc.)

### Features:
- ✅ **Separate Men's and Women's rankings** (not combined)
- ✅ **Team drill-down** with event group stats
- ✅ **Category drill-down** with full athlete data
- ✅ **Responsive design** with modern UI
- ✅ **CORS proxy** to connect to your Flask scraper
- ✅ **Loading states** and error handling

---

## Setup Instructions

### 1. Start Your TFFRS Scraper
```bash
cd /Users/cn424694/Milesplit\ Like/tfrrs-scraper
./start.sh
# Or: python3 app.py
```

The Flask app should be running on `http://localhost:8080`

### 2. Start Next.js Dev Server
```bash
cd /Users/cn424694/Milesplit\ Like
npm run dev
```

### 3. Access the Dashboard
Go to: **http://localhost:3000/tffrs-analytics**

---

## How to Use

1. **Enter a TFFRS URL** (pre-filled with Ohio Valley example)
2. **Click "Analyze"** to fetch team rankings
3. **View separate Men's and Women's rankings**
4. **Click any team** (e.g., "Little Rock") to see:
   - Team overview with rank and points
   - Event category breakdown
   - Top performances in each category
5. **Click any category** (e.g., "Sprints") to see:
   - All performances in that category
   - Detailed athlete information
   - Summary statistics

---

## Navigation Flow
```
Main Rankings → Team Detail → Category Detail
     ↓              ↓              ↓
  All Teams    Event Groups   All Athletes
```

The dashboard provides a complete drill-down experience from conference rankings down to individual athlete performances!
