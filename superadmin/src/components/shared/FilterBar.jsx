import React, { useState } from 'react';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

const FilterBar = ({ filters = [], onFilterChange, onReset, activeFiltersCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar py-1">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
            ${isOpen ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] 
              ${isOpen ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'}
            `}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />

        <div className="flex items-center gap-2">
          {filters?.map((filter, idx) => {
            if (!filter?.appliedValue) return null;
            return (
              <div 
                key={idx}
                className="flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1 rounded-full text-xs font-medium animate-fade-in group"
              >
                <span className="text-primary-500/60">{filter.label}:</span>
                <span>{Array.isArray(filter.appliedValue) ? filter.appliedValue.join(', ') : filter.appliedValue}</span>
                <button 
                  onClick={() => onFilterChange(filter.key, null)}
                  className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
          {activeFiltersCount > 0 && (
            <button 
              onClick={onReset}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors ml-2 uppercase tracking-wider"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 glass shadow-2xl p-6 animate-fade-in-scale grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-b-3xl">
          {filters?.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filter.label}</label>
              {filter.type === 'select' ? (
                <div className="relative group">
                   <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                    value={filter.appliedValue || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" size={16} />
                </div>
              ) : filter.type === 'search' ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text"
                    placeholder={`Search ${filter.label}...`}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    value={filter.appliedValue || ''}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  />
                </div>
              ) : filter.type === 'checkbox' ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {filter.options?.map(opt => {
                    const isSelected = filter.appliedValue && filter.appliedValue.includes(opt.value);
                    return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            const current = filter.appliedValue || [];
                            const next = isSelected 
                              ? current.filter(v => v !== opt.value)
                              : [...current, opt.value];
                            onFilterChange(filter.key, next.length > 0 ? next : null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                            ${isSelected 
                              ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm' 
                              : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}
                          `}
                        >
                          {opt.label}
                        </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          ))}
          <div className="lg:col-span-4 flex justify-end pt-4 border-t border-gray-50 gap-4">
             <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
                Apply Filters
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
