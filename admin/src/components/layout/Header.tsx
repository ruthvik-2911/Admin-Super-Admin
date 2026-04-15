import * as React from 'react';
import { Menu, Moon, Sun, Bell, ChevronDown, Search } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (document.documentElement.classList.contains('dark') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 w-full lg:left-[280px] lg:w-[calc(100%-280px)] h-[60px] bg-[#1a1a1a] flex items-center justify-between px-4 lg:px-6 z-40 border-b border-[#2a2a2a] font-sans transition-all duration-300">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white transition"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        {/* Logo & Search Section */}
        <div className="flex items-center gap-6">
          <img 
            src="/src/assets/keliri-logo.png" 
            alt="Keliri Logo" 
            className="w-[36px] h-[36px] object-contain bg-white rounded-lg p-1" 
          />
          {/* Global Search Bar to fill the empty space neatly */}
          <div className="hidden md:flex items-center bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-full border border-gray-700/50 w-[300px] hover:border-gray-600 transition-colors focus-within:border-[#E8640C] focus-within:ring-1 focus-within:ring-[#E8640C]">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search everywhere..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500" 
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Actions (Moon, Bell) */}
        <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-white transition-colors">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white relative transition-colors focus:outline-none hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-700/50 hidden sm:block mx-1"></div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-[36px] h-[36px] rounded-full bg-[#E8640C] flex items-center justify-center text-white font-bold text-lg leading-none hover:opacity-90 transition shadow-sm border border-[#E8640C]/20">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition">Admin User</p>
            <p className="text-[11px] text-[#E8640C] font-bold uppercase tracking-wider">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition hidden md:block" />
        </div>
      </div>
    </header>
  );
}
