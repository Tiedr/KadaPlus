
import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { MediaItem } from '../types';
import { CalendarIcon, PlayIcon, CheckIcon, BellIcon } from '../components/Icons';

const ComingSoon: React.FC = () => {
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  useEffect(() => {
    const allContent = store.getLibrary();
    setUpcoming(allContent.filter(item => item.isComingSoon));
  }, []);

  const toggleRemind = (id: string) => {
      if (remindedIds.includes(id)) { setRemindedIds(prev => prev.filter(i => i !== id)); } 
      else { setRemindedIds(prev => [...prev, id]); }
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-32 px-6 font-sans">
       <div className="container mx-auto max-w-4xl pb-40">
          <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
             <CalendarIcon className="w-8 h-8 text-utv-500" />
             <h1 className="text-2xl font-bold text-white">Coming Soon</h1>
          </div>

          {upcoming.length > 0 ? (
             <div className="space-y-16">
                {upcoming.map(item => (
                    <div key={item.id} className="group">
                        <div className="w-full aspect-video rounded-lg overflow-hidden relative mb-4">
                            <img src={item.backdropUrl || item.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-utv-600 text-white font-bold text-xs uppercase px-2 py-1 shadow-md tracking-wider">Coming {item.releaseDate ? new Date(item.releaseDate).toLocaleDateString() : 'Soon'}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/50 rounded-full p-4 border-2 border-white">
                                    <PlayIcon className="w-8 h-8 text-white translate-x-0.5" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                             <div className="max-w-2xl">
                                 <h2 className="text-3xl font-bold text-white mb-2 font-serif">{item.title}</h2>
                                 <p className="text-gray-400 leading-relaxed mb-4">{item.description}</p>
                                 <div className="flex gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                     <span>{item.genre}</span>
                                     <span>•</span>
                                     <span>{item.type}</span>
                                 </div>
                             </div>
                             <div className="flex flex-col gap-2">
                                 <button 
                                    onClick={() => toggleRemind(item.id)}
                                    className="flex flex-col items-center gap-1 group/btn"
                                 >
                                     {remindedIds.includes(item.id) ? (
                                         <CheckIcon className="w-6 h-6 text-green-500" />
                                     ) : (
                                         <BellIcon className="w-6 h-6 text-white group-hover/btn:text-utv-500 transition-colors" />
                                     )}
                                     <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{remindedIds.includes(item.id) ? 'Reminded' : 'Remind Me'}</span>
                                 </button>
                             </div>
                        </div>
                    </div>
                ))}
             </div>
          ) : (
             <div className="py-20 text-center text-gray-500"><p className="text-xl">No upcoming releases scheduled.</p></div>
          )}
       </div>
    </div>
  );
};

export default ComingSoon;
