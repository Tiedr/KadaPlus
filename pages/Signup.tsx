
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { store } from '../store';
import { Plan, User } from '../types';
import { CheckIcon } from '../components/Icons';

type Step = 1 | 2 | 3;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = store.getSettings();
  const plans = store.getPlans();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  
  useEffect(() => {
      const stateEmail = location.state?.email;
      if (stateEmail) setEmail(stateEmail);
  }, [location]);

  const handleStep1 = (e: React.FormEvent) => {
      e.preventDefault();
      if (email && password.length >= 6) setStep(2);
  };

  const handleStep2 = () => {
      if (selectedPlanId) setStep(3);
  };

  const completeSignup = () => {
      const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          password,
          planId: selectedPlanId,
          isAdmin: false,
          profiles: [ { id: `p-${Date.now()}`, name: 'My Profile', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, watchHistory: [], myList: [] } ]
      };
      store.registerUser(newUser);
      navigate('/app');
  };

  const formatPrice = (price: number) => {
      return price === 0 ? 'Free' : `₦${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <div className="p-8 flex justify-between items-center relative z-10">
        <Link to="/" className="text-3xl font-black tracking-tight text-white">
           {settings.appLogoText}<span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-pink to-kada-yellow">{settings.appLogoHighlight}</span>
        </Link>
        <Link to="/login" className="text-white font-bold hover:text-kada-pink transition-colors">Sign In</Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 pt-10 pb-20 relative z-10">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-kada-pink/5 rounded-full blur-[80px]"></div>
         </div>

         <div className="w-full max-w-md relative z-10">
            
            {/* Progress Bar */}
            <div className="flex gap-2 mb-10">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-kada-pink' : 'bg-zinc-800'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-kada-pink' : 'bg-zinc-800'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-kada-pink' : 'bg-zinc-800'}`}></div>
            </div>

            {step === 1 && (
                <div className="animate-fade-in">
                    <span className="text-xs uppercase font-bold text-kada-yellow tracking-widest">Step 1 of 3</span>
                    <h1 className="text-3xl font-bold mb-4 mt-2">Create your account</h1>
                    <p className="text-gray-400 mb-8">Sign up to unlock the full Kada+ experience.</p>
                    <form onSubmit={handleStep1} className="space-y-4">
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-kada-pink focus:bg-zinc-800 transition-colors" placeholder="Email" />
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-kada-pink focus:bg-zinc-800 transition-colors" placeholder="Create a password" minLength={6} />
                        <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors text-lg mt-4">Next</button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="animate-fade-in">
                    <span className="text-xs uppercase font-bold text-kada-yellow tracking-widest">Step 2 of 3</span>
                    <h1 className="text-3xl font-bold mb-4 mt-2">Choose your plan</h1>
                    <ul className="mb-8 space-y-4">
                        <li className="flex gap-3 text-gray-300"><CheckIcon className="w-6 h-6 text-kada-pink" /> Watch all you want. Ad-free.</li>
                        <li className="flex gap-3 text-gray-300"><CheckIcon className="w-6 h-6 text-kada-pink" /> 4K HDR Support.</li>
                        <li className="flex gap-3 text-gray-300"><CheckIcon className="w-6 h-6 text-kada-pink" /> Change or cancel anytime.</li>
                    </ul>
                    <div className="grid gap-4 mb-8">
                        {plans.map(plan => (
                            <div key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`relative cursor-pointer border rounded-xl p-5 flex justify-between items-center transition-all ${selectedPlanId === plan.id ? 'border-kada-pink bg-kada-pink/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}>
                                <div><h3 className="font-bold text-lg text-white">{plan.name}</h3><span className="text-gray-500 text-sm">{plan.features[0]}</span></div>
                                <div className="text-right font-bold text-lg text-white">{formatPrice(plan.price)}<span className="text-xs font-normal text-gray-500 block">/mo</span></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleStep2} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors text-lg">Next</button>
                </div>
            )}

            {step === 3 && (
                <div className="animate-fade-in">
                    <span className="text-xs uppercase font-bold text-kada-yellow tracking-widest">Step 3 of 3</span>
                    <h1 className="text-3xl font-bold mb-4 mt-2">Confirm Subscription</h1>
                    <p className="text-gray-400 mb-8">Your membership starts immediately. Cancel online anytime.</p>
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl mb-8 border border-white/5">
                        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                            <span className="font-bold text-lg">{plans.find(p => p.id === selectedPlanId)?.name}</span>
                            <span className="text-xl font-bold text-kada-pink">{formatPrice(plans.find(p => p.id === selectedPlanId)?.price || 0)}<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div> Active immediately
                        </div>
                    </div>
                    <button onClick={completeSignup} className="w-full bg-gradient-to-r from-kada-pink to-kada-yellow text-black font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-kada-pink/20 transition-all text-lg">Start Membership</button>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default Signup;
