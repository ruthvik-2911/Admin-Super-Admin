
import React, { useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-out animate-slide-in-right`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
             {footerActions && <div className="flex items-center gap-2">{footerActions}</div>}
             <button 
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
             >
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
