
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, SearchIcon, DashboardIcon, UserIcon, CalendarIcon, BellIcon, CheckIcon, CloseIcon, TvIcon } from './Icons';
import { store } from '../store';
import { AppSettings, User, UserProfile, Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(store.getSettings());
  const [user, setUser] = useState<User>(store.getUser());
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(store.getCurrentProfile());
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const isLanding = location.pathname === '/';
  const isPlayer = location.pathname.startsWith('/watch');
  const isAdmin = location.pathname.startsWith('/admin');
  const isProfileSelect = location.pathname === '/profiles';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const updateData = () => {
        setSettings(store.getSettings());
        const u = store.getUser();
        setUser(u);
        setCurrentProfile(store.getCurrentProfile());
        setNotifications(u.notifications || []);
    };

    updateData();

    const unsubSettings = store.subscribe('settings', updateData);
    const unsubUser = store.subscribe('user', updateData);
    const unsubProfile = store.subscribe('profile', updateData);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubSettings();
      unsubUser();
      unsubProfile();
    };
  }, []);

  useEffect(() => {
      if (!isLanding && !isProfileSelect && !isAuthPage && !store.getActiveProfileId() && user.id) {
          navigate('/profiles');
      }
  }, [location.pathname, user.id]);

  const handleProfileSwitch = (profileId: string) => {
      store.setActiveProfileId(profileId);
      setShowProfileMenu(false);
      navigate('/app');
  };

  const handleMarkRead = (id: string) => {
      store.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
      store.markAllNotificationsRead();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path: string) => location.pathname === path ? 'text-kada-pink font-bold' : 'text-gray-300 hover:text-white';

  if (isProfileSelect || isAuthPage) {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-kada-dark text-white font-sans selection:bg-kada-pink selection:text-white relative overflow-x-hidden">
      
      {/* Ambient Background Gradient Mesh */}
      {!isPlayer && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-kada-pink rounded-full blur-[150px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-kada-yellow rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>
      )}

      {!isPlayer && !isAdmin && (
        <div className={`fixed top-4 left-0 right-0 z-[100] flex justify-center transition-all duration-500 ${scrolled ? 'translate-y-0' : 'translate-y-1'}`}>
          <nav className="glass-panel px-4 md:px-6 py-2 rounded-full flex items-center justify-between md:justify-start gap-4 md:gap-8 shadow-2xl transition-all duration-300 max-w-6xl w-[95%] sm:w-auto">
            <Link to={isLanding ? '/' : '/app'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-kada-pink to-kada-yellow rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-white font-black text-base md:text-lg">U</span>
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter text-white group-hover:text-kada-pink transition-colors">
                {settings.appLogoText}<span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-pink to-kada-yellow">{settings.appLogoHighlight}</span>
              </span>
            </Link>

            {!isLanding && (
              <div className="hidden md:flex items-center space-x-6 border-l border-white/10 pl-6 h-6">
                <Link to="/app" className={`text-sm font-bold transition-colors ${isActive('/app')}`}>Home</Link>
                <Link to="/browse" className={`text-sm font-bold transition-colors ${isActive('/browse')}`}>Explore</Link>
                <Link to="/live" className={`text-sm font-bold transition-colors flex items-center gap-1 ${isActive('/live')}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Live TV
                </Link>
                <Link to="/coming-soon" className={`text-sm font-bold transition-colors ${isActive('/coming-soon')}`}>New</Link>
                {user.isAdmin && (
                   <Link to="/admin" className={`text-sm font-bold transition-colors ${location.pathname.startsWith('/admin') ? 'text-kada-yellow font-bold' : 'text-gray-300 hover:text-white'}`}>Admin</Link>
                )}
              </div>
            )}

            <div className="flex-1"></div>

            <div className="flex items-center gap-3 md:gap-5">
              {isLanding ? (
                 <div className="flex items-center gap-3">
                     <Link to="/login" className="text-sm font-semibold hover:text-kada-pink transition-colors">Log In</Link>
                     <Link to="/signup" className="px-5 py-2 bg-gradient-to-r from-kada-pink to-kada-yellow text-black font-bold text-sm rounded-full hover:shadow-lg hover:shadow-kada-pink/30 transition-all">
                        Join
                     </Link>
                 </div>
              ) : (
                <div className="flex items-center gap-3 md:gap-5">
                    <Link to="/browse" className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </Link>
                    
                    {/* NOTIFICATIONS */}
                    <div className="relative">
                        <button 
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                            className="relative text-white hover:text-kada-yellow transition-colors"
                        >
                            <BellIcon className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-kada-pink rounded-full border-2 border-black"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute top-full right-[-60px] md:right-0 mt-6 w-80 glass-panel rounded-2xl overflow-hidden z-50 animate-fade-in origin-top-right">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                                    <span className="font-bold text-sm text-white">Notifications</span>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllRead} className="text-xs text-kada-pink hover:underline">Mark all read</button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-400 text-sm">All caught up!</div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => handleMarkRead(notif.id)}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-white/5' : ''}`}
                                            >
                                                {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-kada-pink"></div>}
                                                <h4 className={`text-sm font-bold mb-1 ${!notif.isRead ? 'text-white' : 'text-gray-400'}`}>{notif.title}</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PROFILE */}
                    <div className="relative group">
                        <button 
                            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-9 h-9 rounded-full bg-zinc-800 p-[2px] bg-gradient-to-tr from-kada-pink to-kada-yellow">
                                <img src={currentProfile.avatarUrl || 'https://picsum.photos/200'} alt={currentProfile.name} className="w-full h-full rounded-full object-cover border-2 border-black" />
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute top-full right-0 mt-6 w-56 glass-panel rounded-2xl overflow-hidden z-50 animate-fade-in origin-top-right">
                                <div className="p-3 border-b border-white/10">
                                    {user.profiles.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => handleProfileSwitch(p.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${p.id === currentProfile.id ? 'bg-white/10' : ''}`}
                                        >
                                            <img src={p.avatarUrl} className="w-8 h-8 rounded-full object-cover" />
                                            <span className={`text-sm ${p.id === currentProfile.id ? 'font-bold text-white' : 'text-gray-400'}`}>{p.name}</span>
                                        </button>
                                    ))}
                                    <Link to="/profiles" className="w-full text-left text-xs text-kada-yellow hover:underline px-3 py-2 mt-2 block">Manage Profiles</Link>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setShowProfileMenu(false)}>Account</Link>
                                    <button onClick={() => { store.logout(); navigate('/'); }} className="w-full text-left block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {!isLanding && !isPlayer && !isAdmin && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
           <div className="glass-panel rounded-2xl flex justify-around items-center p-3 shadow-2xl">
              <Link to="/app" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${location.pathname === '/app' ? 'text-kada-pink bg-white/10' : 'text-gray-400'}`}>
                <HomeIcon className="w-6 h-6" />
              </Link>
              <Link to="/live" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${location.pathname === '/live' ? 'text-kada-pink bg-white/10' : 'text-gray-400'}`}>
                <TvIcon className="w-6 h-6" />
              </Link>
              <Link to="/coming-soon" className={`flex flex-col items-center p-2 rounded-lg transition-colors ${location.pathname === '/coming-soon' ? 'text-kada-pink bg-white/10' : 'text-gray-400'}`}>
                <CalendarIcon className="w-6 h-6" />
              </Link>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pb-40 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      {!isPlayer && !isAdmin && !isAuthPage && (
        <footer className="border-t border-white/5 bg-black py-16 relative z-10 mb-40 md:mb-0">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-500">
              <ul className="space-y-4">
                  <li><Link to="/app" className="hover:text-kada-pink transition-colors">Home</Link></li>
                  <li><Link to="/browse" className="hover:text-kada-pink transition-colors">Browse</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-kada-pink transition-colors">Coming Soon</Link></li>
              </ul>
              <ul className="space-y-4">
                  <li><Link to="/profile" className="hover:text-kada-pink transition-colors">Account</Link></li>
                  <li><a href="#" className="hover:text-kada-pink transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-kada-pink transition-colors">Terms of Use</a></li>
              </ul>
              <ul className="space-y-4">
                  <li><a href="#" className="hover:text-kada-pink transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-kada-pink transition-colors">Cookie Preferences</a></li>
                  <li><a href="#" className="hover:text-kada-pink transition-colors">Corporate Info</a></li>
                  <li><Link to="/business" className="hover:text-kada-pink transition-colors">Advertising</Link></li>
                  <li><Link to="/admin" className="hover:text-kada-pink transition-colors">Admin Panel</Link></li>
              </ul>
              <div className="space-y-4">
                  <h4 className="text-white font-bold">Connect</h4>
                  <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-kada-pink transition-colors cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-kada-yellow transition-colors cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white transition-colors cursor-pointer"></div>
                  </div>
                  <p className="text-xs pt-4">© 2024 Kada+ Nigeria</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
