// components/ArticleSkeleton.jsx
import React from "react";

const ArticleSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse flex flex-col h-full">
      <div className="bg-gray-300 h-48 w-full" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="w-20 h-4 bg-gray-300 rounded" />
          <div className="w-16 h-4 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-5 bg-gray-300 rounded mb-2" />
        <div className="w-5/6 h-4 bg-gray-300 rounded mb-2" />
        <div className="w-4/6 h-4 bg-gray-300 rounded mb-4" />
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full" />
            <div className="w-24 h-4 bg-gray-300 rounded" />
          </div>
          <div className="w-16 h-4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
