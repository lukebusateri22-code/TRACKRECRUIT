# TrackRecruit Platform Prototype

A modern, fully-functional prototype of the TrackRecruit recruiting platform - Where Track Athletes Meet College Programs.

## Overview

TrackRecruit is a comprehensive digital platform connecting high school track and field athletes with college programs nationwide. This prototype demonstrates the core functionality and user experience of the platform.

## Design Philosophy

### Two Distinct User Experiences

**For Coaches: Utility-Focused, Straight to the Point**
- Clean, minimal interface prioritizing function over form
- Table-based layouts for quick scanning
- Simple borders and white backgrounds
- Fast access to search, messages, and preferences
- No unnecessary visual flourishes
- Data-dense displays for efficient decision making

**For Athletes: Rich, Engaging, Feature-Packed**
- Vibrant colors and dynamic layouts
- Meet results with medal placements and PR badges
- National rankings with trending indicators
- Upcoming meets calendar with registration
- School branding integration
- Social proof and achievement highlights

## Features

### Landing Page
- **Hero Section**: Compelling value proposition with call-to-action
- **Feature Showcase**: 6 key platform benefits with icons
- **Coach Section**: Dedicated area highlighting coach features
- **Responsive Design**: Optimized for all devices

### Athlete Dashboard (`/athletes`)
- **Profile Overview**: Complete athlete profile with PRs, academics, and achievements
- **Activity Feed**: Real-time updates on coach views and messages
- **Quick Stats**: Profile views, messages, saved schools, and completion percentage
- **Quick Actions**: Easy access to profile editing, video uploads, eligible schools, and search
- **Upcoming Deadlines**: NCAA registration, test dates, and competitions
- **Eligible Schools Link**: Quick access to see which schools you qualify for

### Athlete Meet Results (`/athletes/meets`)
- **Meet History**: Complete results from all competitions with placements and times
- **PR Tracking**: Automatic PR badges on personal records
- **Points System**: Track scoring across meets
- **Upcoming Meets Calendar**: Register for national and regional competitions
- **Meet Details**: Venue, location, entry deadlines, and event registration
- **Competition Insights**: Why compete, level of competition, coach attendance

### Athlete Rankings (`/athletes/rankings`)
- **National Rankings**: See your position in national leaderboards by event
- **Class-Based Rankings**: Filter by graduation year (2025-2028)
- **Event Selection**: View rankings for all your events
- **Trending Indicators**: Up/down/same arrows showing ranking movement
- **Your Position Highlight**: Special highlighting for your ranking
- **Goal Tracking**: See what times needed to reach top 5, top 10, etc.
- **Recruiting Impact**: How many D1 programs your ranking qualifies you for

### Coach Dashboard (`/coaches/dashboard`)
- **Utility-Focused Design**: Clean, table-based interface for quick scanning
- **New Matches Table**: Sortable list of qualified athletes with key stats
- **Quick Stats**: Athletes watched, prospects, conversations, commits
- **Recent Activity Feed**: Simple list of athlete updates
- **Quick Actions**: Direct access to search, messages, preferences, export
- **Active Filters Display**: See current performance standards at a glance
- **Class Tracking**: Commitments and scholarship allocation

### Search & Discovery (`/search`)
- **Dual Search**: Toggle between searching colleges and athletes
- **Advanced Filters**: Division, conference, region, events, GPA, location
- **Match Scores**: Algorithm-based compatibility percentages
- **Detailed Cards**: Comprehensive athlete/college information
- **Save & Contact**: Star favorites and direct messaging

### Messaging System (`/messages`)
- **Real-time Conversations**: Chat interface with coaches/athletes
- **Conversation List**: All active conversations with unread indicators
- **NCAA Compliance**: Built-in compliance monitoring and logging
- **File Attachments**: Support for sharing documents and videos
- **Search**: Find specific conversations quickly

### 🎯 Performance-Based Filtering System (NEW!)

#### For Coaches (`/coaches/preferences`)
- **Set Performance Standards**: Define minimum and maximum performance requirements for each event
- **Event-Specific Thresholds**: Configure standards for sprints, middle distance, distance, hurdles, and field events
- **Academic Requirements**: Set minimum GPA, SAT, and ACT scores
- **Graduation Year Filters**: Choose which class years you're recruiting
- **Contact Permissions**: Control whether qualified athletes can message you directly
- **Automatic Filtering**: Only athletes who meet your standards appear in search results

#### For Athletes (`/athletes/eligible-schools`)
- **Eligibility Dashboard**: See exactly which schools you qualify to contact
- **Performance Comparison**: View each school's requirements vs. your current PRs
- **Match Scoring**: Algorithm calculates compatibility percentage (0-100%)
- **Clear Feedback**: Understand exactly what times you need to reach new schools
- **Motivation Tracking**: See schools "out of reach" and what it takes to unlock them
- **Direct Messaging**: Contact eligible schools directly from the dashboard

#### Advanced Coach Search (`/coaches/search`)
- **Pre-Filtered Results**: Only shows athletes meeting your performance standards
- **"Meets Standards" Badges**: Visual indicators for qualified athletes
- **Detailed Performance Cards**: See PRs, academics, and match scores at a glance
- **Filtered Athletes Counter**: Shows how many athletes don't meet your criteria
- **One-Click Messaging**: Contact qualified athletes instantly
- **Saved Searches**: Quick access to your recruiting preferences

#### How It Works
1. **Coaches** set performance thresholds in their preferences (e.g., 400m must be 48.0s or faster)
2. **Athletes** can only message schools where they meet ALL performance and academic requirements
3. **Search results** automatically filter based on these criteria
4. **Match scores** calculate compatibility based on how well athletes fit program standards
5. **Real-time updates**: As athletes improve their PRs, they unlock new schools

### 🎨 Dynamic College Branding System (NEW!)

#### School Profile Pages (`/schools/[id]`)
Each college has a fully customized profile page with their unique branding:
- **Custom Color Schemes**: Primary, secondary, and accent colors matching school branding
- **School Identity**: Logo, mascot, conference, and location prominently displayed
- **Branded Headers**: Navigation and headers adapt to school colors
- **Performance Requirements**: Side-by-side comparison of school standards vs. athlete PRs
- **Eligibility Status**: Clear indicators showing if athlete qualifies to contact the school
- **Program Information**: Facilities, team size, scholarships, recent achievements
- **Coaching Staff**: Head coach info with direct contact options

#### School-Specific Messaging (`/messages/[schoolId]`)
Messaging interface adapts to each school's branding:
- **Branded Message Interface**: Headers, buttons, and accents use school colors
- **Coach Messages**: Display in school's primary color with secondary text color
- **School Context**: Quick info sidebar with school details
- **NCAA Compliance**: Branded compliance notices
- **Quick Actions**: Schedule calls, request visits, view profile - all themed

#### Supported Schools with Full Branding
- **Michigan**: Maize (#FFCB05) & Blue (#00274C)
- **Ohio State**: Scarlet (#BB0000) & Gray (#666666)
- **Penn State**: Navy Blue (#041E42) & White
- **Oregon**: Green (#154733) & Yellow (#FEE123)
- **Stanford**: Cardinal (#8C1515) & White
- **Wisconsin**: Red (#C5050C) & White

#### Branding Features
- Dynamic color theming throughout the interface
- School logos and mascots
- Conference and division badges
- Facility highlights
- Recent achievements and accolades
- Team statistics and scholarship info
- Direct links to official team websites

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Project Structure

```
trackrecruit-platform/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing page
│   ├── athletes/
│   │   └── page.tsx        # Athlete dashboard
│   ├── coaches/
│   │   └── page.tsx        # Coach dashboard
│   ├── search/
│   │   └── page.tsx        # Search & discovery
│   ├── messages/
│   │   └── page.tsx        # Messaging interface
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── README.md             # This file
```

## Pages Overview

- **`/`** - Landing page with hero, features, testimonials, pricing, and FAQ
- **`/athletes`** - Athlete dashboard with profile, stats, and activity
- **`/athletes/eligible-schools`** - View schools you qualify to contact based on performance
- **`/coaches`** - Coach dashboard with prospects and recruiting tools
- **`/coaches/preferences`** - Set performance standards and recruiting requirements
- **`/coaches/search`** - Advanced athlete search with performance filtering
- **`/search`** - Search colleges or athletes with advanced filters
- **`/messages`** - Real-time messaging with NCAA compliance

## Key Design Elements

- **Brand Color**: TrackRecruit Yellow (#FFE500)
- **Typography**: Bold, athletic aesthetic with Inter font
- **Components**: Cards, buttons, and navigation with consistent styling
- **Icons**: Lucide React for clean, modern iconography

## Sample Data

The prototype includes realistic sample data:
- **Athletes**: 6 sample athlete profiles with PRs, academics, and locations
- **Colleges**: 6 Big Ten schools with program details
- **Messages**: Conversation threads with multiple coaches
- **Activity**: Recent recruiting activity and notifications

## Future Enhancements

- User authentication and authorization
- Real-time database integration
- Video upload and playback
- Advanced analytics and reporting
- Mobile app (iOS/Android)
- Email notifications
- Calendar integration
- Payment processing for premium features

## License

© 2026 TrackRecruit. All rights reserved.

## Contact

For questions about this prototype or partnership opportunities, contact the TrackRecruit team.
