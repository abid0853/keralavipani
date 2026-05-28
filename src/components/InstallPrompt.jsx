import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the user previously asked never to see this again
    const hasOptedOut = localStorage.getItem('keralavipani_pwa_optout');

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later.
      if (!hasOptedOut) {
        setDeferredPrompt(e);
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      // Clear the prompt if the user successfully installs it
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleMaybeLater = () => {
    setShowPrompt(false);
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('keralavipani_pwa_optout', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-3xl p-8 relative shadow-2xl border border-slate-800 animate-fade-in-up">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={handleMaybeLater}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* App Logo with Glow */}
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-400">
          <img src="/logo.png" alt="Icon" className="w-10 h-10 object-contain invert brightness-0" />
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-black text-emerald-500 leading-tight mb-3">
          Add KeralaVipani<br/>to your home<br/>screen
        </h2>
        <p className="text-slate-300 text-sm mb-8 font-medium leading-relaxed">
          Get instant access to live rates, gold prices and more — right from your home screen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleInstallClick}
            className="w-full py-4 bg-primary hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/50"
          >
            Install KeralaVipani App
          </button>
          
          <button 
            onClick={handleMaybeLater}
            className="w-full py-3 text-slate-400 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
          >
            Maybe Later
          </button>
          
          <button 
            onClick={handleNeverShowAgain}
            className="w-full pb-2 text-slate-600 text-[10px] font-bold tracking-widest uppercase hover:text-slate-400 transition-colors"
          >
            Don't Show Again
          </button>
        </div>

        {/* Bottom Status Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Secure Offline Access
        </div>
      </div>
    </div>
  );
}