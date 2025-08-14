import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full h-64 md:h-96 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600"></div>
      </div>

      {/* Match Categories Section Skeleton */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-10 sm:py-12 px-4 sm:px-6">
        
        {/* Category Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded-xl"
            ></div>
          ))}
        </div>

        {/* Match Cards Skeleton */}
        <div className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide mx-2 sm:mx-0 pb-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 min-w-[90%] sm:min-w-[340px] max-w-sm mx-2 sm:mx-0"
            >
              {/* Match Card Skeleton */}
              <div className="bg-white dark:bg-gray-800 shadow-xl mt-4 rounded-2xl p-4 sm:p-6">
                
                {/* Top info section skeleton */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mb-6">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>

                {/* Team Comparison Skeleton */}
                <div className="flex justify-between items-center gap-3 sm:gap-6">
                  {/* Team 1 Skeleton */}
                  <div className="flex flex-col flex-1 items-start space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  </div>

                  {/* VS Section Skeleton */}
                  <div className="text-center space-y-2">
                    <div className="h-6 w-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>

                  {/* Team 2 Skeleton */}
                  <div className="flex flex-col flex-1 items-end space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar Skeleton */}
              <div className="bg-gray-400 dark:bg-gray-600 rounded-b-2xl -mt-3 p-4">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-500 dark:bg-gray-500 rounded"></div>
                  <div className="h-4 w-20 bg-gray-500 dark:bg-gray-500 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Section Skeleton */}
      <div className="flex flex-col md:flex-row gap-8 my-8 px-5 md:px-24">
        
        {/* Recent Highlights Skeleton */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg"
              >
                <div className="h-5 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* England Tour Section Skeleton */}
        <div className="w-full md:w-2/3">
          <div className="relative w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-2xl mb-4"></div>
          
          <div className="flex md:flex-row flex-col gap-3 mt-4">
            <div className="h-12 flex-1 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
            <div className="h-12 flex-1 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Components Section Skeleton */}
      <div className="flex flex-col md:flex-row gap-5 py-3 px-5 md:px-24">
        
        {/* Left Column Skeleton */}
        <div className="flex-1 space-y-6">
          
          {/* Upcoming Fixtures Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="h-7 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historic Moments Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="h-7 w-36 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-40 w-full bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          </div>

          {/* Blog Section Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="h-7 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="flex-1 flex flex-col space-y-5">
          
          <div className="flex flex-col md:flex-row gap-5">
            
            {/* Player Rankings Skeleton */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="h-7 w-36 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-6 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fan Predictions Skeleton */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="h-7 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
  className="h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
  style={{ width: `${30 + i * 20}%` }}
></div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Shorts Skeleton */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="h-7 w-28 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section Skeleton */}
      <div className="mx-5 md:mx-24 bg-white dark:bg-gray-900 py-8">
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;