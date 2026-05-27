export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 font-medium tracking-wide">
          Developed by{' '}
          <a 
            href="https://abidts.work" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:text-emerald-700 font-extrabold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
          >
            Abid TS
          </a>
        </p>
      </div>
    </footer>
  );
}