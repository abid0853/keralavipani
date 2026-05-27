import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function MySubmissions() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchMySubmissions = async () => {
      try {
        // Only fetch submissions submitted by THIS specific user
        const q = query(
          collection(db, 'submissions'), 
          where('submittedBy', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort manually by timestamp (newest first) since we are filtering by a different field
        data.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
        setMySubmissions(data);
      } catch (error) {
        console.error("Error fetching user submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySubmissions();
  }, [currentUser, navigate]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Approved (+10 Pts)</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full animate-pulse">Pending Review</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">My Submissions</h2>
        <p className="text-gray-500 mt-1">Track the status of the market rates you have reported.</p>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-xl text-gray-900 font-bold mb-2">No submissions yet!</p>
          <p className="text-sm text-gray-500 mb-6">Start contributing to the community to earn trust points.</p>
          <button onClick={() => navigate('/contribute')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md">
            Report a Price
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mySubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{sub.productName}</div>
                      <div className="text-xs text-gray-500">{sub.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-gray-900">₹{sub.suggestedPrice} <span className="text-xs font-medium text-gray-500">/ {sub.unit}</span></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sub.district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {getStatusBadge(sub.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}