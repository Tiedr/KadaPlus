
import React, { useEffect, useState } from 'react';
import { store } from '../store';
import { User, Plan, MediaItem, UserProfile } from '../types';
import { UserIcon, ClockIcon, SparklesIcon, SettingsIcon, EditIcon } from '../components/Icons';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(store.getUser());
  const [profile, setProfile] = useState<UserProfile>(store.getCurrentProfile());
  const [plans, setPlans] = useState<Plan[]>(store.getPlans());
  const [library, setLibrary] = useState<MediaItem[]>(store.getLibrary());
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const unsubUser = store.subscribe('user', () => setUser(store.getUser()));
    const unsubProfile = store.subscribe('profile', () => setProfile(store.getCurrentProfile()));
    return () => { unsubUser(); unsubProfile(); };
  }, []);

  const currentPlan = plans.find(p => p.id === user.planId);
  const historyItems = profile.watchHistory.map(h => { const media = library.find(m => m.id === h.mediaId); return { ...h, media }; }).filter(h => h.media);

  const handleUpdateName = () => { store.updateProfile({ ...profile, name: newName }); setIsEditingName(false); };

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-32 px-4 md:px-6 font-sans">
      <div className="container mx-auto max-w-4xl pb-40">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 border-b border-zinc-800">
           <div className="relative group">
               <div className="w-32 h-32 rounded overflow-hidden border-2 border-transparent group-hover:border-white transition-colors">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
               </div>
               <div className="absolute bottom-2 right-2 bg-black text-white p-1 rounded-full cursor-pointer border border-gray-500 hover:border-white">
                   <EditIcon className="w-3 h-3" />
               </div>
           </div>
           <div className="text-center md:text-left flex-1">
              {isEditingName ? (
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                      <input className="bg-zinc-800 rounded px-3 py-2 text-xl font-bold text-white outline-none" value={newName} onChange={e => setNewName(e.target.value)} placeholder={profile.name} autoFocus />
                      <button onClick={handleUpdateName} className="bg-white text-black px-4 py-2 rounded font-bold text-sm">Save</button>
                      <button onClick={() => setIsEditingName(false)} className="text-gray-400 text-sm border border-gray-600 px-3 py-2 rounded">Cancel</button>
                  </div>
              ) : (
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                      {profile.name} <button onClick={() => { setNewName(profile.name); setIsEditingName(true); }} className="text-gray-600 hover:text-white"><EditIcon className="w-5 h-5" /></button>
                  </h1>
              )}
              <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <button onClick={() => navigate('/profiles')} className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest border border-gray-600 hover:border-white px-4 py-2">Switch Profile</button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-6">
              <div className="bg-zinc-900/50 p-6 rounded border border-white/5">
                 <h3 className="text-gray-400 font-bold uppercase text-xs mb-4">Membership</h3>
                 <div className="text-white font-bold mb-1">{user.email}</div>
                 <div className="text-gray-500 text-sm mb-4">Password: ********</div>
                 <div className="text-white font-bold mb-1">{currentPlan?.name} Plan</div>
                 <div className="text-gray-500 text-sm mb-6">Next billing date: Oct 15</div>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">Manage Account</button>
              </div>
              <button onClick={() => navigate('/')} className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-gray-400 text-sm font-bold border border-white/10">Sign Out of All Devices</button>
           </div>

           <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                 <h2 className="text-lg font-bold text-white">Viewing Activity</h2>
                 <button className="text-xs text-blue-500 hover:underline" onClick={() => store.updateProfile({ ...profile, watchHistory: [] })}>Clear</button>
              </div>
              <div className="space-y-1">
                 {historyItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">You haven't watched anything yet.</div>
                 ) : (
                    historyItems.map((item, idx) => (
                       <div key={`${item.mediaId}-${idx}`} className="flex items-center justify-between p-3 hover:bg-zinc-900 transition-colors group rounded">
                          <div className="flex items-center gap-4">
                              <Link to={`/watch/${item.mediaId}`} className="text-sm font-bold text-gray-300 group-hover:text-white hover:underline">{item.media?.title}</Link>
                          </div>
                          <span className="text-xs text-gray-600">{new Date(item.lastWatchedAt).toLocaleDateString()}</span>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
