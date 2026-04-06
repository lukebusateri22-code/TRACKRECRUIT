# Scraper Performance Analysis - Deep Dive

## Problem Statement
1. **Duplicate Data:** Athlete scraper creates duplicate entries (see screenshot - same athlete appears 4 times for rank 1)
2. **Performance:** Coach scraper is faster despite getting MORE data
3. **Goal:** Optimize athlete scraper to match coach scraper performance and eliminate duplicates

---

## Performance Comparison

| Metric | Athlete Scraper | Coach Scraper | Difference |
|--------|----------------|---------------|------------|
| **Duration** | ~45 minutes | ~30 minutes | **15 min slower** |
| **Conferences** | 31 | 31 | Same |
| **Data Volume** | 7,293 performances | Full raw data | More processing |
| **Database Writes** | ~7,300 INSERTs | 31 UPSERTs | **235x more writes** |
| **API Calls** | ~7,300+ | ~62 | **117x more calls** |
| **Delay Between** | 2 seconds | 1 second | 2x slower |

---

## Root Cause Analysis

### Why Coach Scraper is Faster

#### 1. **Single Write Per Conference**
```python
# Coach scraper - ONE write per conference
conference_data = {
    'url': url,
    'conference_name': conference_name,
    'data': data,  # Saves ALL data in one JSON blob
    'scraped_at': datetime.now().isoformat()
}
# Single UPSERT
requests.patch(update_url, headers=headers, json=conference_data)
```

**Result:** 31 total database operations (1 per conference)

#### 2. **UPSERT Instead of INSERT**
```python
# Coach scraper checks if exists, then updates
if response.status_code == 200 and response.json():
    # Update existing
    requests.patch(update_url, headers=headers, json=conference_data)
else:
    # Insert new
    requests.post(insert_url, headers=headers, json=conference_data)
```

**Result:** No duplicates, always updates existing data

#### 3. **Minimal Processing**
- Scrapes data
- Saves raw JSON
- Done

**Result:** No nested loops, no data extraction

---

### Why Athlete Scraper is Slower

#### 1. **Individual Writes Per Performance**
```python
# Athlete scraper - ONE write per performance
for event_name, team_performances in event_breakdown.items():
    for team_name, categories in team_performances.items():
        for category, performances in categories.items():
            for perf in performances:
                # Individual INSERT for each performance
                insert_performance(team_id, athlete_name, ...)
```

**Result:** 7,293 individual INSERT operations

#### 2. **No Duplicate Prevention**
```python
# Athlete scraper just inserts without checking
def insert_performance(team_id, athlete_name, event_name, ...):
    insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_performances"
    perf_data = {...}
    response = requests.post(insert_url, headers=headers, json=perf_data)
    # No check if already exists!
```

**Result:** Running scraper twice creates duplicates

#### 3. **Multiple API Calls Per Conference**
```python
# For each conference:
get_or_create_conference()  # 1 GET + maybe 1 POST
for each team:
    get_or_create_team()     # 1 GET + maybe 1 POST per team (~15 teams)
for each performance:
    insert_performance()      # 1 POST per performance (~235 performances)
```

**Result:** ~250 API calls per conference × 31 conferences = **7,750 API calls**

#### 4. **Nested Loops**
```python
for event_name in event_breakdown:           # ~30 events
    for team_name in team_performances:      # ~15 teams
        for category in categories:          # ~3 categories
            for perf in performances:        # ~8 performances
                insert_performance()
```

**Result:** Massive processing overhead

---

## Why Duplicates Occur

### Screenshot Analysis
The image shows **Gleason, Sullivan** appearing 4 times with:
- Same rank (1)
- Same mark (5.15m)
- Same points (10)

### Root Cause
```python
# Athlete scraper has NO duplicate check
def insert_performance(team_id, athlete_name, event_name, ...):
    # Just blindly inserts
    response = requests.post(insert_url, headers=headers, json=perf_data)
```

**When scraper runs multiple times:**
1. First run: Inserts Gleason, Sullivan
2. Second run: Inserts Gleason, Sullivan AGAIN
3. Third run: Inserts Gleason, Sullivan AGAIN
4. Result: 4 identical entries

**Why coach scraper doesn't have this:**
```python
# Coach scraper checks first
check_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.{url}"
response = requests.get(check_url, headers=headers)

if response.status_code == 200 and response.json():
    # Update existing - NO DUPLICATE
    requests.patch(update_url, ...)
```

---

## Solution: Optimize Athlete Scraper

### Strategy 1: Batch Inserts (Fastest)
Instead of 7,293 individual INSERTs, do batch inserts:

```python
# Collect all performances first
all_performances = []

for event_name, team_performances in event_breakdown.items():
    for team_name, categories in team_performances.items():
        for category, performances in categories.items():
            for perf in performances:
                all_performances.append({
                    'team_id': team_id,
                    'athlete_name': perf['athlete'],
                    'event_name': perf.get('event', event_name),
                    'event_category': category,
                    'mark': perf['mark'],
                    'rank': perf['rank'],
                    'points': perf.get('points', 0)
                })

# Single batch insert
insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_performances"
response = requests.post(insert_url, headers=headers, json=all_performances)
```

**Performance Improvement:**
- Before: 7,293 API calls
- After: 31 API calls (1 per conference)
- **Speedup: 235x faster**

### Strategy 2: Delete Before Insert (Prevent Duplicates)
```python
# Before inserting performances for a conference, delete old ones
def delete_conference_performances(conference_id):
    # Get all team IDs for this conference
    teams_url = f"{SUPABASE_URL}/rest/v1/tffrs_teams?conference_id=eq.{conference_id}&select=id"
    teams = requests.get(teams_url, headers=headers).json()
    team_ids = [t['id'] for t in teams]
    
    # Delete all performances for these teams
    for team_id in team_ids:
        delete_url = f"{SUPABASE_URL}/rest/v1/tffrs_performances?team_id=eq.{team_id}"
        requests.delete(delete_url, headers=headers)
```

### Strategy 3: UPSERT with Unique Constraint (Best)
Add unique constraint to database:

```sql
-- Add unique constraint to prevent duplicates
ALTER TABLE tffrs_performances 
ADD CONSTRAINT unique_performance 
UNIQUE (team_id, athlete_name, event_name, rank);
```

Then use UPSERT:
```python
# Use UPSERT instead of INSERT
headers['Prefer'] = 'resolution=merge-duplicates'
response = requests.post(insert_url, headers=headers, json=all_performances)
```

---

## Recommended Implementation

### Phase 1: Add Duplicate Prevention (Immediate)
1. Add unique constraint to database
2. Use UPSERT instead of INSERT
3. Delete old data before inserting new

### Phase 2: Batch Inserts (Performance)
1. Collect all performances in memory
2. Single batch insert per conference
3. Reduce from 7,293 to 31 API calls

### Phase 3: Optimize Loops (Further Optimization)
1. Flatten nested loops
2. Use list comprehensions
3. Parallel processing for conferences

---

## Expected Performance After Optimization

| Metric | Current | Optimized | Improvement |
|--------|---------|-----------|-------------|
| **Duration** | 45 min | ~10 min | **4.5x faster** |
| **API Calls** | 7,750 | 93 | **83x fewer** |
| **Duplicates** | Yes | No | **100% fixed** |
| **Database Load** | High | Low | **Minimal** |

---

## Implementation Priority

### High Priority (Do Now)
1. ✅ Add unique constraint to prevent duplicates
2. ✅ Delete old performances before inserting new
3. ✅ Batch insert performances

### Medium Priority (Do Soon)
4. ⚠️ Optimize nested loops
5. ⚠️ Add progress indicators
6. ⚠️ Better error handling

### Low Priority (Nice to Have)
7. ⏳ Parallel processing
8. ⏳ Caching team IDs
9. ⏳ Connection pooling

---

## Code Changes Required

### 1. Add Unique Constraint (SQL)
```sql
ALTER TABLE tffrs_performances 
ADD CONSTRAINT unique_performance 
UNIQUE (team_id, athlete_name, event_name, rank);
```

### 2. Delete Before Insert (Python)
```python
def clear_conference_data(conference_id):
    """Delete all performances for a conference before re-scraping"""
    # Implementation in optimized scraper
```

### 3. Batch Insert (Python)
```python
def batch_insert_performances(performances):
    """Insert all performances in a single API call"""
    # Implementation in optimized scraper
```

---

## Summary

**Why Coach Scraper is Faster:**
- 1 write per conference vs 235 writes
- UPSERT prevents duplicates
- No nested loops
- Minimal processing

**Why Athlete Scraper is Slower:**
- 7,293 individual writes
- No duplicate prevention
- Nested loops (4 levels deep)
- Massive API overhead

**Solution:**
- Batch inserts: 235x fewer API calls
- Unique constraints: No duplicates
- Delete before insert: Clean data
- Expected: 4.5x faster, no duplicates
