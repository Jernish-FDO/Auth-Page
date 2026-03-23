import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, User as UserIcon, Shield, Activity, Search, Bell, Menu,
  MailWarning, Loader2, Users, Eye, Star, Trash2, Edit2,
  MoreVertical, ShieldAlert, CheckCircle2, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- Mock Data for Admin Dashboard ---
const MOCK_USERS = [
  { id: '1', name: 'Alice Smith', email: 'alice@gmail.com', role: 'user', status: 'active', lastActive: 'Just now' },
  { id: '2', name: 'Bob Johnson', email: 'bob@gmail.com', role: 'admin', status: 'active', lastActive: '5 mins ago' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@gmail.com', role: 'user', status: 'suspended', lastActive: '2 days ago' },
  { id: '4', name: 'Diana Prince', email: 'diana@gmail.com', role: 'user', status: 'active', lastActive: '1 hour ago' },
];

const MOCK_ACTIVITIES = [
  { id: '101', user: 'Alice Smith', action: 'Logged into the system', time: 'Just now', type: 'info' },
  { id: '102', user: 'Diana Prince', action: 'Updated account settings', time: '12 mins ago', type: 'info' },
  { id: '103', user: 'Charlie Brown', action: 'Multiple failed login attempts', time: '1 hour ago', type: 'warning' },
  { id: '104', user: 'System', action: 'Automated backup completed', time: '3 hours ago', type: 'success' },
];

const MOCK_REVIEWS = [
  { id: '201', user: 'Alice Smith', rating: 5, comment: 'Absolutely love the new security features!', time: '1 day ago' },
  { id: '202', user: 'Bob Johnson', rating: 4, comment: 'Clean interface, very fast response times.', time: '3 days ago' },
];

export default function Dashboard() {
  const { user, logout, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Admin State
  const [activeTab, setActiveTab] = useState('Overview');
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle countdown for resend verification
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
      setCountdown(60);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a few minutes.');
        setCountdown(60);
      } else {
        toast.error(err.message || 'Failed to resend verification email.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsersList(usersList.filter(u => u.id !== id));
      toast.success("User successfully deleted.");
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsersList(usersList.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        toast.success(`User status changed to ${newStatus}.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span className="font-serif text-2xl tracking-tight text-luxury-950 dark:text-white">AdminPage</span>
              </div>

              <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-luxury-400">
                {['Overview', 'Users', 'Analytics', 'Settings'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`transition-colors ${activeTab === item ? 'text-luxury-950 dark:text-white' : 'hover:text-luxury-950 dark:hover:text-white'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-luxury-50 dark:bg-luxury-900 rounded-full border border-luxury-100 dark:border-luxury-800">
                <Search className="w-4 h-4 text-luxury-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-luxury-950 dark:text-white placeholder:text-luxury-400 w-40"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="relative text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-luxury-950"></span>
                </button>
                <div className="w-px h-6 bg-luxury-100 dark:bg-luxury-900"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-luxury-950 dark:text-white leading-none mb-1">Admin</p>
                    <p className="text-[10px] text-luxury-400 font-bold uppercase tracking-wider leading-none">Superuser</p>
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
                Admin, please verify your email address to unlock full infrastructure capabilities.
              </p>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={isResending || countdown > 0}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] justify-center"
            >
              {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Link'}
            </button>
          </div>
        </div>
      )}

      <main className="max-w-screen-2xl mx-auto py-12 px-6 lg:px-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-up">
          <div>
            <h1 className="text-5xl lg:text-7xl mb-4 leading-none">Command Center.</h1>
            <p className="text-luxury-500 dark:text-luxury-400 text-lg max-w-xl font-medium">
              Real-time analytics and user management. All systems are performing optimally.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toast.success("Live analytics refreshed.")}
              className="px-6 py-3 bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 text-sm font-bold rounded-lg flex items-center gap-2 group transition-transform active:scale-95"
            >
              <span>Refresh Data</span>
              <Activity className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
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

        {/* --- Key Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up stagger-1">
          {[
            { label: 'Total Users', value: '1,248', icon: Users, sub: '+12% this week', color: 'text-indigo-500' },
            { label: 'Live Active Users', value: '42', icon: Activity, sub: 'Real-time monitoring', color: 'text-emerald-500' },
            { label: 'Page Views', value: '84.2K', icon: Eye, sub: '+5.4% this week', color: 'text-blue-500' },
            { label: 'Total Reviews', value: '312', icon: Star, sub: '4.8 Avg Rating', color: 'text-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white dark:bg-luxury-950 rounded-2xl border border-luxury-100 dark:border-luxury-900 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-400 mb-1">{stat.label}</p>
                  <p className="text-4xl font-serif text-luxury-950 dark:text-white leading-none">{stat.value}</p>
                </div>
                <div className="p-2 bg-luxury-50 dark:bg-luxury-900 rounded-lg group-hover:scale-110 transition-transform">
                  <stat.icon className={`w-5 h-5 ${stat.color} stroke-[2px]`} />
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text', 'bg')} ${stat.label === 'Live Active Users' ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs font-bold text-luxury-500">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up stagger-2">

          {/* --- User Management Table --- */}
          <div className="lg:col-span-2 bg-white dark:bg-luxury-950 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-luxury-100 dark:border-luxury-900 flex justify-between items-center">
              <h3 className="text-2xl font-serif text-luxury-950 dark:text-white">User Management</h3>
              <button
                onClick={() => toast('Add User modal opened (Coming Soon)')}
                className="text-xs font-bold uppercase tracking-widest text-luxury-950 dark:text-white hover:text-luxury-500 transition-colors border border-luxury-200 dark:border-luxury-800 px-4 py-2 rounded-lg"
              >
                + Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-luxury-50 dark:bg-luxury-900/50">
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400">User</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400">Role</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400">Status</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400">Last Active</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-100 dark:divide-luxury-900">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-luxury-50 dark:hover:bg-luxury-900/20 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-luxury-100 dark:bg-luxury-800 flex items-center justify-center text-luxury-950 dark:text-white font-bold text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-luxury-950 dark:text-white">{u.name}</p>
                            <p className="text-xs text-luxury-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-luxury-100 text-luxury-600 dark:bg-luxury-800 dark:text-luxury-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs font-bold text-luxury-600 dark:text-luxury-300 capitalize">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs text-luxury-500">{u.lastActive}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toast('Edit user settings')} className="p-1.5 hover:bg-luxury-200 dark:hover:bg-luxury-800 rounded-md transition-colors text-luxury-500">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => toggleUserStatus(u.id)} className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-md transition-colors text-amber-500">
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-luxury-500 text-sm">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Live Activity & Reviews --- */}
          <div className="flex flex-col gap-8">

            {/* Live Activity */}
            <div className="bg-white dark:bg-luxury-950 p-8 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif text-luxury-950 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Activity
                </h3>
              </div>
              <div className="space-y-6">
                {MOCK_ACTIVITIES.map((activity, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      {activity.type === 'info' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-500" />}
                      {activity.type === 'success' && <Activity className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-luxury-950 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-xs text-luxury-500 mb-1">{activity.action}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-luxury-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-luxury-950 dark:bg-luxury-900 p-8 rounded-3xl shadow-sm relative overflow-hidden flex-1">
              <div className="relative z-10 flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Recent Reviews
                </h3>
              </div>
              <div className="space-y-4 relative z-10">
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="p-4 bg-luxury-900 dark:bg-luxury-950 rounded-xl border border-luxury-800">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-white">{review.user}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-luxury-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-luxury-300 italic mb-2">"{review.comment}"</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-luxury-500">{review.time}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
