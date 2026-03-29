# TFRRS Conference Analytics

A comprehensive web application for analyzing TFRRS (Track & Field Results Reporting System) conference performance data with advanced scoring, team rankings, and detailed analytics.

## Features

### 🏆 **Scoring System**
- Top 8 athletes per event score points (10-8-6-5-4-3-2-1)
- Automatic point calculation based on finishing positions
- Gender-separated scoring for Men's and Women's divisions

### 📊 **Team Analytics**
- **Separate Rankings**: Men's and Women's team standings
- **Event Categories**: Sprints, Distance, Jumps, Throws, Hurdles, Relays, Combined
- **Drill-Down Navigation**: Rankings → Team Details → Event Group Details
- **Interactive UI**: Click teams and categories for detailed breakdowns

### 🎨 **Modern Interface**
- **Dark Theme**: Professional glass morphism design
- **Responsive Layout**: Works on all devices
- **Interactive Charts**: Visual analytics with Chart.js
- **Clean Metrics**: Summary cards and performance insights

### 📋 **Data Management**
- **CSV Export**: Download complete datasets
- **Real-time Analysis**: Instant processing of TFRRS URLs
- **Error Handling**: Robust data validation and user feedback

## Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Setup

1. **Clone or download the project folder**
2. **Create virtual environment**:
   ```bash
   python -m venv tfrrs_env
   source tfrrs_env/bin/activate  # On Windows: tfrrs_env\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Open in browser**: Navigate to `http://localhost:8080`

## Usage

### Basic Workflow

1. **Enter TFRRS URL**: Use any TFRRS conference performance list URL
2. **Load Data**: Click "Load Conference Data" to analyze
3. **View Rankings**: See separate Men's and Women's team standings
4. **Explore Teams**: Click any team to see detailed breakdowns
5. **Drill Down**: Click event categories to see individual performances
6. **Export Data**: Download CSV for further analysis

### Example URLs
- OVC Outdoor: `https://www.tfrrs.org/lists/5675/Ohio_Valley_OVC_Outdoor_Performance_List`
- OVC Indoor: `https://www.tfrrs.org/lists/5674/Ohio_Valley_OVC_Indoor_Performance_List`

## Project Structure

```
tfrrs-scraper/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
└── templates/
    └── index.html        # Frontend interface
```

## Technology Stack

- **Backend**: Python, Flask, BeautifulSoup, pandas
- **Frontend**: HTML5, Tailwind CSS, JavaScript, Chart.js
- **Icons**: Lucide Icons
- **Data**: TFRRS.org API scraping

## API Endpoints

- `POST /analyze` - Analyze TFRRS conference data
- `POST /download` - Download CSV export
- `GET /` - Main web interface

## Scoring System

| Rank | Points |
|------|--------|
| 1st  | 10     |
| 2nd  | 8      |
| 3rd  | 6      |
| 4th  | 5      |
| 5th  | 4      |
| 6th  | 3      |
| 7th  | 2      |
| 8th  | 1      |

## Event Categories

- **Sprints**: 100m, 200m, 400m
- **Distance**: 800m, 1500m, 3000m, 5000m, 10000m, Steeplechase
- **Hurdles**: 60H, 100H, 110H, 400H
- **Jumps**: Long Jump, Triple Jump, High Jump, Pole Vault
- **Throws**: Shot Put, Discus, Javelin, Hammer, Weight
- **Relays**: 4x100, 4x400
- **Combined**: Pentathlon, Heptathlon, Decathlon

## Troubleshooting

### Common Issues

1. **Port 8080 in use**: Change port in `app.py` or kill existing process
2. **Dependencies errors**: Ensure virtual environment is activated
3. **TFRRS URL errors**: Verify URL is valid TFRRS performance list
4. **No data found**: Check if TFRRS page structure has changed

### Debug Mode

The application runs in debug mode by default. Check console output for detailed error information.

## License

This project is for educational and analytical purposes. Please respect TFRRS.org terms of service when using this tool.

## Contributing

Feel free to submit issues and enhancement requests!
