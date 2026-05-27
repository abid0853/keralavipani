import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Contribute() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we arrived here by clicking "Suggest Price Change"
  const editProduct = location.state?.editProduct || null;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill the form if we are editing
  const [formData, setFormData] = useState({
    productName: editProduct ? editProduct.name : '',
    category: editProduct ? editProduct.category : 'Vegetables/Fruit',
    price: '', // Always leave price blank so they type the new one
    unit: editProduct ? editProduct.unit : 'kg',
    district: editProduct ? editProduct.district : 'Thiruvananthapuram'
  });

  const categories = ['Vegetables/Fruit', 'Meat', 'Fish', 'Fuel', 'Groceries', 'Commodities', 'Precious Metals'];
  const units = ['kg', 'liter', 'piece', 'bunch', '10g','unit'];
  const districts = ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-500 text-sm mb-8">
          To maintain accurate market rates, we require users to sign in before suggesting price changes. 
        </p>
        <Link 
          to="/login" 
          className="w-full inline-block py-3 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

    setLoading(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        targetProductId: editProduct ? editProduct.id : null,
        productName: formData.productName,
        
        // THE FIX: Corrected spelling to match "Vegetables/Fruit"
        category: formData.category === 'Vegetables/Fruit' ? 'Vegetables' : formData.category,
        
        suggestedPrice: Number(formData.price),
        unit: formData.unit,
        district: formData.district,
        status: 'pending',
        submittedBy: currentUser.uid,
        submitterName: userData.name,
        timestamp: serverTimestamp()
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert("Failed to submit.");
    }
    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">You must be logged in to contribute.</h2>
        <Link to="/login" className="text-primary hover:underline font-medium">Click here to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {editProduct ? 'Update Live Price' : 'Report New Product'}
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          {editProduct 
            ? `Suggesting a new rate for ${editProduct.name} in ${editProduct.district}.`
            : 'Help the community by submitting current market rates.'}
        </p>
      </div>

      {success ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
          <h3 className="text-lg font-bold text-emerald-800">Submission Received!</h3>
          <p className="text-emerald-600 text-sm mt-1">An admin will verify this update shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Product Name</label>
              <input 
                required
                type="text" 
                disabled={!!editProduct} // Lock field if editing
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select 
                disabled={!!editProduct}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 disabled:bg-gray-50"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">District</label>
              <select 
                disabled={!!editProduct}
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 disabled:bg-gray-50"
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">New Price (₹)</label>
              <input 
                required
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Unit</label>
              <select 
                disabled={!!editProduct}
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 disabled:bg-gray-50"
              >
                {units.map(u => <option key={u} value={u}>per {u}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Price for Review'}
          </button>
        </form>
      )}
    </div>
  );
}