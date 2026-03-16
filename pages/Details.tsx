
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../store';
import { MediaItem, UserProfile } from '../types';
import { PlayIcon, ListIcon, PlusIcon, CheckIcon, CalendarIcon, LockIcon } from '../components/Icons';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [profile, setProfile] = useState<UserProfile>(store.getCurrentProfile());
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);

  useEffect(() => {
    const library = store.getLibrary();
    const found = library.find(m => m.id === id);
    
    if (found) {
      setMedia(found);
      if (found.type === 'series' && found.seasons?.length) {
        setActiveSeasonId(found.seasons[0].id);
      }
    }

    const unsubProfile = store.subscribe('profile', () => setProfile(store.getCurrentProfile()));
    return () => {
      unsubProfile();
    };
  }, [id]);

  const handlePlay = () => {
    if (media && !media.isComingSoon) {
      if (media.type === 'series' && media.seasons?.[0]?.episodes?.[0]) {
         handleEpisodePlay(media.seasons[0].episodes[0].id);
      } else {
         navigate(`/watch/${media.id}`);
      }
    }
  };

  const handleEpisodePlay = (episodeId: string) => {
    if (media && !media.isComingSoon) {
        navigate(`/watch/${media.id}`, { state: { startEpisodeId: episodeId } });
    }
  };

  const isInMyList = profile.myList.includes(media?.id || '');

  const toggleMyList = () => {
    if (!media) return;
    if (isInMyList) {
        store.removeFromMyList(media.id);
    } else {
        store.addToMyList(media.id);
    }
  };


  if (!media) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const activeSeason = media.seasons?.find(s => s.id === activeSeasonId);

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end pt-32 md:pt-40">
        <div className="absolute inset-0">
           <img src={media.backdropUrl || media.thumbnailUrl} alt={media.title} className={`w-full h-full object-cover opacity-70 ${media.isComingSoon ? 'grayscale' : ''}`} />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full p-6 pb-12 md:p-16 mt-12 md:mt-0">
           <div className="max-w-4xl space-y-4 md:space-y-6 animate-fade-in-up">
             
             <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-xl">
               {media.title}
             </h1>

             <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-300">
               <span className="text-green-500">97% Match</span>
               <span>{media.year}</span>
               <span className="border border-gray-400 px-1 rounded-sm text-xs">{media.rating}</span>
               <span>{media.type === 'movie' ? media.duration : `${media.seasons?.length} Seasons`}</span>
               <span className="border border-gray-400 px-1 rounded-sm text-xs uppercase">HD</span>
               {media.isComingSoon && <span className="text-utv-400 flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> Coming Soon</span>}
             </div>

             <div className="flex flex-wrap gap-2 max-w-2xl text-sm font-bold">
                 <span className="text-white">{media.genre}</span>
                 {media.tags?.slice(0, 3).map((tag, idx) => (
                    <React.Fragment key={idx}>
                       <span className="text-gray-500">•</span>
                       <span className="text-gray-300">{tag}</span>
                    </React.Fragment>
                 ))}
             </div>

             <p className="text-base md:text-lg text-white leading-relaxed max-w-2xl drop-shadow-md">
               {media.description}
             </p>

             <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4">
               {media.isComingSoon ? (
                    <button className="bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-2.5 md:px-10 md:py-4 rounded-full font-bold flex items-center gap-2 cursor-not-allowed text-sm md:text-base">
                        <LockIcon className="w-4 h-4 md:w-5 md:h-5" />
                        Available {media.releaseDate ? new Date(media.releaseDate).toLocaleDateString() : 'Soon'}
                    </button>
               ) : (
                   <button 
                        onClick={handlePlay}
                        className="flex items-center gap-3 bg-white text-black px-6 py-2.5 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/90 transition-colors"
                   >
                        <PlayIcon className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                        Play
                   </button>
               )}

                <button 
                    onClick={toggleMyList}
                    className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-gray-500/70 text-white rounded-full font-bold hover:bg-gray-500/50 transition-colors backdrop-blur-sm flex-shrink-0"
                >
                    {isInMyList ? <CheckIcon className="w-5 h-5 md:w-6 md:h-6" /> : <PlusIcon className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="container mx-auto px-4 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-40">
         
         {/* Left: Episodes & More Like This */}
         <div className="lg:col-span-2 space-y-10">
            {/* Series Episodes Section */}
            {media.type === 'series' && media.seasons && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-white">Episodes</h2>
                  
                  {/* Season Selector */}
                  <div className="relative">
                      <select 
                        className="appearance-none bg-zinc-900 border border-gray-700 text-white py-2 pl-4 pr-10 rounded-full font-bold focus:outline-none"
                        value={activeSeasonId || ''}
                        onChange={(e) => setActiveSeasonId(e.target.value)}
                      >
                         {media.seasons.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                      </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeSeason?.episodes.map((episode, idx) => (
                    <div 
                      key={episode.id} 
                      className={`group flex flex-col md:flex-row gap-4 p-4 rounded border-b border-gray-800 hover:bg-zinc-900 cursor-pointer transition-colors ${media.isComingSoon ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleEpisodePlay(episode.id)}
                    >
                        <div className="text-xl text-gray-500 font-bold self-center w-8">{idx + 1}</div>
                        <div className="relative w-full md:w-40 aspect-video rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                          <img src={episode.thumbnailUrl} alt={episode.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                              <PlayIcon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline mb-2">
                             <h3 className="font-bold text-white text-base">{episode.title}</h3>
                             <span className="text-sm text-gray-400">{episode.duration}</span>
                          </div>
                          <p className="text-gray-400 text-sm leading-snug line-clamp-3">
                            {episode.description}
                          </p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>

         {/* Right: Details Sidebar */}
         <div className="space-y-6 text-sm">
             <div>
                 <span className="text-gray-500 block mb-1">Cast</span>
                 <p className="text-white leading-relaxed">
                     {media.cast?.join(', ') || 'N/A'}
                 </p>
             </div>
             <div>
                 <span className="text-gray-500 block mb-1">Genres</span>
                 <p className="text-white leading-relaxed">
                     {media.genre}, {media.tags?.join(', ')}
                 </p>
             </div>
             <div>
                 <span className="text-gray-500 block mb-1">This show is...</span>
                 <p className="text-white leading-relaxed font-bold">
                     Exciting, Cerebral, Visual
                 </p>
             </div>
             {media.studio && (
                 <div>
                     <span className="text-gray-500 block mb-1">Production</span>
                     <p className="text-white">{media.studio}</p>
                 </div>
             )}
         </div>
         
      </div>
    </div>
  );
};

export default Details;
