
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../store';
import { Channel } from '../types';
import { PlayIcon, TvIcon, SearchIcon } from '../components/Icons';

const LiveTV: React.FC = () => {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setChannels(store.getChannels());
    }, []);

    const filteredChannels = useMemo(() => {
        return channels.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [channels, searchTerm]);

    const handleChannelClick = (id: string) => {
        navigate(`/watch/${id}`);
    };

    return (
        <div className="min-h-screen bg-black pt-24 md:pt-28 pb-32 px-4 md:px-6 font-sans">
            <div className="container mx-auto max-w-7xl pb-40">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-red-600/20 text-red-500 animate-pulse">
                            <TvIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Live TV</h1>
                    </div>
                    
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-kada-pink to-kada-yellow rounded-full blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
                        <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-full px-4 py-3 md:px-6 md:py-4 shadow-xl">
                            <SearchIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 mr-3" />
                            <input 
                                type="text" 
                                placeholder="Search channels..." 
                                className="w-full bg-transparent border-none outline-none text-white text-sm md:text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredChannels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredChannels.map(channel => (
                            <div 
                                key={channel.id} 
                                onClick={() => handleChannelClick(channel.id)}
                                className="group cursor-pointer bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-kada-pink/50 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                            >
                                {/* Thumbnail Area - Logo Focused */}
                                <div className="relative aspect-video bg-white/5 p-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80 z-0"></div>
                                    <img 
                                        src={channel.logoUrl} 
                                        alt={channel.name} 
                                        className="relative z-10 w-2/3 h-2/3 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    
                                    {/* Live Badge */}
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> LIVE
                                    </div>

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                            <PlayIcon className="w-6 h-6 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4 border-t border-white/5 bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
                                    <h3 className="text-white font-bold text-lg truncate group-hover:text-kada-pink transition-colors">{channel.name}</h3>
                                    <p className="text-gray-400 text-xs font-medium truncate mt-1">{channel.currentProgram}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-[10px] text-gray-500 uppercase border border-gray-700 px-1.5 py-0.5 rounded">{channel.category}</span>
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-gray-500"></div> {channel.viewers.toLocaleString()} watching
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <TvIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No channels found</h3>
                        <p className="text-gray-400">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTV;
