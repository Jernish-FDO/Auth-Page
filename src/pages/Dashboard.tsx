import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import {
  LogOut, User as UserIcon, Shield, Activity, Search, Bell, Menu,
  MailWarning, Loader2, Users, Star, Trash2,
  ShieldAlert, CheckCircle2, Zap, X, Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: any;
}

export default function Dashboard() {
  const { user, logout, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Admin State
  const [activeTab, setActiveTab] = useState('Overview');
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [godMode, setGodMode] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Fetch Users from Firestore in Real-Time
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersArray: UserData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let lastActiveStr = 'Just now';
        if (data.lastActive?.toDate) {
          lastActiveStr = data.lastActive.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }

        usersArray.push({
          id: doc.id,
          name: data.name || 'Unknown User',
          email: data.email || 'No Email',
          role: data.role || 'user',
          status: data.status || 'active',
          lastActive: lastActiveStr
        });
      });
      setUsersList(usersArray);
    }, (error) => {
      console.error("Error fetching users:", error);
      toast.error("Failed to load real-time users.");
    });
    return () => unsubscribe();
  }, []);

  // Fetch Activities
  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('time', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activitiesArray: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let timeStr = 'Just now';
        if (data.time?.toDate) {
          timeStr = data.time.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        activitiesArray.push({ id: doc.id, ...data, timeStr });
      });
      setActivitiesList(activitiesArray);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Reviews
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('time', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsArray: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let timeStr = 'Just now';
        if (data.time?.toDate) {
          timeStr = data.time.toDate().toLocaleString([], { month: 'short', day: 'numeric' });
        }
        reviewsArray.push({ id: doc.id, ...data, timeStr });
      });
      setReviewsList(reviewsArray);
    });
    return () => unsubscribe();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const logActivity = async (action: string, targetName: string, type: 'info' | 'warning' | 'success' | 'error') => {
    try {
      await addDoc(collection(db, 'activities'), {
        admin: user?.name || 'Admin',
        targetUser: targetName,
        action,
        type,
        time: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to log activity", e);
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      await resendVerification();
      toast.success('Verification email sent! Please check your inbox.');
      setCountdown(60);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`[GOD MODE] Erase ${name} from the database permanently?`)) {
      try {
        await deleteDoc(doc(db, 'users', id));
        toast.success(`User ${name} terminated.`);
        await logActivity('Erased user record', name, 'error');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete user.');
      }
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateDoc(doc(db, 'users', id), { status: newStatus });
      toast.success(`User ${name} status changed to ${newStatus}.`);
      await logActivity(`Changed status to ${newStatus}`, name, newStatus === 'active' ? 'success' : 'warning');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status.');
    }
  };

  const toggleUserRole = async (id: string, currentRole: string, name: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`[GOD MODE] Change ${name}'s role to ${newRole.toUpperCase()}?`)) {
      try {
        await updateDoc(doc(db, 'users', id), { role: newRole });
        toast.success(`User ${name} is now ${newRole.toUpperCase()}.`);
        await logActivity(`Changed role to ${newRole.toUpperCase()}`, name, 'info');
      } catch (error: any) {
        toast.error(error.message || 'Failed to update role.');
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return toast.error("Please fill all fields");
    setIsCreatingUser(true);
    try {
      // Create a pending invitation record in Firestore
      // A backend function should ideally trigger off this to create the Firebase Auth record
      // Or they register themselves and claim this invite
      await addDoc(collection(db, 'users'), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'pending_invite',
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });
      await logActivity('Created pending user invite', newUser.name, 'success');
      toast.success(`User ${newUser.name} added to pending invites.`);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddUserModal(false);
    } catch (error: any) {
      toast.error('Failed to create user record.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsersCount = usersList.filter(u => u.status === 'active').length;

  return (
    <div className={`min-h-screen font-sans selection:bg-luxury-900 selection:text-white dark:selection:bg-luxury-100 dark:selection:text-black transition-colors duration-500 ${godMode ? 'bg-red-950/5 dark:bg-[#050000]' : 'bg-[#fafafa] dark:bg-[#0a0a0a]'}`}>
      <nav className={`luxury-blur border-b sticky top-0 z-50 transition-colors duration-500 ${godMode ? 'bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' : 'bg-white/80 dark:bg-luxury-950/80 border-luxury-100 dark:border-luxury-900'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setGodMode(!godMode)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] ${godMode ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-luxury-950 dark:bg-white'}`}>
                  {godMode ? (
                    <Zap className="w-5 h-5 text-white stroke-[2px] animate-pulse" />
                  ) : (
                    <Shield className="w-5 h-5 text-white dark:text-luxury-950 stroke-[1.5px]" />
                  )}
                </div>
                <span className={`font-serif text-2xl tracking-tight transition-colors duration-500 ${godMode ? 'text-red-600 dark:text-red-500 font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]' : 'text-luxury-950 dark:text-white'}`}>
                  {godMode ? 'GOD MODE' : 'AdminPage'}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-luxury-400">
                {['Overview', 'Users', 'Analytics', 'Settings'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`transition-colors ${activeTab === item ? (godMode ? 'text-red-600 dark:text-red-500' : 'text-luxury-950 dark:text-white') : 'hover:text-luxury-950 dark:hover:text-white'}`}
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'Users') setActiveTab('Users');
                  }}
                  className="bg-transparent border-none outline-none text-xs font-bold text-luxury-950 dark:text-white placeholder:text-luxury-400 w-40"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="relative text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  {activitiesList.length > 0 && <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-luxury-950"></span>}
                </button>
                <div className="w-px h-6 bg-luxury-100 dark:bg-luxury-900"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-luxury-950 dark:text-white leading-none mb-1">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-luxury-400 font-bold uppercase tracking-wider leading-none">{godMode ? 'God' : 'Superuser'}</p>
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
              onClick={logout}
              className="px-6 py-3 border border-luxury-200 dark:border-luxury-800 text-sm font-bold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* --- DYNAMIC RENDERING BASED ON ACTIVE TAB --- */}

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: usersList.length.toString(), icon: Users, sub: 'Registered accounts', color: 'text-indigo-500' },
                { label: 'Live Active Users', value: activeUsersCount.toString(), icon: Activity, sub: 'Real-time monitoring', color: 'text-emerald-500' },
                { label: 'Pending Invites', value: usersList.filter(u => u.status === 'pending_invite').length.toString(), icon: MailWarning, sub: 'Awaiting completion', color: 'text-blue-500' },
                { label: 'Total Reviews', value: reviewsList.length.toString(), icon: Star, sub: 'Verified users', color: 'text-amber-500' }
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Live Activity Feed */}
              <div className="bg-white dark:bg-luxury-950 p-8 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-serif text-luxury-950 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Network Activity
                  </h3>
                </div>
                <div className="space-y-6">
                  {activitiesList.length > 0 ? (
                    activitiesList.map((activity, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1">
                          {activity.type === 'info' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-500" />}
                          {activity.type === 'success' && <Activity className="w-5 h-5 text-emerald-500" />}
                          {activity.type === 'error' && <Trash2 className="w-5 h-5 text-red-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-luxury-950 dark:text-white">
                            {activity.targetUser || activity.admin || 'System'}
                          </p>
                          <p className="text-xs text-luxury-500 mb-1">{activity.action}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-luxury-400">{activity.timeStr}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-luxury-500 italic">Listening for network events...</p>
                  )}
                </div>
              </div>

              {/* Real-time Reviews */}
              <div className="bg-luxury-950 dark:bg-luxury-900 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Verified User Reviews
                  </h3>
                </div>
                <div className="space-y-4 relative z-10">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((review, i) => (
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
                        <p className="text-[9px] font-bold uppercase tracking-wider text-luxury-500">{review.timeStr}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-luxury-500 italic text-white/50">No reviews have been published yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'Users' && (
          <div className="bg-white dark:bg-luxury-950 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-8 border-b border-luxury-100 dark:border-luxury-900 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-serif text-luxury-950 dark:text-white">User Registry</h3>
                <p className="text-xs text-luxury-500 mt-1">Manage all registered accounts and pending invites.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="text-xs font-bold uppercase tracking-widest text-white bg-luxury-950 dark:text-luxury-950 dark:bg-white hover:opacity-90 transition-opacity px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add User
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
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-luxury-400 text-right">
                      {godMode ? <span className="text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">GOD CONTROLS</span> : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-100 dark:divide-luxury-900">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={`hover:bg-luxury-50 dark:hover:bg-luxury-900/20 transition-colors group ${godMode && u.role === 'admin' ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-500 ${godMode && u.role === 'admin' ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-950 dark:text-white'}`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-luxury-950 dark:text-white">{u.name}</p>
                            <p className="text-xs text-luxury-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <button
                          onClick={() => godMode ? toggleUserRole(u.id, u.role, u.name) : null}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${godMode ? 'hover:scale-105 cursor-pointer ring-1 ring-red-500/50 hover:ring-red-500' : 'cursor-default'} ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-luxury-100 text-luxury-600 dark:bg-luxury-800 dark:text-luxury-300'}`}
                        >
                          {u.role} {godMode && <Zap className="w-3 h-3 inline-block ml-1 opacity-50" />}
                        </button>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : u.status === 'pending_invite' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs font-bold text-luxury-600 dark:text-luxury-300 capitalize">{u.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs text-luxury-500">{u.lastActive}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleUserStatus(u.id, u.status, u.name)} className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-md transition-colors text-amber-500" title="Suspend/Unsuspend">
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                          {godMode && (
                            <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-500 hover:text-white rounded-md transition-colors text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]" title="Obliterate Record">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-luxury-500 text-sm">No users found matching query.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'Analytics' && (
          <div className="flex flex-col items-center justify-center p-24 bg-white dark:bg-luxury-950 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm animate-fade-in text-center">
            <Activity className="w-16 h-16 text-luxury-300 dark:text-luxury-800 mb-6" />
            <h3 className="text-3xl font-serif text-luxury-950 dark:text-white mb-2">Analytics Engine</h3>
            <p className="text-luxury-500 max-w-md">Connect your Google Analytics or Mixpanel data source here to visualize long-term trends and user retention graphs.</p>
            <button className="mt-8 px-6 py-3 border border-luxury-200 dark:border-luxury-800 text-sm font-bold rounded-lg text-luxury-950 dark:text-white hover:bg-luxury-50 dark:hover:bg-luxury-900 transition-colors">
              Configure Data Source
            </button>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <div className="bg-white dark:bg-luxury-950 rounded-3xl border border-luxury-100 dark:border-luxury-900 shadow-sm p-8 max-w-3xl animate-fade-in">
            <h3 className="text-2xl font-serif text-luxury-950 dark:text-white mb-8">Admin Settings</h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-luxury-100 dark:border-luxury-900 pb-6">
                <div>
                  <p className="font-bold text-luxury-950 dark:text-white">God Mode Controls</p>
                  <p className="text-sm text-luxury-500 mt-1">Unlock dangerous database obliteration and role management features.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={godMode} onChange={() => setGodMode(!godMode)} />
                  <div className="w-11 h-6 bg-luxury-200 peer-focus:outline-none rounded-full peer dark:bg-luxury-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between border-b border-luxury-100 dark:border-luxury-900 pb-6">
                <div>
                  <p className="font-bold text-luxury-950 dark:text-white">Strict Registration</p>
                  <p className="text-sm text-luxury-500 mt-1">Only allow whitelisted domains (e.g. @gmail.com).</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-luxury-200 peer-focus:outline-none rounded-full peer dark:bg-luxury-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-luxury-950 dark:text-white">Email Verification Gate</p>
                  <p className="text-sm text-luxury-500 mt-1">Require users to click email link before accessing main app.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-luxury-200 peer-focus:outline-none rounded-full peer dark:bg-luxury-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luxury-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-luxury-950 rounded-2xl w-full max-w-md shadow-2xl border border-luxury-100 dark:border-luxury-900 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-luxury-100 dark:border-luxury-900">
              <h3 className="font-serif text-xl text-luxury-950 dark:text-white">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-luxury-400 hover:text-luxury-950 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-luxury-500 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-3 bg-luxury-50 dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-lg outline-none focus:border-luxury-950 dark:focus:border-white text-luxury-950 dark:text-white transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-luxury-500 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 bg-luxury-50 dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-lg outline-none focus:border-luxury-950 dark:focus:border-white text-luxury-950 dark:text-white transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-luxury-500 mb-2">Assign Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-3 bg-luxury-50 dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-lg outline-none focus:border-luxury-950 dark:focus:border-white text-luxury-950 dark:text-white transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-3 border border-luxury-200 dark:border-luxury-800 text-luxury-950 dark:text-white font-bold rounded-lg hover:bg-luxury-50 dark:hover:bg-luxury-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="flex-1 py-3 bg-luxury-950 dark:bg-white text-white dark:text-luxury-950 font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isCreatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
