
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { store } from '../store';
import { MediaItem, Episode, Channel } from '../types';
import { CloseIcon, TvIcon } from '../components/Icons';
import VideoPlayer from '../components/VideoPlayer';

const Player: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [library, setLibrary] = useState<MediaItem[]>(store.getLibrary());
  const [channels, setChannels] = useState<Channel[]>(store.getChannels());
  
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isLiveContent, setIsLiveContent] = useState(false);

  useEffect(() => {
    // 1. Try to find in regular Library
    let found = library.find(m => m.id === id);
    let isChannel = false;

    // 2. If not found, check Channels
    if (!found) {
        const channel = channels.find(c => c.id === id);
        if (channel) {
            isChannel = true;
            // Construct a mock MediaItem for the player
            found = {
                id: channel.id,
                title: channel.name,
                description: `Live Stream: ${channel.currentProgram}`,
                type: 'movie', // Treat as single video for basic structure
                thumbnailUrl: channel.logoUrl,
                posterUrl: channel.logoUrl,
                backdropUrl: channel.logoUrl,
                videoUrl: channel.streamUrl,
                genre: channel.category,
                year: new Date().getFullYear(),
                rating: 'TV-PG',
                studio: 'Kada Live',
                cast: [],
                crew: [],
                tags: ['Live TV', channel.category],
                analytics: { 
                    views: channel.viewers,
                    uniqueViewers: 0, listAdds: 0, likes: 0, completionRate: 0, totalWatchTime: 0
                }
            } as MediaItem;
        }
    }

    if (found) {
      setMedia(found);
      setIsLiveContent(isChannel);

      const startEpId = (location.state as any)?.startEpisodeId;
      if (found.type === 'series' && found.seasons && !isChannel) {
        if (startEpId) {
           for (const s of found.seasons) {
             const ep = s.episodes.find(e => e.id === startEpId);
             if (ep) { setCurrentEpisode(ep); return; }
           }
        }
        const profile = store.getCurrentProfile();
        const lastWatchedEp = profile.watchHistory.find(h => h.mediaId === found.id)?.episodeId;
        if (lastWatchedEp) {
           for (const s of found.seasons) {
             const ep = s.episodes.find(e => e.id === lastWatchedEp);
             if (ep) { setCurrentEpisode(ep); return; }
           }
        }
        if (!currentEpisode) setCurrentEpisode(found.seasons[0]?.episodes[0]);
      } else {
        setCurrentEpisode(null);
      }
    }
  }, [id, library, channels]);

  useEffect(() => {
     setShowSidePanel(false);
  }, [currentEpisode, media]);

  const nextEpisodeData = useMemo(() => {
    if (isLiveContent || !media || media.type !== 'series' || !media.seasons || !currentEpisode) return null;
    let currentSeasonIndex = -1;
    let currentEpIndex = -1;

    media.seasons.forEach((season, sIdx) => {
      const epIdx = season.episodes.findIndex(e => e.id === currentEpisode.id);
      if (epIdx !== -1) { currentSeasonIndex = sIdx; currentEpIndex = epIdx; }
    });

    if (currentSeasonIndex === -1) return null;
    const currentSeason = media.seasons[currentSeasonIndex];
    if (currentEpIndex < currentSeason.episodes.length - 1) {
      return { episode: currentSeason.episodes[currentEpIndex + 1], season: currentSeason };
    }
    if (currentSeasonIndex < media.seasons.length - 1) {
      const nextSeason = media.seasons[currentSeasonIndex + 1];
      if (nextSeason.episodes.length > 0) return { episode: nextSeason.episodes[0], season: nextSeason };
    }
    return null;
  }, [media, currentEpisode, isLiveContent]);

  const recommendedItem = useMemo(() => {
     if (!media || isLiveContent) return null; // No auto-rec for live yet
     const candidates = library.filter(m => m.genre === media.genre && m.id !== media.id);
     const rec = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : library.find(m => m.id !== media.id);
     if (rec) {
         return {
             id: rec.id, title: rec.title, thumbnailUrl: rec.backdropUrl || rec.thumbnailUrl, trailerUrl: rec.trailerUrl,
             action: () => { navigate(`/watch/${rec.id}`); }
         }
     }
     return null;
  }, [media, library, isLiveContent]);

  const handleNext = () => {
    if (nextEpisodeData) { setCurrentEpisode(nextEpisodeData.episode); }
  };

  const handleClosePlayer = () => {
      if (isLiveContent) {
          navigate('/live');
      } else {
          navigate(`/title/${media?.id}`);
      }
  };

  const handleProgress = (time: number, duration: number) => {
      if (!media || isLiveContent) return;
      if (Math.floor(time) % 5 === 0) {
        store.updateWatchHistory(media.id, time, duration, currentEpisode?.id);
      }
  };

  const getStartTime = () => {
      if (!media || isLiveContent) return 0;
      const profile = store.getCurrentProfile();
      const historyItem = profile.watchHistory.find(h => h.mediaId === media.id && (currentEpisode ? h.episodeId === currentEpisode.id : true));
      if (historyItem) {
          if (historyItem.progress > 0.95) return 0;
          return historyItem.timestamp;
      }
      return 0;
  };

  if (!media) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  const videoSource = currentEpisode ? currentEpisode.videoUrl : media.videoUrl;
  const posterSource = currentEpisode ? currentEpisode.thumbnailUrl : media.thumbnailUrl;
  const displayTitle = media.title;
  const subTitle = isLiveContent 
        ? media.description.replace('Live Stream: ', '') 
        : currentEpisode 
            ? `S${media.seasons?.find(s => s.episodes.includes(currentEpisode!))?.seasonNumber} E${currentEpisode.episodeNumber}: ${currentEpisode.title}` 
            : undefined;
  
  const startTime = getStartTime();

  // Extract intro timestamps from current episode OR media item
  const introStartTime = currentEpisode?.introStartTime ?? media.introStartTime;
  const introEndTime = currentEpisode?.introEndTime ?? media.introEndTime;

  const nextVideoProp = nextEpisodeData ? {
    title: nextEpisodeData.episode.title,
    thumbnailUrl: nextEpisodeData.episode.thumbnailUrl,
    subTitle: `S${nextEpisodeData.season.seasonNumber} E${nextEpisodeData.episode.episodeNumber}`,
    onPlay: handleNext
  } : null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden font-sans">
       <VideoPlayer 
          key={videoSource}
          src={videoSource || ''} poster={posterSource} title={displayTitle} subTitle={subTitle} ads={media.ads}
          autoPlay={true} startTime={startTime} nextVideo={nextVideoProp} recommendedItem={recommendedItem}
          onEnded={handleNext} 
          isSeries={media.type === 'series'}
          isLive={isLiveContent}
          onToggleEpisodes={() => { setShowSidePanel(!showSidePanel); }}
          onClose={handleClosePlayer} onProgress={handleProgress}
          introStartTime={introStartTime}
          introEndTime={introEndTime}
       />

       {/* SIDE PANEL (Episodes OR Channels) */}
       <div className={`absolute top-0 right-0 h-full w-80 md:w-96 bg-zinc-900/95 border-l border-white/10 transform transition-transform duration-300 ease-in-out z-[60] ${showSidePanel ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="p-6 h-full flex flex-col">
               <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                   <h2 className="text-white font-bold text-xl">{isLiveContent ? 'Live Channels' : 'Episodes'}</h2>
                   <button onClick={() => setShowSidePanel(false)} className="text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                   
                   {/* SERIES EPISODES LIST */}
                   {!isLiveContent && media.seasons?.map(season => (
                       <div key={season.id}>
                           <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 sticky top-0 bg-zinc-900 py-2 z-10">Season {season.seasonNumber}</h3>
                           <div className="space-y-1">
                               {season.episodes.map(ep => {
                                   const isActive = currentEpisode?.id === ep.id;
                                   return (
                                       <div 
                                         key={ep.id} onClick={() => setCurrentEpisode(ep)}
                                         className={`flex gap-3 p-3 rounded hover:bg-white/10 cursor-pointer transition-colors ${isActive ? 'bg-white/10' : ''}`}
                                       >
                                           <div className="text-gray-500 font-bold text-lg self-center w-6">{ep.episodeNumber}</div>
                                           <div className="relative w-24 h-14 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                                               <img src={ep.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                               {isActive && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-2 h-2 bg-utv-500 rounded-full animate-ping"></div></div>}
                                           </div>
                                           <div className="min-w-0 flex flex-col justify-center">
                                               <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{ep.title}</h4>
                                               <p className="text-xs text-gray-500">{ep.duration}</p>
                                           </div>
                                       </div>
                                   )
                               })}
                           </div>
                       </div>
                   ))}

                   {/* LIVE CHANNELS LIST */}
                   {isLiveContent && (
                       <div className="space-y-4">
                           <div>
                               <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Up Next</h3>
                               <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                   <div className="flex justify-between text-sm"><span className="text-white">14:00</span><span className="text-gray-400">News Update</span></div>
                                   <div className="flex justify-between text-sm"><span className="text-white">15:30</span><span className="text-gray-400">Documentary</span></div>
                                   <div className="flex justify-between text-sm"><span className="text-white">17:00</span><span className="text-gray-400">Music Hour</span></div>
                               </div>
                           </div>

                           <div>
                               <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Other Channels</h3>
                               <div className="space-y-2">
                                   {channels.filter(c => c.id !== media.id).map(c => (
                                       <button 
                                            key={c.id}
                                            onClick={() => { navigate(`/watch/${c.id}`); setShowSidePanel(false); }}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
                                       >
                                           <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 shrink-0">
                                               <img src={c.logoUrl} className="max-w-full max-h-full object-contain" />
                                           </div>
                                           <div className="min-w-0">
                                               <h4 className="text-sm font-bold text-gray-300 group-hover:text-white truncate">{c.name}</h4>
                                               <p className="text-xs text-gray-500 truncate">{c.category}</p>
                                           </div>
                                       </button>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

               </div>
           </div>
       </div>
    </div>
  );
};

export default Player;
