
import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { MediaItem, User, Plan, AppSettings, Season, Episode, Ad, Genre, SubtitleTrack } from '../types';
import { DashboardIcon, UserIcon, SettingsIcon, SparklesIcon, PlusIcon, TrashIcon, EditIcon, TrendingUpIcon, DollarIcon, FilmIcon, CloseIcon, MenuIcon, CreditCardIcon, BriefcaseIcon, CheckIcon, WorldIcon, LockIcon, CalendarIcon, ListIcon, PlayIcon, UploadIcon, CheckCircleIcon, SubtitleIcon, ActivityIcon, BarChartIcon, FilterIcon, DownloadIcon, EyeIcon, PieChartIcon, MapIcon, SearchIcon } from '../components/Icons';

type Tab = 'dashboard' | 'content' | 'genres' | 'users' | 'plans' | 'ads' | 'settings';

const FileUpload: React.FC<{ 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    accept?: string,
    type?: 'image' | 'video' | 'subtitle'
}> = ({ label, value, onChange, accept = "image/*", type = 'image' }) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            onChange(url);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{label}</label>
            <div className="flex gap-2">
                <input 
                    className="flex-1 bg-zinc-900 border border-white/20 rounded p-3 text-white text-sm focus:border-utv-500 outline-none transition-colors"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={`Enter URL or upload ${type}...`}
                />
                <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded border border-white/20 cursor-pointer flex items-center justify-center transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    <input type="file" accept={accept} className="hidden" onChange={handleFile} />
                </label>
            </div>
            {type === 'image' && value && (
                <div className="mt-2 w-24 h-16 rounded overflow-hidden border border-white/10 shadow-sm">
                    <img src={value} className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
};

interface AdEditModalProps {
    ad: Partial<Ad>;
    onSave: () => void;
    onCancel: () => void;
    onChange: (ad: Partial<Ad>) => void;
}

const AdEditModal: React.FC<AdEditModalProps> = ({ ad, onSave, onCancel, onChange }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-zinc-950 w-full max-w-lg rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                 <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white">{ad.id ? 'Edit Ad' : 'New Ad'}</h3>
                    <button onClick={onCancel}><CloseIcon className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                 </div>
                 <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title / Advertiser</label>
                        <input className="input-field" placeholder="Internal Promo / Brand Name" value={ad.advertiserName || ''} onChange={e => onChange({...ad, advertiserName: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ad Type</label>
                            <select className="input-field" value={ad.type || 'preroll'} onChange={e => onChange({...ad, type: e.target.value as any})}>
                                <option value="preroll">Pre-roll</option>
                                <option value="midroll">Mid-roll</option>
                                <option value="postroll">Post-roll</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Duration (sec)</label>
                            <input type="number" className="input-field" value={ad.duration || 15} onChange={e => onChange({...ad, duration: parseInt(e.target.value)})} />
                         </div>
                     </div>
                     {ad.type === 'midroll' && (
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Start Time (sec)</label>
                            <input type="number" className="input-field" value={ad.startTime || 0} onChange={e => onChange({...ad, startTime: parseInt(e.target.value)})} />
                         </div>
                     )}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Skip After (sec)</label>
                        <input type="number" className="input-field" value={ad.skipAfter || 5} onChange={e => onChange({...ad, skipAfter: parseInt(e.target.value)})} />
                     </div>
                     <FileUpload label="Video URL" value={ad.videoUrl || ''} onChange={v => onChange({...ad, videoUrl: v})} type="video" accept="video/*" />
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Destination Link</label>
                        <input className="input-field" placeholder="https://..." value={ad.linkUrl || ''} onChange={e => onChange({...ad, linkUrl: e.target.value})} />
                     </div>
                 </div>
                 <div className="p-6 border-t border-white/10 bg-zinc-900 rounded-b-xl flex justify-end gap-3">
                     <button onClick={onCancel} className="px-6 py-2 rounded border border-white/10 hover:bg-white/10 text-white">Cancel</button>
                     <button onClick={onSave} className="px-6 py-2 rounded bg-utv-600 text-white font-bold hover:bg-utv-500 transition-colors">Save Ad</button>
                 </div>
            </div>
             <style>{`
             .input-field {
                width: 100%;
                background-color: #000;
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 0.25rem;
                padding: 0.75rem;
                color: white;
                outline: none;
                transition: border-color 0.2s;
                font-size: 14px; 
             }
             .input-field:focus {
                border-color: #ff3217;
             }
          `}</style>
        </div>
    );
};

interface PlanEditModalProps {
    plan: Partial<Plan>;
    onSave: () => void;
    onCancel: () => void;
    onChange: (plan: Partial<Plan>) => void;
}

const PlanEditModal: React.FC<PlanEditModalProps> = ({ plan, onSave, onCancel, onChange }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-zinc-950 w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                 <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900 rounded-t-xl">
                    <h3 className="text-xl font-bold text-white">{plan.id ? 'Edit Plan' : 'New Plan'}</h3>
                    <button onClick={onCancel}><CloseIcon className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                 </div>
                 <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plan Name</label>
                             <input className="w-full bg-black border border-white/20 rounded p-3 text-white outline-none focus:border-utv-500" value={plan.name || ''} onChange={e => onChange({...plan, name: e.target.value})} />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (NGN)</label>
                             <input type="number" className="w-full bg-black border border-white/20 rounded p-3 text-white outline-none focus:border-utv-500" value={plan.price || 0} onChange={e => onChange({...plan, price: parseFloat(e.target.value)})} />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Features (Comma separated)</label>
                         <textarea className="w-full bg-black border border-white/20 rounded p-3 text-white outline-none focus:border-utv-500 min-h-[100px]" value={plan.features?.join(', ') || ''} onChange={e => onChange({...plan, features: e.target.value.split(',').map(s => s.trim())})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="flex items-center gap-3 bg-white/5 p-4 rounded border border-white/5">
                             <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-utv-500 focus:ring-0 bg-transparent" checked={plan.adsEnabled || false} onChange={e => onChange({...plan, adsEnabled: e.target.checked})} />
                             <span className="text-sm font-bold text-white">Ads Enabled</span>
                         </div>
                         <div className="flex items-center gap-3 bg-white/5 p-4 rounded border border-white/5">
                             <input type="checkbox" className="w-5 h-5 rounded border-white/20 text-utv-500 focus:ring-0 bg-transparent" checked={plan.isPopular || false} onChange={e => onChange({...plan, isPopular: e.target.checked})} />
                             <span className="text-sm font-bold text-white">Mark as Popular</span>
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Max Devices</label>
                         <input type="number" className="w-full bg-black border border-white/20 rounded p-3 text-white outline-none focus:border-utv-500" value={plan.maxDevices || 1} onChange={e => onChange({...plan, maxDevices: parseInt(e.target.value)})} />
                     </div>
                 </div>
                 <div className="p-6 border-t border-white/10 bg-zinc-900 rounded-b-xl flex justify-end gap-3">
                     <button onClick={onCancel} className="px-6 py-2 rounded border border-white/10 hover:bg-white/10 text-white">Cancel</button>
                     <button onClick={onSave} className="px-6 py-2 rounded bg-utv-600 text-white font-bold hover:bg-utv-500 transition-colors">Save Plan</button>
                 </div>
            </div>
        </div>
    );
};

interface EditModalProps {
  item: Partial<MediaItem>;
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: Partial<MediaItem>) => void;
  genres: Genre[];
}

const EditModal: React.FC<EditModalProps> = ({ item, onSave, onCancel, onChange, genres }) => {
   const [activeFormTab, setActiveFormTab] = useState<'general' | 'media' | 'restrictions' | 'analytics'>('general');
   
   const addSeason = () => {
     const newSeason: Season = {
       id: Date.now().toString(),
       seasonNumber: (item.seasons?.length || 0) + 1,
       title: `Season ${(item.seasons?.length || 0) + 1}`,
       episodes: []
     };
     onChange({ ...item, seasons: [...(item.seasons || []), newSeason] });
   };

   const addEpisode = (seasonIndex: number) => {
      if (!item.seasons) return;
      const season = item.seasons[seasonIndex];
      const newEp: Episode = {
        id: Date.now().toString(),
        episodeNumber: season.episodes.length + 1,
        title: `Episode ${season.episodes.length + 1}`,
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        duration: '0m'
      };
      const updatedSeasons = [...item.seasons];
      updatedSeasons[seasonIndex].episodes.push(newEp);
      onChange({ ...item, seasons: updatedSeasons });
   };

   const updateEpisode = (seasonIndex: number, epIndex: number, field: keyof Episode, val: any) => {
      if (!item.seasons) return;
      const updatedSeasons = [...item.seasons];
      updatedSeasons[seasonIndex].episodes[epIndex] = {
          ...updatedSeasons[seasonIndex].episodes[epIndex],
          [field]: val
      };
      onChange({ ...item, seasons: updatedSeasons });
   };

   const addSubtitle = () => {
       const newTrack: SubtitleTrack = { id: `sub-${Date.now()}`, label: 'English', language: 'en', src: '' };
       onChange({ ...item, subtitles: [...(item.subtitles || []), newTrack] });
   };

   const updateSubtitle = (idx: number, field: keyof SubtitleTrack, val: string) => {
       if (!item.subtitles) return;
       const updated = [...item.subtitles];
       updated[idx] = { ...updated[idx], [field]: val };
       onChange({ ...item, subtitles: updated });
   };

   const removeSubtitle = (idx: number) => {
       if (!item.subtitles) return;
       onChange({ ...item, subtitles: item.subtitles.filter((_, i) => i !== idx) });
   };

   // Helper to safely update analytics
   const updateAnalytics = (field: keyof NonNullable<MediaItem['analytics']>, value: number) => {
       const currentAnalytics = item.analytics || { 
           views: 0, uniqueViewers: 0, listAdds: 0, likes: 0, 
           completionRate: 0, totalWatchTime: 0 
       };
       onChange({ 
           ...item, 
           analytics: { ...currentAnalytics, [field]: value } 
       });
   };

   return (
    <div className="fixed inset-0 z-[100] bg-black/90 md:bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center md:p-4 animate-fade-in">
       <div className="bg-zinc-950 w-full md:max-w-4xl md:rounded-xl border-t md:border border-white/10 shadow-2xl flex flex-col h-full md:h-[90vh]">
          <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900 rounded-t-xl">
              <div>
                 <h3 className="text-lg md:text-xl font-bold text-white">{item.id ? 'Edit Content' : 'Add New Content'}</h3>
              </div>
              <button onClick={onCancel} className="text-gray-400 hover:text-white p-2"><CloseIcon className="w-6 h-6" /></button>
          </div>

          <div className="flex border-b border-white/10 bg-zinc-900 shrink-0 overflow-x-auto">
              <button onClick={() => setActiveFormTab('general')} className={`flex-1 py-3 md:py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeFormTab === 'general' ? 'border-utv-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>General Info</button>
              <button onClick={() => setActiveFormTab('media')} className={`flex-1 py-3 md:py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeFormTab === 'media' ? 'border-utv-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Media & Structure</button>
              <button onClick={() => setActiveFormTab('restrictions')} className={`flex-1 py-3 md:py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeFormTab === 'restrictions' ? 'border-utv-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Availability & Settings</button>
              <button onClick={() => setActiveFormTab('analytics')} className={`flex-1 py-3 md:py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeFormTab === 'analytics' ? 'border-utv-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Analytics (Sim)</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-zinc-950 pb-20 md:pb-8">
             {activeFormTab === 'general' ? (
                <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                       <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                          <input className="input-field" placeholder="Title..." value={item.title || ''} onChange={e => onChange({...item, title: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                          <select className="input-field" value={item.type || 'movie'} onChange={e => onChange({...item, type: e.target.value as any})}>
                             <option value="movie">Movie</option>
                             <option value="series">Series</option>
                          </select>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                       <textarea className="input-field min-h-[100px]" placeholder="Synopsis..." value={item.description || ''} onChange={e => onChange({...item, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Genre</label>
                          <select className="input-field" value={item.genre || ''} onChange={e => onChange({...item, genre: e.target.value})}>
                             <option value="">Select Genre</option>
                             {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Studio</label>
                          <input className="input-field" placeholder="Studio..." value={item.studio || ''} onChange={e => onChange({...item, studio: e.target.value})} />
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tags (Comma separated)</label>
                       <input className="input-field" placeholder="Action, Adventure, 4K..." value={item.tags?.join(', ') || ''} onChange={e => onChange({...item, tags: e.target.value.split(',').map(t => t.trim())})} />
                    </div>
                </div>
             ) : activeFormTab === 'media' ? (
                 <div className="space-y-8">
                    <section>
                        <h4 className="font-bold text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                            <FilmIcon className="w-5 h-5 text-utv-500" /> Visual Assets
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                           <FileUpload label="Poster (Portrait)" value={item.posterUrl || ''} onChange={v => onChange({...item, posterUrl: v})} />
                           <FileUpload label="Backdrop (Hero)" value={item.backdropUrl || ''} onChange={v => onChange({...item, backdropUrl: v})} />
                           <FileUpload label="Thumbnail (Card)" value={item.thumbnailUrl || ''} onChange={v => onChange({...item, thumbnailUrl: v})} />
                        </div>
                    </section>

                    <section>
                        <h4 className="font-bold text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                            <PlayIcon className="w-5 h-5 text-utv-500" /> Media Files
                        </h4>
                        
                        <FileUpload label="Trailer URL" value={item.trailerUrl || ''} onChange={v => onChange({...item, trailerUrl: v})} type="video" accept="video/*" />

                        {item.type === 'movie' ? (
                           <>
                               <div className="mt-4">
                                    <FileUpload label="Main Movie URL" value={item.videoUrl || ''} onChange={v => onChange({...item, videoUrl: v})} type="video" accept="video/*" />
                               </div>
                               
                               <div className="mt-8 bg-zinc-900/50 border border-white/10 rounded-xl p-5">
                                   <div className="flex items-center justify-between mb-4">
                                      <label className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                          <SubtitleIcon className="w-4 h-4" /> Subtitles / Captions
                                      </label>
                                      <button onClick={addSubtitle} className="text-xs bg-white/10 text-white px-3 py-1 rounded hover:bg-utv-500 hover:text-white font-bold transition-colors">+ Add Track</button>
                                   </div>
                                   <div className="space-y-3">
                                       {item.subtitles?.map((sub, idx) => (
                                           <div key={idx} className="grid grid-cols-12 gap-2 bg-black/50 p-3 rounded-lg items-start border border-white/5">
                                               <div className="col-span-3">
                                                   <input className="input-mini w-full" placeholder="English" value={sub.label} onChange={e => updateSubtitle(idx, 'label', e.target.value)} />
                                               </div>
                                               <div className="col-span-2">
                                                   <input className="input-mini w-full" placeholder="en" value={sub.language} onChange={e => updateSubtitle(idx, 'language', e.target.value)} />
                                               </div>
                                               <div className="col-span-6">
                                                   <FileUpload 
                                                        label="" 
                                                        value={sub.src} 
                                                        onChange={v => updateSubtitle(idx, 'src', v)} 
                                                        type="subtitle" 
                                                        accept=".vtt,.srt"
                                                   />
                                               </div>
                                               <div className="col-span-1 flex justify-end pt-6">
                                                   <button onClick={() => removeSubtitle(idx)} className="text-red-400 hover:bg-red-500/20 p-1 rounded transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           </>
                        ) : (
                           <div className="space-y-6 mt-4">
                              <div className="flex items-center justify-between">
                                 <span className="text-sm font-bold text-utv-500 uppercase">Seasons & Episodes</span>
                                 <button onClick={addSeason} className="text-xs bg-white text-black px-3 py-1 rounded font-bold hover:bg-utv-500 hover:text-white">+ Add Season</button>
                              </div>
                              
                              {item.seasons?.map((season, sIdx) => (
                                 <div key={sIdx} className="border border-white/10 rounded-xl p-4 bg-zinc-900/50">
                                    <div className="flex justify-between mb-4 items-center">
                                       <input className="bg-transparent font-bold text-white outline-none w-full border-b border-transparent focus:border-utv-500 transition-colors" value={season.title} onChange={e => {
                                           const ups = [...item.seasons!];
                                           ups[sIdx].title = e.target.value;
                                           onChange({...item, seasons: ups});
                                       }} />
                                       <button onClick={() => addEpisode(sIdx)} className="text-xs text-utv-500 hover:underline whitespace-nowrap ml-4 font-bold">+ Add Episode</button>
                                    </div>
                                    
                                    <div className="space-y-3 pl-2 md:pl-4 border-l-2 border-white/10">
                                       {season.episodes.map((ep, eIdx) => (
                                          <div key={eIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-black/50 p-3 rounded-lg border border-white/5">
                                              <div className="md:col-span-3">
                                                  <input className="input-mini" placeholder="Ep Title" value={ep.title} onChange={e => updateEpisode(sIdx, eIdx, 'title', e.target.value)} />
                                              </div>
                                              <div className="md:col-span-4">
                                                  <input className="input-mini" placeholder="Video URL" value={ep.videoUrl} onChange={e => updateEpisode(sIdx, eIdx, 'videoUrl', e.target.value)} />
                                              </div>
                                              <div className="md:col-span-3">
                                                  <input className="input-mini" placeholder="Thumb URL" value={ep.thumbnailUrl} onChange={e => updateEpisode(sIdx, eIdx, 'thumbnailUrl', e.target.value)} />
                                              </div>
                                              <div className="md:col-span-2">
                                                  <input className="input-mini" placeholder="Duration" value={ep.duration} onChange={e => updateEpisode(sIdx, eIdx, 'duration', e.target.value)} />
                                              </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                    </section>
                 </div>
             ) : activeFormTab === 'restrictions' ? (
                <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-4 p-4 bg-zinc-900 rounded-lg border border-white/10">
                               <label className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                   <CalendarIcon className="w-4 h-4" /> Coming Soon Mode
                               </label>
                               <input 
                                  type="checkbox" 
                                  checked={item.isComingSoon || false}
                                  onChange={e => onChange({...item, isComingSoon: e.target.checked})}
                                  className="w-5 h-5 rounded border-white/20 text-utv-500 focus:ring-0 bg-transparent"
                               />
                            </div>
                            {item.isComingSoon && (
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Release Date</label>
                                   <input type="date" className="input-field" value={item.releaseDate || ''} onChange={e => onChange({...item, releaseDate: e.target.value})} />
                               </div>
                            )}
                        </div>
                     </div>
                </div>
             ) : (
                 <div className="space-y-6 animate-fade-in">
                    <h4 className="font-bold text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                        <BarChartIcon className="w-5 h-5 text-utv-500" /> Simulation Metrics
                    </h4>
                    <p className="text-sm text-gray-500 mb-6">Manually override analytics for testing or simulation purposes.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Total Views</label>
                            <input type="number" className="input-field" value={item.analytics?.views || 0} onChange={e => updateAnalytics('views', parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Likes</label>
                            <input type="number" className="input-field" value={item.analytics?.likes || 0} onChange={e => updateAnalytics('likes', parseInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">List Adds</label>
                            <input type="number" className="input-field" value={item.analytics?.listAdds || 0} onChange={e => updateAnalytics('listAdds', parseInt(e.target.value))} />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Completion Rate (%)</label>
                             <input type="number" max="100" className="input-field" value={item.analytics?.completionRate || 0} onChange={e => updateAnalytics('completionRate', parseInt(e.target.value))} />
                        </div>
                    </div>
                 </div>
             )}
          </div>
          
          <div className="p-4 md:p-6 border-t border-white/10 flex justify-end gap-3 bg-zinc-900 shrink-0 rounded-b-xl">
             <button onClick={onCancel} className="px-4 md:px-6 py-3 rounded text-gray-400 hover:text-white hover:bg-white/5 font-bold transition-colors text-sm md:text-base border border-white/10">Cancel</button>
             <button onClick={onSave} className="px-6 md:px-8 py-3 bg-utv-600 text-white rounded font-bold shadow-lg hover:bg-utv-500 transition-all text-sm md:text-base">Save</button>
          </div>
       </div>
       <style>{`
        .input-mini {
            width: 100%;
            background-color: transparent;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            color: white;
            font-size: 12px;
            padding: 2px;
            outline: none;
        }
        .input-mini:focus {
            border-color: #ff3217;
        }
       `}</style>
    </div>
   );
};

const ContentAnalyticsModal: React.FC<{ item: MediaItem; onClose: () => void }> = ({ item, onClose }) => {
    const analytics = item.analytics;
    if (!analytics) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-zinc-950 w-full max-w-5xl h-[90vh] rounded-xl border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 z-10">
                     <button onClick={onClose} className="bg-black/50 hover:bg-white/20 p-2 rounded-full text-white transition-colors"><CloseIcon className="w-6 h-6" /></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto custom-scrollbar">
                     <div className="flex items-center gap-6 mb-8">
                         <img src={item.posterUrl || item.thumbnailUrl} className="w-24 h-36 object-cover rounded shadow-lg border border-white/10" />
                         <div>
                             <div className="flex items-center gap-2 mb-2">
                                 <span className="bg-utv-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{item.type}</span>
                                 <span className="text-gray-400 text-xs">{item.genre}</span>
                             </div>
                             <h2 className="text-3xl font-bold text-white mb-1">{item.title}</h2>
                             <div className="flex gap-6 text-sm text-gray-400 mt-2">
                                 <span className="flex items-center gap-2"><EyeIcon className="w-4 h-4" /> {analytics.views.toLocaleString()} Views</span>
                                 <span className="flex items-center gap-2"><ActivityIcon className="w-4 h-4 text-utv-500" /> {analytics.completionRate}% Completion</span>
                                 <span className="flex items-center gap-2"><DollarIcon className="w-4 h-4 text-green-400" /> ₦{(analytics.revenueGenerated || 0).toLocaleString()} Est. Rev</span>
                             </div>
                         </div>
                     </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                         <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChartIcon className="w-5 h-5 text-utv-500" /> Audience Retention</h3>
                             <div className="h-64 flex items-end gap-1 px-2">
                                 {(analytics.retentionCurve || []).map((val, i) => (
                                     <div key={i} className="flex-1 bg-zinc-700 hover:bg-utv-500 transition-colors relative group" style={{ height: `${val}%` }}></div>
                                 ))}
                             </div>
                         </div>
                         <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-6 flex items-center gap-2"><MapIcon className="w-5 h-5 text-blue-400" /> Top Regions</h3>
                             <div className="space-y-4">
                                 {analytics.demographics?.topRegions.map((region, i) => (
                                     <div key={i} className="flex items-center gap-4">
                                         <span className="w-24 text-sm text-gray-300">{region.country}</span>
                                         <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                                             <div className="h-full bg-blue-500" style={{ width: `${region.percentage}%` }}></div>
                                         </div>
                                         <span className="text-sm font-bold text-white w-12 text-right">{region.percentage}%</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [library, setLibrary] = useState<MediaItem[]>(store.getLibrary());
  const [users, setUsers] = useState<User[]>(store.getAllUsers()); 
  const [plans, setPlans] = useState<Plan[]>(store.getPlans());
  const [ads, setAds] = useState<Ad[]>(store.getAds());
  const [genres, setGenres] = useState<Genre[]>(store.getGenres());
  const [settings, setSettings] = useState<AppSettings>(store.getSettings());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'movie' | 'series'>('All');
  const [settingsTab, setSettingsTab] = useState<'general' | 'branding' | 'geo' | 'integrations' | 'danger'>('general');

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isEditingAd, setIsEditingAd] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editItem, setEditItem] = useState<Partial<MediaItem>>({});
  const [analyzeItem, setAnalyzeItem] = useState<MediaItem | null>(null);
  const [editPlan, setEditPlan] = useState<Partial<Plan>>({});
  const [editAd, setEditAd] = useState<Partial<Ad>>({});
  const [newGenreName, setNewGenreName] = useState('');

  useEffect(() => {
    const refresh = () => {
      setLibrary(store.getLibrary());
      setUsers(store.getAllUsers());
      setPlans(store.getPlans());
      setAds(store.getAds());
      setGenres(store.getGenres());
      setSettings(store.getSettings());
    };
    const unsubL = store.subscribe('library', refresh);
    const unsubS = store.subscribe('settings', refresh);
    const unsubP = store.subscribe('plans', refresh);
    const unsubU = store.subscribe('users_list', refresh);
    const unsubA = store.subscribe('ads', refresh);
    const unsubG = store.subscribe('genres', refresh);
    return () => { unsubL(); unsubS(); unsubP(); unsubU(); unsubA(); unsubG(); };
  }, []);

  const calculateRevenue = () => {
      let subRevenue = 0;
      users.forEach(u => {
          const plan = plans.find(p => p.id === u.planId);
          if (plan) subRevenue += plan.price;
      });
      let adRevenue = 0;
      ads.filter(a => a.status === 'approved' && a.isBusinessAd).forEach(a => {
          adRevenue += (a.budget || 0);
      });
      return { subRevenue, adRevenue, total: subRevenue + adRevenue };
  };
  
  const revenue = calculateRevenue();

  const handleDeleteContent = (id: string) => { if (confirm('Delete item?')) store.saveLibrary(library.filter(i => i.id !== id)); };
  const handleSaveContent = () => {
    if (!editItem.title) return alert('Title required');
    let newLib = [...library];
    if (editItem.id) {
      newLib = newLib.map(item => item.id === editItem.id ? { ...item, ...editItem } as MediaItem : item);
    } else {
      const newItem = {
        ...editItem,
        id: Date.now().toString(),
        type: editItem.type || 'movie',
        thumbnailUrl: editItem.thumbnailUrl || 'https://picsum.photos/seed/new/800/450',
        rating: 'G',
        year: new Date().getFullYear(),
        ads: [],
        cast: editItem.cast || [],
        crew: editItem.crew || [],
        tags: editItem.tags || [],
        allowedCountries: editItem.allowedCountries || [],
        analytics: { views: 0, likes: 0, listAdds: 0, completionRate: 0 }
      } as MediaItem;
      newLib.push(newItem);
    }
    store.saveLibrary(newLib);
    setIsEditing(false);
    setEditItem({});
  };
  const handleAddGenre = () => { if (!newGenreName) return; store.saveGenres([...genres, { id: `g${Date.now()}`, name: newGenreName }]); setNewGenreName(''); };
  const handleDeleteGenre = (id: string) => { store.saveGenres(genres.filter(g => g.id !== id)); };
  const handleAdAction = (id: string, status: 'approved' | 'declined') => { store.saveAds(ads.map(a => a.id === id ? { ...a, status } : a)); };
  const handleDeleteAd = (id: string) => { if(confirm("Delete ad?")) store.saveAds(ads.filter(a => a.id !== id)); };
  const handleSaveAd = () => {
      if (!editAd.videoUrl) return alert('Video URL required');
      let newAds = [...ads];
      if (editAd.id) { newAds = newAds.map(a => a.id === editAd.id ? { ...a, ...editAd } as Ad : a); } 
      else { const newAd = { ...editAd, id: `sys-ad-${Date.now()}`, isBusinessAd: false, status: 'approved', impressions: 0, type: editAd.type || 'preroll', duration: editAd.duration || 15 } as Ad; newAds.push(newAd); }
      store.saveAds(newAds);
      setIsEditingAd(false);
      setEditAd({});
  };
  const handleSaveSettings = () => { store.saveSettings(settings); alert('Settings Saved'); };
  const handleDeleteUser = (id: string) => { if(confirm("Delete user?")) store.saveAllUsers(users.filter(u => u.id !== id)); };
  const toggleUserAdmin = (id: string) => { store.saveAllUsers(users.map(u => u.id === id ? { ...u, isAdmin: !u.isAdmin } : u)); };
  const handleSavePlan = () => {
      if(!editPlan.name) return alert('Name required');
      let updatedPlans = [...plans];
      if(editPlan.id) { updatedPlans = updatedPlans.map(p => p.id === editPlan.id ? {...p, ...editPlan} as Plan : p); } 
      else { const newPlan = { ...editPlan, id: `plan-${Date.now()}` } as Plan; updatedPlans.push(newPlan); }
      store.savePlans(updatedPlans);
      setIsEditingPlan(false);
      setEditPlan({});
  };
  const handleDeletePlan = (id: string) => { if(confirm("Delete plan?")) store.savePlans(plans.filter(p => p.id !== id)); };

  const renderSidebar = () => (
    <>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full bg-zinc-950 border-r border-white/10 pt-24 z-50 transition-transform duration-300 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
         <div className="px-8 mb-10 flex items-center justify-between">
           <h2 className="text-xs font-bold text-utv-500 uppercase tracking-[0.2em]">Console</h2>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white"><CloseIcon className="w-6 h-6" /></button>
         </div>
         <nav className="space-y-1 px-4">
           {[ { id: 'dashboard', label: 'Overview', icon: DashboardIcon }, { id: 'content', label: 'Library', icon: FilmIcon }, { id: 'genres', label: 'Genres', icon: ListIcon }, { id: 'ads', label: 'Ads', icon: BriefcaseIcon }, { id: 'users', label: 'Users', icon: UserIcon }, { id: 'plans', label: 'Plans', icon: CreditCardIcon }, { id: 'settings', label: 'Settings', icon: SettingsIcon }, ].map(item => (
             <button key={item.id} onClick={() => { setActiveTab(item.id as Tab); setIsSidebarOpen(false); setSearchTerm(''); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded text-sm font-medium transition-all ${activeTab === item.id ? 'bg-utv-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
             </button>
           ))}
         </nav>
      </div>
    </>
  );

  const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 shadow-md hover:border-white/10 transition-all">
       <div className="flex justify-between items-start">
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
             <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
             <div className="flex items-center gap-2 mt-2 text-xs font-bold">
                <span className={`${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                    <TrendingUpIcon className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} /> {change}
                </span>
             </div>
          </div>
          <div className={`p-3 rounded bg-zinc-800 text-${color}-500`}>
             <Icon className="w-5 h-5" />
          </div>
       </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-end mb-8">
           <div><h1 className="text-3xl font-bold text-white mb-1">Overview</h1></div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={`₦${revenue.total.toLocaleString()}`} change="+12.5%" icon={DollarIcon} color="green" trend="up" />
          <StatCard title="Ad Spend" value={`₦${revenue.adRevenue.toLocaleString()}`} change="+32%" icon={BriefcaseIcon} color="yellow" trend="up" />
          <StatCard title="Total Users" value={users.length} change="+8.2%" icon={UserIcon} color="blue" trend="up" />
          <StatCard title="Library Size" value={library.length} change="+2" icon={FilmIcon} color="purple" trend="up" />
       </div>
       <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
              <button onClick={() => { setEditItem({}); setIsEditing(true); }} className="flex items-center gap-2 bg-utv-600 text-white px-5 py-3 rounded font-bold transition-all hover:bg-utv-500">
                  <PlusIcon className="w-4 h-4" /> Add Movie
              </button>
              <button onClick={() => { setEditPlan({}); setIsEditingPlan(true); }} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-3 rounded font-bold transition-all border border-white/10">
                  <PlusIcon className="w-4 h-4" /> New Plan
              </button>
          </div>
       </div>
    </div>
  );

  const renderContentManager = () => {
      const filteredLibrary = library.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || item.type === filterType;
        return matchesSearch && matchesType;
    });
      return (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <h2 className="text-3xl font-bold text-white">Library</h2>
                <button onClick={() => { setEditItem({}); setIsEditing(true); }} className="bg-utv-600 text-white px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-utv-500 transition-colors">
                    <PlusIcon className="w-5 h-5" /> Add New
                </button>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full bg-black border border-white/10 rounded px-4 py-2 pl-10 text-white outline-none focus:border-utv-500" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
                <div className="flex gap-2">
                    {['All', 'movie', 'series'].map(type => (
                        <button key={type} onClick={() => setFilterType(type as any)} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${filterType === type ? 'bg-white text-black' : 'bg-black text-gray-400 border border-white/10'}`}>{type}</button>
                    ))}
                </div>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-lg overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[800px]">
                    <thead className="bg-black/50 text-gray-400 uppercase font-bold text-xs tracking-wider border-b border-white/5">
                        <tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Stats</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredLibrary.map(item => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="w-12 h-16 bg-zinc-800 rounded overflow-hidden"><img src={item.posterUrl || item.thumbnailUrl} className="w-full h-full object-cover" /></div>
                                <div><div className="font-bold text-white">{item.title}</div><div className="text-xs text-gray-500">{item.year} • {item.type}</div></div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-300">
                                <div><span className="font-bold">{item.analytics?.views.toLocaleString() || 0}</span> Views</div>
                            </td>
                            <td className="px-6 py-4">
                                {item.trending && <span className="text-[10px] bg-utv-600/20 text-utv-500 px-2 py-1 rounded uppercase font-bold border border-utv-500/20">Trending</span>}
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => { setAnalyzeItem(item); setIsAnalyzing(true); }} className="p-2 bg-zinc-800 hover:bg-white hover:text-black rounded text-gray-400"><BarChartIcon className="w-4 h-4" /></button>
                                <button onClick={() => { setEditItem(item); setIsEditing(true); }} className="p-2 bg-zinc-800 hover:bg-white hover:text-black rounded text-gray-400"><EditIcon className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteContent(item.id)} className="p-2 bg-zinc-800 hover:bg-red-500 hover:text-white rounded text-gray-400"><TrashIcon className="w-4 h-4" /></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
      );
  };

  const renderAdsManager = () => (
      <div className="animate-fade-in space-y-6">
         <div className="flex justify-between items-end">
             <h2 className="text-3xl font-bold text-white">Ads</h2>
             <button onClick={() => { setEditAd({}); setIsEditingAd(true); }} className="bg-white text-black px-5 py-2 rounded font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Create Ad</button>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {ads.map(ad => (
                <div key={ad.id} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex gap-4">
                    <div className="w-32 aspect-video bg-black rounded overflow-hidden relative"><video src={ad.videoUrl} className="w-full h-full object-cover opacity-60" /></div>
                    <div className="flex-1">
                        <div className="flex justify-between"><h3 className="font-bold text-white">{ad.advertiserName || 'System Ad'}</h3><span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${ad.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>{ad.status}</span></div>
                        <div className="text-xs text-gray-400 mt-1">{ad.type} • {ad.duration}s</div>
                        <div className="flex gap-2 mt-2 justify-end">
                             <button onClick={() => { setEditAd(ad); setIsEditingAd(true); }} className="text-gray-400 hover:text-white"><EditIcon className="w-4 h-4" /></button>
                             <button onClick={() => handleDeleteAd(ad.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
             ))}
         </div>
      </div>
  );

  const renderGenreEditor = () => (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Genres</h2>
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 mb-8 flex gap-4">
         <input value={newGenreName} onChange={e => setNewGenreName(e.target.value)} placeholder="New Genre Name" className="flex-1 bg-black border border-white/10 rounded px-4 py-2 text-white outline-none focus:border-utv-500" />
         <button onClick={handleAddGenre} className="bg-utv-600 text-white font-bold px-6 rounded hover:bg-utv-500 transition-colors">Add</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {genres.map(genre => (
            <div key={genre.id} className="flex items-center justify-between bg-zinc-900 border border-white/5 p-3 rounded group hover:border-white/20">
               <span className="font-bold text-white text-sm">{genre.name}</span>
               <button onClick={() => handleDeleteGenre(genre.id)} className="text-gray-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
            </div>
         ))}
      </div>
    </div>
  );

  const renderUsersManager = () => (
    <div className="animate-fade-in space-y-6">
       <h2 className="text-3xl font-bold text-white">Users</h2>
       <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
             <thead className="bg-black/50 text-gray-400 uppercase font-bold text-xs border-b border-white/5">
                <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {users.map(u => (
                   <tr key={u.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-bold">{u.email}</td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-bold uppercase ${u.isAdmin ? 'bg-utv-600/20 text-utv-500' : 'bg-gray-800 text-gray-400'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                         <button onClick={() => toggleUserAdmin(u.id)} className="text-xs border border-white/10 px-2 py-1 rounded hover:bg-white hover:text-black">Toggle Admin</button>
                         <button onClick={() => handleDeleteUser(u.id)} className="text-gray-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderPlansManager = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-end"><h2 className="text-3xl font-bold text-white">Plans</h2><button onClick={() => { setEditPlan({}); setIsEditingPlan(true); }} className="bg-utv-600 text-white px-5 py-2 rounded font-bold text-sm hover:bg-utv-500">Create Plan</button></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
             <div key={plan.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 relative group hover:border-utv-500 transition-colors">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="text-2xl font-bold text-white mb-4">₦{plan.price.toLocaleString()}</div>
                <ul className="space-y-2 mb-6 text-sm text-gray-400">{plan.features.slice(0,3).map((f, i) => <li key={i}>• {f}</li>)}</ul>
                <div className="flex gap-2">
                    <button onClick={() => { setEditPlan(plan); setIsEditingPlan(true); }} className="flex-1 py-2 bg-white/10 hover:bg-white hover:text-black rounded text-sm font-bold">Edit</button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="p-2 hover:text-red-500 text-gray-400"><TrashIcon className="w-4 h-4" /></button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
       <h2 className="text-3xl font-bold text-white">Settings</h2>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="space-y-2">
               {[{id:'general',label:'General'},{id:'branding',label:'Branding'},{id:'geo',label:'Geo-Blocking'},{id:'integrations',label:'Integrations'}].map(tab => (
                   <button key={tab.id} onClick={() => setSettingsTab(tab.id as any)} className={`w-full text-left px-4 py-2 rounded text-sm font-bold ${settingsTab === tab.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>{tab.label}</button>
               ))}
           </div>
           <div className="md:col-span-3 bg-zinc-900 border border-white/10 rounded-xl p-6">
                {settingsTab === 'general' && (
                    <div className="space-y-4">
                        <div><label className="label">App Name</label><input value={settings.appName} onChange={e => setSettings({...settings, appName: e.target.value})} className="input-field" /></div>
                        <div className="flex items-center gap-4"><input type="checkbox" checked={settings.enableAdsGlobal} onChange={e => setSettings({...settings, enableAdsGlobal: e.target.checked})} /><span className="text-sm font-bold">Enable Ads Global</span></div>
                    </div>
                )}
                {settingsTab === 'branding' && (
                     <div className="space-y-4">
                        <div><label className="label">Logo Text</label><input value={settings.appLogoText} onChange={e => setSettings({...settings, appLogoText: e.target.value})} className="input-field" /></div>
                        <div><label className="label">Highlight</label><input value={settings.appLogoHighlight} onChange={e => setSettings({...settings, appLogoHighlight: e.target.value})} className="input-field" /></div>
                        <FileUpload label="App Icon URL" value={settings.appIconUrl || ''} onChange={v => setSettings({...settings, appIconUrl: v})} />
                     </div>
                )}
                {settingsTab === 'geo' && (
                    <div className="space-y-4">
                        <label className="label">Simulated Location</label>
                        <div className="flex gap-2">
                            {['NG', 'US', 'GB'].map(c => <button key={c} onClick={() => setSettings({...settings, simulatedCountry: c})} className={`px-4 py-2 border rounded ${settings.simulatedCountry === c ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-400'}`}>{c}</button>)}
                        </div>
                    </div>
                )}
                <div className="mt-8 pt-4 border-t border-white/10 text-right">
                    <button onClick={handleSaveSettings} className="bg-utv-600 text-white font-bold px-6 py-2 rounded hover:bg-utv-500">Save Changes</button>
                </div>
           </div>
       </div>
       <style>{`.label { display: block; font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 8px; }`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-utv-500 selection:text-white">
      <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-20 left-6 z-30 p-2 bg-zinc-800 rounded border border-white/10"><MenuIcon className="w-6 h-6 text-white" /></button>
      {renderSidebar()}
      <div className="md:pl-64 pt-24 p-4 md:p-8 relative z-10 pb-40 md:pb-8">
         <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'content' && renderContentManager()}
            {activeTab === 'genres' && renderGenreEditor()}
            {activeTab === 'ads' && renderAdsManager()}
            {activeTab === 'users' && renderUsersManager()}
            {activeTab === 'plans' && renderPlansManager()}
            {activeTab === 'settings' && renderSettings()}
         </div>
      </div>
      {isEditing && <EditModal item={editItem} onChange={setEditItem} onSave={handleSaveContent} onCancel={() => setIsEditing(false)} genres={genres} />}
      {isAnalyzing && analyzeItem && <ContentAnalyticsModal item={analyzeItem} onClose={() => setIsAnalyzing(false)} />}
      {isEditingPlan && <PlanEditModal plan={editPlan} onChange={setEditPlan} onSave={handleSavePlan} onCancel={() => setIsEditingPlan(false)} />}
      {isEditingAd && <AdEditModal ad={editAd} onChange={setEditAd} onSave={handleSaveAd} onCancel={() => setIsEditingAd(false)} />}
    </div>
  );
};

export default AdminDashboard;
