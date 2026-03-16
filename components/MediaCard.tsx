
import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';
import { PlayIcon, CalendarIcon, LockIcon } from './Icons';

interface MediaCardProps {
  item: MediaItem;
  variant?: 'portrait' | 'landscape';
  progress?: number; // 0 to 1
}

const MediaCard: React.FC<MediaCardProps> = ({ item, variant = 'landscape', progress }) => {
  const isPortrait = variant === 'portrait';
  const aspectRatio = isPortrait ? 'aspect-[2/3]' : 'aspect-video';
  const imageUrl = isPortrait ? (item.posterUrl || item.thumbnailUrl) : item.thumbnailUrl;

  return (
    <Link to={`/title/${item.id}`} className="group relative block h-full">
      <div className={`relative overflow-hidden rounded-2xl ${aspectRatio} bg-zinc-900 border border-white/10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,128,0.3)] group-hover:border-kada-pink/50`}>
        <img
          src={imageUrl}
          alt={item.title}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.isComingSoon ? 'grayscale opacity-60' : 'opacity-90 group-hover:opacity-100'}`}
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

        {/* Series Badge */}
        {item.type === 'series' && (
           <div className="absolute top-3 right-3 glass-panel text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-white/20">
             Series
           </div>
        )}

        {/* Coming Soon Badge */}
        {item.isComingSoon && (
           <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
             <CalendarIcon className="w-3 h-3" /> COMING SOON
           </div>
        )}

        {/* Play Icon on Hover */}
        {!item.isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 backdrop-blur-[2px]">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-kada-pink to-kada-yellow flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
               <PlayIcon className="h-5 w-5 fill-black text-black translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Progress Bar for Continue Watching */}
        {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div className="h-full bg-gradient-to-r from-kada-pink to-kada-yellow" style={{ width: `${progress * 100}%` }}></div>
            </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 z-10">
          <h3 className={`font-bold text-white leading-tight group-hover:text-kada-yellow transition-colors ${isPortrait ? 'text-sm line-clamp-1' : 'text-base line-clamp-1'}`}>
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] text-kada-pink font-bold border border-kada-pink/30 px-1.5 rounded">{item.rating}</span>
             <span className="text-[10px] text-gray-400">{item.genre}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
