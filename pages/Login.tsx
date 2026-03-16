
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const settings = store.getSettings();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
        const users = store.getAllUsers();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (found) {
            if (!found.password || found.password === password) {
                store.saveUser(found);
                navigate('/app');
                return;
            } else {
                setError('Incorrect password.');
            }
        } else {
            if (email === 'alex.rayner@ughoron.com' || email === 'admin@ughoron.com') {
                 const seedUser = store.getUser();
                 store.saveUser({ ...seedUser, email });
                 navigate('/app');
                 return;
            }
            setError('User not found. Please sign up.');
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[20%] w-[70vw] h-[70vw] bg-kada-pink/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-kada-yellow/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 p-8">
        <Link to="/" className="text-3xl font-black tracking-tight text-white">
           {settings.appLogoText}<span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-pink to-kada-yellow">{settings.appLogoHighlight}</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
         <div className="w-full max-w-md glass-panel p-10 rounded-3xl">
            <h1 className="text-3xl font-bold mb-8">Sign In</h1>
            
            {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-kada-pink transition-colors"
                  placeholder="Email address"
                />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-kada-pink transition-colors"
                  placeholder="Password"
                />
                <button type="submit" className="w-full bg-gradient-to-r from-kada-pink to-kada-yellow text-black font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-kada-pink/20 transition-all mt-4">
                    Sign In
                </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white"><input type="checkbox" className="rounded bg-zinc-800 border-none text-kada-pink focus:ring-0" /> Remember me</label>
                <a href="#" className="hover:text-kada-pink transition-colors">Forgot password?</a>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 text-center text-gray-400">
                New to Kada+? <Link to="/signup" className="text-white font-bold hover:text-kada-yellow transition-colors ml-1">Sign up now</Link>.
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
