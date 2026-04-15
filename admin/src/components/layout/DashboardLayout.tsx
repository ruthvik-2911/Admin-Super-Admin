import * as React from 'react';
import Header from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  activeItem?: string;
}

export default function DashboardLayout({ children, activeItem }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col transition-colors duration-300 dark:bg-[#0E1117] dark:text-gray-100 text-gray-900">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1 pt-[60px]">
        {/* The Sidebar component manages its own visibility/mobile overlay */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activeItem={activeItem} />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:ml-[280px] transition-all duration-300">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
