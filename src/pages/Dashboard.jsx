import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Kerala');
  const [selectedCategory, setSelectedCategory] = useState('All Types');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const districts = ['All Kerala', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'];
const categories = ['All Types', 'Vegetables/Fruit', 'Meat', 'Fish', 'Fuel', 'Groceries', 'Commodities', 'Precious Metals'];
  // 1. Fetch Real-Time Data
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Smart Filtering Engine
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === 'All Kerala' || product.district === selectedDistrict;
      
      // THE FIX: Check for exact match OR the new Vegetable/Fruits alias
      const matchesCategory = 
        selectedCategory === 'All Types' || 
        product.category === selectedCategory ||
        (selectedCategory === 'Vegetable/Fruits' && product.category === 'Vegetables');

      return matchesSearch && matchesDistrict && matchesCategory;
    });
  }, [products, searchQuery, selectedDistrict, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto mt-4 md:mt-8 pb-12">
      
      {/* HEADER & MOBILE FILTER TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Live Market Rates</h2>
          <p className="text-gray-500 mt-1">Verified commodity prices across Kerala.</p>
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          {isMobileFilterOpen ? 'Hide Filters' : 'Filter by Location & Type'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR (FILTERS) */}
        <aside className={`w-full md:w-64 shrink-0 space-y-8 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          {/* District Filter */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Select District
            </h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
              {districts.map(d => (
                <button 
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedDistrict === d 
                      ? 'bg-primary text-white font-bold shadow-md' 
                      : 'text-gray-600 hover:bg-emerald-50 font-medium'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Product Type
            </h3>
            <div className="space-y-1">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCategory === c 
                      ? 'bg-primary text-white font-bold shadow-md' 
                      : 'text-gray-600 hover:bg-emerald-50 font-medium'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          
          {/* The Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search for Coconut, Petrol, Mathi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg transition-all"
            />
          </div>

          {/* Result Context Banner */}
          <div className="mb-4 text-sm font-semibold text-gray-500">
            Showing results for: <span className="text-primary">{selectedCategory}</span> in <span className="text-primary">{selectedDistrict}</span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-2">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-xl text-gray-900 font-bold mb-2">No rates found</p>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any prices matching your current filters. Be the first to report a price for this area!</p>
              <button 
                onClick={() => navigate('/contribute')} 
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Report a New Price
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-600 rounded-md shrink-0 ml-2">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {product.district}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Verified Rate</p>
                        <p className="text-2xl font-black text-primary">
                          ₹{product.currentPrice}
                          <span className="text-sm font-bold text-gray-400 ml-1">/ {product.unit}</span>
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate('/contribute', { state: { editProduct: product } })}
                      className="w-full py-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 font-bold text-xs rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors flex justify-center items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      Suggest Price Change
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}