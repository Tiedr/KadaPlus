
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import { PlayIcon, InfoIcon, TrendingUpIcon, StarIcon, FilmIcon, TvIcon, VolumeMuteIcon, VolumeHighIcon, ClockIcon, PlusIcon, SparklesIcon, CalendarIcon, CheckIcon } from '../components/Icons';
import { store } from '../store';
import { MediaItem, UserProfile, AppSettings, Channel } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(store.getSettings());
  const [channels, setChannels] = useState<Channel[]>([]);
  
  // Hero Slider State
  const [featuredItems, setFeaturedItems] = useState<MediaItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const slideInterval = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Ref for hero video

  useEffect(() => {
    setLibrary(store.getLibrary());
    setProfile(store.getCurrentProfile());
    setSettings(store.getSettings());
    setChannels(store.getChannels());
    
    const unsubLibrary = store.subscribe('library', () => setLibrary(store.getLibrary()));
    const unsubProfile = store.subscribe('profile', () => setProfile(store.getCurrentProfile()));
    const unsubSettings = store.subscribe('settings', () => setSettings(store.getSettings()));

    return () => {
      unsubLibrary();
      unsubProfile();
      unsubSettings();
    };
  }, []);

  const simulatedCountry = settings.simulatedCountry || 'US';

  const safeLibrary = useMemo(() => {
    if (!profile) return [];
    return library.filter(item => {
        const kidsCheck = profile.isKids ? item.isKidsSafe : true;
        let geoCheck = true;
        if (item.allowedCountries && item.allowedCountries.length > 0) {
            geoCheck = item.allowedCountries.includes(simulatedCountry);
        }
        return kidsCheck && geoCheck;
    });
  }, [library, profile, simulatedCountry]);

  useEffect(() => {
      if (safeLibrary.length > 0) {
          const featured = safeLibrary.filter(item => item.trending && !item.isComingSoon).slice(0, 5);
          setFeaturedItems(featured.length > 0 ? featured : safeLibrary.slice(0, 5));
      }
  }, [safeLibrary]);

  useEffect(() => {
      if (featuredItems.length <= 1) return;
      const nextSlide = () => {
          setShowVideo(false);
          setCurrentSlide(prev => (prev + 1) % featuredItems.length);
      };
      slideInterval.current = setInterval(nextSlide, 15000);
      return () => { if (slideInterval.current) clearInterval(slideInterval.current); };
  }, [featuredItems]);

  useEffect(() => {
      const timer = setTimeout(() => { setShowVideo(true); }, 3000);
      return () => clearTimeout(timer);
  }, [currentSlide]);

  // Handle Video Playback explicitly to avoid "interrupted" errors
  useEffect(() => {
      if (showVideo && videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => {
                  // Ignore abort errors (happens when slide changes quickly)
                  if (error.name !== 'AbortError') {
                      // console.log("Hero video play error", error);
                  }
              });
          }
      }
  }, [showVideo, currentSlide]);

  const activeSlide = featuredItems[currentSlide];

  // Specific Categorized Lists
  const trending = safeLibrary.filter(item => item.trending && !item.isComingSoon).slice(0, 10);
  const topMovies = safeLibrary.filter(item => item.type === 'movie' && !item.isComingSoon).sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0)).slice(0, 10);
  const freshArrivals = safeLibrary.filter(item => !item.isComingSoon && item.year >= 2023).slice(0, 8);
  const actionMovies = safeLibrary.filter(item => !item.isComingSoon && item.genre === 'Action');
  const comedies = safeLibrary.filter(item => !item.isComingSoon && item.genre === 'Comedy');
  const sciFiSeries = safeLibrary.filter(item => !item.isComingSoon && (item.genre === 'Science' || item.genre === 'Physics' || item.tags.includes('Sci-Fi')));
  const bingeWorthy = safeLibrary.filter(item => item.type === 'series' && !item.isComingSoon);

  // Spotlight Logic
  const spotlightMovie = useMemo(() => {
      const candidates = safeLibrary.filter(m => m.type === 'movie' && !m.isComingSoon && m.id !== activeSlide?.id);
      return candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  }, [safeLibrary, activeSlide]);

  const continueWatching = useMemo(() => {
      if (!profile) return [];
      
      const seenMediaIds = new Set<string>();
      const result: { item: MediaItem, history: any }[] = [];
      
      const sortedHistory = [...profile.watchHistory].sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);

      for (const h of sortedHistory) {
          if (h.progress >= 0.95) continue; 
          if (seenMediaIds.has(h.mediaId)) continue; 

          const item = safeLibrary.find(m => m.id === h.mediaId);
          if (item) {
              seenMediaIds.add(h.mediaId);
              result.push({ item, history: h });
          }
          if (result.length >= 4) break;
      }
      return result;
  }, [profile, safeLibrary]);

  const isInMyList = (id: string) => profile?.myList.includes(id);
  const toggleMyList = (id: string) => {
      if (isInMyList(id)) {
          store.removeFromMyList(id);
      } else {
          store.addToMyList(id);
      }
  };

  if (!profile) return null; 
  if (featuredItems.length === 0) return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
          <p>No content available.</p>
      </div>
  );

  return (
    <div className="pb-32">
      
      {/* Glass Hero Section */}
      <div className="relative w-full min-h-[85vh] overflow-hidden flex items-start justify-center pt-24 md:pt-40 pb-24">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
             {showVideo && activeSlide.trailerUrl ? (
                 <video 
                    ref={videoRef}
                    src={activeSlide.trailerUrl}
                    className="w-full h-full object-cover scale-105"
                    // autoPlay removed to handle manually
                    muted={isMuted}
                    loop
                    playsInline
                 />
             ) : (
                 <img 
                    src={activeSlide.backdropUrl || activeSlide.thumbnailUrl} 
                    alt={activeSlide.title}
                    className="w-full h-full object-cover animate-pulse-slow"
                 />
             )}
             <div className="absolute inset-0 bg-black/40"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-kada-dark via-transparent to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-kada-dark/90 via-transparent to-kada-dark/90"></div>
        </div>

        {/* Floating Glass Content Card */}
        <div className="relative z-10 max-w-6xl w-full px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-kada-pink animate-pulse"></span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">Featured Premiere</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-2xl leading-tight md:leading-tight">
                     {activeSlide.title}
                 </h1>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-sm font-semibold text-gray-300">
                     <span className="text-kada-yellow">{activeSlide.year}</span>
                     <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                     <span>{activeSlide.genre}</span>
                     <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                     <span className="border border-gray-500 px-2 rounded text-[10px] md:text-xs">{activeSlide.rating}</span>
                 </div>
                 <p className="text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-none max-w-xl mx-auto md:mx-0 drop-shadow-lg leading-relaxed">
                     {activeSlide.description}
                 </p>
                 <div className="grid grid-cols-[1fr_1fr_auto] sm:flex sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 pt-2 w-full max-w-md md:max-w-none mx-auto md:mx-0">
                     <Link to={`/watch/${activeSlide.id}`} className="w-full group relative px-2 py-2 md:px-6 md:py-3 bg-white text-black rounded-full font-bold text-xs md:text-base overflow-hidden shadow-sm transition-all hover:scale-105 flex items-center justify-center">
                         <div className="absolute inset-0 bg-gradient-to-r from-kada-pink to-kada-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="relative flex items-center justify-center gap-1.5 md:gap-2 group-hover:text-white transition-colors whitespace-nowrap">
                            <PlayIcon className="w-4 h-4 md:w-5 md:h-5 fill-current" /> <span>Watch</span>
                         </div>
                     </Link>
                     <Link to={`/title/${activeSlide.id}`} className="w-full px-2 py-2 md:px-6 md:py-3 glass-panel rounded-full font-bold text-xs md:text-base hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 md:gap-2 border border-white/20 whitespace-nowrap">
                         <InfoIcon className="w-4 h-4 md:w-5 md:h-5" /> Details
                     </Link>
                     <button onClick={(e) => { e.preventDefault(); toggleMyList(activeSlide.id); }} className="w-9 h-9 md:w-12 md:h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border border-white/20 flex-shrink-0">
                         {isInMyList(activeSlide.id) ? <CheckIcon className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <PlusIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                     </button>
                 </div>
            </div>
            <div className="hidden md:block w-72 lg:w-80 aspect-[2/3] relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-kada-pink to-kada-yellow rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl transform rotate-y-12 group-hover:rotate-y-0 transition-transform duration-700">
                    <img src={activeSlide.posterUrl || activeSlide.thumbnailUrl} className="w-full h-full object-cover" />
                </div>
                {showVideo && (
                    <button onClick={() => setIsMuted(!isMuted)} className="absolute bottom-4 right-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/20 transition-colors z-20">
                        {isMuted ? <VolumeMuteIcon className="w-5 h-5 text-white" /> : <VolumeHighIcon className="w-5 h-5 text-white" />}
                    </button>
                )}
            </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {featuredItems.map((_, idx) => (
                <button key={idx} onClick={() => { setCurrentSlide(idx); setShowVideo(false); }} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'}`} />
            ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-12 relative z-10 mt-8 md:mt-12 space-y-16 md:space-y-24 lg:space-y-32">
        
        {/* Live TV Row */}
        {channels.length > 0 && (
             <section>
                 <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-red-600/20 text-red-500 animate-pulse"><div className="w-3 h-3 bg-red-500 rounded-full"></div></div>
                         <h2 className="text-2xl font-bold text-white tracking-tight">Live TV</h2>
                     </div>
                     <Link to="/live" className="text-xs md:text-sm font-bold text-kada-pink hover:text-white transition-colors uppercase tracking-wider">View All Channels</Link>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                     {channels.slice(0, 4).map(channel => (
                         <Link key={channel.id} to={`/watch/${channel.id}`} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-kada-pink/50 transition-all bg-zinc-900">
                             <img src={channel.logoUrl} className="absolute top-4 left-4 w-12 h-12 rounded object-contain bg-black/50 p-1 z-10" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0"></div>
                             <div className="w-full h-full bg-zinc-800 group-hover:scale-105 transition-transform duration-700"></div>
                             <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                                 <h3 className="font-bold text-white text-lg">{channel.name}</h3>
                                 <p className="text-xs text-gray-400 truncate">{channel.currentProgram}</p>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20">
                                 <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                                     <PlayIcon className="w-5 h-5 ml-0.5" />
                                 </div>
                             </div>
                         </Link>
                     ))}
                 </div>
             </section>
        )}

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
           <section>
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-white/10 text-kada-pink"><ClockIcon className="w-5 h-5" /></div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Continue Watching</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {continueWatching.map(({ item, history }) => (
                   <div key={`${item!.id}-${history.episodeId || ''}`} className="relative group">
                      <MediaCard item={item!} progress={history.progress} />
                   </div>
                ))}
             </div>
           </section>
        )}

        {/* Fresh Arrivals - Landscape Scroll */}
        {freshArrivals.length > 0 && (
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-white/10 text-green-400"><SparklesIcon className="w-5 h-5" /></div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Fresh Arrivals</h2>
                </div>
                <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
                    {freshArrivals.map(item => (
                        <div key={item.id} className="min-w-[280px] md:min-w-[320px] aspect-video">
                            <MediaCard item={item} />
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* PREMIUM PROMO BANNER */}
        <div className="relative w-full aspect-[21/9] md:aspect-[4/1] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer my-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900">
               <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            </div>
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 relative z-10">
               <div className="space-y-4 text-center md:text-left">
                   <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-blue-300 border border-blue-500/30">Limited Time</span>
                   <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Unlock the Universe. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Go Premium Today.</span></h2>
                   <p className="text-gray-300 max-w-lg">Get access to exclusive 4K content, download for offline viewing, and enjoy an ad-free experience.</p>
               </div>
               <button className="mt-6 md:mt-0 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                   Upgrade Now
               </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-30"></div>
        </div>

        {/* Top 10 Stylized Row */}
        {topMovies.length > 0 && (
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-white/10 text-kada-yellow"><StarIcon className="w-5 h-5" /></div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Top 10 Movies</h2>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar pl-4 items-center">
                    {topMovies.map((item, index) => (
                        <div key={item.id} className="flex-shrink-0 relative group flex items-end">
                            <span className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-transparent leading-none -mr-10 z-0 scale-y-110 translate-y-4 font-outline-2">{index + 1}</span>
                            <div className="w-40 z-10 transition-transform duration-300 group-hover:-translate-y-4">
                               <MediaCard item={item} variant="portrait" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* SPOTLIGHT MOVIE BANNER */}
        {spotlightMovie && (
            <div className="relative w-full aspect-[16/9] md:aspect-[3/1] lg:aspect-[4/1] rounded-2xl overflow-hidden group cursor-pointer my-12 shadow-2xl border border-white/5">
                <img 
                  src={spotlightMovie.backdropUrl || spotlightMovie.thumbnailUrl} 
                  alt={spotlightMovie.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl space-y-4">
                    <div className="flex items-center gap-3 animate-fade-in-up">
                        <span className="text-kada-pink font-bold tracking-widest text-[10px] uppercase border border-kada-pink/30 px-3 py-1 rounded-full bg-kada-pink/10 backdrop-blur-md">Movie of the Day</span>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-3 h-3 text-kada-yellow" />)}
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>{spotlightMovie.title}</h2>
                    <p className="text-gray-300 line-clamp-2 md:text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>{spotlightMovie.description}</p>
                    <div className="flex items-center gap-4 pt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        <Link to={`/watch/${spotlightMovie.id}`} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            <PlayIcon className="w-5 h-5 fill-current" /> Watch Now
                        </Link>
                        <button className="p-3 rounded-full bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 hover:border-white text-white transition-colors">
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Action & Adventure - Portrait Grid */}
        {actionMovies.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/10 text-red-500"><FilmIcon className="w-5 h-5" /></div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Action & Adventure</h2>
                    </div>
                    <Link to="/browse?category=Action" className="text-xs md:text-sm font-bold text-kada-pink hover:text-white transition-colors uppercase tracking-wider">View All</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {actionMovies.map(item => (
                        <div key={item.id} className="transition-transform duration-300 hover:-translate-y-2">
                            <MediaCard item={item} variant="portrait" />
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* 3RD PARTY BUSINESS AD BANNER */}
        <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden relative my-12 border border-white/5 group">
            <img src="https://picsum.photos/seed/ad/1200/200" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-between p-8">
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-600 px-2 py-1 rounded mb-2 inline-block">Sponsored</span>
                    <h3 className="text-2xl font-bold text-white">Experience Future Tech</h3>
                    <p className="text-gray-300 text-sm">The latest gadgets for your smart home.</p>
                </div>
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">Shop Now</button>
            </div>
        </div>

        {/* Sci-Fi Dimensions - Stylized Grid */}
        {sciFiSeries.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/10 text-purple-500"><SparklesIcon className="w-5 h-5" /></div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Sci-Fi Dimensions</h2>
                    </div>
                    <Link to="/browse?category=Sci-Fi" className="text-xs md:text-sm font-bold text-kada-pink hover:text-white transition-colors uppercase tracking-wider">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sciFiSeries.slice(0, 3).map((item, idx) => (
                        <div key={item.id} className={`group relative rounded-xl overflow-hidden ${idx === 0 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}>
                            <Link to={`/title/${item.id}`} className="block w-full h-full">
                                <img src={idx === 0 ? (item.backdropUrl || item.thumbnailUrl) : (item.posterUrl || item.thumbnailUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-300 line-clamp-2 mt-1">{item.description}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Categories */}
        {[
            { title: "Laugh Out Loud", icon: TrendingUpIcon, items: comedies, color: "text-yellow-400" },
            { title: "Weekend Binge", icon: TvIcon, items: bingeWorthy, color: "text-purple-400" },
            { title: "Trending Now", icon: TrendingUpIcon, items: trending, color: "text-kada-pink" },
        ].map(cat => cat.items.length > 0 && (
            <section key={cat.title}>
               <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-full bg-white/10 ${cat.color}`}>
                           {React.createElement(cat.icon, { className: "w-5 h-5" })}
                       </div>
                       <h2 className="text-2xl font-bold text-white tracking-tight">{cat.title}</h2>
                   </div>
                   <Link to={`/browse?category=${cat.title}`} className="text-xs md:text-sm font-bold text-kada-pink hover:text-white transition-colors uppercase tracking-wider">View All</Link>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {cat.items.slice(0, 5).map(item => (
                   <MediaCard key={item.id} item={item} variant="portrait" />
                 ))}
               </div>
            </section>
        ))}

        {/* KIDS MODE AD */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden mt-12 mb-40 border border-white/10 bg-gradient-to-r from-blue-500 to-teal-400">
             <div className="absolute inset-0 flex items-center p-8 md:p-12">
                 <div className="flex-1 text-white">
                     <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Kada Kids</h3>
                     <p className="max-w-md font-medium">Safe, fun, and educational content for the little ones. Create a Kids Profile today.</p>
                 </div>
                 <div className="w-1/3 h-full relative hidden md:flex items-center justify-end pr-10">
                     <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">Explore Kids</button>
                 </div>
             </div>
        </div>

      </div>
      
      {/* Custom CSS for Text Outline effect used in Top 10 */}
      <style>{`
        .font-outline-2 {
            -webkit-text-stroke: 2px rgba(255,255,255,0.2);
        }
        .text-kada-pink { color: #ff0080; }
        .text-kada-yellow { color: #ffcc00; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Home;
