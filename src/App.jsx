import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt'; // <-- 1. IMPORT IT HERE
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contribute from './pages/Contribute';
import Admin from './pages/Admin';
import MySubmissions from './pages/MySubmissions';
import Leaderboard from './pages/Leaderboard';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
        
        <Navbar />

        <main className="flex-grow container mx-auto p-4 md:p-6 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-submissions" element={<MySubmissions />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>

        <Footer />
        <Analytics />
        
        {/* <-- 2. ADD IT HERE AT THE BOTTOM --> */}
        <InstallPrompt /> 
        
      </div>
    </Router>
  );
}

export default App;