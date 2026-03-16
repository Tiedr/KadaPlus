
import { MediaItem, User, Plan, AppSettings, WatchHistoryItem, UserProfile, Ad, Genre, Notification, Channel } from './types';
import { SEED_LIBRARY, SEED_PLANS, SEED_USER, SEED_USERS_LIST, SEED_GENRES, SEED_ADS, SEED_SETTINGS, SEED_CHANNELS } from './constants';

// Keys for LocalStorage
const KEYS = {
  LIBRARY: 'xp_library',
  USER: 'xp_user', // Current logged in account
  ACTIVE_PROFILE_ID: 'xp_active_profile_id',
  USERS_LIST: 'xp_users_list', // All users (Admin db)
  PLANS: 'xp_plans',
  SETTINGS: 'xp_settings',
  GENRES: 'xp_genres',
  ADS: 'xp_ads', // Business ads + System ads
  CHANNELS: 'xp_channels'
};

const loadData = <T>(key: string, seed: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing ${key}`, e);
    }
  }
  return seed;
};

const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Update Seed Settings for Kada+
const KADA_SEED_SETTINGS: AppSettings = {
  ...SEED_SETTINGS,
  appName: 'Kada+',
  appLogoText: 'Kada',
  appLogoHighlight: '+',
};

export const store = {
  // --- LIBRARY ---
  getLibrary: (): MediaItem[] => loadData(KEYS.LIBRARY, SEED_LIBRARY),
  
  saveLibrary: (items: MediaItem[]) => {
    saveData(KEYS.LIBRARY, items);
    window.dispatchEvent(new Event('storage_library'));
  },

  // --- CHANNELS ---
  getChannels: (): Channel[] => loadData(KEYS.CHANNELS, SEED_CHANNELS),

  // --- GENRES ---
  getGenres: (): Genre[] => loadData(KEYS.GENRES, SEED_GENRES),
  saveGenres: (genres: Genre[]) => {
    saveData(KEYS.GENRES, genres);
    window.dispatchEvent(new Event('storage_genres'));
  },

  // --- ADS (Business & System) ---
  getAds: (): Ad[] => loadData(KEYS.ADS, SEED_ADS),
  saveAds: (ads: Ad[]) => {
    saveData(KEYS.ADS, ads);
    window.dispatchEvent(new Event('storage_ads'));
  },
  addBusinessAd: (ad: Ad) => {
    const ads = store.getAds();
    ads.push(ad);
    store.saveAds(ads);
  },

  // --- USER ACCOUNT & AUTH ---
  getAllUsers: (): User[] => loadData(KEYS.USERS_LIST, SEED_USERS_LIST),

  saveAllUsers: (users: User[]) => {
    saveData(KEYS.USERS_LIST, users);
    window.dispatchEvent(new Event('storage_users_list'));
  },

  getUser: (): User => loadData(KEYS.USER, SEED_USER),
  
  saveUser: (user: User) => {
    saveData(KEYS.USER, user);
    // Also update the user in the USERS_LIST if they exist there
    const allUsers = store.getAllUsers();
    const idx = allUsers.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      allUsers[idx] = user;
    } else {
      allUsers.push(user);
    }
    store.saveAllUsers(allUsers);
    window.dispatchEvent(new Event('storage_user'));
  },

  logout: () => {
    localStorage.removeItem(KEYS.ACTIVE_PROFILE_ID);
  },

  registerUser: (newUser: User) => {
     // Initialize with welcome notification
     newUser.notifications = [
         {
             id: `notif-${Date.now()}`,
             title: 'Welcome to Kada+!',
             message: 'Your account has been successfully created. Start watching now!',
             date: Date.now(),
             isRead: false,
             type: 'success'
         }
     ];
     store.saveUser(newUser);
  },

  // --- NOTIFICATIONS ---
  getNotifications: (): Notification[] => {
      const user = store.getUser();
      return user.notifications || [];
  },

  markNotificationRead: (notifId: string) => {
      const user = store.getUser();
      if (user.notifications) {
          user.notifications = user.notifications.map(n => 
              n.id === notifId ? { ...n, isRead: true } : n
          );
          store.saveUser(user);
      }
  },

  markAllNotificationsRead: () => {
      const user = store.getUser();
      if (user.notifications) {
          user.notifications = user.notifications.map(n => ({ ...n, isRead: true }));
          store.saveUser(user);
      }
  },

  addNotification: (notification: Notification) => {
      const user = store.getUser();
      const currentNotifs = user.notifications || [];
      user.notifications = [notification, ...currentNotifs];
      store.saveUser(user);
  },

  // --- PROFILE MANAGEMENT ---
  getActiveProfileId: (): string | null => localStorage.getItem(KEYS.ACTIVE_PROFILE_ID),
  
  setActiveProfileId: (id: string) => {
    localStorage.setItem(KEYS.ACTIVE_PROFILE_ID, id);
    window.dispatchEvent(new Event('storage_profile'));
  },

  getCurrentProfile: (): UserProfile => {
    const user = store.getUser();
    const profileId = store.getActiveProfileId();
    // Default to first profile if none selected or invalid
    return user.profiles.find(p => p.id === profileId) || user.profiles[0];
  },

  updateProfile: (updatedProfile: UserProfile) => {
    const user = store.getUser();
    const idx = user.profiles.findIndex(p => p.id === updatedProfile.id);
    if (idx !== -1) {
      user.profiles[idx] = updatedProfile;
      store.saveUser(user);
      window.dispatchEvent(new Event('storage_profile'));
    }
  },

  // --- MY LIST & HISTORY (Per Profile) ---
  addToMyList: (mediaId: string) => {
    const profile = store.getCurrentProfile();
    if (!profile.myList.includes(mediaId)) {
        profile.myList.unshift(mediaId);
        store.updateProfile(profile);
    }
  },

  removeFromMyList: (mediaId: string) => {
    const profile = store.getCurrentProfile();
    profile.myList = profile.myList.filter(id => id !== mediaId);
    store.updateProfile(profile);
  },

  updateWatchHistory: (mediaId: string, timestamp: number, duration: number, episodeId?: string) => {
    const profile = store.getCurrentProfile();
    if (!profile) return; // Guard
    
    const progress = duration > 0 ? timestamp / duration : 0;
    
    const existingIdx = profile.watchHistory.findIndex(h => h.mediaId === mediaId && h.episodeId === episodeId);
    
    const newItem: WatchHistoryItem = {
      mediaId,
      episodeId,
      timestamp,
      progress,
      lastWatchedAt: Date.now()
    };

    if (existingIdx > -1) {
      profile.watchHistory[existingIdx] = newItem;
    } else {
      profile.watchHistory.unshift(newItem);
    }

    // Sort by last watched
    profile.watchHistory.sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);
    
    // Keep history manageable (e.g. last 50 items)
    if (profile.watchHistory.length > 50) {
      profile.watchHistory = profile.watchHistory.slice(0, 50);
    }

    store.updateProfile(profile);
  },

  // --- PLANS ---
  getPlans: (): Plan[] => loadData(KEYS.PLANS, SEED_PLANS),
  
  savePlans: (plans: Plan[]) => {
    saveData(KEYS.PLANS, plans);
    window.dispatchEvent(new Event('storage_plans'));
  },

  // --- SETTINGS ---
  getSettings: (): AppSettings => loadData(KEYS.SETTINGS, KADA_SEED_SETTINGS),
  
  saveSettings: (settings: AppSettings) => {
    saveData(KEYS.SETTINGS, settings);
    window.dispatchEvent(new Event('storage_settings'));
  },
  
  // Helper to listen to changes
  subscribe: (key: string, callback: () => void) => {
    const eventName = `storage_${key}`;
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }
};
