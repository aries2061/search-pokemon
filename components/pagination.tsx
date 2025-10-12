'use client';

import React from 'react';
import { PaginationProps } from '../lib/interfaces/components';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Function to generate page numbers with ellipsis for mobile responsiveness
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum pages to show on larger screens
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page if it's not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex-shrink-0 px-2 sm:px-3 py-1 text-sm sm:text-base rounded cursor-pointer hover:bg-emerald-500 hover:text-white border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-1 min-w-0">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-gray-500 select-none">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`flex-shrink-0 cursor-pointer px-2 sm:px-3 py-1 text-sm sm:text-base rounded-xl transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white border-2 border-emerald-700'
                      : 'border hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex-shrink-0 px-2 sm:px-3 py-1 text-sm sm:text-base rounded border cursor-pointer hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
        </button>
      </div>
    </div>
  );
}