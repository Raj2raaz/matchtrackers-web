// components/BlogSkeleton.jsx
import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-16 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 w-3/4 mx-auto mb-8 rounded" />

        <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-xl mb-10" />

        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10 flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="space-y-2 w-full">
            <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
