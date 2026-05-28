import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc, deleteDoc, writeBatch, increment, setDoc 
} from 'firebase/firestore';

export default function Admin() {
  const { currentUser, userData, loginWithGoogle, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('pending'); 
  const [submissions, setSubmissions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Leaderboard States
  const [resetting, setResetting] = useState(false);

  const handleAdminLogin = async () => {
    try {
      setAuthError('');
      await loginWithGoogle(true); 
    } catch (error) {
      setAuthError(error.message);
    }
  };

  useEffect(() => {
    if (userData?.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'pending') {
          const q = query(collection(db, 'submissions'), where('status', '==', 'pending'));
          const snap = await getDocs(q);
          setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } 
        else if (activeTab === 'products') {
          const snap = await getDocs(collection(db, 'products'));
          setAllProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        else if (activeTab === 'users') {
          const snap = await getDocs(collection(db, 'users'));
          setAllUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, activeTab]);

  // --- TAB 1: PENDING QUEUE ---
  const handleApprove = async (submission) => {
    setProcessingId(submission.id);
    try {
      // 1. Mark submission as approved
      await updateDoc(doc(db, 'submissions', submission.id), { status: 'approved' });

      // 2. ZERO DUPLICATION LOGIC
      if (submission.targetProductId) {
        await updateDoc(doc(db, 'products', submission.targetProductId), {
          currentPrice: submission.suggestedPrice,
          lastUpdated: new Date()
        });
      } else {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('district', '==', submission.district));
        const productSnapshot = await getDocs(q);

        const submittedName = submission.productName.trim().toLowerCase();
        const existingProduct = productSnapshot.docs.find(d => d.data().name.trim().toLowerCase() === submittedName);

        if (existingProduct) {
          await updateDoc(doc(db, 'products', existingProduct.id), {
            currentPrice: submission.suggestedPrice, lastUpdated: new Date()
          });
        } else {
          await addDoc(collection(db, 'products'), {
            name: submission.productName.trim(), category: submission.category, unit: submission.unit,
            district: submission.district, currentPrice: submission.suggestedPrice, lastUpdated: new Date()
          });
        }
      }

      // 3. Award Trust Points (Updates both All-Time and Monthly)
      const userRef = doc(db, 'users', submission.submittedBy);
      await updateDoc(userRef, { 
        trustScore: increment(10),
        monthlyScore: increment(10)
      });

      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
    } catch (error) {
      alert("Failed to approve.");
      console.error(error);
    }
    setProcessingId(null);
  };

  const handleReject = async (submissionId) => {
    setProcessingId(submissionId);
    try {
      await updateDoc(doc(db, 'submissions', submissionId), { status: 'rejected' });
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
    } catch (error) {
      alert("Failed to reject.");
    }
    setProcessingId(null);
  };

  // --- TEMPORARY BULK UPLOAD SCRIPT ---
  const handleBulkUpload = async () => {
    if (!window.confirm("Are you sure you want to inject this seed data?")) return;
    
    const seedData = [
      { name: "Swarnam (Gold 24k)", category: "Precious Metals", district: "Ernakulam", currentPrice: 116520, unit: "10g", lastUpdated: new Date() },
    ];
    
    try {
      for (const product of seedData) {
        await addDoc(collection(db, 'products'), product);
      }
      alert("Seed data successfully added!");
      window.location.reload(); 
    } catch (error) {
      console.error("Bulk upload failed:", error);
      alert("Upload failed. Check console.");
    }
  };

  // --- TAB 2: PRODUCT MANAGEMENT ---
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setAllProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  // --- TAB 3: USER MANAGEMENT & LEADERBOARD CONTROLS ---
  const openUserActivity = async (user) => {
    setSelectedUser(user);
    setLoadingActivity(true);
    try {
      const q = query(collection(db, 'submissions'), where('submittedBy', '==', user.uid));
      const snap = await getDocs(q);
      const activityData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      activityData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      setUserActivity(activityData);
    } catch (error) {
      console.error("Error fetching activity", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userId === currentUser.uid) {
      alert("Action Blocked: You cannot delete your own Master Admin account.");
      return;
    }
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to delete the profile for ${userEmail}? They will lose all Trust Points and roles.`);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setAllUsers(prev => prev.filter(u => u.uid !== userId));
        alert("User profile successfully deleted.");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user profile.");
      }
    }
  };

  // --- LEADERBOARD: Auto-Reset on New Month ---
  useEffect(() => {
    // Only run this check if the user is an admin and the user list has loaded
    if (userData?.role !== 'admin' || allUsers.length === 0) return;

    const checkAndAutoReset = async () => {
      try {
        // Gets the current year and month (e.g., "2026-05")
        const currentMonth = new Date().toISOString().slice(0, 7); 
        
        // Check our database to see when we last reset the scores
        const systemRef = doc(db, 'system', 'leaderboardMeta');
        const systemSnap = await getDoc(systemRef);
        
        const lastResetMonth = systemSnap.exists() ? systemSnap.data().lastResetMonth : null;

        // If it's a new month, trigger the automatic reset!
        if (lastResetMonth !== currentMonth) {
          console.log("New month detected! Auto-resetting scores...");
          setResetting(true);
          
          const batch = writeBatch(db);
          
          // 1. Reset everyone's score to 0
          allUsers.forEach((user) => {
            const userRef = doc(db, 'users', user.id);
            batch.update(userRef, { monthlyScore: 0 });
          });
          
          // 2. Update the system tracker so it doesn't run again this month
          batch.set(systemRef, { lastResetMonth: currentMonth }, { merge: true });
          
          await batch.commit();
          
          // 3. Update the UI instantly
          setAllUsers(prev => prev.map(u => ({ ...u, monthlyScore: 0 })));
          alert(`Happy New Month! 🎊 Scores have been automatically reset for ${currentMonth}.`);
          setResetting(false);
        }
      } catch (error) {
        console.error("Auto-reset check failed:", error);
      }
    };

    checkAndAutoReset();
  }, [userData, allUsers.length]); // Triggers when the admin loads the user directory

  // --- LEADERBOARD: Manual Reset (Kept for emergencies) ---
  const handleMonthlyReset = async () => {
    if (!window.confirm("⚠️ Are you absolutely sure you want to manually reset EVERYONE'S monthly scores to 0?")) return;
    
    setResetting(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const batch = writeBatch(db);
      
      allUsers.forEach((user) => {
        const userRef = doc(db, 'users', user.id);
        batch.update(userRef, { monthlyScore: 0 });
      });

      // Update the system tracker during manual resets too!
      const systemRef = doc(db, 'system', 'leaderboardMeta');
      batch.set(systemRef, { lastResetMonth: currentMonth }, { merge: true });

      await batch.commit();
      
      setAllUsers(prev => prev.map(u => ({ ...u, monthlyScore: 0 })));
      alert("Successfully reset all monthly scores to 0!");
    } catch (error) {
      console.error(error);
      alert("Failed to reset monthly scores.");
    }
    setResetting(false);
  };

  const handleBadgeChange = async (userId, newBadge) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { badge: newBadge || null });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, badge: newBadge } : u));
    } catch (error) {
      alert("Failed to update badge profile.");
    }
  };

  // --- SECURITY GATE ---
  if (!currentUser || userData?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-3xl shadow-xl text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">System Administrator</h2>
        <p className="text-gray-400 text-sm mb-8">Restricted Access. Master Email required.</p>
        {authError && <div className="mb-6 p-3 bg-red-900/50 text-red-200 text-sm rounded-xl border border-red-800">{authError}</div>}
        <button onClick={handleAdminLogin} className="w-full py-3 bg-primary hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
          Authenticate via Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 pb-12 relative">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Control Panel</h2>
          <p className="text-gray-500 mt-1">Manage submissions, active markets, and users.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'pending' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>
            Pending Queue
          </button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>
            Manage Products
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>
            User Directory
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
          <button onClick={logout} className="px-3 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap">
            Exit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* TAB 1: PENDING SUBMISSIONS */}
          {activeTab === 'pending' && (
            <div className="overflow-x-auto">
              {submissions.length === 0 ? (
                <div className="text-center py-16"><p className="text-gray-500 font-bold">No pending submissions.</p></div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Suggested Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{sub.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-primary">₹{sub.suggestedPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.district}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button onClick={() => handleApprove(sub)} disabled={processingId === sub.id} className="text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl mr-2 font-bold disabled:opacity-50">Approve</button>
                          <button onClick={() => handleReject(sub.id)} disabled={processingId === sub.id} className="text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-bold disabled:opacity-50">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: MANAGE PRODUCTS */}
          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Active Market Data</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Manage live commodity rates on the platform.</p>
                </div>
                {/* RESTORED BUTTON: Placed elegantly inside Tab 2 */}
                <button 
                  onClick={handleBulkUpload} 
                  className="px-5 py-2.5 text-sm font-bold rounded-xl transition-colors bg-purple-600 text-white hover:bg-purple-700 shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  Inject Seed Data
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                {allProducts.length === 0 ? (
                  <div className="text-center py-16"><p className="text-gray-500 font-bold">No active products found.</p></div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Current Rate</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {allProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.district}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-primary">₹{product.currentPrice} <span className="text-xs font-medium text-gray-500">/ {product.unit}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: USER DIRECTORY (WITH LEADERBOARD CONTROLS) */}
          {activeTab === 'users' && (
            <div className="p-6 space-y-6">
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">End-of-Month Operations</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Flush global monthly scores to kick off next month's competition cycle.</p>
                </div>
                <button
                  onClick={handleMonthlyReset}
                  disabled={resetting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 shrink-0 flex items-center gap-2"
                >
                  {resetting ? 'Resetting Data...' : '🔄 Reset Monthly Scores'}
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                {allUsers.length === 0 ? (
                  <div className="text-center py-16"><p className="text-gray-500 font-bold">No users found.</p></div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User Profile</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Scores (M / All)</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Assign Badge</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {allUsers.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50">
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-bold text-gray-900">{user.name}</div>
                              {user.role === 'admin' && <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-700">Admin</span>}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            <span className="text-primary font-black">{user.monthlyScore || 0}</span> M / {user.trustScore || 0} Total
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.badge || ''}
                              onChange={(e) => handleBadgeChange(user.id, e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold focus:ring-2 outline-none bg-white text-gray-700 cursor-pointer"
                            >
                              <option value="">No Badge</option>
                              <option value="Master">👑 Master</option>
                              <option value="Gold">🥇 Gold</option>
                              <option value="Silver">🥈 Silver</option>
                            </select>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right flex items-center justify-end gap-2">
                            <button onClick={() => openUserActivity(user)} className="text-primary hover:text-primary-dark border border-primary hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                              View Activity
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.uid, user.email)}
                              disabled={user.uid === currentUser.uid}
                              className="text-red-600 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-600"
                              title={user.uid === currentUser.uid ? "Cannot delete yourself" : "Delete User"}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* USER ACTIVITY MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Activity: {selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email} • {selectedUser.trustScore} Trust Points</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              {loadingActivity ? (
                <div className="text-center py-10 text-gray-500">Loading history...</div>
              ) : userActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-500">This user has not submitted any prices yet.</div>
              ) : (
                <div className="space-y-3">
                  {userActivity.map(act => (
                    <div key={act.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div>
                        <p className="font-bold text-gray-900">{act.productName} <span className="font-normal text-sm text-gray-500">({act.district})</span></p>
                        <p className="text-sm font-black text-primary">₹{act.suggestedPrice} <span className="font-normal text-xs text-gray-400">/ {act.unit}</span></p>
                      </div>
                      <div>
                        {act.status === 'approved' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Approved</span>}
                        {act.status === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">Rejected</span>}
                        {act.status === 'pending' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg">Pending</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}