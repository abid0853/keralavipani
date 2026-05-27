import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'; // <-- NEW IMPORT
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contribute from './pages/Contribute';
import Admin from './pages/Admin';
import MySubmissions from './pages/MySubmissions';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        
        <Navbar />

        <main className="flex-grow container mx-auto p-4 md:p-6 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-submissions" element={<MySubmissions />} />
          </Routes>
        </main>

        <Footer />
        
        {/* NEW: The Vercel Analytics Component */}
        <Analytics />
        
      </div>
    </Router>
  );
}

export default App;