import { Link } from 'react-router-dom';

export default function HowItWorks() {
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

      </div>

      {/* FRIENDLY MALAYALAM DISCLAIMER */}
      <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
        <h3 
          className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2"
          style={{ fontFamily: "'Manjari', sans-serif" }}
        >
          ⚠️ ഒരു ചെറിയ അപേക്ഷ...
        </h3>
        <p 
          className="text-amber-800 text-base md:text-lg leading-relaxed"
          style={{ fontFamily: "'Manjari', sans-serif" }}
        >
          അളിയാ... ഇതിലെ വിലവിവരങ്ങൾ നമ്മളൊക്കെ തന്നെ ചേർക്കുന്നതല്ലേ, അതുകൊണ്ട് ചിലപ്പോൾ ചെറിയ വ്യത്യാസങ്ങൾ ഒക്കെ ഉണ്ടാകാം. എങ്ങാനും വില മാറിയിട്ടുണ്ടെങ്കിൽ നമ്മളോട് കനിയണം! ദേഷ്യപ്പെടാതെ ആ <span className="font-bold bg-amber-200/50 px-1.5 py-0.5 rounded text-sm" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>Suggest Price Change</span> ബട്ടൺ ഞെക്കി ശരിയായ വിലയൊന്ന് അപ്‌ഡേറ്റ് ചെയ്തു സഹായിക്കണേ... 😅
        </p>
      </div>

      {/* CALL TO ACTION BUTTONS */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/" 
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Check Live Prices
        </Link>
        
        <Link 
          to="/contribute" 
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-white bg-primary hover:bg-emerald-600 shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-1"
        >
          Start Contributing Now
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
      </div>

    </div>
  );
}