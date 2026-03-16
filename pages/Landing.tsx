
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayIcon, CheckIcon, PlusIcon, ChevronRightIcon } from '../components/Icons';
import { store } from '../store';
import { MediaItem } from '../types';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [freePreview, setFreePreview] = useState<MediaItem[]>([]);

  useEffect(() => {
     const lib = store.getLibrary();
     // Shuffle or just pick top items to display as free preview
     setFreePreview(lib.slice(0, 4));
  }, []);

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate('/signup', { state: { email } });
    } else {
      navigate('/signup');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "Is Kada+ really free?", a: "Yes! We offer a completely free, ad-supported tier that gives you access to a huge library of movies and TV shows. No credit card required." },
    { q: "What do I get with Premium?", a: "Premium removes ads, unlocks 4K Ultra HD quality, allows offline downloads, and gives you access to exclusive originals." },
    { q: "Where can I watch?", a: "Watch anywhere on your phone, tablet, laptop, or TV. The Kada+ app is available on all major platforms." },
    { q: "How do I sign up for free?", a: "Simply click 'Get Started', enter your email, and select the 'Free' plan during setup. It's that easy." },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-kada-pink selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-kada-pink/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-kada-yellow/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center pt-24 md:pt-32 pb-16 md:pb-32">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
            <div className="inline-block animate-fade-in-up">
                <span className="px-4 py-2 rounded-full border border-kada-yellow/50 bg-kada-yellow/10 text-kada-yellow font-bold text-sm tracking-widest uppercase mb-4 inline-block backdrop-blur-md">
                    No Credit Card Required
                </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none animate-fade-in-up">
              Stream Free. <span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-pink to-kada-yellow">Watch Forever.</span>
            </h1>
            <p className="text-xl md:text-3xl font-light text-gray-300 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Thousands of movies and TV shows at zero cost. Upgrade anytime for ad-free 4K.
            </p>
            
            <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto pt-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="relative flex-1 w-full">
                    <input 
                        type="email" 
                        placeholder="Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-kada-pink focus:bg-white/20 backdrop-blur-md transition-all text-lg"
                    />
                </div>
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-kada-pink to-kada-yellow text-black text-xl font-bold rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-kada-pink/30 w-full md:w-auto whitespace-nowrap">
                    Start Watching Free
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                Already have an account? <Link to="/login" className="text-white underline hover:text-kada-pink">Sign In</Link>
            </p>
        </div>
      </div>

      {/* Free Showcase Section */}
      <div className="py-24 bg-zinc-900/30 border-y border-white/5 relative z-10 backdrop-blur-sm">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <span className="text-kada-pink font-bold uppercase tracking-widest text-sm mb-3 block">Instant Access</span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Free to Watch Now</h2>
                  <p className="text-gray-400 max-w-xl mx-auto">Dive into these popular titles immediately after signing up. No payment needed.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {freePreview.map((item, i) => (
                      <div key={item.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-kada-pink/50 transition-all duration-300" onClick={() => navigate('/signup')}>
                         <img src={item.posterUrl || item.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                         
                         {/* Free Badge */}
                         <div className="absolute top-4 right-4 bg-kada-yellow text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                             FREE
                         </div>

                         <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                             <h3 className="font-bold text-white text-xl leading-tight mb-1">{item.title}</h3>
                             <div className="flex items-center gap-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                 <PlayIcon className="w-4 h-4 text-kada-pink" /> <span className="font-bold">Watch for Free</span>
                             </div>
                         </div>
                      </div>
                  ))}
              </div>
              
              <div className="text-center mt-16">
                  <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all font-bold group">
                      Explore Full Library <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
          </div>
      </div>

      {/* Free Tier Benefits Split Section */}
      <div className="py-32 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 order-2 md:order-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Always Free Option
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black leading-tight">Premium Content. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-kada-yellow to-orange-500">Zero Cost.</span></h2>
                      <p className="text-xl text-gray-400 leading-relaxed">
                          We believe great stories should be accessible to everyone. That's why Kada+ offers a robust free tier supported by unobtrusive ads.
                      </p>
                      
                      <ul className="space-y-6">
                          {[
                              "Access to 500+ Movies & TV Series",
                              "No Credit Card Required",
                              "Watch on Any Device",
                              "Curated Lists & Recommendations"
                          ].map((benefit, i) => (
                              <li key={i} className="flex items-center gap-4 text-lg text-gray-200 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <div className="w-8 h-8 rounded-full bg-kada-pink/20 flex items-center justify-center text-kada-pink shrink-0">
                                      <CheckIcon className="w-5 h-5" />
                                  </div>
                                  {benefit}
                              </li>
                          ))}
                      </ul>
                      
                      <button onClick={handleGetStarted} className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                          Create Free Account
                      </button>
                  </div>
                  
                  <div className="relative order-1 md:order-2">
                       {/* Visual Abstract representation of free tier */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-kada-pink to-kada-yellow rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
                       <div className="relative glass-panel p-10 rounded-[2rem] border border-white/20 rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                            <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                                <div>
                                    <div className="font-bold text-3xl mb-1">Free Plan</div>
                                    <div className="text-sm text-gray-400">Ad-Supported</div>
                                </div>
                                <div className="text-5xl font-black text-kada-yellow">₦0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                            </div>
                            <div className="space-y-6">
                                {[80, 60, 90, 40].map((w, i) => (
                                    <div key={i} className="h-6 bg-white/10 rounded-full" style={{width: `${w}%`}}></div>
                                ))}
                            </div>
                            <div className="mt-12 pt-6 flex justify-center">
                                <div className="px-6 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 text-sm font-bold flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4" /> Active Status
                                </div>
                            </div>
                       </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 relative z-10 bg-zinc-900/30">
          <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { title: "Enjoy on your TV", desc: "Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.", gradient: "from-blue-500 to-purple-500" },
                  { title: "Download & Go", desc: "Save your favorites easily and always have something to watch offline (Premium).", gradient: "from-kada-pink to-orange-500" },
                  { title: "Watch Everywhere", desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.", gradient: "from-green-400 to-cyan-500" }
              ].map((feature, i) => (
                  <div key={i} className="glass-panel p-10 rounded-3xl hover:border-white/30 transition-all group">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}></div>
                      <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
                      <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-3xl">
              <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                  {faqs.map((faq, index) => (
                      <div key={index} className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
                          <button 
                            className="w-full p-6 text-left flex justify-between items-center text-lg font-bold hover:bg-white/5 transition-colors"
                            onClick={() => toggleFaq(index)}
                          >
                              {faq.q}
                              <PlusIcon className={`w-6 h-6 transition-transform duration-300 ${openFaq === index ? 'rotate-45 text-kada-pink' : 'text-gray-400'}`} />
                          </button>
                          <div className={`transition-all duration-300 ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <div className="p-6 pt-0 text-gray-300 leading-relaxed border-t border-white/5 mt-2">
                                {faq.a}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-20 text-center glass-panel p-12 rounded-3xl border border-white/10 max-w-4xl mx-auto">
                 <h3 className="text-3xl font-bold mb-4">Ready to watch for free?</h3>
                 <p className="text-xl mb-8 text-gray-400">Enter your email to create your account and start streaming instantly.</p>
                 <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <input 
                            type="email" 
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-kada-pink text-lg"
                        />
                    </div>
                    <button type="submit" className="px-10 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors w-full md:w-auto">
                        Get Started
                    </button>
                 </form>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Landing;
