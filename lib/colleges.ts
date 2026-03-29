export interface CollegeBranding {
  id: string
  name: string
  shortName: string
  division: string
  conference: string
  location: string
  
  // Branding
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: string
  mascot: string
  
  // Program Info
  headCoach: string
  coachEmail: string
  teamWebsite: string
  facilities: string[]
  
  // Performance Standards
  requirements: {
    [event: string]: {
      min: string
      max: string
    }
  }
  minGPA: number
  minSAT: number
  
  // Additional Info
  scholarships: number
  teamSize: number
  recentAchievements: string[]
}

export const colleges: CollegeBranding[] = [
  {
    id: 'michigan',
    name: 'University of Michigan',
    shortName: 'Michigan',
    division: 'D1',
    conference: 'Big Ten',
    location: 'Ann Arbor, MI',
    primaryColor: '#00274C', // Michigan Blue
    secondaryColor: '#FFCB05', // Maize
    accentColor: '#00274C',
    logo: 'UM',
    mascot: 'Wolverines',
    headCoach: 'Coach Anderson',
    coachEmail: 'anderson@umich.edu',
    teamWebsite: 'mgoblue.com',
    facilities: ['Indoor Track Facility', 'Outdoor Stadium', 'Strength & Conditioning Center'],
    requirements: {
      '400m': { min: '49.0s', max: '46.0s' },
      '800m': { min: '1:55.0', max: '1:48.0' }
    },
    minGPA: 3.5,
    minSAT: 1200,
    scholarships: 12.6,
    teamSize: 45,
    recentAchievements: [
      'Big Ten Champions 2025',
      '3 NCAA All-Americans',
      'Top 10 NCAA Finish'
    ]
  },
  {
    id: 'ohio-state',
    name: 'Ohio State University',
    shortName: 'Ohio State',
    division: 'D1',
    conference: 'Big Ten',
    location: 'Columbus, OH',
    primaryColor: '#BB0000', // Scarlet
    secondaryColor: '#666666', // Gray
    accentColor: '#BB0000',
    logo: 'OSU',
    mascot: 'Buckeyes',
    headCoach: 'Coach Williams',
    coachEmail: 'williams@osu.edu',
    teamWebsite: 'ohiostatebuckeyes.com',
    facilities: ['Jesse Owens Track', 'Indoor Practice Facility', 'Sports Medicine Center'],
    requirements: {
      '400m': { min: '47.5s', max: '45.0s' },
      '800m': { min: '1:52.0', max: '1:46.0' }
    },
    minGPA: 3.6,
    minSAT: 1300,
    scholarships: 12.6,
    teamSize: 50,
    recentAchievements: [
      'NCAA Outdoor Champions 2024',
      '5 Individual National Champions',
      'Big Ten Indoor Champions'
    ]
  },
  {
    id: 'penn-state',
    name: 'Penn State University',
    shortName: 'Penn State',
    division: 'D1',
    conference: 'Big Ten',
    location: 'University Park, PA',
    primaryColor: '#041E42', // Navy Blue
    secondaryColor: '#FFFFFF', // White
    accentColor: '#041E42',
    logo: 'PSU',
    mascot: 'Nittany Lions',
    headCoach: 'Coach Martinez',
    coachEmail: 'martinez@psu.edu',
    teamWebsite: 'gopsusports.com',
    facilities: ['Multi-Sport Facility', 'Outdoor Complex', 'Recovery Center'],
    requirements: {
      '400m': { min: '48.5s', max: '45.5s' },
      '800m': { min: '1:54.0', max: '1:47.0' }
    },
    minGPA: 3.4,
    minSAT: 1250,
    scholarships: 12.6,
    teamSize: 42,
    recentAchievements: [
      'Big Ten Outdoor Runner-Up 2025',
      '2 Olympic Trials Qualifiers',
      'Conference Record Holder - 4x400m'
    ]
  },
  {
    id: 'oregon',
    name: 'University of Oregon',
    shortName: 'Oregon',
    division: 'D1',
    conference: 'Pac-12',
    location: 'Eugene, OR',
    primaryColor: '#154733', // Green
    secondaryColor: '#FEE123', // Yellow
    accentColor: '#154733',
    logo: 'UO',
    mascot: 'Ducks',
    headCoach: 'Coach Thompson',
    coachEmail: 'thompson@uoregon.edu',
    teamWebsite: 'goducks.com',
    facilities: ['Hayward Field', 'Nike Performance Center', 'Sports Science Lab'],
    requirements: {
      '400m': { min: '47.0s', max: '44.5s' },
      '800m': { min: '1:50.0', max: '1:45.0' }
    },
    minGPA: 3.7,
    minSAT: 1350,
    scholarships: 12.6,
    teamSize: 55,
    recentAchievements: [
      'NCAA Champions 2024, 2025',
      'Hayward Field - TrackTown USA',
      '10+ Olympic Athletes'
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    division: 'D1',
    conference: 'Pac-12',
    location: 'Stanford, CA',
    primaryColor: '#8C1515', // Cardinal
    secondaryColor: '#FFFFFF', // White
    accentColor: '#8C1515',
    logo: 'SU',
    mascot: 'Cardinal',
    headCoach: 'Coach Davis',
    coachEmail: 'davis@stanford.edu',
    teamWebsite: 'gostanford.com',
    facilities: ['Cobb Track & Angell Field', 'Sports Medicine Facility', 'Academic Support Center'],
    requirements: {
      '400m': { min: '46.5s', max: '44.0s' },
      '800m': { min: '1:49.0', max: '1:44.0' }
    },
    minGPA: 3.9,
    minSAT: 1450,
    scholarships: 12.6,
    teamSize: 48,
    recentAchievements: [
      'Pac-12 Champions 2025',
      'Top Academic Program in Nation',
      '15 Academic All-Americans'
    ]
  },
  {
    id: 'wisconsin',
    name: 'University of Wisconsin',
    shortName: 'Wisconsin',
    division: 'D1',
    conference: 'Big Ten',
    location: 'Madison, WI',
    primaryColor: '#C5050C', // Red
    secondaryColor: '#FFFFFF', // White
    accentColor: '#C5050C',
    logo: 'UW',
    mascot: 'Badgers',
    headCoach: 'Coach Johnson',
    coachEmail: 'johnson@wisc.edu',
    teamWebsite: 'uwbadgers.com',
    facilities: ['Indoor Track Facility', 'Outdoor Stadium', 'Training Center'],
    requirements: {
      '400m': { min: '49.5s', max: '46.5s' },
      '800m': { min: '1:56.0', max: '1:49.0' }
    },
    minGPA: 3.3,
    minSAT: 1180,
    scholarships: 12.6,
    teamSize: 40,
    recentAchievements: [
      'Big Ten Indoor Top 3',
      'Strong Distance Program',
      'NCAA Qualifier Pipeline'
    ]
  }
]

export function getCollegeById(id: string): CollegeBranding | undefined {
  return colleges.find(c => c.id === id)
}

export function getCollegeByName(name: string): CollegeBranding | undefined {
  return colleges.find(c => c.name.toLowerCase() === name.toLowerCase())
}
