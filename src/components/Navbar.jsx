import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const location = useLocation();
  
  // State to control the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  // Helper to close the menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO SECTION */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="KeralaVipani Logo" className="w-10 h-10 object-contain rounded-full shadow-sm bg-white border border-gray-100 p-0.5" />
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Kerala<span className="text-primary">Vipani</span></span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-4">
            {/* ALWAYS VISIBLE LINKS */}
            <Link to="/how-it-works" className={`text-sm font-medium transition-colors ${isActive('/how-it-works') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
  How it Works
</Link>
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
              Live Rates
            </Link>
            <Link to="/contribute" className={`text-sm font-medium transition-colors ${isActive('/contribute') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
              Add Price
            </Link>
<Link to="/leaderboard" className={`text-sm font-medium transition-colors ${isActive('/leaderboard') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
  Leaderboard
</Link>
<Link to="/shopping-list" className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${isActive('/shopping-list') ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
  🛒 My List
</Link>

            {/* LOGGED IN ONLY LINKS */}
            {currentUser ? (
              <>
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
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{userData?.name}</p>
                    <p className="text-[10px] text-primary font-semibold uppercase">{userData?.trustScore} Trust Pts</p>
                  </div>
                  <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg hover:bg-red-50" title="Sign Out">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="ml-4 inline-flex items-center justify-center px-5 py-2 rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-emerald-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            
            {/* ALWAYS VISIBLE MOBILE LINKS */}
            <Link to="/how-it-works" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/how-it-works') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
  How it Works
</Link>
            <Link to="/" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
              Live Rates
            </Link>
            <Link to="/contribute" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/contribute') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
              Add Price
            </Link>
<Link 
  to="/leaderboard" 
  onClick={closeMenu} 
  className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/leaderboard') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
>
  Leaderboard
</Link>
<Link to="/shopping-list" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors flex items-center gap-2 ${isActive('/shopping-list') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
  🛒 Smart Shopping List
</Link>

            {/* LOGGED IN ONLY MOBILE LINKS */}
            {currentUser ? (
              <>
                <Link to="/my-submissions" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/my-submissions') ? 'bg-emerald-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}>
                  My Activity
                </Link>
                {userData?.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive('/admin') ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Admin Panel
                  </Link>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="px-4 flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{userData?.name}</p>
                      <p className="text-xs text-primary font-bold uppercase mt-0.5">{userData?.trustScore} Trust Pts</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 font-bold rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4">
                <Link to="/login" onClick={closeMenu} className="block w-full text-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-primary hover:bg-emerald-600 transition-colors">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}