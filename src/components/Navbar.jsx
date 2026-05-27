import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Kerala<span className="text-primary">Vipani</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links & Profile */}
          <div className="flex items-center gap-4">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
              Live Rates
            </Link>

            {currentUser ? (
              <>
                <Link to="/contribute" className={`text-sm font-medium transition-colors ${isActive('/contribute') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                  Add Price
                </Link>
                
                {/* NEW: My Submissions Link */}
                <Link to="/my-submissions" className={`text-sm font-medium transition-colors ${isActive('/my-submissions') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                  My Activity
                </Link>
                
                {userData?.role === 'admin' && (
                  <Link to="/admin" className={`text-sm font-bold transition-colors ${isActive('/admin') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
                    Admin Panel
                  </Link>
                )}

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-gray-900">{userData?.name}</p>
                    <p className="text-[10px] text-primary font-semibold uppercase">{userData?.trustScore} Trust Pts</p>
                  </div>
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-emerald-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}