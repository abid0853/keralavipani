import { useEffect } from 'react';

export default function Ad1() {
  useEffect(() => {
    try {
      // This runs the push() function safely after the component renders on the screen
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error", error);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden rounded-xl">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '300px', width: '100%' }}
        data-ad-client="ca-pub-8835598047017569"
        data-ad-slot="1771229316"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}