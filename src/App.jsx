import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- IMPORT THE FOOTER
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

        {/* Main Content Area (flex-grow pushes the footer to the bottom) */}
        <main className="flex-grow container mx-auto p-4 md:p-6 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-submissions" element={<MySubmissions />} />
          </Routes>
        </main>

        {/* NEW: The Footer Component */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;