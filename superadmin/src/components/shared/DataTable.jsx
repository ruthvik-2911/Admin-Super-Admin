
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  isLoading = false,
  emptyMessage = "No records found",
  onRowClick,
  pageSizeOptions = [10, 25, 50],
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const sortedData = React.useMemo(() => {
    let items = [...data];
    if (sortConfig !== null) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [data, sortConfig]);

  // Filtering (simple search across all columns)
  const filteredData = sortedData.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-card overflow-hidden flex flex-col animate-fade-in ${className}`}>
      {/* Search Bar - Optional, but useful */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search all columns..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Show</span>
            <select 
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                }}
                className="text-sm font-semibold text-gray-700 bg-gray-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
                {pageSizeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors ${col.className || ''}`}
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortConfig?.key === col.key ? (
                      sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                      <SlidersHorizontal size={12} className="opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className={`shimmer h-4 rounded-lg bg-gray-100 ${j === 0 ? 'w-16' : j === 1 ? 'w-48' : 'w-full'}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr 
                  key={i} 
                  className={`hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 text-sm text-gray-600 whitespace-nowrap ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                       <Search size={24} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-900">{emptyMessage}</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="text-gray-900">{filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="text-gray-900">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="text-gray-900">{filteredData.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum = i + 1;
                // Simple pagination logic for many pages
                if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }
                
                return (
                    <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                        ${currentPage === pageNum 
                            ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                            : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200'}
                        `}
                    >
                        {pageNum}
                    </button>
                )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
