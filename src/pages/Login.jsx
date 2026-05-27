import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  // We pass "false" here so it's strictly a normal user attempt
  const { loginWithGoogle, currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleUserAuth = async () => {
    try {
      setError('');
      // Calling with false = NOT an admin attempt
      await loginWithGoogle(false); 
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Welcome to KeralaVipani
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Join the community to submit and track live market rates.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {!currentUser ? (
        <div className="space-y-4">
          <button
            onClick={handleUserAuth}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-xl shadow-md font-bold hover:bg-black transition-colors"
          >
            Sign In (Existing User)
          </button>
          
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={handleUserAuth}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create New Account with Google
          </button>
          <p className="text-xs text-gray-400 mt-4 text-left">
            * Note: Google securely handles both new account creation and returning logins through the same secure window.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Your Profile</p>
            <p className="text-xl font-black text-gray-900">{userData?.name}</p>
            <p className="text-sm text-gray-600 mb-4">{userData?.email}</p>
            
            <div className="flex gap-4">
              <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-bold capitalize text-primary">{userData?.role}</p>
              </div>
              <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Trust Score</p>
                <p className="text-sm font-bold text-gray-800">{userData?.trustScore}</p>
              </div>
            </div>
          </div>
          
          <button onClick={() => navigate('/')} className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md">
            Go to Dashboard
          </button>
          <button onClick={logout} className="w-full py-3 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}