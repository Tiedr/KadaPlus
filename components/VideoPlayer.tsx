
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, VolumeHighIcon, VolumeMuteIcon, MaximizeIcon, SkipForwardIcon, CloseIcon, ListIcon, PhoneRotateIcon, SpeedIcon, QualityIcon, SubtitleIcon, ExternalLinkIcon, SettingsIcon } from './Icons';
import { Ad, SubtitleTrack } from '../types';

interface NextVideo {
  title: string;
  thumbnailUrl: string;
  subTitle?: string;
  onPlay: () => void;
}

interface RecommendedItem {
    id: string;
    title: string;
    thumbnailUrl: string;
    trailerUrl?: string;
    action: () => void;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subTitle?: string;
  ads?: Ad[];
  nextVideo?: NextVideo | null;
  recommendedItem?: RecommendedItem | null;
  onEnded?: () => void;
  autoPlay?: boolean;
  startTime?: number; 
  isSeries?: boolean;
  onToggleEpisodes?: () => void;
  onClose?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
  initialSubtitles?: SubtitleTrack[];
  isLive?: boolean;
  introStartTime?: number;
  introEndTime?: number;
  className?: string;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITIES = ['Auto', '4K', '1080p', '720p', '480p'];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, poster, title, subTitle, ads = [], nextVideo, recommendedItem, onEnded, autoPlay = false, startTime = 0,
  isSeries, onToggleEpisodes, onClose, onProgress, initialSubtitles = [], isLive = false,
  introStartTime, introEndTime, className = "", loop = false, muted = false, showControls: showControlsProp = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isHovering, setIsHovering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>(initialSubtitles);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeQuality, setActiveQuality] = useState('Auto');
  
  const [showRecommendation, setShowRecommendation] = useState(false);

  const [adState, setAdState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [activeBannerAd, setActiveBannerAd] = useState<Ad | null>(null);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [canSkipAd, setCanSkipAd] = useState(false);
  const [playedAds, setPlayedAds] = useState<string[]>([]);
  const [showSkipRecap, setShowSkipRecap] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAdState('idle');
    setCurrentAd(null);
    setActiveBannerAd(null);
    setPlayedAds([]);
    setShowRecommendation(false);
    setSubtitles(initialSubtitles);
    setActiveSubtitle('off');
    setPlaybackRate(1);
    setActiveQuality('Auto');
    setShowSkipRecap(false);
    setShowSkipIntro(false);
    
    let seekTimeout: any;
    let playTimeout: any;

    if (videoRef.current) {
      // Ensure we don't carry over playback state confusingly
      videoRef.current.pause();
      
      seekTimeout = setTimeout(() => {
          if (videoRef.current && startTime > 0 && startTime < (videoRef.current.duration || Infinity) * 0.95) {
            videoRef.current.currentTime = startTime;
            setCurrentTime(startTime);
          }
      }, 100);
    }
    
    if (autoPlay && videoRef.current) {
      playTimeout = setTimeout(() => {
        if (videoRef.current) {
             const playPromise = videoRef.current.play();
             if (playPromise !== undefined) {
                 playPromise.catch(err => {
                     // Ignore AbortError (happens when element removed or src changed quickly)
                     if (err.name !== 'AbortError') {
                         console.log('Autoplay prevented', err);
                     }
                 });
             }
        }
      }, 500);
    }

    return () => {
        if (seekTimeout) clearTimeout(seekTimeout);
        if (playTimeout) clearTimeout(playTimeout);
    };
  }, [src]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const checkForAds = (time: number) => {
    if (adState === 'playing') return;

    // Preroll
    // Ensure we trigger only if we are at the very start
    if (time < 0.5 && !playedAds.includes('preroll')) {
      const preroll = ads.find(a => a.type === 'preroll');
      if (preroll) {
        playAd(preroll, 'preroll');
        return;
      }
    }

    // Midroll
    const midrolls = ads.filter(a => a.type === 'midroll' && !playedAds.includes(a.id));
    for (const ad of midrolls) {
      if (ad.startTime && Math.abs(time - ad.startTime) < 1) {
        playAd(ad, ad.id);
        return;
      }
    }

    // Banner Ads Logic (Mocked frequency)
    if (!activeBannerAd && time > 60 && time % 300 < 1 && !playedAds.includes('banner-' + Math.floor(time))) {
        const banner = ads.find(a => a.type === 'banner');
        if (banner) {
            setActiveBannerAd(banner);
            setPlayedAds(prev => [...prev, 'banner-' + Math.floor(time)]);
            // Auto hide after 15s
            setTimeout(() => setActiveBannerAd(null), 15000);
        }
    }

    // Skip Recap Logic
    if (isSeries && time > 0 && time < 45 && !showSkipRecap && !showSkipIntro) {
        setShowSkipRecap(true);
    } else if ((time >= 45 || adState === 'playing') && showSkipRecap) {
        setShowSkipRecap(false);
    }

    // Skip Intro Logic
    if (introStartTime !== undefined && introEndTime !== undefined) {
        if (time >= introStartTime && time < introEndTime && !showSkipIntro && adState !== 'playing') {
            setShowSkipIntro(true);
        } else if ((time >= introEndTime || time < introStartTime || adState === 'playing') && showSkipIntro) {
            setShowSkipIntro(false);
        }
    }
  };

  const playAd = (ad: Ad, adIdToMark: string) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    setCurrentAd(ad);
    setAdState('playing');
    setAdTimeLeft(ad.duration);
    setCanSkipAd(false);
    setPlayedAds(prev => [...prev, adIdToMark]);
    if (ad.skipAfter && ad.skipAfter > 0) {
       setTimeout(() => setCanSkipAd(true), ad.skipAfter * 1000);
    }
  };

  const handleAdTick = () => {
    setAdTimeLeft(prev => {
      if (prev <= 1) {
        finishAd();
        return 0;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    let interval: any;
    if (adState === 'playing' && currentAd) {
      interval = setInterval(handleAdTick, 1000);
    }
    return () => clearInterval(interval);
  }, [adState, currentAd]);

  const finishAd = () => {
    // If it was a postroll, we are done with the content
    const wasPostroll = currentAd?.type === 'postroll';
    
    setAdState('idle');
    setCurrentAd(null);
    
    if (wasPostroll) {
       triggerEndSequence();
    } else {
       // Resume main video
       if (videoRef.current) {
         const p = videoRef.current.play();
         if (p !== undefined) {
             p.catch(e => { if (e.name !== 'AbortError') console.error("Resume error", e) });
         }
         setIsPlaying(true);
       }
    }
  };

  const skipRecap = () => {
      if (videoRef.current) {
          videoRef.current.currentTime = 45; // Jump to 45s
          setShowSkipRecap(false);
      }
  };

  const skipIntro = () => {
      if (videoRef.current && introEndTime) {
          videoRef.current.currentTime = introEndTime;
          setShowSkipIntro(false);
      }
  };

  const togglePlay = () => {
    if (adState === 'playing') return;
    if (showRecommendation) return; 
    
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      const p = videoRef.current.play();
      if (p !== undefined) {
          p.catch(e => { if (e.name !== 'AbortError') console.error("Play error", e); });
      }
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(curr);
    checkForAds(curr);
    
    if (onProgress && dur > 0) {
        onProgress(curr, dur);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = Number(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
        videoRef.current.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSettingsMenu(false);
    }
  };
  
  const changeQuality = (q: string) => {
      setActiveQuality(q);
      setShowSettingsMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const triggerEndSequence = () => {
      if (nextVideo) {
        nextVideo.onPlay();
      } else if (recommendedItem) {
        setShowRecommendation(true);
      } else if (onEnded) {
        onEnded();
      }
  };

  const handleMainVideoEnded = () => {
    setIsPlaying(false);
    const postroll = ads.find(a => a.type === 'postroll' && !playedAds.includes('postroll'));
    if (postroll) {
      playAd(postroll, 'postroll');
    } else {
      triggerEndSequence();
    }
  };

  const changeSubtitle = (trackId: string) => {
      setActiveSubtitle(trackId);
      setShowSubtitleMenu(false);
      
      if (videoRef.current) {
          const tracks = videoRef.current.textTracks;
          for (let i = 0; i < tracks.length; i++) {
             const trackData = subtitles.find(s => s.id === trackId);
             
             if (trackId === 'off') {
                 tracks[i].mode = 'hidden';
             } else if (trackData && (tracks[i].label === trackData.label)) {
                 tracks[i].mode = 'showing';
             } else {
                 tracks[i].mode = 'hidden';
             }
          }
      }
  };

  const closeAllMenus = () => {
      setShowSettingsMenu(false);
      setShowSubtitleMenu(false);
  };

  useEffect(() => {
    let timeout: any;
    if (isHovering) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !showSettingsMenu && !showSubtitleMenu) setIsHovering(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [isHovering, isPlaying, showSettingsMenu, showSubtitleMenu]);

  const showControls = showControlsProp && !showRecommendation && adState !== 'playing' && (isHovering || !isPlaying || showSettingsMenu || showSubtitleMenu);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black group overflow-hidden select-none font-sans mobile-forced-landscape ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={() => setIsHovering(true)}
      onClick={closeAllMenus}
    >
      
      <style>{`
        @media (max-width: 1024px) and (orientation: portrait) {
          .mobile-forced-landscape {
            width: 100vh !important;
            height: 100vw !important;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            transform-origin: center;
            z-index: 9999;
          }
        }
      `}</style>

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        className="w-full h-full object-contain"
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
            if (videoRef.current) {
                setDuration(videoRef.current.duration || 0);
            }
        }}
        onEnded={handleMainVideoEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      >
          {subtitles.map((track, index) => (
              <track 
                 key={track.id}
                 kind="subtitles"
                 src={track.src}
                 srcLang={track.language}
                 label={track.label}
                 default={activeSubtitle === track.id}
              />
          ))}
      </video>

      {/* Top Overlay - Glass Gradient */}
      {showControls && (title || subTitle) && (
        <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 to-transparent z-40 pointer-events-none transition-opacity duration-500">
            <h2 className="text-white font-bold text-3xl drop-shadow-lg tracking-tight">{title}</h2>
            {subTitle && <p className="text-gray-200 text-base font-medium drop-shadow-md mt-1">{subTitle}</p>}
        </div>
      )}

      {/* Close Button - Floating Glass */}
      {showControls && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white transition-all hover:bg-white/20 hover:scale-110 pointer-events-auto shadow-lg group/close"
          title="Exit Player"
        >
          <CloseIcon className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {/* BANNER AD OVERLAY */}
      {activeBannerAd && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[45] animate-fade-in-up">
              <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl relative max-w-lg flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setActiveBannerAd(null); }} className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1 shadow-lg hover:bg-gray-200">
                      <CloseIcon className="w-4 h-4" />
                  </button>
                  {activeBannerAd.imageUrl ? (
                      <img src={activeBannerAd.imageUrl} className="w-24 h-16 object-cover rounded" />
                  ) : (
                      <div className="w-24 h-16 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">Ad Image</div>
                  )}
                  <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{activeBannerAd.advertiserName || 'Sponsored'}</h4>
                      <p className="text-xs text-gray-300 mb-2">Check out our latest offers today.</p>
                      {activeBannerAd.linkUrl && (
                          <a href={activeBannerAd.linkUrl} target="_blank" className="text-xs bg-kada-pink text-white px-3 py-1 rounded font-bold hover:bg-pink-600 inline-block">Learn More</a>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* SKIP RECAP BUTTON */}
      {showSkipRecap && !isLive && (
          <div className="absolute bottom-32 right-12 z-[45] animate-fade-in">
              <button 
                onClick={skipRecap}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-lg group"
              >
                  Skip Recap <SkipForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      )}

      {/* SKIP INTRO BUTTON */}
      {showSkipIntro && !isLive && (
          <div className="absolute bottom-32 right-12 z-[45] animate-fade-in">
              <button 
                onClick={skipIntro}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-lg group"
              >
                  Skip Intro <SkipForwardIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      )}

      {/* AD OVERLAY */}
      {adState === 'playing' && currentAd && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
           <video 
             src={currentAd.videoUrl}
             autoPlay 
             className="absolute inset-0 w-full h-full object-contain"
           />
           
           <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-start pointer-events-auto">
                <div className="flex gap-2">
                    <span className="glass-panel text-white text-xs font-bold px-3 py-1.5 rounded-full border border-kada-yellow/50 text-kada-yellow uppercase tracking-wider">Ad</span>
                    {currentAd.advertiserName && (
                        <span className="glass-panel text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {currentAd.advertiserName}
                        </span>
                    )}
                </div>
                
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-white/20 relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-kada-yellow transition-all duration-1000 linear" strokeDasharray={`${(adTimeLeft / currentAd.duration) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <span className="text-sm font-bold text-white">{adTimeLeft}</span>
                </div>
           </div>

           <div className="absolute bottom-10 right-8 left-8 flex justify-between items-end pointer-events-auto z-50">
               <div>
                  {currentAd.linkUrl && (
                      <a href={currentAd.linkUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 glass-panel hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-all border border-white/20 group">
                          Visit Advertiser <ExternalLinkIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                  )}
               </div>

              <div className="flex flex-col items-end space-y-4">
                  {canSkipAd ? (
                    <button onClick={finishAd} className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                      Skip Ad <SkipForwardIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="glass-panel px-6 py-3 rounded-full text-gray-300 text-sm font-medium border border-white/10">
                       Skip in <span className="text-white font-bold ml-1">{currentAd.skipAfter ? Math.max(0, currentAd.skipAfter - (currentAd.duration - adTimeLeft)) : adTimeLeft}s</span>
                    </div>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* RECOMMENDATION OVERLAY */}
      {showRecommendation && recommendedItem && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden animate-fade-in">
             {recommendedItem.trailerUrl && (
                 <div className="absolute inset-0 opacity-40">
                    <video src={recommendedItem.trailerUrl} autoPlay muted loop className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>
                 </div>
             )}
             
             <div className="relative z-10 text-center p-4 md:p-8 max-w-4xl w-full">
                 <div className="text-kada-pink text-[10px] md:text-sm uppercase tracking-[0.3em] font-bold mb-2 md:mb-6">Up Next</div>
                 <h2 className="text-3xl md:text-7xl font-black text-white mb-6 md:mb-10 tracking-tight leading-tight">{recommendedItem.title}</h2>
                 
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                     <div className="w-full max-w-[280px] md:max-w-sm aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative border border-white/10 group cursor-pointer" onClick={() => recommendedItem.action()}>
                         <img src={recommendedItem.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                                 <PlayIcon className="w-6 h-6 md:w-8 md:h-8 text-white fill-white translate-x-0.5" />
                             </div>
                         </div>
                     </div>

                     <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[280px] md:w-auto md:min-w-[200px]">
                         <button 
                            onClick={() => recommendedItem.action()}
                            className="w-full px-6 py-3.5 md:px-10 md:py-4 bg-white text-black font-bold text-base md:text-lg rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-xl"
                         >
                             Play Now
                         </button>
                         <button 
                            onClick={onClose} 
                            className="w-full px-6 py-3.5 md:px-10 md:py-4 glass-panel text-white font-bold text-base md:text-lg rounded-full hover:bg-white/10 transition-all border border-white/20"
                         >
                             Cancel
                         </button>
                     </div>
                 </div>
             </div>
        </div>
      )}

      {/* CONTROLS BAR - Floating Glass Pill */}
      {showControls && (
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12 z-40 animate-fade-in-up">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 md:px-8 md:py-5 shadow-2xl relative">
              
              {/* Progress Bar - Floating above (Hidden for Live) */}
              {!isLive && (
                  <div className="absolute -top-3 left-6 right-6 group/progress h-1.5 cursor-pointer">
                     <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                         <div 
                           className="h-full bg-gradient-to-r from-kada-pink to-kada-yellow rounded-full relative"
                           style={{ width: `${(currentTime / duration) * 100}%` }}
                         >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/progress:opacity-100 scale-0 group-hover/progress:scale-150 transition-all"></div>
                         </div>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max={duration || 100} 
                       value={currentTime} 
                       onChange={handleSeek}
                       onClick={(e) => e.stopPropagation()}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     />
                  </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {/* Left Controls */}
                <div className="flex items-center gap-4 md:gap-8">
                   <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-kada-pink transition-colors hover:scale-110 transform">
                     {isPlaying ? <PauseIcon className="w-7 h-7 md:w-9 md:h-9" /> : <PlayIcon className="w-7 h-7 md:w-9 md:h-9 fill-current" />}
                   </button>
                   
                   {!isLive && (
                       <button onClick={(e) => { e.stopPropagation(); if(videoRef.current) videoRef.current.currentTime -= 10; }} className="hidden sm:block text-gray-300 hover:text-white transition-colors text-xs font-bold">
                           -10s
                       </button>
                   )}

                   <div className="flex items-center gap-2 md:gap-3 group/volume" onClick={(e) => e.stopPropagation()}>
                     <button onClick={toggleMute} className="text-gray-300 hover:text-white transition-colors">
                       {isMuted || volume === 0 ? <VolumeMuteIcon className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeHighIcon className="w-5 h-5 md:w-6 md:h-6" />}
                     </button>
                     <div className="hidden md:flex w-0 group-hover/volume:w-24 transition-all duration-300 overflow-hidden items-center">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110"
                        />
                     </div>
                   </div>

                   {!isLive ? (
                       <div className="text-xs font-bold text-gray-400 tracking-wider">
                         <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
                       </div>
                   ) : (
                       <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                           <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live</span>
                       </div>
                   )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-4 relative">
                   
                   {/* Subtitles */}
                   <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setShowSubtitleMenu(!showSubtitleMenu); setShowSettingsMenu(false); }} className={`hover:text-white transition-colors hover:scale-110 ${activeSubtitle && activeSubtitle !== 'off' ? 'text-kada-pink' : 'text-gray-300'}`}>
                         <SubtitleIcon className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      {showSubtitleMenu && (
                          <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl py-2 min-w-[180px] shadow-2xl overflow-hidden z-50 animate-fade-in-up origin-bottom">
                              <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/10 mb-1">Subtitles</div>
                              <button onClick={(e) => { e.stopPropagation(); changeSubtitle('off'); setShowSubtitleMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${activeSubtitle === 'off' ? 'text-kada-pink font-bold' : 'text-gray-300'}`}>Off</button>
                              {subtitles.map(track => (
                                  <button key={track.id} onClick={(e) => { e.stopPropagation(); changeSubtitle(track.id); setShowSubtitleMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${activeSubtitle === track.id ? 'text-kada-pink font-bold' : 'text-gray-300'}`}>{track.label}</button>
                              ))}
                          </div>
                      )}
                   </div>

                   {/* Settings (Quality & Speed) */}
                   {!isLive && (
                       <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); setShowSubtitleMenu(false); }}
                                className={`transition-colors hover:scale-110 hover:rotate-45 duration-300 ${showSettingsMenu ? 'text-kada-pink' : 'text-gray-300 hover:text-white'}`}
                            >
                                <SettingsIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            {showSettingsMenu && (
                                <div className="absolute bottom-full mb-6 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 min-w-[200px] shadow-2xl overflow-hidden z-50 animate-fade-in-up origin-bottom-right">
                                    {/* Quality Section */}
                                    <div className="px-3 py-2">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quality</div>
                                        <div className="flex flex-wrap gap-2">
                                            {QUALITIES.map(q => (
                                                <button key={q} onClick={(e) => { e.stopPropagation(); changeQuality(q); setShowSettingsMenu(false); }} className={`px-2 py-1 rounded text-xs font-bold transition-colors ${activeQuality === q ? 'bg-kada-pink text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>{q}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10 my-1"></div>
                                    {/* Speed Section */}
                                    <div className="px-3 py-2">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Speed</div>
                                        <div className="flex flex-wrap gap-2">
                                            {PLAYBACK_SPEEDS.map(s => (
                                                <button key={s} onClick={(e) => { e.stopPropagation(); changeSpeed(s); setShowSettingsMenu(false); }} className={`px-2 py-1 rounded text-xs font-bold transition-colors ${playbackRate === s ? 'bg-kada-pink text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>{s}x</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                       </div>
                   )}

                   {/* Next Episode Button */}
                   {nextVideo && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); nextVideo.onPlay(); }} 
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1.5 md:px-4 md:py-1.5 transition-colors border border-white/10"
                        title="Next Episode"
                     >
                       <span className="hidden sm:inline text-xs font-bold">Next Ep</span>
                       <SkipForwardIcon className="w-4 h-4 md:w-5 md:h-5" />
                     </button>
                   )}

                   {(isSeries || isLive) && onToggleEpisodes && (
                     <button onClick={(e) => { e.stopPropagation(); onToggleEpisodes(); }} className="text-gray-300 hover:text-white transition-colors hover:scale-110">
                       <ListIcon className="w-5 h-5 md:w-6 md:h-6" />
                     </button>
                   )}

                   <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-gray-300 hover:text-white transition-colors hover:scale-110">
                     <MaximizeIcon className="w-5 h-5 md:w-6 md:h-6" />
                   </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
