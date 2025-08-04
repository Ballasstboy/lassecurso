export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  price: string;
  genre: string;
  dj?: string;
  ageLimit?: string;
  dressCode?: string;
  description?: string;
}

export interface Club {
  id: string;
  name: string;
  logo: string;
  description: string;
  address: string;
  coordinates: [number, number];
  genres: string[];
  website?: string;
  phone?: string;
  capacity?: number;
  events: Event[];
}

// Helper function to generate events for the next 2 weeks
const generateEvents = (clubId: string, eventTemplates: Omit<Event, 'id' | 'date'>[]): Event[] => {
  const events: Event[] = [];
  const startDate = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Skip some days randomly to make it realistic
    if (Math.random() > 0.7) continue;
    
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    
    events.push({
      ...template,
      id: `${clubId}-${date.toISOString().split('T')[0]}-${template.name.replace(/\s+/g, '-').toLowerCase()}`,
      date: date.toISOString().split('T')[0],
    });
  }
  
  return events.sort((a, b) => a.date.localeCompare(b.date));
};

export const clubs: Club[] = [
  {
    id: 'mau-club',
    name: 'MAU CLUB',
    logo: '🏢',
    description: 'Rostock\'s premier electronic music destination with state-of-the-art sound system and lighting.',
    address: 'Warnowufer 65, 18057 Rostock',
    coordinates: [54.0887, 12.1281],
    genres: ['Techno', 'House', 'Electronic'],
    website: 'https://mauclub.de',
    capacity: 800,
    events: generateEvents('mau-club', [
      {
        name: 'Techno Underground',
        time: '23:00',
        price: '15€',
        genre: 'Techno',
        dj: 'DJ KRTM',
        ageLimit: '18+',
        dressCode: 'Dark colors preferred',
        description: 'Deep underground techno beats until sunrise'
      },
      {
        name: 'House Nation',
        time: '22:00',
        price: '12€',
        genre: 'House',
        dj: 'Sarah Pulse',
        ageLimit: '16+',
        description: 'Classic house vibes with modern twists'
      },
      {
        name: 'Electronic Friday',
        time: '22:30',
        price: '18€',
        genre: 'Electronic',
        dj: 'Synth Master',
        ageLimit: '18+',
        description: 'Cutting-edge electronic music experience'
      }
    ])
  },
  {
    id: 'musik-bar',
    name: 'Musik Bar',
    logo: '🎵',
    description: 'Intimate venue known for its eclectic music selection and cozy atmosphere.',
    address: 'Stephanstraße 6, 18055 Rostock',
    coordinates: [54.0901, 12.1335],
    genres: ['Indie', 'Alternative', 'Rock'],
    phone: '+49 381 123456',
    capacity: 200,
    events: generateEvents('musik-bar', [
      {
        name: 'Indie Night',
        time: '21:00',
        price: '8€',
        genre: 'Indie',
        dj: 'Alex Turner',
        ageLimit: '16+',
        description: 'Best indie tracks from around the world'
      },
      {
        name: 'Alternative Rock Session',
        time: '20:30',
        price: '10€',
        genre: 'Rock',
        dj: 'Rock Rebel',
        ageLimit: '16+',
        description: 'Classic and modern alternative rock'
      },
      {
        name: 'Vinyl Thursday',
        time: '19:00',
        price: '6€',
        genre: 'Alternative',
        description: 'Rare vinyl collections played live'
      }
    ])
  },
  {
    id: 'studentenkeller',
    name: 'Studentenkeller',
    logo: '🍻',
    description: 'Popular student hangout with affordable drinks and party atmosphere.',
    address: 'Universitätsplatz 1, 18055 Rostock',
    coordinates: [54.0916, 12.1251],
    genres: ['Charts', 'Pop', 'Hip-Hop'],
    capacity: 300,
    events: generateEvents('studentenkeller', [
      {
        name: 'Charts Party',
        time: '22:00',
        price: '5€',
        genre: 'Charts',
        ageLimit: '16+',
        description: 'Latest chart hits and party classics'
      },
      {
        name: 'Hip-Hop Night',
        time: '22:30',
        price: '7€',
        genre: 'Hip-Hop',
        dj: 'MC Flow',
        ageLimit: '16+',
        description: 'Best hip-hop and rap tracks'
      },
      {
        name: '90s Party',
        time: '21:30',
        price: '4€',
        genre: 'Pop',
        description: 'Nostalgic 90s hits all night long'
      }
    ])
  },
  {
    id: 'flax',
    name: 'FLAX',
    logo: '🌟',
    description: 'Trendy club with multiple floors and diverse music programming.',
    address: 'Schröderstraße 2, 18055 Rostock',
    coordinates: [54.0889, 12.1298],
    genres: ['House', 'Techno', 'Charts', 'Latin'],
    website: 'https://flax-rostock.de',
    capacity: 500,
    events: generateEvents('flax', [
      {
        name: 'Latin Night',
        time: '21:00',
        price: '12€',
        genre: 'Latin',
        dj: 'Carlos Rhythm',
        ageLimit: '18+',
        description: 'Salsa, Reggaeton, and Latin beats'
      },
      {
        name: 'House Floor',
        time: '23:00',
        price: '15€',
        genre: 'House',
        dj: 'Deep House Dan',
        ageLimit: '18+',
        dressCode: 'Smart casual',
        description: 'Progressive house on the main floor'
      },
      {
        name: 'Mixed Charts',
        time: '22:00',
        price: '10€',
        genre: 'Charts',
        ageLimit: '16+',
        description: 'Chart hits across multiple floors'
      }
    ])
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    logo: '🏭',
    description: 'Industrial-style venue hosting underground electronic events.',
    address: 'Industriestraße 15, 18069 Rostock',
    coordinates: [54.0723, 12.1456],
    genres: ['Techno', 'Industrial', 'Drum & Bass'],
    capacity: 600,
    events: generateEvents('warehouse', [
      {
        name: 'Industrial Techno',
        time: '23:30',
        price: '20€',
        genre: 'Techno',
        dj: 'Industrial Beast',
        ageLimit: '18+',
        dressCode: 'All black',
        description: 'Hard industrial techno in warehouse setting'
      },
      {
        name: 'Drum & Bass Underground',
        time: '22:00',
        price: '15€',
        genre: 'Drum & Bass',
        dj: 'Bass Warrior',
        ageLimit: '18+',
        description: 'High-energy drum & bass session'
      },
      {
        name: 'After Hour Session',
        time: '02:00',
        price: '25€',
        genre: 'Techno',
        ageLimit: '21+',
        description: 'After-hour techno until morning'
      }
    ])
  },
  {
    id: 'kulturkantine',
    name: 'Kulturkantine',
    logo: '🎭',
    description: 'Cultural center combining art exhibitions with diverse music events.',
    address: 'Am Strande 3c, 18055 Rostock',
    coordinates: [54.0924, 12.1387],
    genres: ['Jazz', 'Experimental', 'World Music'],
    website: 'https://kulturkantine-rostock.de',
    capacity: 150,
    events: generateEvents('kulturkantine', [
      {
        name: 'Jazz Session',
        time: '20:00',
        price: '12€',
        genre: 'Jazz',
        description: 'Live jazz with local musicians'
      },
      {
        name: 'World Music Night',
        time: '19:30',
        price: '10€',
        genre: 'World Music',
        ageLimit: '16+',
        description: 'Global sounds and rhythms'
      },
      {
        name: 'Experimental Sounds',
        time: '21:00',
        price: '8€',
        genre: 'Experimental',
        description: 'Avant-garde music exploration'
      }
    ])
  }
];

export const allGenres = Array.from(
  new Set(clubs.flatMap(club => club.genres))
).sort();