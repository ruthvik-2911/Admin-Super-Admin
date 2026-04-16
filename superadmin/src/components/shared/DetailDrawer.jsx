
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const DetailDrawer = ({ isOpen, onClose, title, children, footerActions }) => {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#1A1D24] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1D24] sticky top-0 z-10 transition-colors">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
             {footerActions && <div className="flex items-center gap-2">{footerActions}</div>}
             <button 
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90"
             >
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#1A1D24] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DetailDrawer;
