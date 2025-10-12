'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton with proper aspect ratio */}
      <div className="flex justify-center flex-grow p-4">
        <div 
          className="bg-gray-200 rounded object-contain"
          style={{ 
            width: '165px', 
            height: '165px',
            aspectRatio: '1/1'
          }}
        />
      </div>
      
      {/* Content skeleton */}
      <div className="text-center mt-auto pt-4 border-t border-gray-100 p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        
        {/* Classification skeleton */}
        <div className="mt-2">
          <div className="h-4 bg-gray-200 rounded-full w-20 mx-auto" />
        </div>
      </div>
    </div>
  );
}