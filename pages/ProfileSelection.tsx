
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../store';
import { User, UserProfile } from '../types';
import { PlusIcon } from '../components/Icons';

const ProfileSelection: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(store.getUser());
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => { store.setActiveProfileId(''); }, []);

  const handleSelect = (profileId: string) => { store.setActiveProfileId(profileId); navigate('/app'); };
  const handleCreate = () => { if (!newProfileName.trim()) return; const newProfile: UserProfile = { id: `p${Date.now()}`, name: newProfileName, avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, watchHistory: [], myList: [] }; const updatedUser = { ...user, profiles: [...user.profiles, newProfile] }; store.saveUser(updatedUser); setUser(updatedUser); setIsCreating(false); setNewProfileName(''); };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center animate-fade-in font-sans">
       <div className="mb-12 text-center"><h1 className="text-3xl md:text-5xl font-normal text-white mb-4">Who's watching?</h1></div>
       <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl px-6">
           {user.profiles.map(profile => (
               <div key={profile.id} className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => handleSelect(profile.id)}>
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
                       <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                   </div>
                   <span className="text-gray-400 text-lg group-hover:text-white transition-colors">{profile.name}</span>
               </div>
           ))}
           {user.profiles.length < 5 && !isCreating && (
               <div className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => setIsCreating(true)}>
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-transparent border-2 border-gray-600 group-hover:bg-white group-hover:border-white flex items-center justify-center transition-all">
                       <PlusIcon className="w-12 h-12 text-gray-600 group-hover:text-black" />
                   </div>
                   <span className="text-gray-400 text-lg group-hover:text-white">Add Profile</span>
               </div>
           )}
       </div>
        {isCreating && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                <div className="bg-black border border-gray-600 p-8 max-w-sm w-full mx-4">
                    <h3 className="text-2xl font-bold text-white mb-6">Add Profile</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded"></div>
                        <input autoFocus value={newProfileName} onChange={e => setNewProfileName(e.target.value)} placeholder="Name" className="flex-1 bg-zinc-800 border border-transparent rounded px-4 py-2 text-white outline-none focus:border-white" />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleCreate} className="px-6 py-2 bg-white text-black font-bold hover:bg-utv-600 hover:text-white transition-colors">Continue</button>
                        <button onClick={() => setIsCreating(false)} className="px-6 py-2 border border-gray-500 text-gray-500 font-bold hover:border-white hover:text-white transition-colors">Cancel</button>
                    </div>
                </div>
            </div>
        )}
       <button className="mt-16 border border-gray-500 text-gray-400 px-6 py-2 hover:border-white hover:text-white transition-colors tracking-widest uppercase text-sm font-bold">Manage Profiles</button>
    </div>
  );
};

export default ProfileSelection;
