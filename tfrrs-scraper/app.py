#!/usr/bin/env python3
"""
TFRRS Conference Analytics - Advanced scoring and team rankings
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from flask import Flask, render_template, request, jsonify, send_file
import io
import re
from collections import defaultdict
import urllib3

# Suppress SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# Scoring system for top 8 positions
SCORING_SYSTEM = {
    1: 10,
    2: 8,
    3: 6,
    4: 5,
    5: 4,
    6: 3,
    7: 2,
    8: 1
}

# Event categorization
EVENT_CATEGORIES = {
    'Sprints': ['100', '200', '400'],
    'Distance': ['800', '1500', '3000', '5000', '10000', 'Steeplechase'],
    'Hurdles': ['Hurdles', '60H', '100H', '110H', '400H'],
    'Jumps': ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault'],
    'Throws': ['Shot Put', 'Discus', 'Javelin', 'Hammer', 'Weight'],
    'Relays': ['Relay', '4x100', '4x400'],
    'Combined': ['Pentathlon', 'Heptathlon', 'Decathlon']
}

def categorize_event(event_name):
    """Categorize event based on name"""
    event_upper = event_name.upper()
    
    for category, keywords in EVENT_CATEGORIES.items():
        for keyword in keywords:
            if keyword.upper() in event_upper:
                return category
    
    return 'Other'

def extract_gender(event_name):
    """Extract gender from event name"""
    # Clean up the event name first
    clean_event = ' '.join(event_name.split())
    event_upper = clean_event.upper()
    
    # Check for various gender indicators
    if any(indicator in event_upper for indicator in ['(MEN)', 'MEN\'S', 'MENS', ' MALE ', ' (M)']):
        return 'Men'
    elif any(indicator in event_upper for indicator in ['(WOMEN)', 'WOMEN\'S', 'WOMENS', ' FEMALE ', ' (W)', 'WOM']):
        return 'Women'
    
    # Check for patterns like "800 METERS (MEN)" or "800 METERS (WOMEN)"
    if event_upper.endswith('(MEN)') or event_upper.endswith('(M)'):
        return 'Men'
    elif event_upper.endswith('(WOMEN)') or event_upper.endswith('(W)'):
        return 'Women'
    
    return 'Unknown'

def scrape_performance_list(url):
    """Scrape performance data from TFRRS performance list page"""
    resp = requests.get(url, headers=HEADERS, verify=False)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    all_records = []

    # Find all event headers (h3 tags)
    event_headers = soup.find_all("h3")
    
    for h3 in event_headers:
        event_name = h3.get_text(strip=True)
        
        # Skip non-event headers
        if not any(keyword in event_name for keyword in ['Meters', 'Jump', 'Vault', 'Put', 'Relay', 'Throw', 'athlon', 'Hurdles', 'Steeplechase', 'Discus', 'Javelin', 'Hammer']):
            continue
        
        # Clean up the event name for display
        clean_event_name = ' '.join(event_name.split())

        # Find the performance list div that comes after this h3
        performance_list = h3.find_next('div', class_='performance-list')
        if not performance_list:
            continue

        # Find all rows in this performance list
        rows = performance_list.find_all('div', class_='performance-list-row')
        
        for row in rows:
            try:
                # Extract data from each column div
                rank_div = row.find('div', class_='col-place')
                athlete_div = row.find('div', class_='col-athlete')
                year_div = row.find('div', class_='col-narrow')
                team_div = row.find('div', class_='col-team')
                mark_div = row.find_all('div', class_='col-narrow')[1] if len(row.find_all('div', class_='col-narrow')) > 1 else None
                meet_div = row.find('div', class_='col-meet')
                date_div = row.find_all('div', class_='col-narrow')[2] if len(row.find_all('div', class_='col-narrow')) > 2 else None
                wind_div = row.find_all('div', class_='col-narrow')[3] if len(row.find_all('div', class_='col-narrow')) > 3 else None
                
                # Get athlete URL if available
                ath_url = ''
                if athlete_div and athlete_div.find('a'):
                    ath_url = athlete_div.find('a').get('href', '')
                
                # Extract text content
                rank = rank_div.get_text(strip=True) if rank_div else ''
                athlete = athlete_div.get_text(strip=True) if athlete_div else ''
                year = year_div.get_text(strip=True) if year_div else ''
                team = team_div.get_text(strip=True) if team_div else ''
                mark = mark_div.get_text(strip=True) if mark_div else ''
                meet = meet_div.get_text(strip=True) if meet_div else ''
                date = date_div.get_text(strip=True) if date_div else ''
                wind = wind_div.get_text(strip=True) if wind_div else ''
                
                # Convert rank to integer for scoring
                try:
                    rank_int = int(rank)
                except (ValueError, TypeError):
                    rank_int = 999  # High rank for non-scoring positions
                
                all_records.append({
                    'event': clean_event_name,
                    'rank': rank_int,
                    'athlete': athlete,
                    'ath_url': ath_url,
                    'year': year,
                    'team': team,
                    'mark': mark,
                    'meet': meet,
                    'date': date,
                    'wind': wind,
                    'category': categorize_event(clean_event_name),
                    'gender': extract_gender(clean_event_name)
                })
            except Exception as e:
                continue

    return pd.DataFrame(all_records)

def calculate_team_scores(df):
    """Calculate team scores with scoring system, tie handling, and 4-athlete-per-team limit"""
    team_scores = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    event_breakdown = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    # Group by event and gender to handle ties within each event
    for (event, gender), event_df in df.groupby(['event', 'gender']):
        # Get athletes in top 8 positions
        top_8 = event_df[event_df['rank'] <= 8].copy()
        
        # RULE: Each team can only have 4 athletes score per event
        # Track how many athletes from each team have scored in this event
        team_athlete_count = defaultdict(int)
        
        # Filter athletes - only keep first 4 per team
        valid_athletes = []
        for _, row in top_8.iterrows():
            team = row['team']
            if team_athlete_count[team] < 4:
                valid_athletes.append(row)
                team_athlete_count[team] += 1
        
        # Convert back to DataFrame
        if not valid_athletes:
            continue
        valid_df = pd.DataFrame(valid_athletes)
        
        # Re-rank athletes after removing 5th+ team members
        # Sort by original rank to maintain order
        valid_df = valid_df.sort_values('rank')
        
        # Assign new ranks (1-8 based on position after filtering)
        new_ranks = {}
        current_rank = 1
        for idx, row in valid_df.iterrows():
            new_ranks[idx] = current_rank
            current_rank += 1
        
        # Calculate points for each rank, handling ties
        rank_counts = valid_df['rank'].value_counts().to_dict()
        
        for idx, row in valid_df.iterrows():
            team = row['team']
            category = row['category']
            original_rank = row['rank']
            new_rank = new_ranks[idx]
            
            # Only score top 8 positions
            if new_rank <= 8 and new_rank in SCORING_SYSTEM:
                # Check if there's a tie at this rank (using original ranks for tie detection)
                num_tied = rank_counts.get(original_rank, 1)
                
                if num_tied > 1:
                    # Average the points for tied positions
                    # For example, if 2 athletes tie for 1st, they get (10+8)/2 = 9 points each
                    total_points = sum(SCORING_SYSTEM.get(new_rank + i, 0) for i in range(num_tied))
                    points = round(total_points / num_tied, 2)  # Round to 2 decimal places
                else:
                    # No tie, use standard points
                    points = round(float(SCORING_SYSTEM[new_rank]), 2)  # Round to 2 decimal places
                
                # Add to team total
                team_scores[gender][team][category] += points
                team_scores[gender][team]['total'] += points
                
                # Track event breakdown
                event_breakdown[gender][team][category].append({
                    'event': event,
                    'rank': new_rank,
                    'points': points,
                    'athlete': row['athlete'],
                    'mark': row['mark']
                })
    
    return team_scores, event_breakdown

def generate_rankings(team_scores):
    """Generate team rankings by gender"""
    rankings = {}
    
    for gender in team_scores:
        # Sort teams by total points
        sorted_teams = sorted(
            [(team, scores['total']) for team, scores in team_scores[gender].items()],
            key=lambda x: x[1],
            reverse=True
        )
        
        rankings[gender] = []
        for rank, (team, total_points) in enumerate(sorted_teams, 1):
            team_data = team_scores[gender][team].copy()
            team_data['team'] = team
            team_data['rank'] = rank
            rankings[gender].append(team_data)
    
    return rankings

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'Please provide a TFRRS URL'}), 400
        
        if 'tfrrs.org' not in url:
            return jsonify({'error': 'Please provide a valid TFRRS.org URL'}), 400
        
        # Scrape the data
        df = scrape_performance_list(url)
        
        if df.empty:
            return jsonify({'error': 'No performance data found on the page'}), 404
        
        # Calculate scores and rankings
        team_scores, event_breakdown = calculate_team_scores(df)
        rankings = generate_rankings(team_scores)
        
        # Generate summary statistics
        total_events = df['event'].nunique()
        total_athletes = len(df)
        unique_teams = df['team'].nunique()
        
        # Find leading teams
        men_leader = rankings.get('Men', [{}])[0].get('team', 'N/A') if rankings.get('Men') else 'N/A'
        women_leader = rankings.get('Women', [{}])[0].get('team', 'N/A') if rankings.get('Women') else 'N/A'
        
        summary = {
            'total_events': total_events,
            'total_athletes': total_athletes,
            'unique_teams': unique_teams,
            'men_leader': men_leader,
            'women_leader': women_leader
        }
        
        return jsonify({
            'success': True,
            'summary': summary,
            'rankings': rankings,
            'event_breakdown': dict(event_breakdown),
            'raw_data': df.to_dict('records')[:100],  # Limit raw data for performance
            'categories': list(EVENT_CATEGORIES.keys())
        })
        
    except requests.RequestException as e:
        return jsonify({'error': f'Failed to fetch the URL: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/team_details/<gender>/<team_name>', methods=['POST'])
def team_details(gender, team_name):
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'Please provide a TFRRS URL'}), 400
        
        df = scrape_performance_list(url)
        team_scores, event_breakdown = calculate_team_scores(df)
        
        # Get detailed breakdown for this team
        team_data = event_breakdown.get(gender, {}).get(team_name, {})
        
        return jsonify({
            'success': True,
            'team_data': dict(team_data),
            'team_scores': team_scores.get(gender, {}).get(team_name, {})
        })
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/download', methods=['POST'])
def download():
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'Please provide a TFRRS URL'}), 400
        
        df = scrape_performance_list(url)
        
        if df.empty:
            return jsonify({'error': 'No performance data found on the page'}), 404
        
        # Create CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        # Generate filename from URL
        match = re.search(r'/lists/(\d+)', url)
        list_id = match.group(1) if match else 'performance_list'
        filename = f'tfrrs_{list_id}.csv'
        
        # Create file-like object for download
        mem = io.BytesIO()
        mem.write(output.getvalue().encode('utf-8'))
        mem.seek(0)
        
        return send_file(
            mem,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/enhanced_graduation_analysis', methods=['POST'])
def enhanced_graduation_analysis():
    data = request.get_json()
    url = data.get('url', '').strip()
    
    try:
        df = scrape_performance_list(url)
        team_scores, event_breakdown = calculate_team_scores(df)
        
        # Calculate enhanced graduation losses with category breakdowns
        graduation_analysis = {}
        
        for gender in ['Men', 'Women']:
            graduation_analysis[gender] = {}
            
            for team_name in team_scores.get(gender, {}):
                team_data = event_breakdown.get(gender, {}).get(team_name, {})
                senior_points = 0
                senior_performances = []
                category_breakdown = {}
                
                for category, performances in team_data.items():
                    category_senior_points = 0
                    category_senior_performances = []
                    
                    for perf in performances:
                        # Check if athlete is a senior (SR-4, SR-3, SR-2, SR-1 will graduate)
                        athlete_name = perf.get('athlete', '').upper()
                        if 'SR-4' in athlete_name or 'SR-3' in athlete_name or 'SR-2' in athlete_name or 'SR-1' in athlete_name:
                            senior_points += perf['points']
                            senior_performances.append({
                                'athlete': perf['athlete'],
                                'event': perf['event'],
                                'points': perf['points'],
                                'mark': perf['mark'],
                                'category': category
                            })
                            
                            category_senior_points += perf['points']
                            category_senior_performances.append({
                                'athlete': perf['athlete'],
                                'event': perf['event'],
                                'points': perf['points'],
                                'mark': perf['mark']
                            })
                    
                    # Add category breakdown if there are senior losses
                    if category_senior_points > 0:
                        category_breakdown[category] = {
                            'senior_points_lost': category_senior_points,
                            'total_points': team_scores[gender][team_name].get(category, 0),
                            'performances': category_senior_performances
                        }
                
                # Sort senior performances by points (highest first)
                senior_performances.sort(key=lambda x: x['points'], reverse=True)
                
                graduation_analysis[gender][team_name] = {
                    'senior_points_lost': senior_points,
                    'total_points': team_scores[gender][team_name].get('total', 0),
                    'percentage_lost': round((senior_points / team_scores[gender][team_name].get('total', 1)) * 100, 1),
                    'senior_performances': senior_performances[:10],  # Top 10 senior performances
                    'category_breakdown': category_breakdown
                }
        
        return jsonify({
            'success': True,
            'analysis': graduation_analysis
        })
        
    except Exception as e:
        return jsonify({'error': f'Enhanced graduation analysis failed: {str(e)}'}), 500

@app.route('/graduation_analysis', methods=['POST'])
def graduation_analysis():
    data = request.get_json()
    url = data.get('url', '').strip()
    
    try:
        df = scrape_performance_list(url)
        team_scores, event_breakdown = calculate_team_scores(df)
        
        # Calculate graduation losses
        graduation_analysis = {}
        
        for gender in ['Men', 'Women']:
            graduation_analysis[gender] = {}
            
            for team_name in team_scores.get(gender, {}):
                team_data = event_breakdown.get(gender, {}).get(team_name, {})
                senior_points = 0
                senior_performances = []
                
                for category, performances in team_data.items():
                    for perf in performances:
                        # Check if athlete is a senior (SR-4, SR-3, SR-2, SR-1 will graduate)
                        athlete_name = perf.get('athlete', '').upper()
                        if 'SR-4' in athlete_name or 'SR-3' in athlete_name or 'SR-2' in athlete_name or 'SR-1' in athlete_name:
                            senior_points += perf['points']
                            senior_performances.append({
                                'athlete': perf['athlete'],
                                'event': perf['event'],
                                'points': perf['points'],
                                'mark': perf['mark']
                            })
                
                graduation_analysis[gender][team_name] = {
                    'senior_points_lost': senior_points,
                    'total_points': team_scores[gender][team_name].get('total', 0),
                    'percentage_lost': round((senior_points / team_scores[gender][team_name].get('total', 1)) * 100, 1),
                    'senior_performances': senior_performances[:10]  # Top 10 senior performances
                }
        
        return jsonify({
            'success': True,
            'analysis': graduation_analysis
        })
        
    except Exception as e:
        return jsonify({'error': f'Graduation analysis failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
