import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, ArrowUpRight, Activity, ShieldCheck, Clock, Settings, Bell, Search, Menu, MailWarning, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      await resendVerification();
      toast.success('Verification email sent! Please check your inbox.');
      setCountdown(60); // 60 seconds cooldown
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a few minutes before trying again.');
        setCountdown(60);
      } else {
        toast.error(err.message || 'Failed to resend verification email.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans selection:bg-luxury-900 selection:text-white dark:selection:bg-luxury-100 dark:selection:text-black">
      <nav className="bg-white/80 dark:bg-luxury-950/80 luxury-blur border-b border-luxury-100 dark:border-luxury-900 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 bg-luxury-950 dark:bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-[10deg]">
                  <Shield className="w-5 h-5 text-white dark:text-luxury-950 stroke-[1.5px]" />
                </div>
                <span className="font-serif text-2xl tracking-tight text-luxury-950 dark:text-white">AuthPage</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-luxury-400">
                {['Overview', 'Security', 'Vault', 'Settings'].map((item) => (
                  <a key={item} href="#" className="hover:text-luxury-950 dark:hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-luxury-50 dark:bg-luxury-900 rounded-full border border-luxury-100 dark:border-luxury-800">
                <Search className="w-4 h-4 text-luxury-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs font-bold text-luxury-950 dark:text-white placeholder:text-luxury-400 w-32" />
              </div>
              
              <div className="flex items-center gap-4">
                <button className="relative text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-luxury-950"></span>
                </button>
                <div className="w-px h-6 bg-luxury-100 dark:bg-luxury-900"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-luxury-950 dark:text-white leading-none mb-1">{user?.name || 'Explorer'}</p>
                    <p className="text-[10px] text-luxury-400 font-bold uppercase tracking-wider leading-none">Pro Plan</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-luxury-100 dark:bg-luxury-900 flex items-center justify-center border border-luxury-200 dark:border-luxury-800 cursor-pointer overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-luxury-400" />
                    )}
                  </div>
                </div>
                <button className="lg:hidden text-luxury-950 dark:text-white">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {!user?.emailVerified && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 lg:px-12 py-4">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
              <MailWarning className="w-5 h-5" />
              <p className="text-sm font-medium">
                Please verify your email address to unlock full account capabilities.
              </p>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={isResending || countdown > 0}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] justify-center"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Verification Link'
              )}
            </button>
          </div>
        </div>
      )}

      <main className="max-w-screen-2xl mx-auto py-12 px-6 lg:px-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-up">
          <div>
            <h1 className="text-5xl lg:text-7xl mb-4 leading-none">
              Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}.
            </h1>
            <p className="text-luxury-500 dark:text-luxury-400 text-lg max-w-xl font-medium">
              You are currently protected by our most advanced security protocols. All systems are performing optimally.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 text-sm font-bold rounded-lg flex items-center gap-2 group transition-transform active:scale-95">
              <span>Security Report</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 border border-luxury-200 dark:border-luxury-800 text-sm font-bold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-slide-up stagger-1">
          {[
            { label: 'Security Score', value: '98', icon: ShieldCheck, sub: 'Optimized', color: 'text-emerald-500' },
            { label: 'Active Sessions', value: '03', icon: Activity, sub: 'Verified devices', color: 'text-blue-500' },
            { label: 'Last Login', value: 'Now', icon: Clock, sub: 'London, UK', color: 'text-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-luxury-950 rounded-2xl border border-luxury-100 dark:border-luxury-900 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-400 mb-1">{stat.label}</p>
                  <p className="text-4xl font-serif text-luxury-950 dark:text-white leading-none">{stat.value}</p>
                </div>
                <div className="p-3 bg-luxury-50 dark:bg-luxury-900 rounded-xl group-hover:scale-110 transition-transform">
                  <stat.icon className={`w-6 h-6 ${stat.color} stroke-[1.5px]`} />
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`}></div>
                <span className="text-xs font-bold text-luxury-500">{stat.sub}</span>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <stat.icon className="w-24 h-24 rotate-[-15deg]" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up stagger-2">
          <div className="bg-white dark:bg-luxury-950 p-10 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl">Recent Activity</h3>
              <button className="text-xs font-bold uppercase tracking-widest text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors">View All</button>
            </div>
            <div className="space-y-8">
              {[
                { event: 'New Login', desc: 'Chrome on macOS', time: '2 mins ago', icon: ShieldCheck },
                { event: 'Password Changed', desc: 'System update', time: '1 hour ago', icon: Settings },
                { event: 'Session Expired', desc: 'Safari on iPhone', time: 'Yesterday', icon: Clock }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-luxury-50 dark:bg-luxury-900 flex items-center justify-center group-hover:bg-luxury-950 dark:group-hover:bg-white transition-colors">
                      <item.icon className="w-5 h-5 text-luxury-400 group-hover:text-white dark:group-hover:text-luxury-950" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-luxury-950 dark:text-white mb-0.5">{item.event}</p>
                      <p className="text-xs text-luxury-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-luxury-400 group-hover:text-luxury-950 dark:group-hover:text-white transition-colors">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-luxury-950 dark:bg-white p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-800 dark:bg-luxury-50 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 pointer-events-none"></div>
            <div className="relative z-10">
              <Shield className="w-12 h-12 text-white dark:text-luxury-950 mb-8 stroke-[1px]" />
              <h3 className="text-3xl text-white dark:text-luxury-950 mb-4 max-w-xs">Upgrade your workspace security.</h3>
              <p className="text-luxury-400 dark:text-luxury-500 text-sm max-w-xs leading-relaxed">
                Unlock advanced biometric verification, hardware keys support, and 24/7 priority support with our Enterprise plan.
              </p>
            </div>
            <div className="relative z-10 pt-12">
              <button className="px-8 py-4 bg-white dark:bg-luxury-950 text-luxury-950 dark:text-white text-sm font-bold rounded-xl hover:scale-105 transition-transform active:scale-95">
                Go Enterprise
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
