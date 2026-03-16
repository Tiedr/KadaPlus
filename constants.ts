
import { MediaItem, Ad, Plan, User, AppSettings, Genre, Channel } from './types';

// Public Domain / Creative Commons Video URLs for testing
const VIDEOS = {
  COSMOS: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  QUANTUM: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  TOKYO: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  NATURE: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  AD_1: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  AD_2: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
};

export const SEED_CHANNELS: Channel[] = [
    {
        id: 'ch-news',
        name: 'Kada News',
        logoUrl: 'https://picsum.photos/seed/newslogo/200/200',
        streamUrl: VIDEOS.AD_1, // Simulated live stream
        currentProgram: 'World Report Now',
        category: 'News',
        viewers: 12420
    },
    {
        id: 'ch-sports',
        name: 'Kada Sports',
        logoUrl: 'https://picsum.photos/seed/sportslogo/200/200',
        streamUrl: VIDEOS.COSMOS,
        currentProgram: 'Live: Championship Final',
        category: 'Sports',
        viewers: 45100
    },
    {
        id: 'ch-music',
        name: 'AfroBeats HITS',
        logoUrl: 'https://picsum.photos/seed/musiclogo/200/200',
        streamUrl: VIDEOS.TOKYO,
        currentProgram: 'Top 40 Countdown',
        category: 'Music',
        viewers: 8500
    },
    {
        id: 'ch-docs',
        name: 'Planet Earth TV',
        logoUrl: 'https://picsum.photos/seed/doclogo/200/200',
        streamUrl: VIDEOS.NATURE,
        currentProgram: 'Deep Blue Sea',
        category: 'Documentary',
        viewers: 3200
    }
];

export const SEED_ADS: Ad[] = [
  {
    id: 'ad-sys-1',
    videoUrl: VIDEOS.AD_1,
    type: 'preroll',
    duration: 15,
    skipAfter: 5,
    linkUrl: 'https://example.com/product',
    isBusinessAd: false,
    status: 'approved',
    impressions: 5420,
    clicks: 120,
    spent: 0
  },
  {
    id: 'ad-biz-1',
    videoUrl: VIDEOS.AD_2,
    type: 'midroll',
    duration: 15,
    startTime: 30,
    skipAfter: 5,
    isBusinessAd: true,
    advertiserName: 'TechCorp',
    budget: 50000,
    status: 'approved',
    impressions: 1250,
    clicks: 45,
    spent: 12500,
    startDate: Date.now() - 1000 * 60 * 60 * 24 * 5 // 5 days ago
  },
  {
    id: 'ad-sys-post',
    videoUrl: VIDEOS.AD_1,
    type: 'postroll',
    duration: 10,
    skipAfter: 0,
    isBusinessAd: false,
    status: 'approved'
  },
  {
    id: 'banner-1',
    type: 'banner',
    duration: 10,
    imageUrl: 'https://picsum.photos/seed/bannerad/300/100',
    linkUrl: 'https://google.com',
    advertiserName: 'MegaCola',
    isBusinessAd: true,
    status: 'approved'
  }
];

export const SEED_GENRES: Genre[] = [
  { id: 'g1', name: 'Science' },
  { id: 'g2', name: 'History' },
  { id: 'g3', name: 'Nature' },
  { id: 'g4', name: 'Technology' },
  { id: 'g5', name: 'Travel' },
  { id: 'g6', name: 'Physics' },
  { id: 'g7', name: 'Action' },
  { id: 'g8', name: 'Comedy' },
  { id: 'g9', name: 'Drama' },
];

export const SEED_LIBRARY: MediaItem[] = [
  {
    id: 'feat-1',
    type: 'movie',
    title: 'Cosmic Origins: The Birth of Stars',
    description: 'Journey through the nebulae to witness the violent and beautiful birth of stars in our galaxy. Featuring never-before-seen imagery from the James Webb Telescope.',
    thumbnailUrl: 'https://picsum.photos/seed/cosmic/1920/1080',
    posterUrl: 'https://picsum.photos/seed/cosmic-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/cosmic/1920/1080',
    genre: 'Science',
    year: 2024,
    duration: '1h 45m',
    rating: 'PG',
    studio: 'Nebula Studios',
    cast: ['Neil deGrasse Tyson', 'Brian Cox'],
    crew: ['Christopher Nolan (Director)', 'Hans Zimmer (Music)'],
    tags: ['Space', 'Astronomy', 'Documentary', '4K'],
    videoUrl: VIDEOS.COSMOS,
    trending: true,
    ads: [SEED_ADS[0]], // Preroll only
    allowedCountries: [],
    introStartTime: 60,
    introEndTime: 90,
    analytics: { views: 45200, uniqueViewers: 38100, listAdds: 3240, likes: 12500, completionRate: 85, totalWatchTime: 54000 }
  },
  {
    id: '1',
    type: 'series',
    title: 'The Quantum Leap',
    description: 'Understanding the basics of quantum mechanics and how it shapes our reality. A comprehensive series into the unknown.',
    thumbnailUrl: 'https://picsum.photos/seed/quantum/800/450',
    posterUrl: 'https://picsum.photos/seed/quantum-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/quantum-bg/1920/1080',
    genre: 'Physics',
    year: 2023,
    rating: 'G',
    studio: 'CERN Media',
    cast: ['Michio Kaku'],
    crew: ['Stephen Hawking (Writer)'],
    tags: ['Physics', 'Science', 'Education'],
    trending: true,
    seasons: [
      {
        id: 's1',
        seasonNumber: 1,
        title: 'Foundations',
        episodes: [
          { 
              id: 's1e1', 
              episodeNumber: 1, 
              title: 'Particles & Waves', 
              description: 'The dual nature of matter explained.', 
              thumbnailUrl: 'https://picsum.photos/seed/q1/400/225', 
              videoUrl: VIDEOS.QUANTUM, 
              duration: '24m', 
              releaseDate: '2023-01-15',
              introStartTime: 5, // Intro starts at 5s for testing
              introEndTime: 25   // Ends at 25s
          },
          { 
              id: 's1e2', 
              episodeNumber: 2, 
              title: 'Entanglement', 
              description: 'Spooky action at a distance.', 
              thumbnailUrl: 'https://picsum.photos/seed/q2/400/225', 
              videoUrl: VIDEOS.NATURE, 
              duration: '28m', 
              releaseDate: '2023-01-22',
              introStartTime: 10,
              introEndTime: 30
          }
        ]
      }
    ],
    ads: [SEED_ADS[0], SEED_ADS[1], SEED_ADS[2]], // Preroll, Midroll, Postroll
    allowedCountries: ['US', 'GB', 'NG'],
    analytics: { views: 12500, uniqueViewers: 10200, listAdds: 890, likes: 3400, completionRate: 72, totalWatchTime: 4800 }
  },
  {
    id: 'coming-1',
    type: 'movie',
    title: 'Mars: The First City',
    description: 'An exclusive look at the blueprints for the first permanent human settlement on Mars.',
    thumbnailUrl: 'https://picsum.photos/seed/mars/800/450',
    posterUrl: 'https://picsum.photos/seed/mars-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/mars-bg/1920/1080',
    genre: 'Technology',
    year: 2025,
    duration: '2h 10m',
    rating: 'PG-13',
    studio: 'SpaceX Media',
    cast: ['Elon Musk', 'Robert Zubrin'],
    crew: [],
    tags: ['Space', 'Future', 'Mars'],
    videoUrl: VIDEOS.COSMOS,
    isComingSoon: true,
    releaseDate: '2025-11-15',
    allowedCountries: [],
    analytics: { views: 0, uniqueViewers: 0, listAdds: 5600, likes: 2100, completionRate: 0, totalWatchTime: 0 }
  },
  {
    id: '2',
    type: 'movie',
    title: 'Urban Jungle: Tokyo',
    description: 'A deep dive into the architectural marvels and street culture of Tokyo.',
    thumbnailUrl: 'https://picsum.photos/seed/tokyo/800/450',
    posterUrl: 'https://picsum.photos/seed/tokyo-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/tokyo-bg/1920/1080',
    genre: 'Travel',
    year: 2022,
    duration: '45m',
    rating: 'PG',
    studio: 'Wanderlust Films',
    cast: ['Ken Watanabe'],
    crew: ['Sofia Coppola (Producer)'],
    tags: ['Japan', 'Travel', 'Architecture'],
    videoUrl: VIDEOS.TOKYO,
    trending: true,
    allowedCountries: [],
    analytics: { views: 8900, uniqueViewers: 8100, listAdds: 450, likes: 1200, completionRate: 91, totalWatchTime: 6200 }
  },
  {
    id: 'mov-3',
    type: 'movie',
    title: 'Neon Nights',
    description: 'In a future where rain never stops, one detective must find the truth.',
    thumbnailUrl: 'https://picsum.photos/seed/neon/800/450',
    posterUrl: 'https://picsum.photos/seed/neon-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/neon-bg/1920/1080',
    genre: 'Action',
    year: 2024,
    duration: '2h 15m',
    rating: 'R',
    studio: 'Cyber Films',
    cast: ['Keanu', 'Zendaya'],
    crew: [],
    tags: ['Sci-Fi', 'Action', 'Cyberpunk'],
    videoUrl: VIDEOS.AD_2,
    trending: true,
    analytics: { views: 55000, uniqueViewers: 48000, listAdds: 5000, likes: 25000, completionRate: 88, totalWatchTime: 90000 }
  },
  {
    id: 'mov-4',
    type: 'movie',
    title: 'The Last Laugh',
    description: 'A failing comedian discovers he has a knack for international espionage.',
    thumbnailUrl: 'https://picsum.photos/seed/laugh/800/450',
    posterUrl: 'https://picsum.photos/seed/laugh-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/laugh-bg/1920/1080',
    genre: 'Comedy',
    year: 2023,
    duration: '1h 30m',
    rating: 'PG-13',
    studio: 'FunnyBone',
    cast: ['Kevin Hart', 'The Rock'],
    crew: [],
    tags: ['Comedy', 'Action', 'Spy'],
    videoUrl: VIDEOS.TOKYO,
    analytics: { views: 32000, uniqueViewers: 28000, listAdds: 1200, likes: 8000, completionRate: 70, totalWatchTime: 40000 }
  },
  {
    id: 'mov-5',
    type: 'movie',
    title: 'Deep Blue Silence',
    description: 'A silent film about the mysteries of the deep ocean.',
    thumbnailUrl: 'https://picsum.photos/seed/deep/800/450',
    posterUrl: 'https://picsum.photos/seed/deep-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/deep-bg/1920/1080',
    genre: 'Documentary',
    year: 2021,
    duration: '1h 20m',
    rating: 'G',
    studio: 'Oceanic',
    cast: [],
    crew: [],
    tags: ['Nature', 'Relaxing', 'Water'],
    videoUrl: VIDEOS.NATURE,
    analytics: { views: 5000, uniqueViewers: 4500, listAdds: 800, likes: 1500, completionRate: 95, totalWatchTime: 6000 }
  },
  {
    id: 'ser-2',
    type: 'series',
    title: 'Silicon Valley Hustle',
    description: 'The rise and fall of a tech startup told through the eyes of its interns.',
    thumbnailUrl: 'https://picsum.photos/seed/silicon/800/450',
    posterUrl: 'https://picsum.photos/seed/silicon-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/silicon-bg/1920/1080',
    genre: 'Drama',
    year: 2022,
    rating: 'TV-MA',
    studio: 'TechTV',
    cast: ['Jesse Eisenberg'],
    crew: [],
    tags: ['Drama', 'Tech', 'Business'],
    seasons: [
        { id: 'sv-s1', seasonNumber: 1, title: 'Seed Round', episodes: [
            { id: 'sv-e1', episodeNumber: 1, title: 'The Pitch', description: 'They have an idea.', thumbnailUrl: 'https://picsum.photos/seed/sv1/400/225', videoUrl: VIDEOS.AD_1, duration: '45m' }
        ]}
    ],
    analytics: { views: 18000, uniqueViewers: 15000, listAdds: 2000, likes: 5000, completionRate: 80, totalWatchTime: 20000 }
  },
  {
    id: 'mov-6',
    type: 'movie',
    title: 'Velocity',
    description: 'Fast cars, faster stakes. The ultimate racing movie.',
    thumbnailUrl: 'https://picsum.photos/seed/velocity/800/450',
    posterUrl: 'https://picsum.photos/seed/velocity-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/velocity-bg/1920/1080',
    genre: 'Action',
    year: 2024,
    duration: '2h 05m',
    rating: 'PG-13',
    studio: 'RedLine',
    cast: ['Vin Diesel'],
    crew: [],
    tags: ['Cars', 'Action', 'Adrenaline'],
    videoUrl: VIDEOS.AD_2,
    analytics: { views: 60000, uniqueViewers: 55000, listAdds: 4000, likes: 20000, completionRate: 90, totalWatchTime: 120000 }
  },
  {
    id: 'mov-7',
    type: 'movie',
    title: 'Chef\'s Secret',
    description: 'A culinary journey through Italy finding the perfect pasta.',
    thumbnailUrl: 'https://picsum.photos/seed/chef/800/450',
    posterUrl: 'https://picsum.photos/seed/chef-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/chef-bg/1920/1080',
    genre: 'Documentary',
    year: 2023,
    duration: '1h 15m',
    rating: 'G',
    studio: 'Foodie',
    cast: ['Massimo Bottura'],
    crew: [],
    tags: ['Food', 'Travel', 'Italy'],
    videoUrl: VIDEOS.NATURE,
    analytics: { views: 8000, uniqueViewers: 7500, listAdds: 1500, likes: 3000, completionRate: 92, totalWatchTime: 10000 }
  },
  {
    id: 'ser-3',
    type: 'series',
    title: 'Galactic Empire',
    description: 'Politics in space. Betrayal on a planetary scale.',
    thumbnailUrl: 'https://picsum.photos/seed/empire/800/450',
    posterUrl: 'https://picsum.photos/seed/empire-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/empire-bg/1920/1080',
    genre: 'Science',
    year: 2025,
    rating: 'TV-14',
    studio: 'Space Opera',
    cast: ['Oscar Isaac'],
    crew: [],
    tags: ['Sci-Fi', 'Politics', 'Space'],
    isComingSoon: true,
    releaseDate: '2025-05-04',
    analytics: { views: 0, uniqueViewers: 0, listAdds: 8000, likes: 4000, completionRate: 0, totalWatchTime: 0 }
  },
  {
    id: 'mov-8',
    type: 'movie',
    title: 'Code Red',
    description: 'A rogue AI takes over the world\'s banking systems.',
    thumbnailUrl: 'https://picsum.photos/seed/code/800/450',
    posterUrl: 'https://picsum.photos/seed/code-poster/600/900',
    backdropUrl: 'https://picsum.photos/seed/code-bg/1920/1080',
    genre: 'Technology',
    year: 2023,
    duration: '1h 55m',
    rating: 'PG-13',
    studio: 'CyberSec',
    cast: ['Rami Malek'],
    crew: [],
    tags: ['Thriller', 'Tech', 'Hacking'],
    videoUrl: VIDEOS.AD_1,
    analytics: { views: 22000, uniqueViewers: 20000, listAdds: 1800, likes: 6000, completionRate: 85, totalWatchTime: 38000 }
  }
];

export const SEED_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'NGN',
    features: ['Standard Definition (480p)', 'Limited Content', 'Ads Included', '1 Device'],
    adsEnabled: true,
    maxDevices: 1
  },
  {
    id: 'pro',
    name: 'Standard',
    price: 4900,
    currency: 'NGN',
    regionalPricing: [
        { countryCode: 'US', price: 9.99, currency: 'USD' },
        { countryCode: 'GB', price: 8.99, currency: 'GBP' }
    ],
    features: ['High Definition (1080p)', 'Full Library', 'Limited Ads', '2 Devices', 'Offline Downloads'],
    adsEnabled: true,
    maxDevices: 2,
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 8500,
    currency: 'NGN',
    regionalPricing: [
        { countryCode: 'US', price: 14.99, currency: 'USD' },
        { countryCode: 'GB', price: 12.99, currency: 'GBP' }
    ],
    features: ['Ultra HD (4K)', 'Full Library', 'No Ads', '4 Devices', 'Dolby Atmos Audio'],
    adsEnabled: false,
    maxDevices: 4
  }
];

export const SEED_USER: User = {
  id: 'user-1',
  email: 'alex.rayner@ughoron.com',
  planId: 'pro',
  isAdmin: true,
  profiles: [
    {
      id: 'p1',
      name: 'Alex',
      avatarUrl: 'https://picsum.photos/seed/user/200/200',
      watchHistory: [],
      myList: []
    },
    {
      id: 'p2',
      name: 'Kids',
      avatarUrl: 'https://picsum.photos/seed/kids/200/200',
      isKids: true,
      watchHistory: [],
      myList: []
    }
  ]
};

export const SEED_USERS_LIST: User[] = [
  SEED_USER,
  {
    id: 'user-2',
    email: 'sarah@example.com',
    planId: 'free',
    isAdmin: false,
    profiles: [
        {
            id: 'p3',
            name: 'Sarah',
            avatarUrl: 'https://picsum.photos/seed/user2/200/200',
            watchHistory: [],
            myList: []
        }
    ]
  }
];

export const SEED_SETTINGS: AppSettings = {
  appName: 'Kada+',
  appLogoText: 'Kada',
  appLogoHighlight: '+',
  enableAdsGlobal: true,
  simulatedCountry: 'NG',
  maintenanceMode: false,
  paymentGateway: 'paystack',
  paystackPublicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxx',
  adminEmail: 'admin@ughoron.com'
};
