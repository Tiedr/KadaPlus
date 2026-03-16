
import React, { useState, useEffect } from 'react';
import { store } from '../store';
import { Ad, AdType } from '../types';
import { BriefcaseIcon, CheckIcon, DollarIcon, PlayIcon, EyeIcon, MousePointerIcon, ActivityIcon, UploadIcon, ListIcon, RefreshIcon, PlusIcon, BarChartIcon, TvIcon, FilmIcon, SparklesIcon } from '../components/Icons';

const BusinessAds: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'campaigns' | 'create'>('landing');
  const [ads, setAds] = useState<Ad[]>([]);
  const [form, setForm] = useState({ 
    advertiserName: '', 
    videoUrl: '', 
    linkUrl: '', 
    budget: 50000, 
    duration: 15,
    platform: 'kada+' as 'kada+' | 'cinema',
    type: 'preroll' as AdType,
    isSkippable: true
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { 
    const refresh = () => setAds(store.getAds().filter(a => a.isBusinessAd)); 
    refresh(); 
    const unsub = store.subscribe('ads', refresh); 
    return unsub; 
  }, []);

  const handlePlatformChange = (platform: 'kada+' | 'cinema') => {
    if (platform === 'cinema') {
      setForm({ ...form, platform, type: 'preroll', isSkippable: false });
    } else {
      setForm({ ...form, platform });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: Ad = { 
      id: `biz-${Date.now()}`, 
      type: form.type, 
      isBusinessAd: true, 
      status: 'pending', 
      impressions: 0, 
      clicks: 0, 
      spent: 0, 
      skipAfter: form.isSkippable ? 5 : undefined, 
      startTime: 0, 
      startDate: Date.now(), 
      platform: form.platform,
      isSkippable: form.isSkippable,
      ...form 
    };
    store.addBusinessAd(newAd);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView('campaigns'); }, 2000);
  };

  const handleRestartCampaign = (ad: Ad) => { 
    setForm({ 
      advertiserName: ad.advertiserName || '', 
      videoUrl: ad.videoUrl || '', 
      linkUrl: ad.linkUrl || '', 
      budget: ad.budget || 50000, 
      duration: ad.duration || 15,
      platform: ad.platform || 'kada+',
      type: ad.type || 'preroll',
      isSkippable: ad.isSkippable ?? true
    }); 
    setView('create'); 
  };

  const Stat = ({ icon: Icon, value, label, color = 'kada-pink' }: any) => (
      <div className="flex items-center gap-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-colors">
          <div className={`p-4 bg-zinc-800 rounded-xl text-${color} text-white`}><Icon className="w-7 h-7" /></div>
          <div><div className="text-3xl font-black text-white tracking-tight">{value}</div><div className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">{label}</div></div>
      </div>
  );

  const CampaignsList = () => (
      <div className="container mx-auto max-w-6xl py-12 px-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">My Campaigns</h1>
                  <p className="text-gray-400 mt-1">Manage and track your active advertisements.</p>
              </div>
              <button onClick={() => { setForm({ advertiserName: '', videoUrl: '', linkUrl: '', budget: 50000, duration: 15, platform: 'kada+', type: 'preroll', isSkippable: true }); setView('create'); }} className="bg-gradient-to-r from-kada-pink to-kada-yellow text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"><PlusIcon className="w-5 h-5" /> New Campaign</button>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-black/40 text-gray-400 uppercase font-bold text-xs border-b border-white/10">
                          <tr>
                              <th className="px-6 py-5">Campaign</th>
                              <th className="px-6 py-5">Platform & Type</th>
                              <th className="px-6 py-5">Status</th>
                              <th className="px-6 py-5">Metrics</th>
                              <th className="px-6 py-5">Budget</th>
                              <th className="px-6 py-5 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {ads.map(ad => (
                              <tr key={ad.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-6 py-5"><div className="font-bold text-white text-base">{ad.advertiserName}</div><div className="text-xs text-gray-500 mt-1">{new Date(ad.startDate || Date.now()).toLocaleDateString()}</div></td>
                                  <td className="px-6 py-5">
                                      <div className="flex items-center gap-2">
                                          {ad.platform === 'cinema' ? <FilmIcon className="w-4 h-4 text-kada-yellow" /> : <TvIcon className="w-4 h-4 text-kada-pink" />}
                                          <span className="text-white font-medium capitalize">{ad.platform === 'cinema' ? 'Kada Cinema' : 'Kada+'}</span>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1 capitalize">{ad.type} {ad.isSkippable ? '(Skippable)' : '(Non-Skip)'}</div>
                                  </td>
                                  <td className="px-6 py-5">
                                      {ad.status === 'approved' && <span className="text-[10px] bg-green-500/20 border border-green-500/30 text-green-400 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Active</span>}
                                      {ad.status === 'pending' && <span className="text-[10px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Review</span>}
                                      {ad.status === 'completed' && <span className="text-[10px] bg-gray-500/20 border border-gray-500/30 text-gray-400 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Completed</span>}
                                  </td>
                                  <td className="px-6 py-5"><div className="text-white font-bold">{ad.impressions?.toLocaleString()} Impr.</div><div className="text-xs text-gray-500 mt-1">{ad.clicks?.toLocaleString()} Clicks</div></td>
                                  <td className="px-6 py-5">
                                      <div className="text-white font-medium">₦{ad.spent?.toLocaleString()} <span className="text-gray-500 text-xs font-normal">/ ₦{ad.budget?.toLocaleString()}</span></div>
                                      <div className="w-32 bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-gradient-to-r from-kada-pink to-kada-yellow h-full" style={{ width: `${Math.min(100, ((ad.spent || 0) / (ad.budget || 1)) * 100)}%` }}></div></div>
                                  </td>
                                  <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2">{(ad.status === 'completed' || ad.status === 'declined') && <button onClick={() => handleRestartCampaign(ad)} className="p-2 bg-zinc-800 hover:bg-white hover:text-black rounded-lg text-gray-300 transition-colors" title="Restart Campaign"><RefreshIcon className="w-4 h-4" /></button>}</div></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              {ads.length === 0 && (
                  <div className="p-16 text-center flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-500"><BriefcaseIcon className="w-10 h-10" /></div>
                      <h3 className="text-xl font-bold text-white mb-2">No campaigns yet</h3>
                      <p className="text-gray-400 mb-6">Create your first campaign to start reaching audiences.</p>
                      <button onClick={() => { setForm({ advertiserName: '', videoUrl: '', linkUrl: '', budget: 50000, duration: 15, platform: 'kada+', type: 'preroll', isSkippable: true }); setView('create'); }} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">Create Campaign</button>
                  </div>
              )}
          </div>
      </div>
  );

  const AdvertiserDashboard = () => {
      const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
      const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
      const totalSpent = ads.reduce((sum, a) => sum + (a.spent || 0), 0);
      return (
          <div className="container mx-auto max-w-6xl py-12 px-6 animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                  <div>
                      <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
                      <p className="text-gray-400 mt-1">Your advertising performance at a glance.</p>
                  </div>
                  <button onClick={() => setView('campaigns')} className="px-6 py-2 border border-white/20 rounded-full font-bold text-sm text-white hover:bg-white/10 transition-colors">All Campaigns</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <Stat icon={EyeIcon} value={totalImpressions.toLocaleString()} label="Total Impressions" color="kada-pink" />
                  <Stat icon={MousePointerIcon} value={totalClicks.toLocaleString()} label="Total Clicks" color="blue-400" />
                  <Stat icon={DollarIcon} value={`₦${totalSpent.toLocaleString()}`} label="Amount Spent" color="green-400" />
              </div>
          </div>
      );
  };

  if (submitted) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6"><div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6"><CheckIcon className="w-12 h-12 text-green-500" /></div><h1 className="text-4xl font-black text-white mb-2 tracking-tight">Campaign Submitted!</h1><p className="text-gray-400 text-lg">Your campaign is under review and will go live shortly.</p></div>;

  if (view === 'create') {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20 px-6 font-sans">
           <div className="container mx-auto max-w-3xl">
               <div className="flex items-center gap-4 mb-8">
                   <button onClick={() => setView('campaigns')} className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">← Cancel</button>
                   <h1 className="text-3xl font-black text-white tracking-tight">Create Campaign</h1>
               </div>
               <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Platform Selection */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Target Platform</label>
                          <div className="grid grid-cols-2 gap-4">
                              <button type="button" onClick={() => handlePlatformChange('kada+')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${form.platform === 'kada+' ? 'border-kada-pink bg-kada-pink/10 text-white' : 'border-white/10 bg-black/50 text-gray-400 hover:border-white/30'}`}>
                                  <TvIcon className="w-8 h-8" />
                                  <span className="font-bold">Kada+ Streaming</span>
                              </button>
                              <button type="button" onClick={() => handlePlatformChange('cinema')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${form.platform === 'cinema' ? 'border-kada-yellow bg-kada-yellow/10 text-white' : 'border-white/10 bg-black/50 text-gray-400 hover:border-white/30'}`}>
                                  <FilmIcon className="w-8 h-8" />
                                  <span className="font-bold">Kada Cinema</span>
                              </button>
                          </div>
                      </div>

                      {/* Ad Type & Skippable */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black/30 rounded-2xl border border-white/5">
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ad Type</label>
                              <select 
                                  value={form.type} 
                                  onChange={e => setForm({...form, type: e.target.value as AdType})} 
                                  disabled={form.platform === 'cinema'}
                                  className="w-full bg-zinc-800 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-kada-pink disabled:opacity-50 appearance-none"
                              >
                                  <option value="preroll">{form.platform === 'cinema' ? 'Pre Video Ad' : 'Pre Roll'}</option>
                                  {form.platform === 'kada+' && (
                                      <>
                                          <option value="midroll">Mid Roll</option>
                                          <option value="postroll">Post Roll</option>
                                          <option value="banner">Banner</option>
                                      </>
                                  )}
                              </select>
                              {form.platform === 'cinema' && <p className="text-[10px] text-kada-yellow mt-2">Cinema ads are exclusively pre-video.</p>}
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skip Option</label>
                              <div className="flex bg-zinc-800 rounded-xl p-1 border border-white/10">
                                  <button type="button" disabled={form.platform === 'cinema'} onClick={() => setForm({...form, isSkippable: true})} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 ${form.isSkippable ? 'bg-zinc-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Skippable</button>
                                  <button type="button" onClick={() => setForm({...form, isSkippable: false})} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors ${!form.isSkippable ? 'bg-zinc-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Non-Skip</button>
                              </div>
                              {form.platform === 'cinema' && <p className="text-[10px] text-kada-yellow mt-2">Cinema ads are non-skippable.</p>}
                          </div>
                      </div>

                      {/* Basic Info */}
                      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Business / Advertiser Name</label><input required value={form.advertiserName} onChange={e => setForm({...form, advertiserName: e.target.value})} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white outline-none focus:border-kada-pink transition-colors" placeholder="e.g. Kada Marketing" /></div>
                      
                      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Video Asset URL</label><div className="flex gap-2 relative"><input required value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="flex-1 bg-black border border-white/20 rounded-xl p-4 pl-12 text-white outline-none focus:border-kada-pink transition-colors" placeholder="https://..." /><UploadIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /></div></div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Budget (NGN)</label><input type="number" required min="5000" value={form.budget} onChange={e => setForm({...form, budget: parseInt(e.target.value)})} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white outline-none focus:border-kada-pink transition-colors" /></div>
                          <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration</label><select value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white outline-none focus:border-kada-pink transition-colors appearance-none"><option value={15}>15 Seconds</option><option value={30}>30 Seconds</option><option value={60}>60 Seconds</option></select></div>
                      </div>
                      
                      <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Destination URL (Click-through)</label><input value={form.linkUrl} onChange={e => setForm({...form, linkUrl: e.target.value})} className="w-full bg-black border border-white/20 rounded-xl p-4 text-white outline-none focus:border-kada-pink transition-colors" placeholder="https://..." /></div>
                      
                      <div className="pt-4">
                          <button type="submit" className="w-full bg-gradient-to-r from-kada-pink to-kada-yellow text-white font-bold text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg">Launch Campaign</button>
                      </div>
                  </form>
               </div>
           </div>
        </div>
    );
  }

  if (view !== 'landing') {
      return (
          <div className="min-h-screen bg-black pt-20">
             <div className="bg-zinc-900/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex gap-8 justify-center sticky top-20 z-40">
                 <button onClick={() => setView('dashboard')} className={`pb-1 border-b-2 transition-colors ${view === 'dashboard' ? "border-kada-pink text-white font-bold" : "border-transparent text-gray-400 font-bold hover:text-white"}`}>Overview</button>
                 <button onClick={() => setView('campaigns')} className={`pb-1 border-b-2 transition-colors ${view === 'campaigns' ? "border-kada-pink text-white font-bold" : "border-transparent text-gray-400 font-bold hover:text-white"}`}>Campaigns</button>
                 <button onClick={() => setView('create')} className={`pb-1 border-b-2 transition-colors ${view === 'create' ? "border-kada-pink text-white font-bold" : "border-transparent text-gray-400 font-bold hover:text-white"}`}>Create New</button>
             </div>
             {view === 'dashboard' ? <AdvertiserDashboard /> : <CampaignsList />}
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-24 pb-24 md:pb-20 px-4 md:px-6 font-sans relative overflow-hidden flex items-center">
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kada-pink/10 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-kada-yellow/10 rounded-full blur-[150px] pointer-events-none"></div>
       
       <div className="container mx-auto max-w-5xl relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-kada-pink/30 bg-kada-pink/10 text-kada-pink mb-8">
               <SparklesIcon className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-widest">Premium Advertising</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 mb-6 leading-tight">
               Kada+ Business
           </h1>
           <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
               Reach a highly engaged audience across our streaming platform and physical cinemas with premium, unmissable ad placements.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
               <button onClick={() => setView('dashboard')} className="px-10 py-4 bg-gradient-to-r from-kada-pink to-kada-yellow text-white font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(242,125,38,0.3)]">
                   Enter Dashboard
               </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
                   <div className="w-14 h-14 bg-kada-pink/20 text-kada-pink rounded-2xl flex items-center justify-center mb-6">
                       <TvIcon className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Kada+ Streaming</h3>
                   <p className="text-gray-400 leading-relaxed">Pre-roll, mid-roll, post-roll, and banner ads integrated seamlessly into the premium viewing experience.</p>
               </div>
               <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
                   <div className="w-14 h-14 bg-kada-yellow/20 text-kada-yellow rounded-2xl flex items-center justify-center mb-6">
                       <FilmIcon className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Kada Cinema</h3>
                   <p className="text-gray-400 leading-relaxed">Captivate audiences on the big screen with premium pre-video cinematic ads that demand attention.</p>
               </div>
               <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
                   <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                       <BarChartIcon className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Real-time Analytics</h3>
                   <p className="text-gray-400 leading-relaxed">Track impressions, clicks, and engagement across all your active campaigns instantly from your dashboard.</p>
               </div>
           </div>
       </div>
    </div>
  );
};

export default BusinessAds;
