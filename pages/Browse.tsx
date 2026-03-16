
import React, { useState, useEffect, useMemo } from 'react';
import { store } from '../store';
import { MediaItem, UserProfile, Genre } from '../types';
import MediaCard from '../components/MediaCard';
import { SearchIcon, PlayIcon, InfoIcon, PlusIcon, CheckIcon } from '../components/Icons';

const Browse: React.FC = () => {
  const [library, setLibrary] = useState<MediaItem[]>(store.getLibrary());
  const [profile, setProfile] = useState<UserProfile>(store.getCurrentProfile());
  const [genres, setGenres] = useState<Genre[]>(store.getGenres());
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState(store.getSettings());
  const [randomHero, setRandomHero] = useState<MediaItem | null>(null);

  useEffect(() => {
    const unsubLibrary = store.subscribe('library', () => setLibrary(store.getLibrary()));
    const unsubProfile = store.subscribe('profile', () => setProfile(store.getCurrentProfile()));
    const unsubGenres = store.subscribe('genres', () => setGenres(store.getGenres()));
    const unsubSettings = store.subscribe('settings', () => setSettings(store.getSettings()));
    
    // Set a random hero image for the browse header
    const items = store.getLibrary();
    if (items.length > 0) {
        setRandomHero(items[Math.floor(Math.random() * items.length)]);
    }

    return () => {
      unsubLibrary();
      unsubProfile();
      unsubGenres();
      unsubSettings();
    };
  }, []);

  const simulatedCountry = settings.simulatedCountry || 'US';

  const categories = ['All', 'My List', ...genres.map(g => g.name)];

  const filteredItems = useMemo(() => {
      return library.filter(item => {
        // 1. Check Coming Soon
        if (item.isComingSoon) return false;
        
        // 2. Check Kids Mode
        if (profile.isKids && !item.isKidsSafe) return false; 

        // 3. Check Geo Blocking
        if (item.allowedCountries && item.allowedCountries.length > 0 && !item.allowedCountries.includes(simulatedCountry)) return false;

        // 4. Check Filters/Search
        const matchesCategory = activeCategory === 'All' 
                                || (activeCategory === 'My List' && profile.myList.includes(item.id))
                                || item.genre === activeCategory;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(searchLower) || 
                              item.description.toLowerCase().includes(searchLower) ||
                              item.genre.toLowerCase().includes(searchLower);

        return matchesCategory && matchesSearch;
      });
  }, [library, profile, activeCategory, searchTerm, simulatedCountry]);

  const handleToggleMyList = (e: React.MouseEvent, item: MediaItem) => {
      e.preventDefault();
      e.stopPropagation();
      if (profile.myList.includes(item.id)) {
          store.removeFromMyList(item.id);
      } else {
          store.addToMyList(item.id);
      }
  };

  return (
    <div className="min-h-screen bg-black font-sans pb-32">
      
      {/* Cinematic Header with Search */}
      <div className="relative h-[40vh] w-full flex flex-col items-center justify-center mb-10 overflow-hidden">
          {randomHero && (
              <div className="absolute inset-0 z-0">
                  <img src={randomHero.backdropUrl || randomHero.thumbnailUrl} className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
              </div>
          )}
          
          <div className="relative z-10 w-full max-w-3xl px-6 text-center space-y-6 animate-fade-in-up mt-32 md:mt-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-pink to-kada-yellow">Universe</span>
              </h1>
              
              {/* Enhanced Search Bar */}
              <div className="relative group w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-kada-pink to-kada-yellow rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-3 md:px-8 md:py-5 shadow-2xl transition-all group-focus-within:bg-black/80 group-focus-within:border-white/40">
                      <SearchIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-focus-within:text-kada-pink transition-colors" />
                      <input 
                        type="text"
                        placeholder="Search titles, genres, or people..."
                        className="w-full bg-transparent border-none outline-none text-white text-base md:text-lg placeholder-gray-400 px-3 md:px-4 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                      {searchTerm && (
                          <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-white">
                              Close
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-40">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 md:mb-20">
            {categories.map(cat => {
            // Only show My List if it has items or is active
            if (cat === 'My List' && profile.myList.length === 0 && activeCategory !== 'My List') return null;
            
            const isActive = activeCategory === cat;
            return (
                <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border ${
                    isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] transform scale-105' 
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5'
                }`}
                >
                {cat}
                </button>
            )
            })}
        </div>

        {/* Results Grid */}
        <div className="min-h-[400px]">
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-6 animate-fade-in">
                {filteredItems.map((item, index) => (
                    <div key={item.id} className="group relative" style={{ animationDelay: `${index * 50}ms` }}>
                        <MediaCard item={item} variant="portrait" />
                        
                        {/* Quick Action Overlay (Desktop) */}
                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                            <button 
                                onClick={(e) => handleToggleMyList(e, item)}
                                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                                title={profile.myList.includes(item.id) ? "Remove from List" : "Add to List"}
                            >
                                {profile.myList.includes(item.id) ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <SearchIcon className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                    <p className="text-gray-400 max-w-md">
                        We couldn't find anything matching "{searchTerm}" in {activeCategory}. Try adjusting your keywords or category.
                    </p>
                    <button 
                        onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                        className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
