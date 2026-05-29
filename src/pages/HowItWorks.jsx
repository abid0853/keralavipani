import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  // Add state to track the language for the disclaimer
  const [lang, setLang] = useState('ml');

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-10 pb-16 px-4 animate-fade-in-up">
      
      {/* 1. INJECT THE AESTHETIC MALAYALAM FONT DIRECTLY HERE */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&display=swap');
        `}
      </style>

      {/* HEADER SECTION */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          How Kerala<span className="text-primary">Vipani</span> Works 🌴
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
          We are a community-driven platform keeping local market rates accurate for everyone in Kerala. Here is how you can help (and win)!
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="space-y-6">
        
        {/* Card 1: Adding Prices */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl border border-emerald-100">
            📝
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Got a Price? Add or Edit It!</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Notice the price of Mathi or Coconut changed in your district? Click <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Add Price</span> to report it. If a price already on the dashboard looks outdated, just click <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Suggest Price Change</span> on that exact item to correct it!
            </p>
          </div>
        </div>

        {/* Card 2: Trust Points */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl border border-amber-100">
            🌟
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Earn Trust Points</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              To keep our market data highly accurate and prevent spam, all suggested prices go to our verification queue first. The second your price is verified and approved by our admins, you earn <span className="font-black text-primary">+10 Trust Points</span> on your profile!
            </p>
          </div>
        </div>

        {/* Card 3: Leaderboard */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl border border-purple-100">
            🏆
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Climb the Leaderboard</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Head over to the <span className="font-bold text-gray-900">Leaderboard</span> to see who is leading the state! We track <span className="font-bold text-purple-700">All-Time Legends</span> as well as <span className="font-bold text-primary">Monthly Champions</span> (which resets to zero on the 1st of every month so new users always have a fair shot at the crown).
            </p>
          </div>
        </div>

        {/* Card 4: Smart Shopping List */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl border border-blue-100">
            🛒
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Build a Smart Shopping List</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Planning a trip to the market? Click <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-1">Add to List</span> on any product to build your personalized grocery list. We automatically calculate an estimated budget using the Kerala State Average! Once done, you can instantly export your list as a PDF or share it via WhatsApp.
            </p>
          </div>
        </div>

      </div>

      {/* FRIENDLY MALAYALAM DISCLAIMER */}
      <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
        
        {/* TRANSLATE TOGGLE BUTTON */}
        <div className="flex justify-end mb-2 relative z-10">
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className="text-xs font-bold text-amber-700 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0H3m5 6.135a13.963 13.963 0 01-3.18-3.135" />
            </svg>
            {lang === 'ml' ? 'Translate to English' : 'മലയാളത്തിൽ കാണുക'}
          </button>
        </div>

        <h3 
          className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2"
          style={lang === 'ml' ? { fontFamily: "'Manjari', sans-serif" } : undefined}
        >
          {lang === 'ml' ? '⚠️ ഒരു ചെറിയ അപേക്ഷ...' : '⚠️ A small request...'}
        </h3>
        <p 
          className="text-amber-800 text-base md:text-lg leading-relaxed"
          style={lang === 'ml' ? { fontFamily: "'Manjari', sans-serif" } : undefined}
        >
          {lang === 'ml' ? (
            <>
              അളിയാ... ഇതിലെ വിലവിവരങ്ങൾ നമ്മളൊക്കെ തന്നെ ചേർക്കുന്നതല്ലേ, അതുകൊണ്ട് ചിലപ്പോൾ ചെറിയ വ്യത്യാസങ്ങൾ ഒക്കെ ഉണ്ടാകാം. എങ്ങാനും വില മാറിയിട്ടുണ്ടെങ്കിൽ നമ്മളോട് കനിയണം! ദേഷ്യപ്പെടാതെ ആ <span className="font-bold bg-amber-200/50 px-1.5 py-0.5 rounded text-sm" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>Suggest Price Change</span> ബട്ടൺ ഞെക്കി ശരിയായ വിലയൊന്ന് അപ്‌ഡേറ്റ് ചെയ്തു സഹായിക്കണേ... 😅
            </>
          ) : (
            <>
              Bro... we are all contributing these price details together, so there might be slight variations sometimes. If a price has changed, please have mercy on us! Instead of getting upset, click that <span className="font-bold bg-amber-200/50 px-1.5 py-0.5 rounded text-sm">Suggest Price Change</span> button and help us update the correct rate... 😅
            </>
          )}
        </p>
      </div>

      {/* CALL TO ACTION BUTTONS */}
      <div className="mt-12 flex flex-col lg:flex-row flex-wrap items-center justify-center gap-4">
        
        {/* Neutral Button: Check Live Prices */}
        <Link 
          to="/" 
          className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-2xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Check Live Prices
        </Link>

        {/* Blue Button: Shopping List */}
        <Link 
          to="/shopping-list" 
          className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Build Your Smart Shopping List
        </Link>
        
        {/* Primary Green Button: Contribute */}
        <Link 
          to="/contribute" 
          className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-2xl text-white bg-primary hover:bg-emerald-600 shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-1"
        >
          Start Contributing Now
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>

      </div>

    </div>
  );
}