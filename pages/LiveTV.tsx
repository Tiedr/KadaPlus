
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
                                className="group cursor-pointer bg-zinc-950 rounded-lg overflow-hidden border border-white/5 hover:border-kada-pink/30 transition-all duration-300 hover:bg-zinc-900"
                            >
                                {/* Thumbnail Area */}
                                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={channel.logoUrl} 
                                        alt={channel.name} 
                                        className="relative z-10 w-1/2 h-1/2 object-contain transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    
                                    {/* Live Badge */}
                                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-red-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div> LIVE
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-3 border-t border-white/5">
                                    <h3 className="text-white font-bold text-sm truncate group-hover:text-kada-pink transition-colors">{channel.name}</h3>
                                    <p className="text-gray-500 text-[10px] truncate">{channel.currentProgram}</p>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                        <span className="text-[9px] text-gray-600 uppercase font-mono tracking-wider">{channel.category}</span>
                                        <span className="text-[9px] text-gray-600 font-mono tracking-wider">{channel.viewers.toLocaleString()}</span>
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
