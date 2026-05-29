import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('ml'); // 'ml' for Malayalam, 'en' for English

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeDisclaimer');
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeDisclaimer', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&display=swap');
        `}
      </style>

      {/* Modal Card */}
      <div className="bg-amber-50 border border-amber-200 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
        
        {/* TRANSLATE TOGGLE BUTTON */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className="text-xs font-bold text-amber-700 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0H3m5 6.135a13.963 13.963 0 01-3.18-3.135" 
  />
</svg>
            {lang === 'ml' ? 'Translate to English' : 'മലയാളത്തിൽ കാണുക'}
          </button>
        </div>

        {/* DYNAMIC HEADING */}
        <h3 
          className="text-2xl font-bold text-amber-900 mb-4"
          style={lang === 'ml' ? { fontFamily: "'Manjari', sans-serif" } : undefined}
        >
          {lang === 'ml' ? '⚠️ ഒരു ചെറിയ അപേക്ഷ...' : '⚠️ A small request...'}
        </h3>
        
        {/* DYNAMIC CONTENT */}
        <p 
          className="text-amber-800 text-base md:text-lg leading-relaxed mb-8"
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

        {/* DYNAMIC DISMISS BUTTON */}
        <button 
          onClick={handleClose}
          className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 text-lg font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
          style={lang === 'ml' ? { fontFamily: "'Manjari', sans-serif" } : undefined}
        >
          {lang === 'ml' ? 'മനസ്സിലായി 👍' : 'Got it! 👍'}
        </button>
      </div>
      
    </div>
  );
}