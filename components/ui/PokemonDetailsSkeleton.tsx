'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function PokemonDetailsSkeleton() {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-gray-100 animate-pulse">
      <div className="p-3 sm:p-6">
        {/* Back button skeleton */}
        <div className="flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-1 text-gray-300" />
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>

        {/* Main content skeleton */}
        <div className="flex flex-col md:flex-row gap-4 rounded-lg">
          {/* First Column: Image + Evolution Requirements + Evolutions skeleton */}
           <div className="w-full md:w-1/2 bg-white rounded-lg flex flex-col min-h-[500px]">
             {/* Pokemon Image + Evolution Requirements skeleton */}
             <div className="flex-[2] flex flex-col items-center justify-center p-4">
               <div 
                 className="bg-gray-300 rounded-lg mb-4"
                 style={{ 
                   width: '160px', 
                   height: '160px',
                   aspectRatio: '1/1'
                 }}
               />
               
               {/* Evolution Requirements skeleton */}
               <div className="w-full max-w-sm">
                 <div className="flex items-center mb-2">
                   <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                   <div className="h-4 bg-gray-300 rounded w-32"></div>
                 </div>
                 <div className="bg-blue-100 rounded-lg p-3">
                   <div className="h-4 bg-gray-300 rounded w-full"></div>
                 </div>
               </div>
             </div>
            
            {/* Evolutions skeleton - 25% height */}
            <div className="flex-1 p-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-5 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="bg-gray-300 rounded mb-2 flex-shrink-0"
                      style={{ 
                        width: '48px', 
                        height: '48px',
                        aspectRatio: '1/1'
                      }}
                    />
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info skeleton */}
          <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-4 text-white flex flex-col gap-4">
            {/* Name and number skeleton */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-8 bg-gray-600 rounded w-32 mr-2"></div>
                <div className="h-6 bg-gray-600 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-600 rounded w-12"></div>
            </div>

            {/* Types skeleton */}
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="h-6 bg-gray-600 rounded-full w-16"></div>
              <div className="h-6 bg-gray-600 rounded-full w-20"></div>
            </div>

            {/* Combined Stats and Attack Information skeleton */}
            <div className="bg-white rounded-lg p-3 flex-1">
              {/* Stats skeleton */}
              <div className="h-5 bg-gray-300 rounded w-12 mb-2"></div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center flex flex-col justify-center min-h-[40px]">
                    <div className="h-4 bg-gray-300 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-8 mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Attack Information skeleton */}
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
                <div className="h-5 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex flex-col gap-3">
                {/* Fast attacks skeleton */}
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="space-y-1">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-gray-300 rounded w-12"></div>
                          <div className="h-3 bg-gray-300 rounded w-6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Special attacks skeleton */}
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="space-y-1">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-gray-300 rounded w-12"></div>
                          <div className="h-3 bg-gray-300 rounded w-6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-4 sm:my-5">
          <hr className="w-[100%] sm:w-[75%] border-gray-300" />
        </div>

        {/* Details skeleton */}
        <div className="flex flex-col md:grid md:grid-cols-1 gap-4">
          {/* Resistances and Weaknesses skeleton */}
          <div className="w-full flex flex-col items-start border-1 border-white bg-white rounded-md p-5">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gray-300 rounded mr-1"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="grid w-full gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-300 rounded"></div>
              ))}
            </div>

            {/* Weaknesses skeleton */}
            <div className="w-full mt-3">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gray-300 rounded mr-1"></div>
                <div className="h-6 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="grid w-full gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Evolution skeleton */}
        <div className="mt-6">
          <div className="h-6 bg-gray-300 rounded w-20 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-white">
                <div 
                  className="bg-gray-300 rounded mb-2"
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    aspectRatio: '1/1'
                  }}
                />
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}