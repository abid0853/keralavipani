import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' or 'allTime'

  useEffect(() => {
    // Fetch all users ordered by their all-time score initially
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sort data dynamically based on the selected tab
  const rankedUsers = [...users].sort((a, b) => {
    if (activeTab === 'monthly') {
      return (b.monthlyScore || 0) - (a.monthlyScore || 0);
    }
    return (b.trustScore || 0) - (a.trustScore || 0);
  });

  // Helper to render badge styles
  const renderBadge = (badge) => {
    if (!badge) return null;
    const styles = {
      Master: 'bg-purple-100 text-purple-800 border-purple-200',
      Gold: 'bg-amber-100 text-amber-800 border-amber-200',
      Silver: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return (
      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[badge] || 'bg-gray-100'}`}>
        👑 {badge}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 md:mt-8 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vipani Champions</h2>
        <p className="text-gray-500 mt-2">Honoring our top contributors providing live rates across Kerala.</p>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 max-w-sm mx-auto shadow-sm">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'monthly' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          📅 Monthly Champions
        </button>
        <button
          onClick={() => setActiveTab('allTime')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'allTime' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          🏆 All-Time Legends
        </button>
      </div>

      {/* RANKINGS LIST */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {rankedUsers.map((user, index) => {
              const rank = index + 1;
              const currentScore = activeTab === 'monthly' ? (user.monthlyScore || 0) : (user.trustScore || 0);

              return (
                <div key={user.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Position Label / Medals */}
                    <div className="w-8 flex justify-center items-center font-black text-lg">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : <span className="text-gray-400 text-sm">#{rank}</span>}
                    </div>

                    {/* Avatar & Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{user.name}</p>
                        {renderBadge(user.badge)}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Contributor Platform Member</p>
                    </div>
                  </div>

                  {/* Score Tag */}
                  <div className="text-right">
                    <p className="text-lg font-black text-primary">{currentScore}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}