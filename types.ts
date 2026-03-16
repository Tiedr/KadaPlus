
export type MediaType = 'movie' | 'series';
export type AdType = 'preroll' | 'midroll' | 'postroll' | 'banner';
export type AdStatus = 'pending' | 'approved' | 'declined' | 'completed' | 'paused';

export interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  streamUrl: string; // HLS/Dash stream
  currentProgram: string;
  category: string;
  viewers: number;
}

export interface Ad {
  id: string;
  videoUrl?: string; // Optional for banner ads
  imageUrl?: string; // For banner ads
  type: AdType;
  duration: number; // seconds
  startTime?: number; // seconds, for midroll or banner display start
  skipAfter?: number; // seconds
  linkUrl?: string;
  
  // Business Ad Fields
  isBusinessAd?: boolean;
  advertiserName?: string;
  platform?: 'kada+' | 'cinema';
  isSkippable?: boolean;
  budget?: number;
  status?: AdStatus;
  impressions?: number;
  clicks?: number;
  spent?: number;
  startDate?: number;
  endDate?: number;
}

export interface SubtitleTrack {
  id: string;
  label: string; // e.g. "English"
  language: string; // e.g. "en"
  src: string; // URL or Blob URL
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string; // Display string "45m"
  releaseDate?: string;
  introStartTime?: number;
  introEndTime?: number;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Demographics {
  ageGroups: { range: string; percentage: number }[];
  topRegions: { country: string; percentage: number }[];
  genderSplit: { male: number; female: number; other: number };
}

export interface MediaAnalytics {
  views: number;
  uniqueViewers: number;
  listAdds: number;
  likes: number;
  completionRate: number; // 0-100
  totalWatchTime: number; // hours
  retentionCurve?: number[]; // Array of values 0-100 representing viewership over time
  demographics?: Demographics;
  revenueGenerated?: number; // Estimated revenue attribution
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  
  // Images
  thumbnailUrl: string; // Landscape (16:9)
  posterUrl: string;    // Portrait (2:3)
  backdropUrl: string;  // High Res Landscape
  
  // Metadata
  genre: string;
  year: number;
  releaseDate?: string;
  rating: string;
  studio?: string;
  cast: string[];
  crew: string[];
  tags: string[];
  
  // Media
  trailerUrl?: string;
  subtitles?: SubtitleTrack[];
  introStartTime?: number;
  introEndTime?: number;
  
  // Movie Specific
  videoUrl?: string;
  duration?: string;
  
  // Series Specific
  seasons?: Season[]; 

  // App Specific
  trending?: boolean;
  isComingSoon?: boolean;
  ads?: Ad[]; 

  // Geo Restrictions & Kids
  allowedCountries?: string[]; // If empty, allowed everywhere
  isKidsSafe?: boolean;

  // Metrics
  analytics?: MediaAnalytics;
}

export interface GeminiInsight {
  summary: string;
  keyTakeaways: string[];
  similarTopics: string[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// --- USER & ADMIN ---

export interface RegionalPrice {
  countryCode: string;
  price: number;
  currency: string;
  regionalPricing?: RegionalPrice[];
  features?: string[];
  adsEnabled?: boolean;
  maxDevices?: number;
  isPopular?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number; // Base price
  currency: string;
  regionalPricing?: RegionalPrice[];
  features: string[];
  adsEnabled: boolean;
  maxDevices: number;
  isPopular?: boolean;
}

export interface WatchHistoryItem {
  mediaId: string;
  episodeId?: string; // If series
  timestamp: number; // seconds watched
  lastWatchedAt: number; // Date.now()
  progress: number; // 0 to 1 (percentage)
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids?: boolean;
  watchHistory: WatchHistoryItem[];
  myList: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: number;
  isRead: boolean;
  type: 'info' | 'success' | 'alert' | 'promo';
  link?: string;
}

export interface User {
  id: string;
  email: string;
  password?: string; // Simulation only
  planId: string;
  isAdmin?: boolean;
  profiles: UserProfile[];
  notifications?: Notification[];
}

export interface AppSettings {
  appName: string;
  appLogoText: string;
  appLogoHighlight: string;
  appIconUrl?: string;
  enableAdsGlobal: boolean;
  simulatedCountry: string; // For testing Geo-Blocking
  maintenanceMode: boolean;

  // Integrations
  paymentGateway?: 'paystack' | 'stripe' | 'none';
  paystackPublicKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  adminEmail?: string;
}

export interface Genre {
  id: string;
  name: string;
}
