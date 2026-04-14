
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, primary
  requireReason = false,
  reasonPlaceholder = 'Enter reason...'
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(requireReason ? reason : null);
    setReason('');
    onClose();
  };

  const getColors = () => {
    switch (type) {
      case 'danger': return { btn: 'bg-red-600 hover:bg-red-700', icon: 'text-red-600 bg-red-100' };
      case 'warning': return { btn: 'bg-amber-600 hover:bg-amber-700', icon: 'text-amber-600 bg-amber-100' };
      default: return { btn: 'bg-primary-600 hover:bg-primary-700', icon: 'text-primary-600 bg-primary-100' };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl flex-shrink-0 ${colors.icon}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{message}</p>
              
              {requireReason && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason for {title.toLowerCase()}</label>
                  <textarea
                    className="w-full mt-1.5 p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    rows="3"
                    placeholder={reasonPlaceholder}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    autoFocus
                  />
                  {!reason.trim() && (
                    <p className="text-[10px] text-red-500 mt-1">Reason is mandatory to proceed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={requireReason && !reason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colors.btn}`}
          >
            {confirmText}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
